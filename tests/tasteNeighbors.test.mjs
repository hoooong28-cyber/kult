import test from 'node:test';
import assert from 'node:assert/strict';
import { findTasteNeighbors } from '../lib/tasteNeighbors.ts';

const viewer = { id: 'viewer', naverPlaceIds: ['22', '33', '11', '22'] };
const shelf = (id, naverPlaceIds, visibility = 'shared') => ({ id, nickname: 'Same nickname', naverPlaceIds, visibility });

test('requires two distinct exact IDs and returns only authorized matching projection', () => {
  assert.deepEqual(findTasteNeighbors(viewer, [
    { ...shelf('match', ['44', '22', '11', '44']), email: 'not returned' },
    shelf('duplicates', ['11', '11', '11', '44']),
    shelf('not-exact', ['011', '22', ' 33']),
  ]), [{ id: 'match', nickname: 'Same nickname', commonPlaceIds: ['11', '22'], newPlaceIds: ['44'] }]);
});

test('excludes self, private, revoked, missing opt-in, and ambiguous duplicate shelf versions', () => {
  const ids = ['22', '33', '55'];
  assert.deepEqual(findTasteNeighbors(viewer, [
    shelf(viewer.id, ids),
    shelf('private', ids, 'private'),
    shelf('revoked', ids, 'revoked'),
    { id: 'missing', nickname: 'missing', naverPlaceIds: ids },
    shelf('conflict', ids),
    shelf('conflict', ids, 'revoked'),
  ]), []);
});

test('ranks by overlap first, Jaccard second, then opaque ID independent of order', () => {
  const shelves = [
    shelf('wide', ['11', '22', '66', '77']),
    shelf('m', ['22', '33', '77']),
    shelf('a', ['11', '22', '66']),
    shelf('most', ['11', '22', '33', '66', '77', '88', '99']),
  ];
  const expected = ['most', 'a', 'm', 'wide'];
  assert.deepEqual(findTasteNeighbors(viewer, shelves).map(({ id }) => id), expected);
  assert.deepEqual(findTasteNeighbors(viewer, [...shelves].reverse()).map(({ id }) => id), expected);
});

test('no cold-start mock peers and an exact match can have no unseen places', () => {
  assert.deepEqual(findTasteNeighbors({ ...viewer, naverPlaceIds: ['22', '22'] }, [shelf('match', ['22', '33'])]), []);
  const [result] = findTasteNeighbors(viewer, [shelf('match', ['22', '33'])]);
  assert.deepEqual(result.newPlaceIds, []);
});
