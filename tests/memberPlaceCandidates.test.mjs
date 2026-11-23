import assert from 'node:assert/strict';
import test from 'node:test';
import { collectBrowserNaverPlaces } from '../lib/memberPlaceCandidates.ts';

const url = id => 'https://map.naver.com/p/entry/place/' + id;

test('selected browser imports recognize exact public place IDs only, preserving no raw source fields', () => {
  assert.deepEqual(collectBrowserNaverPlaces({
    imported: [
      { id: 'naver-place-101', name: '  가\t나\n다\u200B라\u2028마  ', url: url('101') + '?tracking=yes', available: true, note: 'private' },
      { id: 'naver-place-102', name: 'Wrong branch', url: url('103'), available: true },
      { id: 'naver-place-104', name: 'Unavailable', url: url('104'), available: false },
      { id: 'naver-place-105', name: 'Lookalike', url: 'https://map.naver.com.evil.test/p/entry/place/105', available: true },
      { id: 'naver-place-106', name: 'Search', url: 'https://map.naver.com/p/search/106', available: true },
    ],
    individual: [
      { id: '101', name: 'Duplicate', url: url('101') },
      { id: '201', name: ' \u200B\n ', url: 'https://m.place.naver.com/restaurant/201/home', savedAt: 'private' },
      { id: '202', name: 'Wrong destination', url: url('203') },
      { id: '204', name: 'Not an exact place', url: 'https://naver.me/AbcDEF' },
    ],
  }), [{ id: '101', name: '가 나 다 라 마' }, { id: '201', name: '네이버 지도 장소 201' }]);
});

test('explicitly selected native catalogue records use only known open canonical identifiers', () => {
  assert.deepEqual(collectBrowserNaverPlaces({
    imported: [{ id: 'naver-place-304', name: 'Closed duplicate', url: url('304'), available: true }],
    individual: [{ id: '301', name: 'Explicit import', url: url('301') }],
    native: [
      { naver_place_id: '301', name: 'Exact duplicate' },
      { naver_place_id: '302', name: 'Display fallback', name_local: '  실제 카페 ', address: 'private' },
      { naver_place_id: '303', name: 'a'.repeat(81) },
      { naver_place_id: '304', name: 'Closed', business_status: 'closed' },
      { naver_place_id: '305', name: 'Demo', is_demo: true },
      { naver_place_id: '0306', name: 'Non-canonical ID' },
      { name: 'Unknown ID, do not map by name', name_local: '실제 카페' },
    ],
  }), [
    { id: '301', name: 'Explicit import' },
    { id: '302', name: '실제 카페' },
    { id: '303', name: 'a'.repeat(80) },
  ]);
});
