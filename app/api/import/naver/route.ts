import { NextRequest, NextResponse } from 'next/server';
import { fetchSharedList, ImportError } from '@/lib/naverImport';
import { createNaverRequest } from '@/lib/naverTransport';

export const runtime = 'nodejs';
export const preferredRegion = 'icn1';
export const maxDuration = 45;

export async function POST(request: NextRequest) {
  const headers = { 'Cache-Control': 'no-store' };
  const trace: string[] = [];
  const naverRequest = createNaverRequest(line => { if (trace.length < 24) trace.push(line); });
  // Deploy only as an isolated, protected preview. No URLs, IDs or response content.
  const diagnostic = () => process.env.VERCEL_ENV === 'preview' ? trace.join(' · ') : undefined;
  try {
    const body = await request.text();
    if (body.length > 4096) return NextResponse.json({ error: '요청이 너무 큽니다.' }, { status: 413, headers });
    const parsed = JSON.parse(body);
    if (typeof parsed?.url !== 'string') throw new ImportError('공유 링크를 넣어주세요.');
    const list = await fetchSharedList(parsed.url, naverRequest, process.env.VERCEL_ENV === 'preview' ? 'overview' : 'paged');
    return NextResponse.json({ list }, { headers });
  } catch (error) {
    if (error instanceof ImportError) {
      const status = { invalid: 400, unavailable: 404, upstream: 502, rate_limit: 503, timeout: 504, format: 502, changed: 409 }[error.code];
      return NextResponse.json({ error: error.message, code: error.code, diagnostic: diagnostic() }, { status, headers });
    }
    const malformed = error instanceof SyntaxError;
    return NextResponse.json({ error: malformed ? '네이버 지도 공유 링크를 다시 확인해주세요.' : '목록을 불러오지 못했어요. 기존 저장은 그대로예요. 잠시 후 다시 시도해주세요.' }, { status: malformed ? 400 : 502, headers });
  }
}
