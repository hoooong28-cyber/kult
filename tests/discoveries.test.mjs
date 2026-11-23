import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const cafes = JSON.parse(fs.readFileSync(new URL('../data/discoveries.json', import.meta.url), 'utf8'));

test('Seoul discoveries preserve source provenance without inventing visit verification', () => {
  assert.equal(new Set(cafes.map(c => c.id)).size, cafes.length);
  assert.equal(new Set(cafes.map(c => c.address)).size, cafes.length);
  const originalCount = cafes.filter(c => new URL(c.discovery_source.url).hostname === 'www.marieclairekorea.com').length;
  assert.ok(originalCount >= 15);
  for (const c of cafes) {
    assert.ok(c.address.startsWith('서울 '));
    assert.equal(c.content_status, 'discovered');
    assert.equal(c.last_verified_date, '');
    assert.equal(c.lat, null);
    assert.equal(c.lng, null);
    assert.deepEqual(c.tags.good_for, []);
    assert.equal(c.tags.noise_level, 'unknown');
    assert.equal(new URL(c.discovery_source.url).protocol, 'https:');
    assert.ok(c.discovery_source.title);
    assert.match(c.discovery_source.published_at, /^\d{4}-\d{2}-\d{2}$/);
    assert.match(c.discovery_source.checked_at, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(c.discovery_source.published_at <= c.discovery_source.checked_at);
  }
});

test('November 2026 research adds a sourced candidate in each priority neighborhood', () => {
  const priority = {
    'discovery-a-glass-of-haebangchon': '용산구 · 해방촌',
    'discovery-mna-samgakji': '용산구 · 삼각지',
    'discovery-tim-hortons-banff-town-seongsu': '성동구 · 성수',
  };
  for (const [id, area] of Object.entries(priority)) {
    const c = cafes.find(cafe => cafe.id === id);
    assert.equal(c?.neighborhood, area);
    assert.ok(c.discovery_source.published_at >= '2026-08-24');
    assert.equal(c.discovery_source.checked_at, '2026-11-22');
  }
});
