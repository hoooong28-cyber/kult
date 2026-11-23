import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';

// https://www.mediawiki.org/wiki/API:Search
// https://www.mediawiki.org/wiki/API:Imageinfo
// https://foundation.wikimedia.org/wiki/Policy:Wikimedia_Foundation_User-Agent_Policy
const API = 'https://commons.wikimedia.org/w/api.php';
const USER_AGENT = 'KULTPhotoDiscovery/1.0 (https://github.com/hoooong28-cyber/kult/issues)';
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const LIMIT = 5;
const MAX_BYTES = 512 * 1024;
const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const FIELDS = {
  objectName: 'ObjectName',
  description: 'ImageDescription',
  artist: 'Artist',
  credit: 'Credit',
  source: 'Source',
  date: 'DateTimeOriginal',
  license: 'License',
  licenseName: 'LicenseShortName',
  licenseUrl: 'LicenseUrl',
  usageTerms: 'UsageTerms',
  attributionRequired: 'AttributionRequired',
  attribution: 'Attribution',
  copyrighted: 'Copyrighted',
  restrictions: 'Restrictions',
  latitude: 'GPSLatitude',
  longitude: 'GPSLongitude',
};

function clean(value, max = 1500) {
  if (typeof value !== 'string') return null;
  const text = value.replace(/<[^>]*>/g, ' ').replace(/[\u0000-\u001f\u007f\u202a-\u202e\u2066-\u2069]/g, ' ')
    .replace(/\s+/gu, ' ').trim();
  return text ? Array.from(text).slice(0, max).join('') : null;
}

export async function findVenue(id, root = ROOT) {
  if (typeof id !== 'string' || id.length > 100 || !ID.test(id)) throw new Error('Invalid venue ID');
  const read = async path => JSON.parse(await readFile(path, 'utf8'));
  const policy = await read(join(root, 'data', 'venue-photo-policy.json')).catch(error => {
    if (error.code === 'ENOENT') return {};
    throw error;
  });
  const excludedIds = policy?.excluded_place_ids ?? [];
  if (!Array.isArray(excludedIds) || excludedIds.some(value => typeof value !== 'string' || !ID.test(value))) {
    throw new Error('Invalid photo discovery exclusion policy');
  }
  if (excludedIds.includes(id)) throw new Error('Venue is excluded by photo policy');
  const curatorDir = join(root, 'data', 'curators');
  const files = (await readdir(curatorDir, { withFileTypes: true })).filter(f => f.isFile() && f.name.endsWith('.json'));
  const candidates = [];
  for (const file of files.sort((a, b) => a.name.localeCompare(b.name, 'en'))) {
    const data = await read(join(curatorDir, file.name));
    if (data?.curator?.status === 'active' && Array.isArray(data.cafes)) candidates.push(...data.cafes);
  }
  const discoveries = await read(join(root, 'data', 'discoveries.json'));
  if (!Array.isArray(discoveries)) throw new Error('Invalid discoveries list');
  candidates.push(...discoveries);
  const owned = await read(join(root, 'data', 'owner-places.json')).catch(error => {
    if (error.code === 'ENOENT') return { places: [] };
    throw error;
  });
  if (!Array.isArray(owned?.places)) throw new Error('Invalid publisher place list');
  candidates.push(...owned.places.filter(place => /^owner-naver-[1-9][0-9]+$/.test(place?.id || '')));
  const matches = candidates.filter(venue => venue?.id === id);
  if (!matches.length || matches.some(venue => venue.is_demo || venue.business_status === 'closed')) {
    throw new Error('Venue is unknown or excluded (demo, closed, or inactive)');
  }
  const [venue] = matches;
  const result = {
    id: venue.id,
    name: clean(venue.name, 100),
    nameLocal: clean(venue.name_local, 100),
    address: clean(venue.address, 200),
    neighborhood: clean(venue.neighborhood, 80),
  };
  if (!result.name && !result.nameLocal) throw new Error('Venue has no searchable name');
  if (!result.address || matches.some(other => clean(other.address, 200) !== result.address)) {
    throw new Error('Venue has no unambiguous address');
  }
  return result;
}

