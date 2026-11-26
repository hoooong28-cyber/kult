import { type NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient, kultMemberSettings } from '@/lib/supabase/server';
import { isCatalogPlaceId } from '@/lib/catalogSavePaths';
import { canSaveCatalogPlace } from '@/lib/supabase/catalogArchive';

export const dynamic = 'force-dynamic';
const json = (body: unknown, status = 200) =>
  NextResponse.json(body, { status, headers: { 'Cache-Control': 'private, no-store' } });

export async function GET() {
  try {
    const client = await createSupabaseServerClient();
    if (!client) return json({ enabled: false, signedIn: false });
    const { data, error } = await client.auth.getUser();
    if (!data.user && (!error || error.name === 'AuthSessionMissingError')) return json({ enabled: true, signedIn: false });
    if (error || !data.user) return json({ error: '로그인 상태를 확인하지 못했어요.' }, 503);
    const result = await client.rpc('kult_catalog_saves_get');
    if (result.error) return json({ error: '계정 저장소를 열지 못했어요.' }, 503);
    return json({ enabled: true, signedIn: true, ids: result.data });
  } catch { return json({ error: '계정 저장소를 열지 못했어요.' }, 503); }
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
      if (size > 512) { void stream.cancel().catch(() => {}); return null; }
      text += decoder.decode(item.value, { stream: true });
    }
    const data: unknown = JSON.parse(text + decoder.decode());
    return data && typeof data === 'object' && !Array.isArray(data) ? data as Record<string, unknown> : null;
  } catch { return null; }
  finally { stream.releaseLock(); }
}

export async function POST(request: NextRequest) {
  const settings = kultMemberSettings();
  if (!settings || request.headers.get('origin') !== settings.origin) return json({}, 403);
  const body = await readBounded(request);
  if (!body || Object.keys(body).length !== 2 || !isCatalogPlaceId(body.placeId) || typeof body.saved !== 'boolean') return json({}, 400);
  try {
    const client = await createSupabaseServerClient();
    if (!client) return json({}, 503);
    const { data, error } = await client.auth.getUser();
    if (!data.user || error) return json({}, 401);
    if (body.saved && !await canSaveCatalogPlace(body.placeId)) return json({}, 404);
    const result = await client.rpc('kult_catalog_save_set', { p_place_id: body.placeId, p_saved: body.saved });
    if (result.error) return json({}, 503);
    return json({ saved: body.saved });
  } catch { return json({}, 503); }
}
