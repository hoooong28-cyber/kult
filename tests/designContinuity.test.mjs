import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const get = path => fs.readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const globals = get('app/globals.css');

test('main KULT discovery surfaces use the same masthead and live brand base', () => {
  for (const page of ['app/page.tsx', 'app/explore/page.tsx', 'app/discoveries/page.tsx', 'app/picks/page.tsx', 'app/picks/area/page.tsx', 'app/picks/[slug]/page.tsx']) {
    assert.match(get(page), /<Header\b/);
  }
  for (const [name, value] of Object.entries({paper:'#fcf9f5',ink:'#1c1c1a',cream:'#f7f3ec',rule:'#e6dfd3',terracotta:'#bf703a'})) {
    assert.ok(globals.includes(`--kult-${name}: ${value}`));
  }
  assert.match(get('app/picks/[slug]/picks.module.css'), /font-family:var\(--kult-font-display\)/);
  assert.match(get('app/page.tsx'), /오늘의 큐레이션 장소는\?/);
  assert.doesNotMatch(get('app/page.tsx'), /<VenuePhoto|<NaverMap|어떤 약속이에요/);
  assert.match(get('app/explore/page.tsx'), /삼각지 약속/);
  const home = get('app/page.tsx');
  const chooser = get('app/EntryChooser.tsx');
  assert.match(home, /<EntryChooser options=\{options\}/);
  assert.match(chooser, /href=\{['"]\/\?purpose=['"] \+ option\.id\}/);
  assert.match(chooser, /area\.slug \+ ['"]\?purpose=['"] \+ purpose\.id/);
  assert.match(chooser, /useSearchParams\(\)\.getAll\('purpose'\)/);
  assert.match(chooser, /window\.history\.pushState/);
  assert.match(home, /getMergedCafes\(\{ resolveMapCoordinates: false \}\)/);
  assert.match(home, /\/archive#naver-import/);
  assert.match(home, /\/brand\/kult-cafe-cover\.webp" alt=""/);
  assert.doesNotMatch(home, /cuco-seongsu-interior\.jpg|<figcaption>성수 · 쿠코/);
  assert.ok(fs.existsSync(new URL('../public/venues/cuco-seongsu-interior.jpg', import.meta.url)));
  assert.match(get('app/picks/area/page.tsx'), /어느 동네로 갈까요\?/);
  assert.match(get('app/picks/area/page.tsx'), /area\.slug \+ '\?purpose=' \+ purpose\.id/);
  for (const page of ['app/page.tsx', 'app/explore/page.tsx', 'app/discoveries/page.tsx', 'app/picks/page.tsx', 'app/picks/[slug]/page.tsx']) {
    assert.doesNotMatch(get(page), /사진(?:을)? 준비 중|사진만 볼 수|사진을 확인한 곳부터/);
  }
});

test('four Hangul font subsets are self-hosted and carry an open-font notice', () => {
  const refs = [...globals.matchAll(/\/fonts\/(kult-hangul-[\w-]+\.woff2)/g)].map(m => m[1]);
  assert.equal(new Set(refs).size, 4);
  for (const name of refs) {
    const data = fs.readFileSync(new URL('../public/fonts/' + name, import.meta.url));
    assert.equal(data.subarray(0, 4).toString(), 'wOF2');
  }
  assert.match(get('public/fonts/OFL-notice.txt'), /SIL OPEN FONT LICENSE Version 1\.1/);
});

test('mobile KULT leads with the artwork, then prioritizes neighborhoods after a choice', () => {
  const home = get('app/page.tsx');
  const layout = get('app/entry.module.css');
  assert.match(home, /<Image src="\/brand\/kult-cafe-cover\.webp" alt=""/);
  assert.match(layout, /grid-template-areas: "cover" "intro" "controls" "secondary"/);
  assert.match(layout, /grid-template-areas: "intro cover" "controls cover" "secondary secondary"/);
  assert.match(get('app/EntryChooser.tsx'), /data-purpose-selected=/);
  assert.match(layout, /\.entry:has\(\.chooser\[data-purpose-selected\]\) \.cover \{ display: none; \}/);
});