function searchesFor(venue) {
  const terms = [venue.nameLocal, venue.name]
    .map(name => clean(name, 80)?.replace(/["\\]/g, ' ').replace(/\s+/gu, ' ').trim())
    .filter(Boolean);
  return [...new Map(terms.map(term => [term.toLowerCase(), term])).values()].map(term => `"${term}"`);
}

async function readApiJson(response) {
  const length = Number(response.headers.get('content-length'));
  if (length > MAX_BYTES) throw new Error('Wikimedia Commons response exceeded size limit');
  if (!response.body) throw new Error('Empty response from Wikimedia Commons');
  const reader = response.body.getReader();
  let size = 0;
  const chunks = [];
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BYTES) {
        void reader.cancel().catch(() => {});
        throw new Error('Wikimedia Commons response exceeded size limit');
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  try {
    return JSON.parse(Buffer.concat(chunks, size).toString('utf8'));
  } catch {
    throw new Error('Invalid JSON response from Wikimedia Commons');
  }
}

async function search(query, fetchImpl) {
  const url = new URL(API);
  url.search = new URLSearchParams({
    action: 'query',
    format: 'json',
    formatversion: '2',
    generator: 'search',
    gsrsearch: query,
    gsrnamespace: '6',
    gsrlimit: String(LIMIT),
    prop: 'imageinfo',
    iiprop: 'mime|extmetadata',
    iilimit: '1',
    iiextmetadatafilter: Object.values(FIELDS).join('|'),
    maxlag: '5',
  }).toString();
  const response = await fetchImpl(url, {
    method: 'GET', redirect: 'error', signal: AbortSignal.timeout(8000),
    headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
  });
  if (!response.ok) throw new Error(`Wikimedia Commons returned HTTP ${response.status}`);
  const data = await readApiJson(response);
  if (data?.error || data?.errors || data?.warnings) throw new Error('Wikimedia Commons rejected or warned about the query');
  const pages = data?.query?.pages;
  if (!Array.isArray(pages) && !(data?.batchcomplete === true && !data?.query)) {
    throw new Error('Unexpected Wikimedia Commons search response');
  }
  const validPages = (pages ?? []).filter(page => page?.ns === 6 &&
    typeof page.title === 'string' && page.title.startsWith('File:') && clean(page.title, 250) === page.title &&
    Number.isSafeInteger(page.pageid) && page.pageid > 0);
  validPages.sort((a, b) => {
    const index = page => Number.isSafeInteger(page.index) ? page.index : Number.MAX_SAFE_INTEGER;
    return index(a) - index(b) || a.pageid - b.pageid;
  });
  return {
    pages: validPages.slice(0, LIMIT),
    moreResults: Boolean(data.continue) || (pages?.length ?? 0) > LIMIT,
  };
}

export async function discoverVenuePhotos(venue, { fetchImpl = fetch, pause = sleep } = {}) {
  const queries = searchesFor(venue);
  if (!queries.length) throw new Error('Venue has no searchable name');
  const candidates = new Map();
  const searchEvidence = [];
  for (const [index, query] of queries.entries()) {
    if (index) await pause(1000);
    const { pages, moreResults } = await search(query, fetchImpl);
    searchEvidence.push({ query, moreResults });
    for (const page of pages) {
      const info = Array.isArray(page.imageinfo) ? page.imageinfo[0] : null;
      const metadata = Object.fromEntries(Object.entries(FIELDS).map(([key, field]) => [
        key, clean(info?.extmetadata?.[field]?.value),
      ]));
      const mime = clean(info?.mime, 80);
      const evidence = {
        query, title: page.title, rank: Number.isSafeInteger(page.index) ? page.index : null,
        mime, metadata,
      };
      const existing = candidates.get(page.pageid);
      if (existing) {
        existing.searchEvidence.push(evidence);
        existing.mime ??= mime;
        for (const key of Object.keys(FIELDS)) existing.metadata[key] ??= metadata[key];
        continue;
      }
      candidates.set(page.pageid, {
        pageId: page.pageid,
        title: page.title,
        sourcePage: `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title.replaceAll(' ', '_'))}`,
        mime,
        metadata: { ...metadata },
        searchEvidence: [evidence],
        reviewRequired: true,
      });
    }
  }
  return {
    schemaVersion: 1,
    source: 'wikimedia-commons',
    venue,
    reviewRequired: true,
    searchEvidence,
    candidates: [...candidates.values()],
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const args = process.argv.slice(2);
    if (args.length !== 2 || args[0] !== '--place') {
      throw new Error('Usage: node scripts/discover-venue-photos.mjs --place <id>');
    }
    const venue = await findVenue(args[1]);
    console.log(JSON.stringify(await discoverVenuePhotos(venue), null, 2));
  } catch (error) {
    console.error(`Candidate discovery failed: ${error.message}`);
    process.exitCode = 1;
  }
}
