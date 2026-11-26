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

type ImportErrorCode = 'invalid' | 'unavailable' | 'upstream' | 'rate_limit' | 'timeout' | 'format' | 'changed';

export class ImportError extends Error {
  readonly code: ImportErrorCode;
  constructor(message: string, code: ImportErrorCode = 'invalid') { super(message); this.code = code; }
}

const upstreamMessage = '네이버 지도에서 목록 응답을 받지 못했어요. 기존 저장은 그대로예요. 잠시 후 다시 시도해주세요.';
const changedMessage = '목록을 읽는 중에 장소가 바뀌었거나 같은 장소가 중복으로 내려왔어요. 기존 저장은 그대로예요. 다시 불러와주세요.';
const formatMessage = '네이버 지도 목록 형식을 확인할 수 없어요. 기존 저장은 그대로예요.';
const timeoutMessage = '네이버 지도 응답이 너무 늦어요. 기존 저장은 그대로예요. 잠시 후 다시 시도해주세요.';
const unavailableMessage = '이 링크의 목록을 열 수 없어요. 삭제되지 않았는지, 링크로 볼 수 있는 공유 목록인지 확인해주세요.';

function responseError(status: number) {
  if (status === 401 || status === 403 || status === 404 || status === 410) return new ImportError(unavailableMessage, 'unavailable');
  if (status === 429) return new ImportError('네이버 지도 요청이 많아요. 기존 저장은 그대로예요. 잠시 후 다시 시도해주세요.', 'rate_limit');
  return new ImportError(upstreamMessage, 'upstream');
}

// Only these public navigation URLs may be resolved. Never forward user cookies.
export function validateListUrl(input: string): URL {
  const value = input.trim();
  if (value.length > 2048) throw new ImportError('링크가 너무 깁니다.');
  let url: URL;
  try { url = new URL(value); } catch { throw new ImportError('올바른 네이버 지도 공유 링크를 넣어주세요.'); }
  if (url.protocol !== 'https:' || url.username || url.password || url.port ||
      !['naver.me', 'map.naver.com', 'pages.map.naver.com', 'm.place.naver.com', 'place.naver.com'].includes(url.hostname)) {
    throw new ImportError('네이버 지도 공유 링크(naver.me, map.naver.com 등)만 사용할 수 있습니다.');
  }
  return url;
}

