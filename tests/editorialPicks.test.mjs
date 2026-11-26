import test from 'node:test';
import assert from 'node:assert/strict';
import { pickCopy, purposePicks, picks, resolveEditorialPick, resolvePickPurpose, resolvePurposeShortlist, resolvePurposeAreas } from '../lib/editorialPicks.ts';
import discoveries from '../data/discoveries.json' with { type: 'json' };
import fs from 'node:fs';
import { getVenuePhoto } from '../lib/venuePhotos.ts';
import founder from '../data/curators/founder.json' with { type: 'json' };

const catalog = [...founder.cafes, ...discoveries];

test('Samgakji research is grouped by the visitor purpose', () => {
  const pick = resolveEditorialPick('samgakji', catalog);
  assert.equal(pick.source, 'mixed');
  assert.deepEqual(pick.places.map(p => p.purposes), [['friends'], ['friends', 'solo'], ['date', 'friends'], ['solo']]);
  for (const { cafe } of pick.places) {
    assert.equal(cafe.neighborhood, '용산구 · 삼각지');
    if (cafe.id === 'demo-naver-1274280104') { assert.equal(cafe.naver_place_id,'1274280104'); continue; }
    assert.equal(cafe.last_verified_date, '');
    assert.equal(new URL(cafe.discovery_source.url).protocol, 'https:');
  }
});

test('unknown collections, demos, closed records and provenance mismatches do not appear', () => {
  assert.equal(resolveEditorialPick('unknown', catalog), null);
  const closed = catalog.map(c => c.id === 'discovery-mongtan-samgakji' ? { ...c, business_status: 'closed' } : c);
  assert.equal(resolveEditorialPick('samgakji', closed).places.length, 3);
  const onlyOne = closed.map(c => c.id === 'discovery-mna-samgakji' ? { ...c, is_demo: true } : c);
  assert.equal(resolveEditorialPick('samgakji', onlyOne).places.length, 2);
  assert.equal(resolveEditorialPick('samgakji', catalog.filter(c => c.neighborhood !== '용산구 · 삼각지')), null);
  assert.equal(resolveEditorialPick('seongsu-brunch-or-coffee', catalog.map(c =>
    c.id === 'lowkey-seongsu' ? { ...c, content_status: 'discovered' } : c)).places[0].cafe.id, 'cuco-seongsu');
  assert.equal(new Set(picks.map(p => p.slug)).size, picks.length);
});

test('purpose and exact-branch photo checks do not exclude legitimate photo-free venues', () => {
  assert.deepEqual(['date', 'friends', 'solo'].map(id => resolvePickPurpose(id).label), ['데이트', '친구 모임', '혼자 가기']);
  assert.equal(resolvePickPurpose(['date', 'solo']), undefined);
  assert.equal(resolvePickPurpose('unknown'), undefined);
  const list = resolveEditorialPick('seongsu-brunch-or-coffee', catalog).places;
  assert.deepEqual(purposePicks(list, 'date').map(p => p.cafe.id), ['cuco-seongsu']);
  const solo = purposePicks(list, 'solo');
  assert.deepEqual(solo.map(p => p.cafe.id), ['lowkey-seongsu']);
  assert.equal(getVenuePhoto(solo[0].cafe), null);
  const image = getVenuePhoto(list[0].cafe);
  assert.ok(fs.readFileSync(new URL('../public' + image.src, import.meta.url)).length > 1024);
  assert.equal(getVenuePhoto({ ...list[0].cafe, address: 'another branch' }), null);
  assert.equal(purposePicks(resolveEditorialPick('samgakji', catalog).places).length, 4);
});

test('citywide purpose results include real matches, excluding closed and demo records', () => {
  const ids = (purpose, rows = catalog) => resolvePurposeShortlist(rows, purpose).filter(row => row.slug !== 'yeonnam').map(row => row.cafe.id);
  assert.deepEqual(ids('date'), ['discovery-mna-samgakji', 'cuco-seongsu', 'discovery-a-glass-of-haebangchon']);
  assert.deepEqual(ids('friends'), ['discovery-mongtan-samgakji', 'discovery-always-august-samgakji', 'discovery-mna-samgakji', 'cuco-seongsu', 'discovery-haus-bakery-service', 'discovery-a-glass-of-haebangchon']);
  assert.deepEqual(ids('solo'), ['demo-naver-1274280104', 'discovery-always-august-samgakji', 'lowkey-seongsu', 'discovery-haus-bakery-service']);
  const altered = catalog.map(c => c.id === 'lowkey-seongsu' ? { ...c, is_demo: true } :
    c.id === 'discovery-haus-bakery-service' ? { ...c, business_status: 'closed' } : c);
  assert.deepEqual(ids('solo', altered), ['demo-naver-1274280104','discovery-always-august-samgakji']);
});

test('Yeonnam shows five exact venues, retains Donggyo addresses, and filters by occasion', () => {
  const result = resolveEditorialPick('yeonnam', catalog);
  assert.equal(result.places.length, 5);
  assert.deepEqual(result.places.map(p => p.cafe.naver_place_id), ['1741866041','1612839292','1883924356','1985216398','1976051967']);
  assert.equal(result.places.filter(p => p.cafe.address.includes('동교동')).length, 2);
  assert.deepEqual(['date','friends','solo'].map(p => purposePicks(result.places,p).length), [3,3,2]);
});

test('purpose entry shows only available matches by neighborhood and by city', () => {
 assert.equal(resolvePurposeAreas(catalog, 'friends').find(area => area.slug === 'samgakji').count,3);
 assert.equal(resolvePurposeAreas(catalog, 'friends').find(area => area.slug === 'yeonnam').count,3);
 assert.equal(resolvePurposeAreas(catalog, 'solo').find(area => area.slug === 'yeonnam').count,2);
 assert.equal(resolvePurposeShortlist(catalog, 'friends').length,9);
 assert.deepEqual(resolvePurposeAreas([], 'friends'),[]);
 const closed=catalog.map(c=>c.id==='nonostante-yeonnam'?{...c,business_status:'closed'}:c);
 assert.equal(resolvePurposeAreas(closed,'friends').find(area=>area.slug==='yeonnam').count,2);
});
test('Yeonnam purpose tabs get distinct first picks and shared places receive different explanations', () => {
 const p=resolveEditorialPick('yeonnam',catalog);
 assert.deepEqual(['date','friends','solo'].map(k=>purposePicks(p.places,k)[0].cafe.naver_place_id),['1976051967','1612839292','1883924356']);
 const shared=resolveEditorialPick('seongsu-brunch-or-coffee',catalog).places.find(x=>x.cafe.id==='cuco-seongsu');
 assert.notEqual(pickCopy(shared,'date').ko,pickCopy(shared,'friends').ko);
 assert.equal(pickCopy(shared,undefined).ko,shared.reason);
});