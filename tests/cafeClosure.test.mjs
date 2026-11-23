import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { analyzeSavedTaste } from '../lib/tasteEngine.ts';
import { classifyUserTasteCluster } from '../lib/tasteClusterEngine.ts';
import { getStory } from '../lib/stories.ts';

const { cafes } = JSON.parse(fs.readFileSync(new URL('../data/curators/founder.json', import.meta.url)));
const branch = cafes.find(cafe => cafe.id === 'center-coffee-seoulforest');
const lowkey = cafes.find(cafe => cafe.id === 'lowkey-seongsu');

test('the closed Seoul Forest branch keeps its stable saved ID and original address', () => {
  assert.equal(branch.business_status, 'closed');
  assert.equal(branch.address, '서울 성동구 서울숲2길 28-11');
  assert.equal(new URL(branch.closure_source_url).hostname, 'onedodaily.kr');
  assert.ok(cafes.filter(cafe => cafe.id !== branch.id).every(cafe => !cafe.business_status));
});

test('closed records never influence active recommendations even when passed to the archive engine', () => {
  const result = analyzeSavedTaste([branch.id], [branch, lowkey]);
  assert.equal(result.savedCount, 0);
  assert.deepEqual(result.recommendations.map(entry => entry.cafe.id), [lowkey.id]);
  assert.ok(analyzeSavedTaste([lowkey.id], [branch, lowkey]).recommendations.every(entry => entry.cafe.id !== branch.id));
  assert.deepEqual(classifyUserTasteCluster([branch.id], [], [branch]), classifyUserTasteCluster([], [], [branch]));
});

test('the published story preserves the historical relationship but states the branch is closed', () => {
  const story = getStory('seoul-forest-coffee-pause');
  assert.ok(story.place_ids.includes(branch.id));
  assert.match(story.paragraphs.join(' '), /서울숲점은 영업을 종료/);
});
