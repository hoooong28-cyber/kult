import assert from 'node:assert/strict';
import test from 'node:test';
import { selectVenuePhotos } from '../scripts/venue-photo-core.mjs';

const place = {
  id: 'lowkey-seongsu', name: 'Lowkey', name_local: '로우키 성수점', address: '서울 성동구 연무장3길 6',
};
const otherBranch = { ...place, id: 'lowkey-yeonhui', name_local: '로우키 연희점', address: '서울 서대문구 연희로 134' };
const valid = {
  id: 'lowkey-inside', place_name: '로우키 (성수점)', place_address: '서울특별시 성동구 연무장3길6 (성수동2가)',
  subject: 'interior', src: '/venues/lowkey-inside.jpg', alt: '로우키 성수점 내부', credit: 'Lowkey Coffee',
  source_url: 'https://lowkeycoffee.com/store', rights: 'owner-permission',
  rights_evidence: 'Owner approval reviewed for display on KULT', reviewed: true, width: 1000, height: 700,
};
const selectedId = (assets, venue = place) => selectVenuePhotos([venue], assets).selected[venue.id]?.src;

test('Korean branch and road normalization allows exact identity only', () => {
  const result = selectVenuePhotos([otherBranch, place], [valid]);
  assert.deepEqual(result.selected, {
    'lowkey-seongsu': { src: valid.src, alt: valid.alt, credit: valid.credit, source_url: valid.source_url, subject: valid.subject },
  });
  assert.deepEqual(result.pending, [{ place_id: 'lowkey-yeonhui', reason: 'no-eligible-photo' }]);
  assert.equal(selectedId([{ ...valid, place_name: '로우키 (다른지점)' }]), undefined);
  assert.equal(selectedId([{ ...valid, place_name: 'Lowkey' }]), valid.src);
  assert.equal(selectedId([{ ...valid, place_address: '서울 성동구 연무장3길 6 2층' }]), undefined);
  assert.equal(selectedId([{ ...valid, place_address: '성수동2가 123' }], { ...place, address: '성수동2가 123' }), undefined);
});

test('exact trusted Naver Place ID disambiguates alias; conflicting IDs and road addresses fail closed', () => {
  const identified = { ...place, naver_place_id: 12345678 };
  assert.equal(selectedId([{ ...valid, place_name: '다른 공식 표기', provider_place_id: '12345678' }], identified), valid.src);
  assert.equal(selectedId([{ ...valid, provider_place_id: '23456789' }], identified), undefined);
  assert.equal(selectedId([{ ...valid, place_address: otherBranch.address, provider_place_id: '12345678' }], identified), undefined);
  assert.equal(selectedId([{ ...valid, provider_place_id: 'naver-anything' }], identified), undefined);
});

test('subject priority is cafe interiors and restaurant food regardless of landscape/resolution', () => {
  const coffee = { ...valid, id: 'coffee', subject: 'coffee', src: '/venues/coffee.webp', width: 4000, height: 3000 };
  const food = { ...valid, id: 'food', subject: 'food', src: '/venues/food.png', width: 2000, height: 1000 };
  const interior = { ...valid, width: 200, height: 500 };
  assert.equal(selectedId([food, coffee, interior]), interior.src);
  assert.equal(selectedId([food, coffee]), coffee.src);
  assert.equal(selectedId([interior, coffee, food], { ...place, kind: 'restaurant' }), food.src);
  assert.equal(selectedId([coffee, interior], { ...place, kind: 'restaurant' }), interior.src);
});

test('same subject prefers landscape then resolution then deterministic stable keys', () => {
  const portrait = { ...valid, id: 'portrait', src: '/venues/portrait.jpg', width: 4000, height: 5000 };
  const landscape = { ...valid, id: 'landscape', src: '/venues/landscape.jpg', width: 1000, height: 700 };
  const smaller = { ...valid, id: '0-small', src: '/venues/small.jpg', width: 500, height: 400 };
  const tie = { ...landscape, id: 'aaa', src: '/venues/tie.jpg' };
  assert.equal(selectedId([portrait, smaller, landscape]), landscape.src);
  assert.equal(selectedId([portrait, smaller, landscape, tie]), tie.src);
  assert.equal(selectedId([tie, landscape, smaller, portrait]), tie.src);
});

test('closed, demo and bad candidate evidence or path never fill a card', () => {
  const closed = { ...place, id: 'closed', business_status: 'closed' };
  const demo = { ...place, id: 'demo', is_demo: true };
  assert.deepEqual(selectVenuePhotos([closed, demo], [valid]), { selected: {}, pending: [] });
  const rejected = [
    { reviewed: false }, { reviewed: 'true' }, { rights: 'all-rights-reserved' }, { rights: 'CC-BY-NC-4.0' },
    { rights_evidence: ' ' }, { credit: '' }, { alt: '' }, { place_name: '' }, { place_address: '' },
    { subject: 'exterior' }, { subject: 'unknown' }, { width: -1 },
    ...['/venues/../private.jpg','/venues/a/../../b.jpg','/venues/%2e%2e/a.jpg','/VENUES/a.png','/venues/a.svg','/venues/a.jpg?b','//venues/a.jpg','https://x.example/venues/a.jpg'].map(src=>({src})),
    ...['http://example.com','javascript:alert(1)','https://abc:password@example.com','//example.com'].map(source_url=>({source_url})),
  ];
  assert.deepEqual(selectVenuePhotos([place], rejected.map(patch => ({ ...valid, ...patch }))), {
    selected: {}, pending: [{ place_id: place.id, reason: 'no-eligible-photo' }],
  });
  assert.equal(selectedId([{ ...valid, rights: 'CC-BY-4.0', src: '/venues/imports/photo.JPG' }]), '/venues/imports/photo.JPG');
});
