import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { selectVenuePhotos } from './venue-photo-core.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const json = async file => JSON.parse(await fs.readFile(path.join(root, file), 'utf8'));
const maxBytes = 8 * 1024 * 1024;
function safeAsset(pathname) {
  return /^\/venues\/[a-z0-9][a-z0-9_-]*\.(jpe?g|png|webp)$/i.test(pathname);
}
function fileMatches(bytes, src) {
  if (/\.jpe?g$/i.test(src)) return bytes.length > 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  if (/\.png$/i.test(src)) return bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
  if (/\.webp$/i.test(src)) return bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP';
  return false;
}
export function approvedAssetUrl(value, hosts) {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.username || url.password || url.port || url.hash || !hosts.includes(url.hostname)) return null;
    return url;
  } catch { return null; }
}
async function fetchImage(asset, hosts) {
  const url = approvedAssetUrl(asset.image_url, hosts);
  if (!url) throw new Error('Image host is not approved');
  const response = await fetch(url, { redirect: 'error', signal: AbortSignal.timeout(12_000) });
  if (!response.ok || !response.body || !/^image\/(jpeg|png|webp)(;|$)/i.test(response.headers.get('content-type') || '')) {
    throw new Error('Provider did not return a supported image');
  }
  if (Number(response.headers.get('content-length')) > maxBytes) throw new Error('Photo exceeds the size limit');
  const chunks = [];
  const reader = response.body.getReader();
  try {
    let count = 0;
    for (;;) {
      const next = await reader.read();
      if (next.done) break;
      count += next.value.byteLength;
      if (count > maxBytes) { await reader.cancel(); throw new Error('Photo exceeds the size limit'); }
      chunks.push(next.value);
    }
  } finally { reader.releaseLock(); }
  const bytes = Buffer.concat(chunks);
  if (!fileMatches(bytes, asset.src)) throw new Error('Photo bytes do not match the file extension');
  return bytes;
}

async function main(args) {
  if (args.length > 1 || (args.length === 1 && args[0] !== '--write')) throw new Error('Usage: node scripts/sync-venue-photos.mjs [--write]');
  const write = args.includes('--write');
  const [policy, assets, discoveries, names] = await Promise.all([json('data/venue-photo-policy.json'), json('data/venue-photo-candidates.json'), json('data/discoveries.json'), fs.readdir(path.join(root, 'data/curators'))]);
  const groups = await Promise.all(names.filter(name => name.endsWith('.json')).sort().map(name => json('data/curators/' + name)));
  const owned = await json('data/owner-places.json');
  if (!Array.isArray(owned?.places)) throw new Error('Invalid publisher place list');
  const additions = owned.places.filter(place => /^owner-naver-[1-9][0-9]+$/.test(place?.id || ''));
  const all = [...groups.filter(group => group.curator?.status === 'active').flatMap(group => group.cafes), ...discoveries, ...additions];
  const places = Array.from(new Map(all.filter(place => !policy.excluded_place_ids.includes(place.id)).map(place => [place.id, place])).values());
  const byId = new Map(places.map(place => [place.id, place]));
  // Ties and provenance must refer to one and only one reviewed local filename.
  const paths = new Set();
  for (const asset of assets) {
    if (asset?.reviewed !== true || typeof asset.src !== 'string') continue;
    if (paths.has(asset.src)) throw new Error('Duplicate reviewed photo file: ' + asset.src);
    paths.add(asset.src);
  }
  const { selected, pending } = selectVenuePhotos(places, assets);
  const manifest = Object.create(null);
  const unresolved = [...pending];
  for (const placeId of Object.keys(selected).sort()) {
    const photo = selected[placeId];
    const identity = byId.get(placeId);
    if (!safeAsset(photo.src) || !identity) throw new Error('Invalid selected photo');
    const asset = assets.find(candidate => candidate?.src === photo.src && candidate?.reviewed === true);
    const dst = path.join(root, 'public', photo.src.slice(1));
    let bytes;
    try {
      const info = await fs.lstat(dst);
      if (!info.isFile() || info.size > maxBytes) throw new Error('Invalid local photo file');
      bytes = await fs.readFile(dst);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      if (!write) {
        unresolved.push({place_id:placeId, reason:'approved-file-not-local-yet'});
        continue;
      }
      try {
        bytes = await fetchImage(asset, policy.approved_asset_hosts);
        await fs.mkdir(path.dirname(dst), { recursive: true });
        await fs.writeFile(dst, bytes, { flag: 'wx' });
      } catch {
        unresolved.push({place_id:placeId, reason:'approved-file-unavailable'});
        continue;
      }
    }
    if (!fileMatches(bytes, photo.src)) throw new Error('Corrupt or mislabeled venue photo: ' + photo.src);
    manifest[placeId] = {...photo, venue_address:identity.address};
  }
  const report = {mode:write ? 'write' : 'dry-run', selected:Object.keys(manifest), pending:unresolved, excluded:policy.excluded_place_ids};
  if (write && unresolved.some(item => item.reason === 'approved-file-unavailable')) {
    console.log(JSON.stringify(report, null, 2));
    throw new Error('An approved asset could not be staged; keeping the previous on-site manifest.');
  }
  if (write) {
    const outfile = path.join(root, 'data/venue-photos.json');
    const temporary = outfile + '.tmp';
    await fs.writeFile(temporary, JSON.stringify(manifest, null, 2) + '\n', { flag: 'wx' });
    await fs.rename(temporary, outfile);
  }
  console.log(JSON.stringify(report, null, 2));
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).catch(error => { console.error(error.message); process.exitCode = 1; });
}
