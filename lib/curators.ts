import fs from 'fs';
import discoveries from '../data/discoveries.json';
import ownerPlaces from '../data/owner-places.json';
import path from 'path';
import { Cafe, CuratorFileContent, CuratorProfile, CuratedCafe, CafeFilterParams } from './types';
import { resolveCoordinates } from './geocoding';
import { parseNaverPlaceLink, ownerPlaceAddressKey, ownerPlaceNameKey, ownerPlaceRoadKey } from './naverPlaceLinks';

const DATA_DIR = path.join(process.cwd(), 'data', 'curators');

type OwnerPlace = {
  naver_place_id: string;
  source_url: string;
  staged_on: string;
  existing_id?: string;
  id?: string;
  name?: string;
  address?: string;
  neighborhood?: string;
};

const ownerRows = (ownerPlaces.places as OwnerPlace[]).filter(row => row && typeof row === 'object');
const ownerCurator: CuratorProfile = {
  id: 'k',
  display_name: 'K',
  identity_tag: 'KULT 편집자',
  bio: 'KULT에서 공개하기로 고른 공간을 모아요. 장소마다 방문 여부나 현재 영업 상태는 따로 확인해 주세요.',
  status: 'active',
  joined_date: ownerRows.map(row => row.staged_on).filter(day => /^\d{4}-\d{2}-\d{2}$/.test(day)).sort()[0] ?? '',
};

function ownerCafes(catalog: CuratedCafe[], history: Cafe[]): CuratedCafe[] {
  const closed = history.filter(row => row.business_status === 'closed');
  const seen = new Set<string>();
  const added: CuratedCafe[] = [];
  for (const row of ownerRows) {
    const URL = parseNaverPlaceLink(row.source_url);
    if (URL?.kind !== 'place' || URL.id !== row.naver_place_id || seen.has(URL.id)) continue;
    seen.add(URL.id);
    const known = history.filter(place => place.naver_place_id === URL.id);
    const conflictsClosed = (address: string) => closed.some(place =>
      place.naver_place_id === URL.id ||
      Boolean(ownerPlaceRoadKey(address) && ownerPlaceRoadKey(place.address) === ownerPlaceRoadKey(address)));
    if (row.existing_id) {
      if (known.length !== 1) continue;
      const existing = catalog.find(place => place.id === row.existing_id && place.naver_place_id === URL.id
        && !place.is_demo && !place.content_status && Boolean(place.last_verified_date) && place.business_status !== 'closed');
      if (existing && !conflictsClosed(existing.address) && !existing.curated_by.includes(ownerCurator.id)) {
        existing.curated_by.push(ownerCurator.id);
        existing.curators.push(ownerCurator);
      }
      continue;
    }
    const { id, name, address, neighborhood } = row;
    if (id !== `owner-naver-${URL.id}` || typeof name !== 'string' || !name.trim() || typeof address !== 'string' || !address.trim()
      || typeof neighborhood !== 'string' || !neighborhood.trim()
      || !ownerPlaceRoadKey(address) || known.length || conflictsClosed(address)
      || [...history, ...added].some(place => place.id === id || (
        [place.name, place.name_local].some(value => ownerPlaceNameKey(value) === ownerPlaceNameKey(name))
        && ownerPlaceAddressKey(place.address) === ownerPlaceAddressKey(address)
      ))) continue;
    added.push({
      id, name, name_local: name, address, neighborhood, naver_place_id: URL.id,
      lat: null, lng: null, hours: '', last_verified_date: '',
      notes: 'K가 네이버 지도 링크로 공개 목록에 추가한 장소입니다. 방문, 현재 영업 상태와 운영 시간은 확인되지 않았습니다.',
      tags: { wifi: null, outlet_availability: 'unknown', noise_level: 'unknown', kid_free_zone: null,
        english_menu: null, card_only: null, good_for: [], price_range: 'unknown' },
      curators: [ownerCurator], curated_by: [ownerCurator.id],
      freshness: { months_ago: 0, is_stale: true, badge_label: 'K의 공개 목록 · 영업 미확인' },
    });
  }
  return added;
}


/**
 * Calculates months elapsed from a verification date string (YYYY-MM-DD)
 */
