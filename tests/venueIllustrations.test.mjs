import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import test from 'node:test';
import { getVenueIllustration, getVenuePhoto } from '../lib/venuePhotos.ts';

const read = pathname => readFileSync(new URL('../' + pathname, import.meta.url), 'utf8');
test('public editorial and discovery places have local, distinct visuals', () => {
  const places = [...JSON.parse(read('data/curators/founder.json')).cafes, ...JSON.parse(read('data/discoveries.json'))];
  const images = new Set();
  for (const place of places) {
    const illustration = getVenueIllustration(place);
    if (place.is_demo || place.business_status === 'closed') {
      assert.equal(illustration, null);
      continue;
    }
    const photo = getVenuePhoto(place);
    assert.ok(photo || illustration, place.id);
    if (!photo) {
      const svg = read('public' + illustration);
      assert.match(svg, /<svg [^>]*viewBox="0 0 640 400"/);
      assert.doesNotMatch(svg, /<script|<foreignObject|href=/);
      const composition = svg.replace(/<text[^>]*>.*?<\/text>/g, '');
      const hash = createHash('sha256').update(composition).digest('hex');
      assert.ok(!images.has(hash), place.id);
      images.add(hash);
    }
  }
  assert.equal(getVenueIllustration({id: 'unknown'}), null);
});
