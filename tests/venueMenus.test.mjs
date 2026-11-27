import assert from 'node:assert/strict';
import test from 'node:test';
import source from '../data/curators/founder.json' with { type: 'json' };
import discoveries from '../data/discoveries.json' with { type: 'json' };
import { getExactBoard, getVenueMenu } from '../lib/venueMenus.ts';

const cuco = source.cafes.find(x => x.id === 'cuco-seongsu');
const mna = discoveries.find(x => x.id === 'discovery-mna-samgakji');
test('shows branch-matched menu facts with independent source and date', () => {
  const menu = getVenueMenu(cuco);
  assert.equal(menu.source.kind, 'menu');
  assert.equal(menu.items.find(x => x.name === '쿠코 커피').price, 6500);
  assert.equal(menu.items.length, 3);
  assert.equal(getVenueMenu(mna).source.kind, 'visit');
  assert.ok(getVenueMenu(mna).items.every(x => x.price === undefined));
});
test('never inherits an unsourced menu, a moved branch, a demo or closed record', () => {
  for (const selected of [
    { ...cuco, id: 'unsourced-seongsu' }, { ...cuco, address: '다른 주소' },
    { ...cuco, is_demo: true }, { ...cuco, business_status: 'closed' },
  ]) assert.equal(getVenueMenu(selected), null);
});

test('Always Au8ust uses the exact Samgakji Naver menu link, never extracted prices or a wrong branch', () => {
  const place = discoveries.find(row => row.id === 'discovery-always-august-samgakji');
  assert.equal(place.naver_place_id, '2051980514');
  const menu = getVenueMenu(place);
  assert.equal(menu.source.kind, 'menu_link');
  assert.equal(menu.source.url, 'https://m.place.naver.com/restaurant/2051980514/menu');
  assert.deepEqual(menu.items, []);
  assert.equal(menu.menuBoard.url, 'https://m.place.naver.com/restaurant/2051980514/photo?filterType=AI+View&subFilter=MENU');
  for (const changed of [
    { ...place, address: '서울 마포구 연남로 71 1층' },
    { ...place, naver_place_id: '111' },
    { ...place, naver_place_id: undefined },
    { ...place, business_status: 'closed' },
    { ...place, is_demo: true },
  ]) assert.equal(getVenueMenu(changed), null);
});

test('venue menu UI renders a link-only section without a fabricated preview, price or list', async () => {
  const [{ readFileSync }, { default: ts }, { createElement }, { renderToStaticMarkup }, jsx] = await Promise.all([
    import('node:fs'), import('typescript'), import('react'), import('react-dom/server'), import('react/jsx-runtime'),
  ]);
  const output = ts.transpileModule(readFileSync(new URL('../components/VenueMenu.tsx', import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const module = { exports: {} };
  const require = name => {
    if (name === 'react/jsx-runtime') return jsx;
    if (name === '@/lib/venueMenus') return { getVenueMenu };
    assert.fail('Unexpected dependency: ' + name);
  };
  new Function('module', 'exports', 'require', output)(module, module.exports, require);
  const component = module.exports.default;
  const cafe = discoveries.find(row => row.id === 'discovery-always-august-samgakji');
  const html = renderToStaticMarkup(createElement(component, { cafe }));
  assert.match(html, /href="https:\/\/m\.place\.naver\.com\/restaurant\/2051980514\/menu"/);
  assert.match(html, /네이버 지도에서 메뉴 보기/);
  assert.match(html, /photo\?filterType=AI\+View&amp;subFilter=MENU/);
  assert.match(html, /네이버 메뉴판 사진 보기/);
  const lowkey = source.cafes.find(row => row.id === 'lowkey-seongsu');
  const lowkeyHtml = renderToStaticMarkup(createElement(component, { cafe: lowkey }));
  assert.match(lowkeyHtml, /5,800원/);
  assert.match(lowkeyHtml, /6,500원/);
  assert.match(lowkeyHtml, /8,500원/);
  assert.match(lowkeyHtml, /메뉴판 이미지로 보기/);
  assert.match(lowkeyHtml, /1393890643\/menu\/list/);
  assert.doesNotMatch(lowkeyHtml, /<img|#photo/);
  assert.doesNotMatch(html, /메뉴 미리보기|[0-9]원|<ul|<img/);
  assert.equal(renderToStaticMarkup(createElement(component, { cafe: { ...cafe, naver_place_id: '123' } })), '');
  assert.match(renderToStaticMarkup(createElement(component, { cafe: cuco })), /메뉴 미리보기|6,500원/);
});

test('menu board requires explicit exact-place Naver filter and independent verification metadata', () => {
  const url = 'https://m.place.naver.com/restaurant/2051980514/photo?filterType=AI+View&subFilter=MENU';
  const board = { url, verifiedDate: '2026-11-24' };
  assert.deepEqual(getExactBoard('2051980514', board), board);
  assert.equal(getExactBoard('2051980514', undefined), undefined);
  assert.equal(getExactBoard('2051980514', { ...board, url: url.replace('2051980514', '123') }), undefined);
  assert.equal(getExactBoard('2051980514', { ...board, url: url.replace('MENU', 'ALL') }), undefined);
  assert.equal(getExactBoard('2051980514', { ...board, verifiedDate: '' }), undefined);
});

test('venue visuals prefer a verified photo and label original illustrations', async () => {
  const [{ readFileSync }, { default: ts }, { createElement }, { renderToStaticMarkup }, jsx, { getVenueIllustration, getVenuePhoto }] = await Promise.all([
    import('node:fs'), import('typescript'), import('react'), import('react-dom/server'), import('react/jsx-runtime'), import('../lib/venuePhotos.ts'),
  ]);
  const output = ts.transpileModule(readFileSync(new URL('../components/VenuePhoto.tsx', import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const module = { exports: {} };
  const require = name => {
    if (name === 'react/jsx-runtime') return jsx;
    if (name === '@/lib/venuePhotos') return { getVenueIllustration, getVenuePhoto };
    if (name === 'next/image') return { default: ({ src, alt }) => createElement('img', { src, alt }) };
    assert.fail('Unexpected dependency: ' + name);
  };
  new Function('module', 'exports', 'require', output)(module, module.exports, require);
  const render = cafe => renderToStaticMarkup(createElement(module.exports.default, { cafe, variant: 'detail' }));
  const html = render(cuco);
  assert.match(html, /id="venue-photo"/);
  assert.match(html, /<img[^>]+alt="쿠코 성수의 원목 테이블/);
  assert.match(html, /href="https:\/\/nmjt\.kr\/cuco"[^>]*>사진 출처 · CUCO \/ Studio NMJT/);
  assert.doesNotMatch(html, /실제 공간 사진이 아니에요/);
  const mnaHtml = render(mna);
  assert.match(mnaHtml, /src="\/venue-art\/discovery-mna-samgakji\.svg"/);
  assert.match(mnaHtml, /KULT 일러스트 · 실제 공간 사진이 아니에요/);
  assert.doesNotMatch(mnaHtml, /사진 출처/);
  assert.match(render(discoveries.find(row => row.id === 'discovery-always-august-samgakji')), /src="\/venue-art\/discovery-always-august-samgakji\.svg"/);
  assert.equal(render({...mna, is_demo: true}), '');
  assert.equal(render({...mna, business_status: 'closed'}), '');
});