export function calculateFreshness(lastVerifiedDate: string): {
  months_ago: number;
  is_stale: boolean;
  badge_label: string;
} {
  const verified = new Date(lastVerifiedDate);
  const now = new Date();

  if (isNaN(verified.getTime())) {
    return {
      months_ago: 0,
      is_stale: false,
      badge_label: 'Recently verified',
    };
  }

  const yearsDiff = now.getFullYear() - verified.getFullYear();
  const monthsDiff = now.getMonth() - verified.getMonth();
  const totalMonths = Math.max(0, yearsDiff * 12 + monthsDiff);

  const is_stale = totalMonths >= 3;
  let badge_label = '';

  if (totalMonths === 0) {
    badge_label = 'Verified this month';
  } else if (totalMonths === 1) {
    badge_label = 'Verified 1 month ago';
  } else {
    badge_label = `Verified ${totalMonths} months ago`;
  }

  if (is_stale) {
    badge_label += ' (Check status)';
  }

  return {
    months_ago: totalMonths,
    is_stale,
    badge_label,
  };
}

/**
 * Reads all curator JSON files in data/curators/
 */
export async function getAllCuratorFiles(): Promise<CuratorFileContent[]> {
  if (!fs.existsSync(DATA_DIR)) {
    return [];
  }

  const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith('.json'));
  const results: CuratorFileContent[] = [];

  for (const file of files) {
    try {
      const filePath = path.join(DATA_DIR, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed: CuratorFileContent = JSON.parse(content);
      if (parsed.curator && Array.isArray(parsed.cafes)) {
        results.push(parsed);
      }
    } catch (err) {
      console.error(`Failed to parse curator JSON ${file}:`, err);
    }
  }

  return results;
}

/**
 * Gets all active Curator Profiles
 */
export async function getAllCurators(): Promise<CuratorProfile[]> {
  const files = await getAllCuratorFiles();
  const curators = files.filter((f) => f.curator.status === 'active').map((f) => f.curator);
  return ownerRows.length && !curators.some(curator => curator.id === ownerCurator.id)
    ? [...curators, ownerCurator] : curators;
}

/**
 * Gets a single Curator Profile by ID along with their cafes count
 */
export async function getCuratorById(id: string): Promise<{
  curator: CuratorProfile;
  cafes: CuratedCafe[];
} | null> {
  const files = await getAllCuratorFiles();
  const match = files.find((f) => f.curator.id === id && f.curator.status === 'active');
  const curator = match?.curator ?? (id === ownerCurator.id && ownerRows.length ? ownerCurator : null);
  if (!curator) return null;

  const allMergedCafes = await getMergedCafes();
  const curatorCafes = allMergedCafes.filter((c) => c.curated_by.includes(id));
  return { curator, cafes: curatorCafes };
}

/**
 * Merges cafes across all curators. Deduplicates by normalized name + address,
 * combining curator metadata into `curated_by` and `curators`.
 */
