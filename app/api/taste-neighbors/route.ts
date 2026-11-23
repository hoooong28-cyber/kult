import { NextRequest, NextResponse } from 'next/server';
import { findTasteNeighbors } from '@/lib/tasteNeighbors';
import {
  PILOT_COOKIE_MAX_AGE, PILOT_OWNER_COOKIE, createPilotOwner, hashPilotOwner,
  openTasteNeighborPilotStore, parsePilotMatchIds, parsePilotShelf,
} from '@/lib/tasteNeighborPilotStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const headers = { 'Cache-Control': 'private, no-store' };
const json = (body: unknown, status = 200) => NextResponse.json(body, { headers, status });
const getDatabasePath = () => process.env.NODE_ENV === 'development' ? process.env.KULT_TASTE_PILOT_DB?.trim() : undefined;
const sameOrigin = (request: NextRequest) => {
  // Next can canonicalize 127.0.0.1 to localhost in nextUrl. Use the browser-visible
  // Host only after allowing exact loopback addresses, and never trust forwarded host headers.
  const host = request.headers.get('host') ?? '';
  const protocol = request.nextUrl.protocol;
  if (!/^(?:localhost|127\.0\.0\.1|\[::1\])(?::[0-9]{1,5})?$/i.test(host)
    || !['http:', 'https:'].includes(protocol)
    || ['cross-site', 'same-site'].includes(request.headers.get('sec-fetch-site') ?? '')) return false;
  try { return request.headers.get('origin') === new URL(protocol + '//' + host).origin; }
  catch { return false; }
};

async function readRequest(request: Request): Promise<Record<string, unknown> | null> {
  if (!/^application\/json(?:\s*;|$)/i.test(request.headers.get('content-type') ?? '')) return null;
  const reader = request.body?.getReader();
  if (!reader) return null;
  const decoder = new TextDecoder('utf-8', { fatal: true });
  let size = 0;
  let body = '';
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) {
        const data: unknown = JSON.parse(body + decoder.decode());
        return data && typeof data === 'object' && !Array.isArray(data) ? data as Record<string, unknown> : null;
      }
      size += value.byteLength;
      if (size > 12_288) {
        void reader.cancel().catch(() => {});
        return null;
      }
      body += decoder.decode(value, { stream: true });
    }
  } catch { return null; }
  finally { reader.releaseLock(); }
}

async function withStore<T>(path: string, fn: (store: Awaited<ReturnType<typeof openTasteNeighborPilotStore>>) => T) {
  try {
    const store = await openTasteNeighborPilotStore(path);
    try { return fn(store); }
    finally { store.close(); }
  } catch {
    return json({ error: '지금은 취향 선반에 연결할 수 없어요.' }, 503);
  }
}

export async function GET(request: NextRequest) {
  const path = getDatabasePath();
  if (!path) return json({ enabled: false, ownShelf: null });
  const ownerHash = hashPilotOwner(request.cookies.get(PILOT_OWNER_COOKIE)?.value);
  if (!ownerHash) return json({ enabled: true, ownShelf: null });
  return withStore(path, store => json({ enabled: true, ownShelf: store.getOwn(ownerHash) }));
}

export async function POST(request: NextRequest) {
  const path = getDatabasePath();
  if (!path) return json({ error: '취향 선반 파일럿은 비활성화돼 있어요.' }, 404);
  if (!sameOrigin(request)) return json({ error: '허용되지 않은 요청이에요.' }, 403);
  const body = await readRequest(request);
  const ownerHash = hashPilotOwner(request.cookies.get(PILOT_OWNER_COOKIE)?.value);
  if (body?.action === 'publish' && body.consent === true && Object.keys(body).length === 4) {
    const shelf = parsePilotShelf(body.nickname, body.places);
    if (!shelf) return json({ error: '공유 닉네임과 네이버 장소를 확인해 주세요.' }, 400);
    const token = ownerHash ? request.cookies.get(PILOT_OWNER_COOKIE)!.value : createPilotOwner();
    const hash = hashPilotOwner(token)!;
    return withStore(path, store => {
      if (!store.publish(hash, shelf)) return json({ error: '파일럿 선반이 가득 찼어요.' }, 409);
      const response = json({ ownShelf: shelf });
      response.cookies.set(PILOT_OWNER_COOKIE, token, {
        httpOnly: true, secure: request.nextUrl.protocol === 'https:', sameSite: 'strict',
        path: '/api/taste-neighbors', maxAge: PILOT_COOKIE_MAX_AGE,
      });
      return response;
    });
  }
  if (body?.action === 'match' && Object.keys(body).length === 2) {
    const placeIds = parsePilotMatchIds(body.placeIds);
    if (!placeIds) return json({ error: '비교할 장소를 확인해 주세요.' }, 400);
    if (placeIds.length < 2) return json({ matches: [] });
    return withStore(path, store => {
      const shelves = store.listOthers(ownerHash);
      const byOwner = new Map(shelves.map(shelf => [shelf.ownerHash, shelf]));
      const matches = findTasteNeighbors(
        { id: ownerHash ?? 'unregistered-pilot-viewer', naverPlaceIds: placeIds },
        shelves.map(shelf => ({
          id: shelf.ownerHash, visibility: 'shared', nickname: shelf.nickname,
          naverPlaceIds: shelf.places.map(place => place.id),
        })),
      ).slice(0, 8).map(match => {
        const names = new Map((byOwner.get(match.id)?.places ?? []).map(place => [place.id, place.name]));
        return {
          nickname: match.nickname,
          commonPlaceIds: match.commonPlaceIds,
          newPlaces: match.newPlaceIds.flatMap(id => {
            const name = names.get(id);
            return name ? [{ id, name }] : [];
          }).slice(0, 10),
        };
      });
      return json({ matches });
    });
  }
  return json({ error: '공유하거나 비교할 장소를 확인해 주세요.' }, 400);
}

export async function DELETE(request: NextRequest) {
  const path = getDatabasePath();
  if (!path) return json({ error: '취향 선반 파일럿은 비활성화돼 있어요.' }, 404);
  if (!sameOrigin(request)) return json({ error: '허용되지 않은 요청이에요.' }, 403);
  const ownerHash = hashPilotOwner(request.cookies.get(PILOT_OWNER_COOKIE)?.value);
  if (!ownerHash) return json({ ownShelf: null });
  return withStore(path, store => {
    store.revoke(ownerHash);
    const response = json({ ownShelf: null });
    response.cookies.set(PILOT_OWNER_COOKIE, '', {
      httpOnly: true, secure: request.nextUrl.protocol === 'https:', sameSite: 'strict',
      path: '/api/taste-neighbors', maxAge: 0,
    });
    return response;
  });
}
