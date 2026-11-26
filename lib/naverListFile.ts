import type { ImportedList } from './naverImport';

export const MAX_NAVER_FILE_BYTES = 2_000_000;
const MAX_PLACES = 500;
const seoul = /^서울(?:특별시|시)?(?:\s|$)/u;
const dining = /카페|커피|베이커리|디저트|브런치|음식점|레스토랑|한식|일식|중식|양식|분식|베트남|태국|이탈리아|프랑스|와인바|술집|비스트로|피자|버거|제과|주점|해산물|국수|고기|스시|아시아|샐러드|아이스크림/u;
const clean = (v: unknown, max = 500) => typeof v === 'string' ? v.trim().slice(0, max) : '';
const obj = (v: unknown): Record<string, unknown> => typeof v === 'object' && v != null && !Array.isArray(v) ? v as Record<string, unknown> : {};
const id = (v: unknown) => (typeof v === 'string' || Number.isSafeInteger(v)) && /^\d{1,25}$/.test(String(v)) ? String(v) : '';

export function seoulDiningPlaces(places: ImportedList['places']) {
  return places.filter(p => p.available && seoul.test(p.address.trim()) && dining.test(p.category));
}

export async function parseNaverListFile(raw: string, options: {name?: string; now?: Date} = {}): Promise<ImportedList> {
  if (new TextEncoder().encode(raw).byteLength > MAX_NAVER_FILE_BYTES) throw new Error('2MB 이하의 JSON 파일만 읽을 수 있어요.');
  let json: ReturnType<typeof obj>;
  try { json = obj(JSON.parse(raw.replace(/^\uFEFF/u, ''))); }
  catch { throw new Error('JSON을 읽을 수 없어요. 네이버 목록 데이터 파일인지 확인해주세요.'); }
  const folder = obj(json.folder);
  const rows = json.bookmarkList;
  if (json.removed === true || !Array.isArray(rows) || !rows.length || rows.length > MAX_PLACES) {
    throw new Error('네이버 장소 목록 JSON에서 1~500곳을 읽을 수 있어요. 기존 저장은 그대로예요.');
  }
  if (typeof folder.bookmarkCount === 'number' && folder.bookmarkCount !== rows.length) {
    throw new Error('이 파일에 목록 일부만 들어 있어요. 전체 장소가 담긴 파일이 필요해요.');
  }
  const places = new Map<string, ImportedList['places'][number]>();
  for (const rawRow of rows) {
    const row = obj(rawRow), info = obj(row.placeInfo);
    const sid = id(row.sid), bookmarkId = id(row.bookmarkId);
    const name = clean(row.name);
    if (!name || (!sid && !bookmarkId)) throw new Error('형식을 확인할 수 없는 장소가 있어요. 아무것도 저장하지 않았어요.');
    const address = clean(row.address);
    const placeId = sid ? 'naver-place-' + sid : 'naver-bookmark-' + bookmarkId;
    if (places.has(placeId)) continue;
    places.set(placeId, {
      id: placeId, name, address, category: clean(info.category) || clean(row.mcidName),
      lat: null, lng: null, available: row.available === true,
      // File imports do not retain private notes, original link, or account metadata.
      memo: '', url: sid ? 'https://map.naver.com/p/entry/place/' + sid : 'https://map.naver.com/p/search/' + encodeURIComponent(name + ' ' + address),
    });
  }
  const name = clean(folder.name, 100) || clean(options.name, 100) || '네이버 지도에서 가져온 장소';
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify([name, [...places.keys()].sort()])));
  const signature = Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, '0')).join('').slice(0, 32);
  return {
    shareId: 'file-' + signature,
    name, sourceUrl: 'https://map.naver.com/',
    importedAt: (options.now || new Date()).toISOString(),
    places: [...places.values()],
  };
}
