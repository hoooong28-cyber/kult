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

test('home uses a compact mobile headline and the shared main landmark', () => {
  assert.match(get('app/entry.module.css'), /font-size: clamp\(1\.625rem, 1\.2rem \+ 2vw, 1\.875rem\); line-height: 1\.23/);
  assert.match(get('app/layout.tsx'), /<main\b/);
  assert.doesNotMatch(get('app/page.tsx'), /<main\b/);
});

test('mobile artwork stays left-aligned, stable during a gesture, and transparent at the edges', () => {
  const css = get('app/entry.module.css');
  const home = get('app/page.tsx');
  assert.ok(css.includes('width: min(calc(100% + 32px), 96vw, 440px, 46svh, max(41svh, calc(71svh - 210px))); justify-self: start'));
  assert.ok(home.includes('min(calc(100vw - 8px), 96vw, 440px, 46svh, max(41svh, calc(71svh - 210px)))'));
  assert.match(css, /justify-self: start; margin-inline-start: -8px/);
  assert.doesNotMatch(css, /max-height: 700px|\d+dvh/);
  assert.match(home, /draggable={false}/);
  assert.match(css, /filter: url\("#kult-cover-ink"\);\s*pointer-events: none;\s*user-select: none/);
  assert.match(css, /\.coverImage \{[\s\S]*?height: auto/);
  assert.match(css, /aspect-ratio: 1040 \/ 1184/);
  assert.match(css, /filter: url\("#kult-cover-ink"\)/);
  assert.doesNotMatch(css, /mix-blend-mode/);
  assert.match(home, /<filter id="kult-cover-ink" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">/);
  assert.ok(home.includes('-.2126 -.7152 -.0722 1 0'));
  assert.match(home, /<feFuncA type="linear" slope="1.18" intercept="-.10"/);
});
