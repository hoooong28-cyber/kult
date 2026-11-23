import assert from 'node:assert/strict';
import test from 'node:test';
import { findVenue } from '../scripts/discover-venue-photos.mjs';
import { planNaverPhotoSearch } from '../scripts/plan-naver-photo-search.mjs';

test('photo search links are discovery only, branch-specific, and point to Naver', async () => {
  const venue = await findVenue('lowkey-seongsu');
  const result = planNaverPhotoSearch(venue);
  assert.equal(result.status, 'discovery-only');
  assert.equal(result.address, '서울 성동구 연무장3길 6');
  assert.equal(result.searches.length, 3);
  for (const item of result.searches) {
    const u = new URL(item.url);
    assert.equal(u.origin, 'https://search.naver.com');
    assert.equal(u.pathname, '/search.naver');
    assert.match(u.searchParams.get('query'), /로우키 성수.*연무장3길 6/);
    assert.equal(item.image_url, undefined);
    assert.equal(item.reviewed, undefined);
  }
  assert.equal(new URL(result.searches[0].url).searchParams.get('where'), 'image');
  assert.equal(new URL(result.searches[2].url).searchParams.get('where'), 'nexearch');
  assert.throws(() => planNaverPhotoSearch({id:'direct', name:'Cafe'}), /street address/);
});

test('Naver search plan cannot target an already closed branch', async () => {
  await assert.rejects(findVenue('center-coffee-seoulforest'), /excluded/);
});