export function shareIdFromUrl(url: URL): string | null {
  if (!['map.naver.com', 'pages.map.naver.com', 'm.place.naver.com', 'place.naver.com'].includes(url.hostname)) return null;
  const match = url.pathname.match(/\/([a-f0-9]{32})\/?$/i) || url.searchParams.get('folderId')?.match(/^([a-f0-9]{32})$/i);
  return match ? match[1].toLowerCase() : null;
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
  if (data.removed === true) throw new ImportError(unavailableMessage, 'unavailable');
  if (!Array.isArray(data.bookmarkList) || typeof folder.name !== 'string' ||
      !Number.isInteger(folder.bookmarkCount) || Number(folder.bookmarkCount) < 0) {
    throw new ImportError(formatMessage, 'format');
  }
  const places = data.bookmarkList.map((value): ImportedPlace => {
    const item = record(value), info = record(item.placeInfo);
    const sourceId = typeof item.sid === 'string' || Number.isSafeInteger(item.sid) ? String(item.sid) : '';
    const sid = /^\d{1,25}$/.test(sourceId) ? sourceId : '';
    const bookmarkId = String(item.bookmarkId ?? '');
    const name = text(item.name);
    if (!name || !/^\d+$/.test(bookmarkId)) throw new ImportError(formatMessage, 'format');
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
  const deadline = AbortSignal.timeout(38000);
  let retryAvailable = true;
  async function read(target: string, init: RequestInit): Promise<Response> {
    for (;;) {
      const signal = AbortSignal.any([deadline, AbortSignal.timeout(18000)]);
      try {
        const response = await request(target, { ...init, signal, cache: 'no-store' });
        if (!(retryAvailable && [500, 502, 503, 504].includes(response.status))) return response;
        await response.body?.cancel();
      } catch {
        if (deadline.aborted || !retryAvailable) {
          throw new ImportError(signal.aborted ? timeoutMessage : upstreamMessage, signal.aborted ? 'timeout' : 'upstream');
        }
      }
      if (deadline.aborted) throw new ImportError(timeoutMessage, 'timeout');
      retryAvailable = false;
    }
  }
  let shareId = shareIdFromUrl(url);
  for (let hops = 0; !shareId && hops < 4; hops++) {
    const response = await read(url.href, { redirect: 'manual' });
    const location = response.headers.get('location');
    await response.body?.cancel();
    if (response.status >= 400) throw responseError(response.status);
    if (![301, 302, 303, 307, 308].includes(response.status) || !location) {
      break;
    }
    url = validateListUrl(new URL(location, url).href);
    shareId = shareIdFromUrl(url);
  }

  // Fallback for single place links (e.g. /entry/place/12345 or /restaurant/12345)
  if (!shareId) {
    const sidMatch = url.pathname.match(/\/(?:entry\/place|restaurant|place)\/(\d+)/) || url.searchParams.get('sid');
    const sid = Array.isArray(sidMatch) ? sidMatch[1] : sidMatch;
    if (sid) {
      return {
        shareId: `single-place-${sid}`,
        name: '네이버 지도 공유 장소',
        sourceUrl: input,
        importedAt: new Date().toISOString(),
        places: [
          {
            id: `naver-place-${sid}`,
            name: '네이버 지도 공유 장소',
            address: '네이버 지도로 공유된 장소',
            category: '카페 / 공간',
            lat: null,
            lng: null,
            available: true,
            memo: `공유된 네이버 지도 장소 링크: ${input}`,
            url: `https://map.naver.com/p/entry/place/${sid}`,
          },
        ],
      };
    }
    throw new ImportError('공유 링크를 읽지 못했습니다. 네이버 지도 앱/웹의 리스트 공유 링크(naver.me 등)를 다시 복사해주세요.');
  }

  const places: ImportedPlace[] = [];
  let name = '', total = 0;
  for (let start = 0; start < 500; start += 20) {
    const endpoint = new URL(`https://pages.map.naver.com/save-pages/api/maps-bookmark/v3/shares/${shareId}/bookmarks`);
    endpoint.search = new URLSearchParams({start: String(start), limit: '20', sort: 'lastUseTime', placeInfo: 'true'}).toString();
    const response = await read(endpoint.href, { redirect: 'manual', headers: {'Accept': 'application/json'} });
    if (!response.ok) { await response.body?.cancel(); throw responseError(response.status); }
    const raw = await response.text();
    if (raw.length > 2_000_000) throw new ImportError('목록 응답이 너무 큽니다.');
    let payload: unknown;
    try { payload = JSON.parse(raw); } catch { throw new ImportError(formatMessage, 'format'); }
    const page = parseBookmarkPage(payload, shareId);
    if (start > 0 && page.total !== total) throw new ImportError(changedMessage, 'changed');
    name = page.name; total = page.total;
    if (total > 500) throw new ImportError('한 목록당 최대 500개를 가져올 수 있습니다. 목록을 나눠주세요.');
    places.push(...page.places);
    if (page.rawCount > 20 || places.length > total) throw new ImportError(changedMessage, 'changed');
    if (places.length === total) break;
    if (page.rawCount !== 20) throw new ImportError(changedMessage, 'changed');
  }
  const unique = [...new Map(places.map(place => [place.id, place])).values()];
  if (places.length !== total || unique.length !== total) throw new ImportError(changedMessage, 'changed');
  return { shareId, name, sourceUrl: `https://map.naver.com/p/favorite/sharedPlace/folder/${shareId}`, importedAt: new Date().toISOString(), places: unique };
}
