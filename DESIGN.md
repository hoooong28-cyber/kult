# Design System: KULT Seoul

Scope: Korean-first editorial meetup finder. This document is a Google Stitch design brief. Preserve the existing KULT identity; revise home, neighborhood choice, results and the opt-in editorial collection. This is not deployed.

## 1. Visual Theme & Atmosphere

A small Seoul city guide, typeset like a contemporary bookshop recommendation card: warm paper, generous margins, quiet confidence. Density 3/10, asymmetry 6/10, motion 2/10. On entry, give only the setting and a clear choice. On results, show an authentic venue photo only if approved; photo-free results must still be useful.

One job: land → choose the purpose → choose a Seoul neighborhood → compare purpose-matched places → open a map or share. A received link lands directly on the same results without a question, signup or splash screen.

## 2. Color Palette & Roles

| Color | Hex | Role |
|---|---|---|
| Warm Paper | #FCF9F5 | Main canvas; light text on dark controls |
| Reading Cream | #F7F3EC | Recessed panel and hover fill |
| Card White | #FFFFFF | Photo card background |
| Charcoal Ink | #1C1C1A | Main copy and dominant action |
| Muted Ink | #5E5E5D | Secondary text and credits |
| Paper Rule | #E6DFD3 | 1px separators and borders |
| Terracotta | #BF703A | Single accent hue; decorative rules and punctuation |
| Deep Terracotta | #8B4829 | Same hue, darker for small text and focus outlines |

Keep navigation ink-first; don't put tiny white text on the brighter terracotta. No second accent, gradients, neon, pure black or cool-gray overlay.

## 3. Typography Rules

- Preserve KULT's existing Playfair Display for Latin display and local KULT Hangul Editorial (Noto Serif CJK KR Bold) for Korean. If the preview cannot access local assets, use Noto Serif KR Bold rather than distorting Hangul.
- Body: existing Source Sans 3 and KULT Hangul Sans (Noto Sans CJK KR); 15–16px, 1.55–1.65 leading, 65ch maximum. Captions: 12–13px.
- Home title: 26–30px on mobile (27px around 390px), line-height 1.23, letter-spacing −0.038em. Supporting text stays 16px: aim for roughly 1.7× title-to-body sizing rather than a display banner. Preserve the desktop scale. Let the Korean title wrap naturally at larger text settings.
- Result heading: 32px on mobile, up to 52px desktop. Korean first and English as a quieter guide cue. No Inter or generic default serif as the visible design face; no condensed pseudo-Hangul.

## 4. Component Stylings and Copy

**Home: one decision, no venue photo.** Use the existing KULT masthead. Use a small inline terracotta rule as visual punctuation in the eyebrow, not a stock or generated picture. Left-align the editorial headline.

- Eyebrow: SEOUL CITY GUIDE
- Headline: 오늘 어디 갈까요?
- Supporting line: 같이 가는 사람과 동네를 골라 서울의 카페와 식당을 찾아보세요.
- Three equal-priority options grouped as one vertical chooser: 데이트 / 친구 모임 / 혼자 가기, with quieter Date / With friends / Solo cues. Each row 56–64px, with fine dividers, optional line icon and a right arrow. One tap opens “어느 동네로 갈까요?” with 삼각지 / 해방촌 / 성수 when applicable. One more tap opens district-and-purpose results; no Continue button.
- Keep 동네별로 보기 and 내 아카이브 as quiet utility links below, not secondary CTAs. Do not add a home map, venue directory, carousel or forced login.

**Results: decision details with an optional approved photo.** Keep the same masthead and type. Use 선택 바꾸기, the occasion heading (e.g. 데이트하기 좋은 곳), and one visible 링크 복사 action for available results. A copied/shared URL preserves the selected occasion and district if present.

- Card sequence: optional approved photo → name and district → one reason to choose → Korean address and one verified practical caveat if available → 지도 열기. Credit beneath photo. Photo aspect 16:10, card radius 16px, 1px Paper Rule, no text on the photo, no heavy shadow.
- Use only the existing approved real CUCO Seongsu interior if available in the preview. Show every real, purpose-matched Samgakji record without an approved photo as a compact text-first card. No placeholder or photo-preparation badge. No stock, AI or placeholder venue imagery, invented venues or claims of live opening.
- Touch targets at least 44×44px; 2px focus outline with 3px offset; press feedback with a subtle opacity change or 1px translation. Semantic headings, keyboard-visible focus, and alt text describing the actual photo.
- Preserve image dimensions during load; a reserved skeleton is for an actual pending load only. Clipboard success: 링크를 복사했어요. If clipboard fails, offer a selectable URL. Forms are out of scope; future forms require visible labels and inline errors.

## 5. Layout Principles

Use CSS Grid with max width 1280px; 48px desktop gutters. On desktop, a left-weighted 5:4 hero puts copy on the left and the vertical chooser to the right, aligned high, with open space. Avoid three adjacent equal feature cards. A single result may occupy roughly 60% of the desktop measure; add a second card only if there is an actual purpose-matched place.

Below 768px, use one column, 16px gutters and 24–32px internal section rhythm. Keep three choices visible without scrolling at 390×844 where possible. No horizontal overflow or stacked/overlapping text. Use natural height and 100dvh minimum only for genuinely fullscreen states. Inspect at 320, 390, 768 and 1440px; check Hangul wrap, keyboard focus, photo crop and back/direct URL behavior.

## 6. Motion & Interaction

