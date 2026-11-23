import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { DatabaseSync } from 'node:sqlite';
import {
  createPilotOwner, hashPilotOwner, openTasteNeighborPilotStore, parsePilotMatchIds, parsePilotShelf,
} from '../lib/tasteNeighborPilotStore.ts';

const places = [{ id: '100', name: '커피' }, { id: '101', name: '서점' }, { id: '102', name: '식당' }];

test('pilot only accepts bounded numeric-ID shelves with display names and no other data', () => {
  assert.deepEqual(parsePilotShelf('테스트', places), { nickname: '테스트', places });
  assert.equal(parsePilotShelf('테스트', places.slice(0, 2)), null);
  assert.equal(parsePilotShelf('테스트', places.concat({ ...places[0] })), null);
  assert.equal(parsePilotShelf('테스트', [...places.slice(0, 2), { ...places[2], url: 'https://example.test' }]), null);
  assert.equal(parsePilotShelf('테스트\n', places), null);
  assert.equal(parsePilotShelf('테스트', [...places.slice(0, 2), { ...places[2], id: 102 }]), null);
  assert.equal(parsePilotMatchIds(['0']), null);
  assert.equal(parsePilotMatchIds(Array.from({ length: 41 }, (_, n) => String(n + 1))), null);
  assert.deepEqual(parsePilotMatchIds(['100', '101', '100']), ['100', '101']);
});

test('opens again after close, never stores token, excludes own and expired shelves, and revokes', async t => {
  const dir = mkdtempSync(join(tmpdir(), 'kult-private-shelf-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const dbPath = join(dir, 'pilot.sqlite');
  const token = createPilotOwner();
  const ownerHash = hashPilotOwner(token);
  assert.match(ownerHash, /^[0-9a-f]{64}$/);
  assert.notEqual(ownerHash, token);
  assert.equal(hashPilotOwner('your-nickname'), null);
  const shelf = { nickname: 'original', places };
  let store = await openTasteNeighborPilotStore(dbPath);
  assert.equal(store.getOwn(null), null);
  assert.equal(store.publish(ownerHash, shelf), true);
  store.close();
  assert.equal(statSync(dbPath).mode & 0o077, 0);
  const raw = new DatabaseSync(dbPath);
  assert.equal(raw.prepare('SELECT owner_hash FROM taste_shelves').get().owner_hash, ownerHash);
  assert.equal(raw.prepare('SELECT 1 FROM taste_shelves WHERE owner_hash = ?').get(token), undefined);
  raw.close();
  store = await openTasteNeighborPilotStore(dbPath);
  assert.deepEqual(store.getOwn(ownerHash), shelf);
  assert.deepEqual(store.getOwn(hashPilotOwner(createPilotOwner())), null);
  assert.deepEqual(store.listOthers(ownerHash), []);
  assert.equal(store.listOthers(null).length, 1);
  assert.equal(store.publish(ownerHash, { ...shelf, nickname: 'updated' }), true);
  assert.equal(store.listOthers(null).length, 1);
  assert.equal(store.getOwn(ownerHash).nickname, 'updated');
  const expired = new DatabaseSync(dbPath);
  expired.exec('UPDATE taste_shelves SET expires_at = 0');
  expired.close();
  assert.equal(store.getOwn(ownerHash), null);
  assert.deepEqual(store.listOthers(null), []);
  assert.equal(store.publish(ownerHash, shelf), true);
  store.revoke(ownerHash);
  assert.equal(store.getOwn(ownerHash), null);
  assert.deepEqual(store.listOthers(null), []);
  store.close();
});
