import test from 'node:test';
import assert from 'node:assert/strict';
import { validateListUrl, fetchSharedList, mergeImportedLists, uniqueImportedPlaces } from '../lib/naverImport.ts';
const id = 'a'.repeat(32);
const url = `https://map.naver.com/p/favorite/sharedPlace/folder/${id}`;
const item = n => ({bookmarkId:n,name:`Place ${n}`,sid:String(n),available:n!==3,px:127,py:37,address:'Seoul',mcidName:'카페'});
const page = (start,total=24) => Response.json({folder:{name:'Test',bookmarkCount:total},bookmarkList:Array.from({length:Math.min(20,total-start)},(_,i)=>item(start+i+1))});
test('rejects SSRF targets and non-list links',()=>{
 for(const u of ['http://naver.me/x','https://naver.me.evil.com/x','https://naver.me@127.0.0.1/x','https://naver.me:444/x','https://map.naver.com/p/entry/place/123','https://127.0.0.1']) assert.throws(()=>validateListUrl(u));
});
test('short link + pagination imports 24 including unavailable place',async()=>{
 const calls=[];
 const result=await fetchSharedList('https://naver.me/abc',async (u)=>{calls.push(u);if(u.includes('naver.me/')) return new Response(null,{status:307,headers:{location:url}});return page(Number(new URL(u).searchParams.get('start')));});
 assert.equal(calls.length,3);assert.equal(result.places.length,24);assert.equal(result.places[2].available,false);assert.equal(result.places[0].lat,37);
});
test('rejects redirect to private hosts before making request',async()=>{
 let calls=0; await assert.rejects(fetchSharedList('https://naver.me/abc',async()=>{calls++;return new Response(null,{status:302,headers:{location:'https://127.0.0.1/internal'}});}));assert.equal(calls,1);
});
test('never returns partial data when second page fails',async()=>{
 await assert.rejects(fetchSharedList(url,async u=>new URL(u).searchParams.get('start')==='0'?page(0):new Response(null,{status:500})));
});
test('rejects private, malformed, changed and oversized lists',async()=>{
 for(const payload of [{removed:true},{folder:{name:'Private',bookmarkCount:3}},{folder:{name:'Too big',bookmarkCount:501},bookmarkList:[]}]) await assert.rejects(fetchSharedList(url,async()=>Response.json(payload)));
 await assert.rejects(fetchSharedList(url,async u=>page(Number(new URL(u).searchParams.get('start')),new URL(u).searchParams.get('start')==='0'?24:25)));
});
test('refresh replaces a list and deduplicates shared places across lists',async()=>{
 const list=await fetchSharedList(url,async u=>page(Number(new URL(u).searchParams.get('start'))));
 const updated={...list,places:list.places.slice(0,2)};
 assert.equal(mergeImportedLists([list],updated).length,1);
 assert.equal(uniqueImportedPlaces([list,{...list,shareId:'b'.repeat(32)}]).length,24);
 assert.equal(uniqueImportedPlaces(mergeImportedLists([list],updated)).length,2);
});
test('empty lists are a valid snapshot',async()=>{
 assert.equal((await fetchSharedList(url,async()=>page(0,0))).places.length,0);
});
