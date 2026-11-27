import { NextRequest, NextResponse } from 'next/server';
import { fetchSharedList, ImportError } from '@/lib/naverImport';
import { naverRequest } from '@/lib/naverTransport';

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  const headers = new Headers({ 'Cache-Control': 'no-store' });
  const timings: string[] = [];
  // Only stage/offset, elapsed time and a fixed outcome; never log links or list data.
  const tracedRequest: typeof fetch = async (input, init) => {
    const url = new URL(String(input));
    const offset = url.searchParams.get('start');
    const stage = url.hostname === 'pages.map.naver.com' &&
      url.pathname.endsWith('/bookmarks') && offset && /^\d{1,3}$/.test(offset)
      ? `bookmark-${offset}` : 'redirect';
    const started = performance.now();
    const record = (outcome: string) => {
      timings.push(`${stage};dur=${Math.round(performance.now() - started)};desc="${outcome}"`);
      if (timings.length > 16) timings.shift();
    };
    try {
      const response = await naverRequest(input, init);
      record(`http-${response.status}`);
      return response;
    } catch (error) {
      const code = (error as NodeJS.ErrnoException | null)?.code;
      const known = ['ECONNRESET', 'ECONNREFUSED', 'ENOTFOUND', 'EAI_AGAIN', 'ETIMEDOUT', 'ENETUNREACH'];
      record(init?.signal?.aborted ? 'aborted' : code && known.includes(code) ? code : 'transport-error');
      throw error;
    }
  };
  const includeTimings = () => {
    if (timings.length) headers.set('Server-Timing', timings.join(', '));
  };
  try {
    const body = await request.text();
    if (body.length > 4096) return NextResponse.json({ error: '요청이 너무 큽니다.' }, { status: 413, headers });
    const parsed = JSON.parse(body);
    if (typeof parsed?.url !== 'string') throw new ImportError('공유 링크를 넣어주세요.');
    const list = await fetchSharedList(parsed.url, tracedRequest);
    includeTimings();
    return NextResponse.json({ list }, { headers });
  } catch (error) {
    includeTimings();
    return NextResponse.json({ error: error instanceof ImportError ? error.message : '목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.' }, { status: error instanceof ImportError || error instanceof SyntaxError ? 400 : 502, headers });
  }
}