Quiet 120–180ms ease-out press, hover and status transitions using only transform and opacity. If a spring is used, use stiffness 100 / damping 20. Stagger is optional and must not hide choices or delay taps. Allow subtle skeleton shimmer only while genuinely loading; no perpetual motion on the decisions themselves. Honor reduced motion.

## 7. Anti-Patterns

No rebrand, neon glow, gradients, emojis, glass panels, custom cursors, centered promotional hero, three equal marketing cards, giant taglines, bouncing scroll arrows, signup before value, unlicensed images from search, fake venue photos, ratings, numbers, social proof or ‘currently open’ claims.

## Stitch generation request

Design Home, Neighborhood Choice and Result at 390×844 and 1440×900, plus a separate no-photo result frame. Use exact Korean copy above. Connect option rows to neighborhood choice and matching results, and 선택 바꾸기 back to Home. Include a direct link example /picks/samgakji?purpose=date. The legacy /picks?purpose=date remains a direct citywide results link. Do not create a substitute photo if the approved CUCO asset is not supplied. Return design frames only; do not publish or modify the live site.

### Main alternate entry: import from Naver Map
Keep the meetup chooser unchanged. Immediately below it, place one Reading Cream panel with a 1px Paper Rule and 16px radius. Copy: “네이버 지도에 모아둔 곳이 있나요?” with “저장 목록 가져오기” as the first action and “장소 하나 저장하기” secondary. Both targets are 44px tall. Link directly to the corresponding archive section. Keep other utility links after this panel. Do not expose or transmit a saved link in a URL query or auto-publish imported places.

## Editorial collection: K’s Seoul Evenings

Use the existing results shell, masthead and text-first place card; no additional visual language. Caption “KULT COLLECTION / BY K”, title “K가 고른 서울의 저녁”, then the share control and place cards. The list represents three individual places across different neighborhoods, not a route. No sign-in wall for reading or sharing, and no payment cues. Save uses the existing private browser archive. Add a quiet utility link on home without altering its purpose chooser. Never include private data in the URL or prefill from a user archive.

## Taste neighbors
Use the collection paper shell and existing Korean editorial type. Lead with “취향이 닮은 사람.” The only first action is selecting actual saved places (nothing preselected). Explain comparison and publication separately. Show matching names and a simple common-place count, not a synthetic percentage, fake profile, or mock result. Make empty states honest and public visibility reversible. Use the existing navigation, ink/cream controls, and 44px targets.


## Stitch iteration: decision context before choosing a venue (2026-11-26)

Reference patterns: [Catchtable](https://apps.apple.com/kr/app/%EC%BA%90%EC%B9%98%ED%85%8C%EC%9D%B4%EB%B8%94/id1485193566) frames discovery around an occasion; [Tabling](https://play.google.com/store/apps/details?hl=ko&id=com.mealant.tabling) makes both location and theme available. KULT uses the same decision principles, not the booking interface or their visual identity.

- Keep the exact title “오늘의 큐레이션 장소는?”, the existing KULT paper/ink/terracotta colors, typography and verified CUCO image. Add a brief Korean cue below each existing purpose label, no new required question or choice.
- Use a subtle 01/02 step marker. After a purpose is selected, expose live counts derived from KULT’s eligible venues on each neighborhood row; retain “목적 바꾸기”. Treat counts as matching venue counts, never availability or waiting times.
- Include a secondary “동네는 아직 미정” row, with the same purpose held in the URL. It goes to the existing citywide results. “동네 고르기” returns with that purpose intact. No calendar, party size, location permission, reviews, or booking signals.
- Keep the fine editorial dividers, single-column rows, at least 44px touch targets, reduced-motion handling, and a visible keyboard focus. Count labels and navigation should wrap without overflow. In a received link, do not force people through onboarding.

### Stitch refinement: purpose-first recommendation cards

Place the venue title and a purpose-specific reason on each card. Rank by the selected occasion, not photo inventory; prefer distinct leads when legitimate options exist, never force uniqueness by inventing a venue. An overlap remains reasonable when distinguishable reasons support both. The first approved exact-branch photo is visible on the result list and loads eagerly; other validated images may load lazily. If no approved image is available, keep the compact card and link the verified Naver photo gallery without embedding, copying or staging a fake photo. Keep the palette, existing hierarchy, and no-placeholder rule.

### Stitch refinement: mobile home hierarchy (2026-11-27)

Use the approved café illustration as the first visual, then the exact existing title, supporting line and purpose chooser. The title is a page heading, not the brand mark: use the mobile scale above and preserve the cover, editorial face and warm paper. Keep a little space before the chooser without moving its first action below the fold at 320×568 with default text settings. Test text at 200% for readable wrapping and reachable controls, not for above-the-fold placement. Preserve one main landmark and retain focus on the step heading after selecting a purpose.

Reference for direction, not a KULT size requirement: [GOV.UK responsive type scale](https://design-system.service.gov.uk/styles/type-scale/) and [USWDS mobile typesetting](https://designsystem.digital.gov/components/typography/).

### Stitch refinement: ink directly on paper (2026-11-27)

Set the café drawing nearly edge to edge against the same warm page paper. Use neutral off-black ink on transparent paper: paper pixels in the source illustration are not part of the design. There must be no visible image rectangle, border, mix-blend wrapper, or introduced color. Preserve every illustrated mark, but trim unused space above the hanging lamp and below the seated figures on phones. Set the width to the smaller of 96vw, 440px and 46svh (41svh at 700px height or less). At 390×844 the cover is 374px wide. Keep the existing desktop geometry and 27px mobile heading; the first purpose remains visible at 320×568 at normal text size. Hide the decoration after a mobile purpose is selected.
