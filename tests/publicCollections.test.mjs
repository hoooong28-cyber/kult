import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveKSeoulEvenings, kSeoulEvenings } from '../lib/publicCollections.ts';
import discoveries from '../data/discoveries.json' with { type: 'json' };

test('the public K collection renders the three selected places only, in order', () => {
  const entries = resolveKSeoulEvenings(discoveries);
  assert.equal(kSeoulEvenings.byline, 'K');
  assert.deepEqual(entries.map(({ cafe }) => cafe.name_local), ['와일드덕칸틴', '춘광', '소금과다시마']);
  assert.deepEqual(entries.map(({ area }) => area), ['해방촌', '연희동', '서교동 · 합정역 근처']);
});

test('closed, demo and removed venues are not sent to the public collection', () => {
  const entries = resolveKSeoulEvenings([
    {id: kSeoulEvenings.entries[0].id, business_status: 'closed'},
    {id: kSeoulEvenings.entries[1].id, is_demo: true},
    {id: 'unselected'},
  ]);
  assert.deepEqual(entries, []);
});
