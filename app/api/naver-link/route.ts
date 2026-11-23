import { NextResponse } from 'next/server';
import { resolveNaverShortLink } from '@/lib/resolveNaverShortLink';
import { parseNaverPlaceLink } from '@/lib/naverPlaceLinks';

export const runtime = 'nodejs';
export const maxDuration = 10;
const headers = { 'Cache-Control': 'no-store' };
const redirectStatuses = new Set([301, 302, 303, 307, 308]);

async function readInput(request: Request) {
  const reader = request.body?.getReader();
  if (!reader) return '';
  const decoder = new TextDecoder();
  let size = 0;
  let body = '';
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) return body + decoder.decode();
      size += value.byteLength;
      if (size > 4096) {
        void reader.cancel().catch(() => {});
        return null;
      }
      body += decoder.decode(value, { stream: true });
    }
  } finally {
    reader.releaseLock();
  }
}

export async function POST(request: Request) {
  let url: unknown;
  try {
    const body = await readInput(request);
    if (body === null) return NextResponse.json({ error: '요청이 너무 큽니다.' }, { status: 413, headers });
    url = JSON.parse(body)?.url;
  } catch { /* Report an invalid request below. */ }
  if (typeof url !== 'string') return NextResponse.json({ error: '공유 링크를 넣어 주세요.' }, { status: 400, headers });
  const parsed = parseNaverPlaceLink(url);
  if (!parsed) return NextResponse.json({ error: '네이버 지도 단일 장소 링크만 사용할 수 있어요.' }, { status: 400, headers });
  if (parsed.kind === 'place') return NextResponse.json(parsed, { headers });
  const signal = AbortSignal.any([request.signal, AbortSignal.timeout(4000)]);
  try {
    const place = await resolveNaverShortLink(url, async shortUrl => {
      const response = await fetch(shortUrl, { method: 'HEAD', redirect: 'manual', cache: 'no-store', credentials: 'omit', signal });
      const location = redirectStatuses.has(response.status) ? response.headers.get('location') : null;
      void response.body?.cancel().catch(() => {});
      return location;
    });
    if (place) return NextResponse.json(place, { headers });
  } catch { /* A short-link resolution failure falls back to the direct place URL. */ }
  return NextResponse.json({ error: '이 짧은 링크에서 장소를 확인하지 못했어요. 네이버 지도에서 장소를 열고 주소창의 전체 링크를 복사해 주세요.' }, { status: 422, headers });
}
