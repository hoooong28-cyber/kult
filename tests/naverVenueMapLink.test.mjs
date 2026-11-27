import assert from 'node:assert/strict';
import test from 'node:test';
import { naverMapSearchUrl, naverVenueMapLink } from '../lib/naverPlaceLinks.ts';

test('known venue IDs go directly to the exact Naver place', () => {
  assert.deepEqual(naverVenueMapLink({naver_place_id:'1976051967', name_local:'노노스탄테', address:'서울 마포구 연남로3길 7'}), {
    kind:'place', href:'https://map.naver.com/p/entry/place/1976051967',
  });
});

test('unmapped venues use a short business query with no appended street address', () => {
  const name = '엠엔에이 삼각지';
  const address = '서울 용산구 한강대로 206-1';
  for (const id of [undefined, '123/../', '0001']) {
    const map = naverVenueMapLink({naver_place_id:id, name_local:name, address});
    assert.equal(map.kind,'search');
    assert.equal(map.href,naverMapSearchUrl(name));
    assert.ok(!decodeURIComponent(map.href).includes(address));
  }
  assert.equal(naverVenueMapLink({name_local:'  ',name:'MNA',address}).href,naverMapSearchUrl('MNA'));
  assert.equal(naverVenueMapLink({address}).href,naverMapSearchUrl(address));
});
