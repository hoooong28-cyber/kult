import assert from 'node:assert/strict';
import test from 'node:test';
import { getLocalNaverLists, saveLocalNaverList } from '../lib/localNaverLists.ts';
import { logOutUser, resumeLocalProfile, startLocalProfile } from '../lib/userStore.ts';

const legacyKey = 'kult_naver_imported_lists_v1';
const legacyUser = 'kult_current_user';
const profile = { id: 'owner-old', name: 'Old', identityTag: '', bio: '', avatar: '', joinedDate: '2026-01-01' };
const lists = suffix => ({
  name: '장소 ' + suffix, shareId: suffix, sourceUrl: 'https://map.naver.com/p/favorite/sharedPlace/folder/' + suffix, importedAt: '2026-01-01',
  places: [{ id: 'place-' + suffix, name: '테스트', address: '서울', category: '카페', url: 'https://map.naver.com/p/entry/place/100' }],
});
function storage() {
  const map = new Map();
  return { getItem: key => map.get(key) ?? null, setItem: (key, value) => map.set(key, String(value)), removeItem: key => map.delete(key) };
}
function setup() {
  globalThis.window = {localStorage: storage(), sessionStorage: storage(), dispatchEvent: () => true};
  return window.localStorage;
}

test('guest and closed tab see no old lists; active legacy profile can resume and merge without overwriting legacy', () => {
  const store = setup();
  store.setItem(legacyUser, JSON.stringify(profile));
  store.setItem(legacyKey, JSON.stringify([lists('first')]));
  assert.deepEqual(getLocalNaverLists(), []);
  assert.throws(() => saveLocalNaverList(lists('new')), /프로필/);
  resumeLocalProfile();
  assert.deepEqual(getLocalNaverLists().map(x => x.shareId), ['first']);
  assert.deepEqual(saveLocalNaverList(lists('new')).map(x => x.shareId), ['new','first']);
  assert.deepEqual(saveLocalNaverList(lists('new')).map(x => x.shareId), ['new','first']);
  assert.equal(JSON.parse(store.getItem(legacyKey)).length, 1);
  logOutUser();
  assert.deepEqual(getLocalNaverLists(), []);
});

test('a newly opened profile never adopts unclaimed old browser imports', () => {
  const store = setup();
  store.setItem(legacyKey, JSON.stringify([lists('old')]));
  startLocalProfile('New');
  assert.deepEqual(getLocalNaverLists(), []);
  assert.deepEqual(saveLocalNaverList(lists('own')).map(x => x.shareId), ['own']);
  assert.equal(JSON.parse(store.getItem(legacyKey))[0].shareId, 'old');
});

test('corrupt imported legacy data is not overwritten', () => {
  const store = setup();
  store.setItem(legacyUser, JSON.stringify(profile));
  store.setItem(legacyKey, 'corrupt');
  resumeLocalProfile();
  assert.throws(() => saveLocalNaverList(lists('own')));
  assert.equal(store.getItem(legacyKey), 'corrupt');
});

test('legacy single-place imports created from a Naver short link remain readable', () => {
  const store = setup();
  store.setItem(legacyUser, JSON.stringify(profile));
  store.setItem(legacyKey, JSON.stringify([{...lists('single-place-100'), sourceUrl:'https://naver.me/ABCD'}]));
  resumeLocalProfile();
  assert.deepEqual(getLocalNaverLists().map(x => x.shareId), ['single-place-100']);
});
