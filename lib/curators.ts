import fs from 'fs';
import path from 'path';
import { Cafe, CuratorFileContent, CuratorProfile, CuratedCafe, CafeFilterParams } from './types';
import { resolveCoordinates } from './geocoding';

const DATA_DIR = path.join(process.cwd(), 'data', 'curators');

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
  return files
    .filter((f) => f.curator.status === 'active')
    .map((f) => f.curator);
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
  if (!match) return null;

  const allMergedCafes = await getMergedCafes();
  const curatorCafes = allMergedCafes.filter((c) => c.curated_by.includes(id));

  return {
    curator: match.curator,
    cafes: curatorCafes,
  };
}

/**
 * Merges cafes across all curators. Deduplicates by normalized name + address,
 * combining curator metadata into `curated_by` and `curators`.
 */
export async function getMergedCafes(): Promise<CuratedCafe[]> {
  const curatorFiles = await getAllCuratorFiles();
  const cafeMap = new Map<string, CuratedCafe>();
  const curatorProfiles = new Map<string, CuratorProfile>();

  for (const cf of curatorFiles) {
    if (cf.curator.status === 'active') {
      curatorProfiles.set(cf.curator.id, cf.curator);
    }
  }

  for (const cf of curatorFiles) {
    const curator = cf.curator;
    if (curator.status !== 'active') continue;

    for (const cafe of cf.cafes) {
      const key = `${cafe.name.toLowerCase().trim()}_${cafe.address.toLowerCase().replace(/\s+/g, '')}`;

      const coords = await resolveCoordinates(cafe.address, cafe.lat, cafe.lng);
      const freshness = calculateFreshness(cafe.last_verified_date);

      if (cafeMap.has(key)) {
        const existing = cafeMap.get(key)!;
        if (!existing.curated_by.includes(curator.id)) {
          existing.curated_by.push(curator.id);
          existing.curators.push(curator);
        }
      } else {
        cafeMap.set(key, {
          ...cafe,
          lat: coords.lat,
          lng: coords.lng,
          curated_by: [curator.id],
          curators: [curator],
          freshness,
        });
      }
    }
  }

  return Array.from(cafeMap.values());
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
  const cafes = await getMergedCafes();
  return cafes.find((c) => c.id === id) || null;
}
