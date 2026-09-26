import { NextRequest, NextResponse } from 'next/server';
import { fetchSharedList, ImportError } from '@/lib/naverImport';
import { naverRequest } from '@/lib/naverTransport';

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  const headers = { 'Cache-Control': 'no-store' };
  try {
    const body = await request.text();
    if (body.length > 4096) return NextResponse.json({ error: '요청이 너무 큽니다.' }, { status: 413, headers });
    const parsed = JSON.parse(body);
    if (typeof parsed?.url !== 'string') throw new ImportError('공유 링크를 넣어주세요.');
    const list = await fetchSharedList(parsed.url, naverRequest);
    return NextResponse.json({ list }, { headers });
  } catch (error) {
    return NextResponse.json({ error: error instanceof ImportError ? error.message : '목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.' }, { status: error instanceof ImportError || error instanceof SyntaxError ? 400 : 502, headers });
  }
}
