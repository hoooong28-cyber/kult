import test from 'node:test';
import assert from 'node:assert/strict';
import {
  addPrivateNaverPlace, filterPrivateNaverPlaces, listPrivateNaverPlaces, removePrivateNaverPlace,
} from '../lib/privateNaverPlaces.ts';
import founder from '../data/curators/founder.json' with { type: 'json' };
import { parseNaverPlaceLink } from '../lib/naverPlaceLinks.ts';
import { resolveNaverShortLink } from '../lib/resolveNaverShortLink.ts';
import { logOutUser, resumeLocalProfile } from '../lib/userStore.ts';

function memory() {
  let stored = new Map();
  return {
    getItem: id => stored.get(id) ?? null,
    setItem: (id, value) => stored.set(id, String(value)),
    removeItem: id => stored.delete(id),
  };
}
function profile(id) {
  window.localStorage.setItem('kult_local_profile_v2', JSON.stringify({ id, name: id }));
  resumeLocalProfile();
}

test('single place is canonical, deduplicated, searchable, and private to active browser profile', () => {
  globalThis.window = { localStorage: memory(), sessionStorage: memory() };
  assert.deepEqual(listPrivateNaverPlaces(), []);
  assert.throws(() => addPrivateNaverPlace('https://map.naver.com/p/entry/place/123', 'Cafe', 'a'), /프로필/);
  profile('a');
  assert.equal(addPrivateNaverPlace('https://m.place.naver.com/restaurant/123/home?secret=1#track', '바닐라 Café', 'a').added, true);
  assert.equal(addPrivateNaverPlace('https://map.naver.com/p/entry/place/123', 'duplicate', 'a').added, false);
  const saved = listPrivateNaverPlaces();
  assert.equal(saved.length, 1);
  assert.equal(saved[0].url, 'https://map.naver.com/p/entry/place/123');
  assert.equal(filterPrivateNaverPlaces(saved, 'CAFÉ').length, 1);
  assert.equal(filterPrivateNaverPlaces(saved, '123').length, 1);
  assert.equal(filterPrivateNaverPlaces(saved, 'other').length, 0);
  logOutUser();
  assert.deepEqual(listPrivateNaverPlaces(), []);
  assert.throws(() => removePrivateNaverPlace('123', 'a'), /프로필/);
  profile('b');
  assert.deepEqual(listPrivateNaverPlaces(), []);
  assert.throws(() => removePrivateNaverPlace('123', 'a'), /프로필/);
  profile('a');
  assert.deepEqual(listPrivateNaverPlaces(), saved);
  assert.deepEqual(removePrivateNaverPlace('123', 'a'), []);
});

test('does not persist a short link, share list, lookalike, or forged stored row', () => {
  globalThis.window = { localStorage: memory(), sessionStorage: memory() };
  profile('test');
  for (const url of ['https://naver.me/GpCZMpKo', 'https://pages.map.naver.com/share/folders/12', 'https://evil.test/p/entry/place/123']) {
    assert.throws(() => addPrivateNaverPlace(url, 'fake', 'test'), /링크/);
  }
  window.localStorage.setItem('kult_private_naver_places_v1:test', JSON.stringify([
    { id: '123', url: 'https://evil.test', name: '', savedAt: '' },
    { id: '321', url: 'https://map.naver.com/p/entry/place/123', name: '', savedAt: '' },
  ]));
  assert.deepEqual(listPrivateNaverPlaces(), []);
});

test('short resolution only fetches Naver short hops, strips tracking and never fetches place page', async () => {
  const visited = [];
  const place = await resolveNaverShortLink('https://naver.me/abcd?private=1', async url => {
    visited.push(url);
    return visited.length === 1 ? '/wxyz?trace=1' : 'https://m.place.naver.com/cafe/123/home?token=2';
  });
  assert.deepEqual(visited, ['https://naver.me/abcd', 'https://naver.me/wxyz']);
  assert.deepEqual(place, { kind: 'place', id: '123', url: 'https://map.naver.com/p/entry/place/123' });
});

test('short resolution fails closed on foreign/list destinations, loops, and excessive redirects', async () => {
  for (const bad of ['https://evil.test/', '//naver.me/efgh', 'https://pages.map.naver.com/share/folders/1', 'https://naver.me/abcd']) {
    let calls = 0;
    assert.equal(await resolveNaverShortLink('https://naver.me/abcd', async () => { calls++; return bad; }), null);
    assert.equal(calls, 1);
  }
  let calls = 0;
  assert.equal(await resolveNaverShortLink('https://naver.me/abcd', async () => 'https://naver.me/next' + ++calls), null);
  assert.equal(calls, 3);
});

test('the encoded Lowkey Seongsu Map search result resolves to the exact branch without tracking', () => {
  globalThis.window = { localStorage: memory(), sessionStorage: memory() };
  profile('lowkey-test');
  const input = 'https://map.naver.com/p/search/' + encodeURIComponent('로우키 성수') + '/place/1393890643?placePath=' + encodeURIComponent('/home?entry=pll&from=map&searchText=로우키 성수') + '&entry=pll&searchType=place&c=15.00,0,0,0,dh';
  const link = parseNaverPlaceLink(input);
  assert.deepEqual(link,{ kind:'place', id:'1393890643', url:'https://map.naver.com/p/entry/place/1393890643' });
  const exact = founder.cafes.find(cafe => cafe.naver_place_id === link.id);
  assert.equal(exact.address, '서울 성동구 연무장3길 6');
  assert.equal(addPrivateNaverPlace(input, exact.name_local, 'lowkey-test').places[0].name, '로우키 성수');
});