export async function getMergedCafes({ includeClosed = false }: { includeClosed?: boolean } = {}): Promise<CuratedCafe[]> {
  const curatorFiles = await getAllCuratorFiles();
  const cafeMap = new Map<string, CuratedCafe>();
  const dedupeKey = (cafe: Cafe) => `${cafe.name.toLowerCase().trim()}_${cafe.address.toLowerCase().replace(/\s+/g, '')}`;
  // A closed branch must not return to discovery through a duplicate curator record.
  const discoveryCafes = discoveries as Cafe[];
  const allHistory = [...discoveryCafes, ...curatorFiles.flatMap(file => file.cafes)];
  const closures = new Map([...discoveryCafes, ...curatorFiles.filter(file => file.curator.status === 'active').flatMap(file => file.cafes)]
    .filter(cafe => cafe.business_status === 'closed')
    .map(cafe => [dedupeKey(cafe), cafe] as const));

  for (const cf of curatorFiles) {
    const curator = cf.curator;
    if (curator.status !== 'active') continue;

    for (const record of cf.cafes) {
      const key = dedupeKey(record);
      const closed = closures.get(key);
      if (closed && !includeClosed) continue;
      const cafe = closed ?? record;

      const coords = closed ? { lat: null, lng: null } : await resolveCoordinates(cafe.address, cafe.lat, cafe.lng);
      const freshness = closed
        ? { months_ago: 0, is_stale: true, badge_label: '영업 종료' }
        : cafe.is_demo
        ? { months_ago: 0, is_stale: true, badge_label: '테스트 장소 · 방문 미확인' }
        : calculateFreshness(cafe.last_verified_date);

      if (cafeMap.has(key)) {
        const existing = cafeMap.get(key)!;
        if (!existing.curated_by.includes(curator.id)) {
          existing.curated_by.push(curator.id);
          existing.curators.push(curator);
        }
      } else {
        cafeMap.set(key, {
          ...cafe,
          ...(closed ? { hours: '', last_verified_date: '' } : {}),
          lat: coords.lat,
          lng: coords.lng,
          curated_by: [curator.id],
          curators: [curator],
          freshness,
        });
      }
    }
  }

  // Research discoveries have no invented curator or approximate map coordinates.
  const discovered = discoveryCafes
    .filter(cafe => !cafeMap.has(dedupeKey(cafe)) && (includeClosed || !closures.has(dedupeKey(cafe))))
    .map(record => {
      const closed = closures.get(dedupeKey(record));
      return {
        ...(closed ?? record), curated_by: [], curators: [],
        ...(closed ? { hours: '', last_verified_date: '', lat: null, lng: null } : {}),
        freshness: { months_ago: 0, is_stale: true, badge_label: closed ? '영업 종료' : '발견한 공간 · 방문 미확인' },
      };
    });
  const catalog = [...cafeMap.values(), ...discovered];
  return [...catalog, ...ownerCafes(catalog, allHistory)];
}

/**
 * Retrieves all unique neighborhoods across all curated cafes
 */
export async function getNeighborhoods(): Promise<string[]> {
  const cafes = await getMergedCafes();
  const set = new Set<string>();
  for (const cafe of cafes) {
    if (cafe.neighborhood) {
      set.add(cafe.neighborhood);
    }
  }
  return Array.from(set).sort();
}

/**
 * Filters cafes based on Expat query parameters.
 * Note: Unverified tags ('unknown' or null) are not arbitrarily guessed or excluded by default.
 */
export async function filterCafes(params: CafeFilterParams): Promise<CuratedCafe[]> {
  let cafes = await getMergedCafes();

  if (params.curator_id) {
    cafes = cafes.filter((c) => c.curated_by.includes(params.curator_id!));
  }

  if (params.neighborhood && params.neighborhood !== 'all') {
    cafes = cafes.filter(
      (c) => c.neighborhood.toLowerCase() === params.neighborhood?.toLowerCase()
    );
  }

  if (params.wifi !== undefined) {
    cafes = cafes.filter((c) => c.tags.wifi === params.wifi || c.tags.wifi === null);
  }

  if (params.outlet_availability && params.outlet_availability !== 'unknown') {
    cafes = cafes.filter(
      (c) =>
        c.tags.outlet_availability === params.outlet_availability ||
        c.tags.outlet_availability === 'unknown'
    );
  }

  if (params.noise_level && params.noise_level !== 'unknown') {
    cafes = cafes.filter(
      (c) => c.tags.noise_level === params.noise_level || c.tags.noise_level === 'unknown'
    );
  }

  if (params.kid_free_zone !== undefined) {
    cafes = cafes.filter(
      (c) => c.tags.kid_free_zone === params.kid_free_zone || c.tags.kid_free_zone === null
    );
  }

  if (params.english_menu !== undefined) {
    cafes = cafes.filter(
      (c) => c.tags.english_menu === params.english_menu || c.tags.english_menu === null
    );
  }

  if (params.good_for) {
    cafes = cafes.filter(
      (c) =>
        c.tags.good_for.length === 0 ||
        c.tags.good_for.some((g) => g.toLowerCase() === params.good_for?.toLowerCase())
    );
  }

  if (params.search_query) {
    const q = params.search_query.toLowerCase();
    cafes = cafes.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.name_local.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q) ||
        c.notes.toLowerCase().includes(q)
    );
  }

  return cafes;
}

/**
 * Gets a single cafe by ID
 */
export async function getCafeById(id: string): Promise<CuratedCafe | null> {
  const cafes = await getMergedCafes({ includeClosed: true });
  return cafes.find((c) => c.id === id) || null;
}
