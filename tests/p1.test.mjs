import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { track, EVENT_KEY, parseSource, withSource } from '../lib/interactions.ts';
import { toggleSaveCafe, getSavedCafeIds } from '../lib/archiveStore.ts';
import { toggleFollow, getFollowingIds } from '../lib/followStore.ts';
import { stories, storiesForPlace, storiesForCurator } from '../lib/stories.ts';
const storage = () => {const map=new Map();return {getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)};};
const setup = () => {globalThis.window={localStorage:storage(),sessionStorage:storage(),dispatchEvent(){},addEventListener(){},removeEventListener(){},location:{search:''}};};
const events = () => JSON.parse(window.localStorage.getItem(EVENT_KEY)||'[]');
test('preserve legacy saves and log only successful user changes with source', () => {
 setup();window.localStorage.setItem('kult_saved_cafe_ids','["legacy"]');
 assert.equal(toggleSaveCafe('cuco-seongsu',{recommendation_source:'story'}),true);
 assert.deepEqual(getSavedCafeIds(),['legacy','cuco-seongsu']);
 toggleSaveCafe('cuco-seongsu');
 assert.deepEqual(events().map(e=>e.event),['place_save','place_unsave']);
 assert.equal(events()[0].recommendation_source,'story');assert.equal(events()[0].user_id,null);
 assert.equal(events()[0].session_id,events()[1].session_id);assert.ok(events()[0].occurred_at);
});
test('new browsers have no synthetic saves/follows/events',()=>{setup();assert.deepEqual(getSavedCafeIds(),[]);assert.deepEqual(getFollowingIds(),[]);assert.deepEqual(events(),[]);});
test('follow/unfollow retain legacy follows and log actual toggles',()=>{setup();window.localStorage.setItem('kult_followed_curator_ids','["legacy"]');toggleFollow('founder');toggleFollow('founder');assert.deepEqual(getFollowingIds(),['legacy']);assert.deepEqual(events().map(e=>e.event),['curator_follow','curator_unfollow']);});
test('failed save never logs success and malformed data is not replaced',()=>{
 setup();window.localStorage.setItem('kult_saved_cafe_ids','broken');assert.throws(()=>toggleSaveCafe('a'));assert.equal(window.localStorage.getItem('kult_saved_cafe_ids'),'broken');assert.deepEqual(events(),[]);
 setup();window.localStorage.setItem=()=>{throw new Error('quota')};assert.throws(()=>toggleSaveCafe('a'));assert.deepEqual(events(),[]);
});
test('analytics failure never prevents actual save or overwrites event data',()=>{
 setup();window.localStorage.setItem(EVENT_KEY,'invalid');assert.equal(toggleSaveCafe('a'),true);assert.equal(window.localStorage.getItem(EVENT_KEY),'invalid');
});
test('unverified local login never becomes a verified event user',()=>{setup();window.localStorage.setItem('kult_current_user','{"id":"user-kult-admin","email":"private@example.com"}');track('place_open',{place_id:'a'});assert.equal(events()[0].user_id,null);assert.ok(!JSON.stringify(events()).includes('private@example.com'));});
test('sources allow existing surfaces only; links preserve hash',()=>{assert.equal(parseSource('taste_match'),undefined);assert.equal(parseSource('story'),'story');assert.equal(withSource('/cafe/a#map','story'),'/cafe/a?source=story#map');});
test('every story relationship resolves to existing place and curator',()=>{
 const files=fs.readdirSync('data/curators').filter(f=>f.endsWith('.json')).map(f=>JSON.parse(fs.readFileSync(`data/curators/${f}`,'utf8')));
 const places=new Set(files.flatMap(f=>f.cafes.map(c=>c.id))),curators=new Set(files.map(f=>f.curator.id));
 assert.ok(stories.length>0);for(const s of stories){assert.ok(s.place_ids.length>=2);for(const id of s.place_ids){assert.ok(places.has(id));assert.ok(storiesForPlace(id).includes(s));}for(const id of s.curator_ids){assert.ok(curators.has(id));assert.ok(storiesForCurator(id).includes(s));}}
});
