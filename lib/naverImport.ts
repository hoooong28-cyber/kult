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
export const NAVER_IMPORT_HOSTS: readonly string[] = [
  'naver.me', 'pages.map.naver.com', 'map.naver.com', 'm.map.naver.com', 'm.place.naver.com', 'place.naver.com',
];

function isAllowedNaverUrl(url: URL): boolean {
  return url.protocol === 'https:' && !url.username && !url.password && !url.port &&
    NAVER_IMPORT_HOSTS.includes(url.hostname);
}

function parseUrl(value: string, base?: URL): URL | null {
  try { return new URL(value, base); } catch { return null; }
}

export function validateListUrl(input: string): URL {
  const value = input.trim();
  if (value.length > 2048) throw new ImportError('링크가 너무 깁니다.');
  const candidates: string[] = value.match(/https:\/\/[^\s<>"'()[\]{}]+/giu) ?? [];
  // Keep plain URLs intact (e.g. percent encoding or parentheses in a query).
  if (/^https:\/\/\S+$/i.test(value)) candidates.unshift(value);
  for (const candidate of candidates) {
    const url = parseUrl(candidate);
    if (url && isAllowedNaverUrl(url)) return url;
  }
  throw new ImportError('올바른 네이버 지도 공유 링크(naver.me, map.naver.com 등)를 넣어주세요.');
}

export function shareIdFromUrl(url: URL): string | null {
  const match = url.pathname.match(/\/([a-f0-9]{32})(?:\/|$)/i) || url.searchParams.get('folderId')?.match(/^([a-f0-9]{32})$/i);
  return match ? match[1] : null;
}

export function singlePlaceIdFromUrl(url: URL): string | null {
  const pathId = url.pathname.match(/\/(?:entry\/place|restaurant|cafe|place)\/(\d+)(?:\/|$)/i)?.[1];
  const queryId = url.searchParams.get('sid');
  return pathId ?? (queryId && /^\d+$/.test(queryId) ? queryId : null);
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

// A stalled upstream page has been observed to spend over 10 seconds before
// returning 500. Keep time for retries and the remaining pages within the 25s
// request budget, while allowing a longer final attempt for a slow response.
const PAGE_ATTEMPT_TIMEOUTS_MS = [5000, 5000, 6000, 12000] as const;
const RETRYABLE_NETWORK_CODES = new Set([
  'EAGAIN', 'ENOTFOUND', 'EAI_AGAIN', 'ECONNRESET', 'ECONNREFUSED', 'ENETUNREACH',
  'EHOSTUNREACH', 'ETIMEDOUT', 'ECONNABORTED', 'EPIPE', 'ERR_STREAM_PREMATURE_CLOSE', 'UND_ERR_SOCKET', 'UND_ERR_CONNECT_TIMEOUT',
]);

function isTemporaryNetworkError(error: unknown): boolean {
  const info = record(error);
  return error instanceof TypeError || info.name === 'TimeoutError' || info.name === 'AbortError' ||
    RETRYABLE_NETWORK_CODES.has(String(info.code ?? record(info.cause).code ?? ''));
}

async function waitForRetry(ms: number, signal: AbortSignal): Promise<void> {
  if (signal.aborted) return;
  await new Promise<void>(resolve => {
    const finish = () => {
      clearTimeout(timer);
      signal.removeEventListener('abort', finish);
      resolve();
    };
    const timer = setTimeout(finish, ms);
    signal.addEventListener('abort', finish, { once: true });
  });
}

async function readBookmarkPage(endpoint: URL, request: typeof fetch, signal: AbortSignal): Promise<unknown> {
  let lastError = new ImportError('네이버 응답을 읽을 수 없습니다. 잠시 후 다시 시도해주세요.');
  for (let attempt = 0; attempt < PAGE_ATTEMPT_TIMEOUTS_MS.length && !signal.aborted; attempt++) {
    if (attempt > 0) {
      await waitForRetry(300 * attempt, signal);
      if (signal.aborted) break;
    }
    const attemptSignal = AbortSignal.any([signal, AbortSignal.timeout(PAGE_ATTEMPT_TIMEOUTS_MS[attempt])]);
    try {
      const response = await request(endpoint.href, { signal: attemptSignal, redirect: 'error', cache: 'no-store', headers: { Accept: 'application/json' } });
      if (!response.ok) {
        await response.body?.cancel();
        if (response.status < 500) throw new ImportError('네이버 목록을 불러오지 못했습니다. 공개 범위와 링크를 확인한 뒤 다시 시도해주세요.');
        lastError = new ImportError('네이버가 목록을 보내지 못했습니다. 잠시 후 다시 시도해주세요.');
        continue;
      }
      const raw = await response.text();
      if (raw.length > 2_000_000) throw new ImportError('목록 응답이 너무 큽니다.');
      if (raw.trim()) {
        try { return JSON.parse(raw); } catch { /* Retry a malformed upstream response. */ }
      }
      lastError = new ImportError('네이버 응답을 읽을 수 없습니다. 잠시 후 다시 시도해주세요.');
    } catch (error) {
      if (!isTemporaryNetworkError(error)) throw error;
      lastError = new ImportError('네이버에 연결하지 못했습니다. 잠시 후 다시 시도해주세요.');
    }
  }
  throw lastError;
}

export async function fetchSharedList(input: string, request: typeof fetch = fetch): Promise<ImportedList> {
  let url = validateListUrl(input);
  const signal = AbortSignal.timeout(25000);
  let shareId = shareIdFromUrl(url);
  let singlePlaceId = singlePlaceIdFromUrl(url);
  for (let hops = 0; !shareId && !singlePlaceId && hops < 4; hops++) {
    const response = await request(url.href, { redirect: 'manual', signal, cache: 'no-store' });
    const location = response.headers.get('location');
    await response.body?.cancel();
    if (![301, 302, 303, 307, 308].includes(response.status) || !location) {
      break;
    }
    const nextUrl = parseUrl(location, url);
    if (!nextUrl || !isAllowedNaverUrl(nextUrl)) throw new ImportError('네이버 지도 공유 링크로 연결되지 않습니다.');
    url = nextUrl;
    shareId = shareIdFromUrl(url);
    singlePlaceId = singlePlaceIdFromUrl(url);
  }

  // Fallback for single place links (e.g. /entry/place/12345 or /restaurant/12345)
  if (!shareId) {
    const sid = singlePlaceId;
    if (sid) {
      return {
        shareId: `single-place-${sid}`,
        name: '네이버 지도 공유 장소',
        sourceUrl: url.href,
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
            memo: `공유된 네이버 지도 장소 링크: ${url.href}`,
            url: `https://map.naver.com/p/entry/place/${sid}`,
          },
        ],
      };
    }
    throw new ImportError('공유 링크를 읽지 못했습니다. 네이버 지도 앱/웹의 리스트 공유 링크(naver.me 등)를 다시 복사해주세요.');
  }

  const pageSize = 20;
  const concurrency = 4;
  const folderId = shareId;
  const fetchPage = async (start: number, pageSignal: AbortSignal) => {
    const endpoint = new URL(`https://pages.map.naver.com/save-pages/api/maps-bookmark/v3/shares/${folderId}/bookmarks`);
    endpoint.search = new URLSearchParams({start: String(start), limit: String(pageSize), sort: 'lastUseTime', placeInfo: 'true'}).toString();
    return parseBookmarkPage(await readBookmarkPage(endpoint, request, pageSignal), folderId);
  };

  const first = await fetchPage(0, signal);
  const { name, total } = first;
  if (total > 500) throw new ImportError('한 목록당 최대 500개를 가져올 수 있습니다. 목록을 나눠주세요.');
  if (total > pageSize && first.rawCount !== pageSize) {
    throw new ImportError('일부 장소를 읽지 못했습니다. 저장하지 않았으니 다시 불러와주세요.');
  }
  const places = [...first.places];
  const offsets: number[] = [];
  for (let start = pageSize; start < total; start += pageSize) offsets.push(start);

  for (let i = 0; i < offsets.length; i += concurrency) {
    const controller = new AbortController();
    const batchSignal = AbortSignal.any([signal, controller.signal]);
    try {
      const pages = await Promise.all(offsets.slice(i, i + concurrency).map(async start => {
        const page = await fetchPage(start, batchSignal);
        if (page.total !== total) throw new ImportError('가져오는 동안 목록이 변경됐습니다. 다시 불러와주세요.');
        if (start + pageSize < total && page.rawCount !== pageSize) {
          throw new ImportError('일부 장소를 읽지 못했습니다. 저장하지 않았으니 다시 불러와주세요.');
        }
        return page;
      }));
      for (const page of pages) places.push(...page.places);
    } catch (error) {
      controller.abort();
      throw error;
    }
  }
  const unique = [...new Map(places.map(place => [place.id, place])).values()];
  if (places.length !== total || unique.length !== total) throw new ImportError('목록이 변경되었거나 중복된 응답이 있습니다. 다시 불러와주세요.');
  return { shareId, name, sourceUrl: `https://map.naver.com/p/favorite/sharedPlace/folder/${shareId}`, importedAt: new Date().toISOString(), places: unique };
}
