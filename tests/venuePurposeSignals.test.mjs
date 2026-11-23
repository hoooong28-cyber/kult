import assert from 'node:assert/strict';
import test from 'node:test';
import {draftVenuePurposes} from '../lib/venuePurposeSignals.ts';

const venue = {id:'pilot-example', address:'서울 예시로 1'};
const now = '2026-11-22';
const evidence = {placeId:venue.id,address:venue.address,source:'kult-observation',reference:'kult:observation:one',checkedOn:'2026-11-18'};

test('verified structured signals yield explainable multi-purpose candidates, not live labels', () => {
  const proposals = draftVenuePurposes(venue,[{...evidence,facts:['quiet','two_seat_tables','bar_seats']}],now);
  assert.deepEqual(proposals.map(row=>row.purpose),['date','solo']);
  assert.ok(proposals.every(row=>row.status==='needs-review'));
  assert.deepEqual(proposals[0].facts,['quiet','two_seat_tables']);
  assert.deepEqual(proposals[0].references,['kult:observation:one']);
});

test('missing, wrong branch, closed, stale and unapproved signals are not promoted', () => {
  const base = {...evidence,facts:['table_for_four','shared_menu']};
  assert.deepEqual(draftVenuePurposes(venue,[{...base,facts:['shared_menu']}],now),[]);
  assert.deepEqual(draftVenuePurposes(venue,[{...base,address:'different branch'},{...base,checkedOn:'2025-12-01'},{...base,source:'naver-review'},{...base,reference:'https://example.com?private=1'}],now),[]);
  assert.deepEqual(draftVenuePurposes({...venue,business_status:'closed'},[base],now),[]);
  assert.deepEqual(draftVenuePurposes(venue,[base],now).map(row=>row.purpose),['friends']);
});
