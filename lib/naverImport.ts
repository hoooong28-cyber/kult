export interface ImportedPlace {
  id: string;
  name: string;
  address: string;
  category: string;
  lat: number | null;
  lng: number | null;
  available: boolean;
  memo: string;
  url: string;
}

export interface ImportedList {
  shareId: string;
  name: string;
  sourceUrl: string;
  importedAt: string;
  places: ImportedPlace[];
}

export class ImportError extends Error {}

// Only these public navigation URLs may be resolved. Never forward user cookies.
export function validateListUrl(input: string): URL {
  const value = input.trim();
  if (value.length > 2048) throw new ImportError('링크가 너무 깁니다.');
  let url: URL;
  try { url = new URL(value); } catch { throw new ImportError('올바른 네이버 지도 공유 링크를 넣어주세요.'); }
  if (url.protocol !== 'https:' || url.username || url.password || url.port ||
      !['naver.me', 'map.naver.com', 'pages.map.naver.com'].includes(url.hostname)) {
    throw new ImportError('네이버 지도 저장 목록의 HTTPS 공유 링크만 사용할 수 있습니다.');
  }
  const validPath = url.hostname === 'naver.me'
    ? /^\/[a-zA-Z0-9]+\/?$/.test(url.pathname)
    : url.hostname === 'map.naver.com'
      ? /^\/(?:p|v5)\/favorite\/(?:sharedPlace|[\w:=-]+)\/folder\/[a-f0-9]{32}\/?$/i.test(url.pathname)
      : /^\/save-pages\/(?:pc|mobile)\/detail-list\/[a-f0-9]{32}\/?$/i.test(url.pathname);
  if (!validPath) throw new ImportError('개별 장소나 내 지도 주소가 아닌 ‘리스트 공유’ 링크를 넣어주세요.');
  return url;
}

export function shareIdFromUrl(url: URL): string | null {
  return url.hostname === 'naver.me' ? null : url.pathname.match(/\/([a-f0-9]{32})\/?$/i)?.[1] || null;
}

type RecordValue = Record<string, unknown>;
function record(value: unknown): RecordValue {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as RecordValue : {};
}
function text(value: unknown, limit = 500): string {
  return typeof value === 'string' ? value.slice(0, limit) : '';
}
function coordinate(value: unknown, max: number): number | null {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) && Math.abs(n) <= max ? n : null;
}

export function parseBookmarkPage(payload: unknown, shareId: string) {
  const data = record(payload), folder = record(data.folder);
  if (data.removed || !Array.isArray(data.bookmarkList) || typeof folder.name !== 'string' ||
      !Number.isInteger(folder.bookmarkCount) || Number(folder.bookmarkCount) < 0) {
    throw new ImportError('목록을 읽을 수 없습니다. 일부 공개 이상으로 설정하고 공유 링크를 다시 확인해주세요.');
  }
  const places = data.bookmarkList.map((value): ImportedPlace => {
    const item = record(value), info = record(item.placeInfo);
    const sid = typeof item.sid === 'string' && /^\d+$/.test(item.sid) ? item.sid : '';
    const bookmarkId = String(item.bookmarkId ?? '');
    const name = text(item.name);
    if (!name || !/^\d+$/.test(bookmarkId)) throw new ImportError('장소 데이터 형식이 변경되었습니다. 잠시 후 다시 시도해주세요.');
    return {
      id: sid ? `naver-place-${sid}` : `naver-bookmark-${bookmarkId}`,
      name, address: text(item.address), category: text(info.category || item.mcidName),
      lat: coordinate(item.py, 90), lng: coordinate(item.px, 180),
      available: item.available === true,
      memo: text(item.memo, 2000),
      url: sid ? `https://map.naver.com/p/entry/place/${sid}` : `https://map.naver.com/p/favorite/sharedPlace/folder/${shareId}`,
    };
  });
  return { name: text(folder.name), total: Number(folder.bookmarkCount), places, rawCount: data.bookmarkList.length };
}

export function mergeImportedLists(lists: ImportedList[], incoming: ImportedList): ImportedList[] {
  return [incoming, ...lists.filter(list => list.shareId !== incoming.shareId)];
}

export function uniqueImportedPlaces(lists: ImportedList[]): ImportedPlace[] {
  return [...new Map(lists.flatMap(list => list.places).reverse().map(place => [place.id, place])).values()];
}

export async function fetchSharedList(input: string, request: typeof fetch = fetch): Promise<ImportedList> {
  let url = validateListUrl(input);
  const signal = AbortSignal.timeout(25000);
  let shareId = shareIdFromUrl(url);
  for (let hops = 0; !shareId && hops < 4; hops++) {
    const response = await request(url.href, { redirect: 'manual', signal, cache: 'no-store' });
    const location = response.headers.get('location');
    await response.body?.cancel();
    if (![301, 302, 303, 307, 308].includes(response.status) || !location) {
      throw new ImportError('공유 링크를 열 수 없습니다. 네이버 지도에서 리스트 공유 링크를 다시 복사해주세요.');
    }
    url = validateListUrl(new URL(location, url).href);
    shareId = shareIdFromUrl(url);
  }
  if (!shareId) throw new ImportError('공유 링크의 연결 단계가 너무 많습니다.');

  const places: ImportedPlace[] = [];
  let name = '', total = 0;
  for (let start = 0; start < 500; start += 20) {
    const endpoint = new URL(`https://pages.map.naver.com/save-pages/api/maps-bookmark/v3/shares/${shareId}/bookmarks`);
    endpoint.search = new URLSearchParams({start: String(start), limit: '20', sort: 'lastUseTime', placeInfo: 'true'}).toString();
    const response = await request(endpoint.href, { signal, redirect: 'error', cache: 'no-store', headers: {'Accept': 'application/json'} });
    if (!response.ok) throw new ImportError('네이버 목록을 불러오지 못했습니다. 공개 범위와 링크를 확인한 뒤 다시 시도해주세요.');
    const raw = await response.text();
    if (raw.length > 2_000_000) throw new ImportError('목록 응답이 너무 큽니다.');
    let payload: unknown;
    try { payload = JSON.parse(raw); } catch { throw new ImportError('네이버 응답을 읽을 수 없습니다. 잠시 후 다시 시도해주세요.'); }
    const page = parseBookmarkPage(payload, shareId);
    if (start > 0 && page.total !== total) throw new ImportError('가져오는 동안 목록이 변경됐습니다. 다시 불러와주세요.');
    name = page.name; total = page.total;
    if (total > 500) throw new ImportError('한 목록당 최대 500개를 가져올 수 있습니다. 목록을 나눠주세요.');
    places.push(...page.places);
    if (places.length >= total) break;
    if (page.rawCount !== 20) throw new ImportError('일부 장소를 읽지 못했습니다. 저장하지 않았으니 다시 불러와주세요.');
  }
  const unique = [...new Map(places.map(place => [place.id, place])).values()];
  if (places.length !== total || unique.length !== total) throw new ImportError('목록이 변경되었거나 중복된 응답이 있습니다. 다시 불러와주세요.');
  return { shareId, name, sourceUrl: `https://map.naver.com/p/favorite/sharedPlace/folder/${shareId}`, importedAt: new Date().toISOString(), places: unique };
}
