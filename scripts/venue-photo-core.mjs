const allowedRights = new Set(['owner-permission', 'CC0', 'CC-BY-4.0', 'KOGL-1']);
const photoPriority = {
  cafe: ['interior', 'coffee', 'food'],
  restaurant: ['food', 'interior', 'coffee'],
};
const localImagePattern = /^\/venues\/(?:[a-z\d][a-z\d._-]*\/)*[a-z\d][a-z\d._-]*\.(?:jpe?g|png|webp)$/i;
const placeSlugPattern = /^[a-z\d][a-z\d_-]*$/i;
const codepointOrder = (left, right) => left < right ? -1 : left > right ? 1 : 0;
const clean = value => typeof value === 'string' && !/[\u0000-\u001f\u007f]/.test(value) ? value.trim() : '';

function compactName(value) {
  // Remove punctuation that only wraps a branch, not the branch text itself.
  return clean(value).normalize('NFKC').toLowerCase().replace(/[\s()[\]{}]/g, '');
}

function normalizeAddress(value) {
  return clean(value).normalize('NFKC').toLowerCase()
    .replace(/^서울특별시(?=\s|[가-힣])/u, '서울')
    .replace(/\s*\((?:[가-힣]+동\d*(?:가)?)\)\s*$/u, '')
    .replace(/[\s(),]/g, '');
}

function roadMain(address) {
  // The full normalized address (including unit, if provided) is still used for name/address matches.
  return address.match(/^.+?(?:대로|로|길)\d+(?:-\d+)?/u)?.[0] ?? '';
}

function naverId(value) {
  const id = typeof value === 'number' && Number.isSafeInteger(value) ? String(value) : clean(value);
  return /^[1-9]\d{0,19}$/.test(id) ? id : '';
}

function parseSource(value) {
  const source = clean(value);
  try {
    const url = new URL(source);
    return url.protocol === 'https:' && url.hostname && !url.username && !url.password ? source : '';
  } catch { return ''; }
}

function eligibleAsset(asset) {
  if (!asset || typeof asset !== 'object' || asset.reviewed !== true || !allowedRights.has(asset.rights)) return null;
  const id = clean(asset.id);
  const name = compactName(asset.place_name);
  const address = normalizeAddress(asset.place_address);
  const src = clean(asset.src);
  const alt = clean(asset.alt);
  const credit = clean(asset.credit);
  const source_url = parseSource(asset.source_url);
  const providerId = naverId(asset.provider_place_id);
  const subject = asset.subject;
  if (!id || !name || !address || !src.startsWith('/venues/') || !localImagePattern.test(src) || !alt || !credit || !source_url
    || !clean(asset.rights_evidence) || !photoPriority.cafe.includes(subject)
    || (asset.provider_place_id != null && !providerId)) return null;
  for (const dimension of [asset.width, asset.height]) {
    if (dimension != null && (!Number.isSafeInteger(dimension) || dimension <= 0 || dimension > 100000)) return null;
  }
  const resolution = asset.width && asset.height ? asset.width * asset.height : 0;
  return {
    id, name, address, providerId, subject, src, alt, credit, source_url, resolution,
    landscape: resolution > 0 && asset.width > asset.height ? 1 : 0,
  };
}

function matchesVenue(place, asset) {
  const providerId = naverId(place.naver_place_id);
  const address = normalizeAddress(place.address);
  if (providerId && asset.providerId) {
    if (providerId !== asset.providerId) return false;
    const a = roadMain(address), b = roadMain(asset.address);
    // A matching provider ID is sufficient unless the records identify two different known road addresses.
    if (a && b && a !== b) return false;
    return true;
  }
  return Boolean(roadMain(address)) && address === asset.address &&
    [place.name, place.name_local].some(name => compactName(name) === asset.name);
}

function compareAssets(a, b, priority) {
  return priority.indexOf(a.subject) - priority.indexOf(b.subject)
    || b.landscape - a.landscape || b.resolution - a.resolution
    || codepointOrder(a.id, b.id)
    || codepointOrder(a.src, b.src)
    || codepointOrder(a.source_url, b.source_url)
    || codepointOrder(a.credit, b.credit)
    || codepointOrder(a.alt, b.alt);
}

/** Select only already reviewed, locally staged, exact-venue assets; never performs I/O or infers rights. */
export function selectVenuePhotos(places, assets) {
  if (!Array.isArray(places) || !Array.isArray(assets)) throw new TypeError('Expected place and candidate arrays.');
  const candidates = assets.map(eligibleAsset).filter(Boolean);
  const entries = [];
  const pending = [];
  for (const place of places.filter(row => row && typeof row.id === 'string' && placeSlugPattern.test(row.id) &&
    !row.is_demo && row.business_status !== 'closed').sort((a, b) => codepointOrder(a.id, b.id))) {
    const priority = place.kind === 'restaurant' ? photoPriority.restaurant : photoPriority.cafe;
    const winner = candidates.filter(asset => matchesVenue(place, asset)).sort((a, b) => compareAssets(a, b, priority))[0];
    if (!winner) {
      pending.push({ place_id: place.id, reason: 'no-eligible-photo' });
      continue;
    }
    const { src, alt, credit, source_url, subject } = winner;
    entries.push([place.id, { src, alt, credit, source_url, subject }]);
  }
  return { selected: Object.fromEntries(entries), pending };
}
