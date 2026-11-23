import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { discoverVenuePhotos, findVenue } from '../scripts/discover-venue-photos.mjs';

const venue = { id: 'cuco-seongsu', name: 'Cuco', nameLocal: '쿠코 성수', address: '아차산로11길 12', neighborhood: 'Seongsu' };
const file = (pageid, title, index, mime, extmetadata) => ({
  pageid, title, index, ns: 6,
  ...(extmetadata || mime ? { imageinfo: [{ mime, extmetadata }] } : {}),
});
const json = data => new Response(JSON.stringify(data), { headers: { 'content-type': 'application/json' } });
async function fixtures(t) {
  const root = await mkdtemp(join(tmpdir(), 'kult-photo-test-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const put = async (path, value) => {
    const target = join(root, path);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, JSON.stringify(value));
  };
  await put('data/curators/a.json', {
    curator: { status: 'active' },
    cafes: [
      { id: 'a', name: 'A', name_local: '에이', address: '서울 A길 1', source_list_url: 'https://example.com/do-not-fetch' },
      { id: 'b', name: 'B', address: '서울 B길 1', is_demo: true },
      { id: 'c', name: 'C', address: '서울 C길 1', business_status: 'closed' },
      { id: 'excluded', name: 'Excluded', address: '서울 D길 1' },
    ],
  });
  await put('data/curators/b.json', { curator: { status: 'inactive' }, cafes: [{ id: 'inactive', name: 'Inactive' }] });
  await put('data/discoveries.json', [{ id: 'discovery-a', name: '발견', address: '서울 D길 2' }]);
  await put('data/venue-photo-policy.json', { excluded_place_ids: ['excluded'] });
  return { root, put };
}

test('loads active venue data and discoveries, rejects demo, closed, explicit exclusions and invalid IDs', async t => {
  const { root } = await fixtures(t);
  assert.deepEqual(await findVenue('a', root), { id: 'a', name: 'A', nameLocal: '에이', address: '서울 A길 1', neighborhood: null });
  assert.equal((await findVenue('discovery-a', root)).name, '발견');
  for (const id of ['b', 'c', 'inactive', 'missing']) await assert.rejects(findVenue(id, root), /unknown or excluded/);
  await assert.rejects(findVenue('excluded', root), /excluded by photo policy/);
  await assert.rejects(findVenue('../a', root), /Invalid venue ID/);
});

test('ambiguous IDs and invalid exclusion policy fail closed', async t => {
  const { root, put } = await fixtures(t);
  await put('data/discoveries.json', [{ id: 'a', name: '또 다른 곳', address: 'B길 2' }]);
  await assert.rejects(findVenue('a', root), /unambiguous address/);
  await put('data/venue-photo-policy.json', { excluded_place_ids: 42 });
  await assert.rejects(findVenue('a', root), /Invalid photo discovery exclusion policy/);
});

test('uses two bounded attributed API searches, deduplicates IDs and retains per-query evidence', async () => {
  const seen = [];
  const waits = [];
  const result = await discoverVenuePhotos(venue, {
    pause: ms => waits.push(ms),
    fetchImpl: async (url, init) => {
      seen.push(url.searchParams.get('gsrsearch'));
      assert.equal(url.origin, 'https://commons.wikimedia.org');
      assert.equal(url.pathname, '/w/api.php');
      assert.equal(url.searchParams.get('gsrnamespace'), '6');
      assert.equal(url.searchParams.get('gsrlimit'), '5');
      assert.equal(url.searchParams.get('iiprop'), 'mime|extmetadata');
      assert.match(init.headers['User-Agent'], /KULTPhotoDiscovery.*github\.com/);
      assert.equal(init.redirect, 'error');
      assert.ok(init.signal instanceof AbortSignal);
      if (seen.length === 1) return json({
        continue: { gsroffset: 5 },
        query: { pages: [
          file(7, 'File:CUCO exterior.jpg', 2, 'image/jpeg', { ImageDescription: { value: '<p>Storefront</p>' } }),
          file(5, 'File:쿠코.png', 1),
          { ns: 0, title: 'File:Ignore', pageid: 9 },
        ] },
      });
      return json({ query: { pages: [
        file(7, 'File:CUCO exterior.jpg', 1, 'image/jpeg', {
          LicenseShortName: { value: 'CC BY 4.0' }, Artist: { value: '<a href="https://invalid.example/">Artist</a>' },
          LicenseUrl: { value: 'https://creativecommons.org/licenses/by/4.0/' },
        }),
        file(11, 'File:Another Cuco.jpg', 3),
      ] } });
    },
  });
  assert.deepEqual(seen, ['"쿠코 성수"', '"Cuco"']);
  assert.deepEqual(waits, [1000]);
  assert.equal(result.reviewRequired, true);
  assert.equal(result.searchEvidence[0].moreResults, true);
  assert.deepEqual(result.candidates.map(c => c.pageId), [5, 7, 11]);
  assert.ok(result.candidates.every(c => c.reviewRequired));
  assert.equal(result.candidates[0].metadata.licenseName, null);
  const match = result.candidates[1];
  assert.equal(match.metadata.licenseName, 'CC BY 4.0');
  assert.equal(match.metadata.artist, 'Artist');
  assert.equal(match.metadata.description, 'Storefront');
  assert.equal(match.searchEvidence[0].metadata.licenseName, null);
  assert.equal(match.searchEvidence[1].metadata.licenseName, 'CC BY 4.0');
  assert.deepEqual(match.searchEvidence.map(e => e.rank), [2, 1]);
  assert.equal(match.sourcePage, 'https://commons.wikimedia.org/wiki/File%3ACUCO_exterior.jpg');
  assert.equal('photoUrl' in match, false);
});

test('missing metadata is not proof of reuse or match, duplicate names issue one query', async () => {
  let calls = 0;
  const result = await discoverVenuePhotos({ ...venue, nameLocal: 'Cuco' }, {
    fetchImpl: async () => { calls++; return json({ batchcomplete: true }); },
  });
  assert.equal(calls, 1);
  assert.deepEqual(result.candidates, []);
  assert.equal(result.reviewRequired, true);
});

test('invalid HTTP, metadata envelope and oversized body are not reported as no matches', async () => {
  const discover = response => discoverVenuePhotos(venue, { fetchImpl: async () => response });
  await assert.rejects(discover(new Response('', { status: 429 })), /HTTP 429/);
  await assert.rejects(discover(json({ error: { code: 'maxlag' } })), /rejected/);
  await assert.rejects(discover(json({})), /Unexpected/);
  await assert.rejects(discover(new Response('not JSON')), /Invalid JSON/);
  await assert.rejects(discover(new Response('x'.repeat(512 * 1024 + 1))), /size limit/);
});
