import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createPublishedPost, getCurrentUser, getUserPosts, hasResumableLocalProfile,
  logOutUser, resumeLocalProfile, startLocalProfile, subscribePosts, subscribeUser, updateUserProfile,
} from '../lib/userStore.ts';
import { getSavedCafeIds, toggleSaveCafe } from '../lib/archiveStore.ts';

const keys = {
  legacy: 'kult_current_user', profile: 'kult_local_profile_v2',
  posts: 'kult_user_published_posts', saves: 'kult_saved_cafe_ids',
};
const legacy = { id: 'user-legacy', name: '저장된 이름', email: 'name@example.invalid', bio: '', identityTag: '', avatar: '', joinedDate: '2026-01-01' };
const post = { title: '테스트', titleLocal: '테스트', neighborhood: '성수', address: '', notes: '메모', noiseLevel: '', outletRatio: '', signaturePairing: '', coverImage: '' };

function storage() {
  const map = new Map();
  return {
    getItem: key => map.get(key) ?? null,
    setItem: (key, value) => map.set(key, String(value)),
    removeItem: key => map.delete(key),
  };
}
function setup() {
  globalThis.window = {
    localStorage: storage(), sessionStorage: storage(),
    dispatchEvent() {}, addEventListener() {}, removeEventListener() {},
  };
  globalThis.localStorage = window.localStorage;
}

test('fresh guest loads no profile or sample post and cannot author as a fallback persona', () => {
  setup();
  const store = window.localStorage;
  assert.equal(getCurrentUser(), null);
  assert.equal(hasResumableLocalProfile(), false);
  assert.deepEqual(getUserPosts(), []);
  assert.equal(store.getItem(keys.posts), null);
  assert.throws(() => createPublishedPost(post), /프로필/);
  assert.throws(() => updateUserProfile('Other', '', ''), /프로필/);
  assert.equal(store.getItem(keys.profile), null);
});

test('legacy data stays guest until resume, and closing the session preserves local data', () => {
  setup();
  const store = window.localStorage;
  const data = JSON.stringify(legacy);
  store.setItem(keys.legacy, data);
  store.setItem(keys.saves, JSON.stringify(['center-coffee-seoulforest']));
  store.setItem(keys.posts, JSON.stringify([
    { id: 'post-1', authorId: 'user-eleanor' },
    { id: 'other', authorId: 'other-user' },
    { id: 'mine', authorId: legacy.id },
  ]));
  assert.equal(getCurrentUser(), null);
  assert.equal(hasResumableLocalProfile(), true);
  assert.deepEqual(getUserPosts(), []);
  const states = [];
  const postStates = [];
  const unsubscribe = subscribeUser(profile => states.push(profile?.id ?? null));
  const unsubscribePosts = subscribePosts(posts => postStates.push(posts.map(x => x.id)));
  try {
    assert.deepEqual(resumeLocalProfile(), legacy);
    assert.equal(getCurrentUser().id, legacy.id);
    assert.deepEqual(getUserPosts().map(x => x.id), ['mine']);
    const oldPosts = store.getItem(keys.posts);
    logOutUser();
    assert.equal(getCurrentUser(), null);
    assert.deepEqual(getUserPosts(), []);
    assert.equal(store.getItem(keys.legacy), data);
    assert.equal(store.getItem(keys.posts), oldPosts);
    assert.deepEqual(getSavedCafeIds(), ['center-coffee-seoulforest']);
    assert.deepEqual(states, [legacy.id, null]);
    assert.deepEqual(postStates, [['mine'], []]);
  } finally {
    unsubscribe();
    unsubscribePosts();
  }
});

test('new browser-tab storage does not automatically resume the same browser profile', () => {
  setup();
  const current = startLocalProfile('  새 이름  ');
  assert.equal(current.name, '새 이름');
  assert.equal('email' in current, false);
  assert.deepEqual(getCurrentUser(), current);
  window.sessionStorage = storage();
  assert.equal(getCurrentUser(), null);
  assert.equal(resumeLocalProfile().id, current.id);
});

test('legacy demo personas stay inactive and a new profile does not replace their legacy storage', () => {
  for (const id of ['user-eleanor', 'user-kult-admin']) {
    setup();
    const raw = JSON.stringify({ ...legacy, id });
    window.localStorage.setItem(keys.legacy, raw);
    assert.equal(getCurrentUser(), null);
    assert.equal(hasResumableLocalProfile(), false);
    assert.throws(() => resumeLocalProfile(), /프로필/);
    assert.notEqual(startLocalProfile('새 이름').id, id);
    assert.equal(window.localStorage.getItem(keys.legacy), raw);
  }
});

test('resume notifies a pending save once and profile changes keep existing saves and unrelated posts', () => {
  setup();
  window.localStorage.setItem(keys.legacy, JSON.stringify(legacy));
  window.localStorage.setItem(keys.saves, JSON.stringify(['historical']));
  window.localStorage.setItem(keys.posts, JSON.stringify([{ id: 'foreign', authorId: 'foreign-id' }]));
  let pending = true;
  const unsubscribe = subscribeUser(profile => {
    if (profile && pending) {
      pending = false;
      toggleSaveCafe('lowkey-seongsu');
    }
  });
  try {
    assert.deepEqual(getSavedCafeIds(), ['historical']);
    resumeLocalProfile();
    assert.deepEqual(getSavedCafeIds(), ['historical', 'lowkey-seongsu']);
    assert.equal(updateUserProfile('새 이름', '소개', '').id, legacy.id);
    const created = createPublishedPost(post);
    assert.equal(created.authorId, legacy.id);
    assert.deepEqual(getUserPosts().map(x => x.id), [created.id]);
    assert.equal(JSON.parse(window.localStorage.getItem(keys.posts)).at(-1).id, 'foreign');
    assert.deepEqual(getSavedCafeIds(), ['historical', 'lowkey-seongsu']);
  } finally { unsubscribe(); }
});
