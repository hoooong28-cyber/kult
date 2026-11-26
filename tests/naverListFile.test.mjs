import test from 'node:test';
import assert from 'node:assert/strict';
import {parseNaverListFile,seoulDiningPlaces} from '../lib/naverListFile.ts';
const fixture = {folder:{name:'2026',bookmarkCount:4},bookmarkList:[
{sid:1393890643,name:'성수 카페',address:'서울특별시 성동구 연무장3길 6',placeInfo:{category:'카페'},available:true,memo:'private'},
{bookmarkId:99,name:'경기도 식당',address:'경기 안양시',mcidName:'한식',available:true},
{sid:'3',name:'옛 식당',address:'서울 용산구',mcidName:'한식',available:false},
{sid:'4',name:'전시',address:'서울 성동구',mcidName:'전시장',available:true}
]};
test('native Naver list file previews privately and can narrow to Seoul dining',async()=>{
const list=await parseNaverListFile(JSON.stringify(fixture));
assert.equal(list.places.length,4);
assert.deepEqual(seoulDiningPlaces(list.places).map(p=>p.id),['naver-place-1393890643']);
assert.equal(list.places[0].memo,'');
assert.equal(list.places[0].url,'https://map.naver.com/p/entry/place/1393890643');
assert.equal(list.shareId,(await parseNaverListFile(JSON.stringify({...fixture,bookmarkList:[...fixture.bookmarkList].reverse()}))).shareId);
});
test('reject incomplete, invalid or oversized files without returning list',async()=>{
await assert.rejects(parseNaverListFile(JSON.stringify({...fixture,bookmarkList:fixture.bookmarkList.slice(0,2)})),/일부/);
await assert.rejects(parseNaverListFile('{"malformed":'),/JSON/);
await assert.rejects(parseNaverListFile(' '.repeat(2_000_001)),/2MB/);
});
test('file import is visible only to its local owner and leaves legacy data alone',async()=>{
 const {readNaverLists,saveNaverList}=await import('../lib/naverListStorage.ts');
 const map=new Map();
 const storage={getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v)};
 const list=await parseNaverListFile(JSON.stringify(fixture));
 const legacy=JSON.stringify([{...list,shareId:'legacy'}]);
 storage.setItem('kult_naver_imported_lists_v1',legacy);
 assert.deepEqual(readNaverLists(storage),[]);
 saveNaverList(storage,'one',list);
 assert.equal(readNaverLists(storage,'one').length,2);
 assert.deepEqual(readNaverLists(storage,'two').map(l=>l.shareId),['legacy']);
 assert.equal(storage.getItem('kult_naver_imported_lists_v1'),legacy);
});
