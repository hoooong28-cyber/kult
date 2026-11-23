import { randomUUID } from 'node:crypto';
import { readFile, readdir, rename, unlink, writeFile } from 'node:fs/promises';
import { basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { parseNaverPlaceLink, ownerPlaceNameKey, ownerPlaceAddressKey, ownerPlaceRoadKey } from '../lib/naverPlaceLinks.ts';

const root = new URL('../', import.meta.url);
const ownerFile = new URL('data/owner-places.json', root);
const readJson = async file => JSON.parse(await readFile(file, 'utf8'));
const safeText = (value, max) => typeof value === 'string' && !/[\p{Cc}\p{Cf}]/u.test(value) && value.trim().length <= max ? value.trim() : '';
const nameEqual = (record, name) => [record.name, record.name_local].some(value => typeof value === 'string' && ownerPlaceNameKey(value) === ownerPlaceNameKey(name));
const addressEqual = (record, address) => typeof record.address === 'string' && ownerPlaceAddressKey(record.address) === ownerPlaceAddressKey(address);
const roadEqual = (record, address) => Boolean(address && ownerPlaceRoadKey(address) && typeof record.address === 'string' && ownerPlaceRoadKey(record.address) === ownerPlaceRoadKey(address));

/** Resolve only trusted naver.me short redirects; no Naver page/metadata is downloaded. */
export async function resolveOwnerPlaceLink(input, fetcher = fetch) {
  let parsed = parseNaverPlaceLink(input);
  if (!parsed) throw new Error('네이버 지도 단일 장소 링크를 넣어 주세요. 목록이나 검색 링크는 받지 않아요.');
  if (parsed.kind === 'place') return parsed;
  const seen = new Set();
  const signal = AbortSignal.timeout(6_000);
  for (let count = 0; count < 3; count++) {
    if (seen.has(parsed.url)) break;
    seen.add(parsed.url);
    let response;
    try { response = await fetcher(parsed.url, { method: 'HEAD', redirect: 'manual', signal, credentials: 'omit', referrerPolicy: 'no-referrer' }); }
    catch { throw new Error('네이버 단축 링크 응답을 받지 못했어요. 네이버 지도에서 열린 장소 상세 링크를 복사해 주세요.'); }
    const location = response.headers.get('location');
    try { await response.body?.cancel(); } catch { /* Ignore cancellation after status/headers. */ }
    if (![301, 302, 303, 307, 308].includes(response.status) || !location || location.startsWith('//')) break;
    parsed = parseNaverPlaceLink(location.startsWith('/') ? new URL(location, parsed.url).href : location);
    if (!parsed) break;
    if (parsed.kind === 'place') return parsed;
  }
  throw new Error('단축 링크가 공개 단일 장소로 확인되지 않았어요. 네이버 지도에서 열린 장소 상세 링크를 복사해 주세요.');
}

export function planOwnerPlace({ link, name, address, neighborhood }, catalog, current) {
  const parsed = link?.kind === 'place' ? parseNaverPlaceLink(link.url) : null;
  if (parsed?.kind !== 'place' || parsed.id !== link.id) throw new Error('확인된 단일 장소 ID가 필요합니다.');
  link = parsed;
  if (!current || current.schema_version !== 1 || !Array.isArray(current.places)) throw new Error('운영자 장소 파일의 형식이 올바르지 않습니다.');
  const verifiedName = safeText(name, 120);
  const verifiedAddress = safeText(address, 250);
  const verifiedNeighborhood = safeText(neighborhood, 100);
  if ((name != null && !verifiedName) || (address != null && !verifiedAddress) || (neighborhood != null && !verifiedNeighborhood)) {
    throw new Error('장소명·도로명 주소·동네 값에 제어 문자나 빈 값이 없는지 확인해 주세요.');
  }

  const sameId = catalog.filter(row => row.naver_place_id === link.id);
  const knownOwner = current.places.find(row => row.naver_place_id === link.id);
  const staged_on = new Date().toISOString().slice(0, 10);
  if (catalog.some(row => row.business_status === 'closed' && (row.naver_place_id === link.id || roadEqual(row, verifiedAddress)
    || (knownOwner?.address && roadEqual(row, knownOwner.address))))) {
    throw new Error('영업 종료 이력이 있는 지점과 충돌합니다. 다시 게시하지 않았습니다.');
  }
  if (knownOwner) {
    if ((verifiedName && knownOwner.name && !nameEqual(knownOwner, verifiedName))
      || (verifiedAddress && knownOwner.address && !addressEqual(knownOwner, verifiedAddress))) {
      throw new Error('같은 ID의 기존 운영자 기록과 새 정보가 다릅니다. 덮어쓰지 않았습니다.');
    }
    return { status: 'already-listed', record: knownOwner };
  }
  if (sameId.length > 1) throw new Error('카탈로그에 같은 네이버 장소 ID가 여러 개 있습니다. 먼저 중복을 확인해 주세요.');
  if (sameId.length === 1) {
    const existing = sameId[0];
    if (existing.is_demo || existing.content_status === 'discovered' || !existing.last_verified_date) {
      throw new Error('같은 ID의 미검증 카탈로그 기록을 먼저 검토해 주세요. 중복 추가하지 않았습니다.');
    }
    if ((verifiedName && !nameEqual(existing, verifiedName)) || (verifiedAddress && !addressEqual(existing, verifiedAddress))) {
      throw new Error('네이버 ID의 기존 장소명 또는 주소와 일치하지 않습니다. 중복 추가하지 않았습니다.');
    }
    return { status: 'reuse-existing', record: { naver_place_id: link.id, existing_id: existing.id, source_url: link.url, staged_on } };
  }

  if (!verifiedName || !verifiedAddress || !ownerPlaceRoadKey(verifiedAddress)) {
    throw new Error('새 장소는 링크에서 확인한 이름과 전체 도로명 주소(--name, --address)가 필요합니다.');
  }
  if ([...catalog, ...current.places].some(row => nameEqual(row, verifiedName) && addressEqual(row, verifiedAddress))) {
    throw new Error('같은 이름·주소가 이미 있습니다. 기존 항목의 장소 ID를 확인해 주세요. 중복 추가하지 않았습니다.');
  }
  const id = `owner-naver-${link.id}`;
  if (catalog.some(row => row.id === id) || current.places.some(row => row.id === id)) {
    throw new Error('KULT 내부 장소 ID가 충돌합니다. 중복 추가하지 않았습니다.');
  }
  return {
    status: 'new-place',
    record: {
      id, naver_place_id: link.id, source_url: link.url, staged_on, name: verifiedName, address: verifiedAddress,
      neighborhood: verifiedNeighborhood || verifiedAddress.match(/^서울(?:특별시)?\s+([가-힣]+구)(?:\s|$)/u)?.[1] || '지역 미상',
    },
  };
}

async function loadCatalog() {
  const files = (await readdir(new URL('data/curators/', root))).filter(name => name.endsWith('.json'));
  const groups = await Promise.all(files.map(name => readJson(new URL(`data/curators/${name}`, root))));
  return [...groups.flatMap(group => Array.isArray(group.cafes) ? group.cafes : []), ...await readJson(new URL('data/discoveries.json', root))];
}

async function main() {
  const { values } = parseArgs({ options: {
    url: { type: 'string' }, name: { type: 'string' }, address: { type: 'string' }, neighborhood: { type: 'string' },
    write: { type: 'boolean' }, help: { type: 'boolean' },
  } });
  if (values.help) {
    console.log('node scripts/stage-owner-place.mjs --url <NaverPlaceURL> [--name <name> --address <road address> --neighborhood <area>] [--write]');
    return;
  }
  const link = await resolveOwnerPlaceLink(values.url);
  const [current, catalog] = await Promise.all([readJson(ownerFile), loadCatalog()]);
  const result = planOwnerPlace({ ...values, link }, catalog, current);
  if (values.write && result.status !== 'already-listed') {
    const temp = new URL(`data/.owner-places.${randomUUID()}.tmp`, root);
    try {
      await writeFile(temp, JSON.stringify({ ...current, places: [...current.places, result.record] }, null, 2) + '\n', { flag: 'wx' });
      await rename(temp, ownerFile);
    } finally { await unlink(temp).catch(() => {}); }
  }
  console.log(JSON.stringify({
    mode: values.write ? 'working-copy' : 'dry-run', ...result,
    wrote: Boolean(values.write && result.status !== 'already-listed'), deployed: false,
  }, null, 2));
}

if (process.argv[1] && basename(process.argv[1]) === 'stage-owner-place.mjs' && new URL(import.meta.url).protocol === 'file:'
  && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
