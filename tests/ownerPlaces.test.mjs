import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { parseNaverPlaceLink } from '../lib/naverPlaceLinks.ts';
import { planOwnerPlace, resolveOwnerPlaceLink } from '../scripts/stage-owner-place.mjs';

const link = parseNaverPlaceLink('https://map.naver.com/p/entry/place/90001');
const current = { schema_version: 1, places: [] };
const address = '서울 성동구 연무장3길 6';
const name = '로우키 성수';
const verified = { id: 'lowkey-seongsu', naver_place_id: '90001', address, name_local: name, last_verified_date: '2025-01-01' };

test('canonicalizes only exact public single-place paths without tracking parameters', () => {
  for (const url of [
    'https://map.naver.com/p/entry/place/90001?entry=pll&token=private#tab',
    'https://map.naver.com/v5/entry/place/90001',
    'https://map.naver.com/p/search/%EB%A1%9C%EC%9A%B0%ED%82%A4/place/90001',
    'https://m.place.naver.com/restaurant/90001/review/visitor?entry=pll',
    'https://place.naver.com/cafe/90001/home',
  ]) assert.deepEqual(parseNaverPlaceLink(url), link);
  assert.deepEqual(parseNaverPlaceLink('https://naver.me/SomeSlug?secret=1'), { kind: 'short', url: 'https://naver.me/SomeSlug' });
});

test('rejects lists, redirect/search endpoints, lookalikes, non-public hosts and traversal-like forms', () => {
  for (const url of [
    'https://map.naver.com/p/favorite/sharedPlace/folder/00000000000000000000000000000000',
    'https://map.naver.com/p/search/coffee?sid=90001',
    'https://map.naver.com/p/entry/place/90001/other',
    'https://naver.me/SomeSlug/next',
    'http://map.naver.com/p/entry/place/90001',
    'https://map.naver.com:443/p/entry/place/90001',
    'https://map.naver.com.example.test/p/entry/place/90001',
    'https://name@map.naver.com/p/entry/place/90001',
    'https://map.naver.com/p/search/../entry/place/90001',
    'https://map.naver.com/p/entry%2Fplace%2F90001',
    'https://127.0.0.1/entry/place/90001',
  ]) assert.equal(parseNaverPlaceLink(url), null, url);
});

test('short resolver requests only validated short URLs and does not fetch or scrape the destination', async () => {
  const observed = [];
  const r = await resolveOwnerPlaceLink('https://naver.me/SomeSlug?secret=1', async (url, options) => {
    observed.push(url);
    assert.equal(options.method, 'HEAD');
    assert.equal(options.redirect, 'manual');
    assert.equal(options.credentials, 'omit');
    return new Response(null, { status: 302, headers: { location: observed.length === 1
      ? 'https://naver.me/AnotherSlug?secret=2'
      : 'https://m.place.naver.com/restaurant/90001/home?secret=3' } });
  });
  assert.deepEqual(r, link);
  assert.deepEqual(observed, ['https://naver.me/SomeSlug', 'https://naver.me/AnotherSlug']);
  let count = 0;
  await assert.rejects(() => resolveOwnerPlaceLink('https://naver.me/SomeSlug', async () => {
    count++;
    return new Response(null, { status: 302, headers: { location: 'https://unexpected.example/redirect' } });
  }), /단축 링크/);
  assert.equal(count, 1);
});

test('operator must confirm name/address for new places and no inferred claims are staged', () => {
  assert.throws(() => planOwnerPlace({ link, name }, [], current), /전체 도로명 주소/);
  assert.throws(() => planOwnerPlace({ link, name, address: '서울 성수동2가 123' }, [], current), /전체 도로명 주소/);
  const planned = planOwnerPlace({ link: { ...link, url: link.url + '?token=private' }, name, address }, [], current);
  assert.equal(planned.status, 'new-place');
  assert.equal(planned.record.id, 'owner-naver-90001');
  assert.equal(planned.record.source_url, link.url);
  assert.equal(planned.record.neighborhood, '성동구');
  assert.equal(planned.record.photos, undefined);
  assert.equal(planned.record.hours, undefined);
  assert.equal(planned.record.address, address);
  assert.deepEqual(current.places, []);
});

test('known curator ID is reused but stage rejects demo, conflict or already closed exact property', () => {
  const plan = planOwnerPlace({ link }, [verified], current);
  assert.equal(plan.status, 'reuse-existing');
  assert.equal(plan.record.existing_id, verified.id);
  assert.equal(plan.record.id, undefined);
  assert.equal(planOwnerPlace({ link }, [verified], { ...current, places: [plan.record] }).status, 'already-listed');
  assert.throws(() => planOwnerPlace({ link, name: '다른 매장' }, [verified], current), /일치하지/);
  assert.throws(() => planOwnerPlace({ link }, [{ ...verified, is_demo: true }], current), /미검증/);
  assert.throws(() => planOwnerPlace({ link }, [{ ...verified, business_status: 'closed' }], current), /영업 종료/);
  assert.throws(() => planOwnerPlace({ link, name, address }, [{ ...verified, naver_place_id: undefined }], current), /중복/);
  assert.throws(() => planOwnerPlace({ link, name, address: '서울특별시 성동구 연무장3길 6 2층' },
    [{ ...verified, naver_place_id: undefined, business_status: 'closed' }], current), /영업 종료/);
});

test('tracked owner list has an explicit versioned places array', () => {
  const state = JSON.parse(readFileSync(new URL('../data/owner-places.json', import.meta.url), 'utf8'));
  assert.equal(state.schema_version, 1);
  assert.ok(Array.isArray(state.places));
});
