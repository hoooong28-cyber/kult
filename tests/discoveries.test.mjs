import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const cafes = JSON.parse(fs.readFileSync(new URL('../data/discoveries.json', import.meta.url), 'utf8'));
test('15 distinct Seoul discoveries retain source provenance without invented verification', () => {
 assert.equal(cafes.length,15); assert.equal(new Set(cafes.map(c=>c.id)).size,15);
 for (const c of cafes) {
  assert.ok(c.address.startsWith('서울 ')); assert.equal(c.content_status,'discovered');
  assert.equal(c.last_verified_date,''); assert.equal(c.lat,null); assert.equal(c.lng,null);
  assert.deepEqual(c.tags.good_for,[]); assert.equal(c.tags.noise_level,'unknown');
  assert.ok(c.discovery_source.url.startsWith('https://www.marieclairekorea.com/'));
 }
});
