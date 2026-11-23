import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient, kultMemberSettings } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'private, no-store' } });

async function getMember() {
  const client = await createSupabaseServerClient();
  if (!client) return null;
  const { data, error } = await client.auth.getUser();
  return data.user && !error ? client : null;
}

export async function GET() {
  if (!kultMemberSettings()) return json({ enabled: false, signedIn: false });
  try {
    const client = await getMember();
    if (!client) return json({ enabled: true, signedIn: false });
    const [archive, shelf] = await Promise.all([client.rpc('kult_archive_get'), client.rpc('kult_shelf_get')]);
    if (archive.error || shelf.error) return json({ error: '회원 저장소를 열지 못했어요.' }, 503);
    return json({ enabled: true, signedIn: true, places: archive.data.places, shelf: shelf.data.shelf });
  } catch { return json({ error: '회원 저장소를 열지 못했어요.' }, 503); }
}

async function readBounded(request: NextRequest) {
  if (!/^application\/json(?:;|$)/i.test(request.headers.get('content-type') ?? '')) return null;
  const stream = request.body?.getReader();
  if (!stream) return null;
  const decoder = new TextDecoder('utf-8', { fatal: true });
  let size = 0, text = '';
  try {
    for (;;) {
      const item = await stream.read();
      if (item.done) break;
      size += item.value.byteLength;
      if (size > 32768) { void stream.cancel().catch(() => {}); return null; }
      text += decoder.decode(item.value, { stream: true });
    }
    const data: unknown = JSON.parse(text + decoder.decode());
    return data && typeof data === 'object' && !Array.isArray(data) ? data as Record<string, unknown> : null;
  } catch { return null; }
  finally { stream.releaseLock(); }
}

export async function POST(request: NextRequest) {
  const config = kultMemberSettings();
  if (!config) return json({ error: '회원 기능을 준비 중이에요.' }, 404);
  if (request.headers.get('origin') !== config.origin) return json({ error: '허용되지 않은 요청이에요.' }, 403);
  const body = await readBounded(request);
  if (!body) return json({ error: '요청을 다시 확인해 주세요.' }, 400);
  const keys = Object.keys(body).length;
  try {
    const client = await getMember();
    if (!client) return json({ error: '로그인해 주세요.' }, 401);
    let result;
    if (body.action === 'merge' && keys === 2 && Array.isArray(body.places)) result = await client.rpc('kult_archive_merge', { p_places: body.places });
    else if (body.action === 'match' && keys === 2 && Array.isArray(body.placeIds)) result = await client.rpc('kult_taste_match', { p_place_ids: body.placeIds });
    else if (body.action === 'publish' && keys === 4 && body.consent === true && typeof body.nickname === 'string' && Array.isArray(body.placeIds))
      result = await client.rpc('kult_shelf_publish', { p_nickname: body.nickname, p_place_ids: body.placeIds });
    else if (body.action === 'revoke' && keys === 1) result = await client.rpc('kult_shelf_revoke');
    else if (body.action === 'remove' && keys === 2 && typeof body.placeId === 'string')
      result = await client.rpc('kult_archive_remove', { p_place_id: body.placeId });
    else return json({ error: '요청을 다시 확인해 주세요.' }, 400);
    if (result.error) {
      const rate = result.error.code === 'PT429' || result.error.code === '54000';
      return json({ error: rate ? '잠시 후 다시 시도해 주세요.' : '저장한 장소와 선택을 다시 확인해 주세요.' }, rate ? 429 : 400);
    }
    return json(result.data);
  } catch { return json({ error: '회원 저장소에 연결할 수 없어요.' }, 503); }
}
