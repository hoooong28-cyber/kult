---
name: Editorial Minimalist
colors:
  surface: '#fcf9f5'
  surface-dim: '#dcdad6'
  surface-bright: '#fcf9f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3ef'
  surface-container: '#f0ede9'
  surface-container-high: '#eae8e4'
  surface-container-highest: '#e5e2de'
  on-surface: '#1c1c1a'
  on-surface-variant: '#444748'
  inverse-surface: '#31302e'
  inverse-on-surface: '#f3f0ec'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#0e0f0f'
  on-primary: '#ffffff'
  primary-container: '#242424'
  on-primary-container: '#8c8b8b'
  inverse-primary: '#c8c6c5'
  secondary: '#5e5e5d'
  on-secondary: '#ffffff'
  secondary-container: '#e0dfde'
  on-secondary-container: '#626361'
  tertiary: '#280002'
  on-tertiary: '#ffffff'
  tertiary-container: '#4a0c0e'
  on-tertiary-container: '#cd716c'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e4e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1b1c1c'
  on-primary-fixed-variant: '#474746'
  secondary-fixed: '#e3e2e0'
  secondary-fixed-dim: '#c7c6c5'
  on-secondary-fixed: '#1a1c1b'
  on-secondary-fixed-variant: '#464746'
  tertiary-fixed: '#ffdad7'
  tertiary-fixed-dim: '#ffb3af'
  on-tertiary-fixed: '#3e0407'
  on-tertiary-fixed-variant: '#792f2d'
  background: '#fcf9f5'
  on-background: '#1c1c1a'
  surface-variant: '#e5e2de'
typography:
  display-lg:
    fontFamily: Libre Caslon Text
    fontSize: 48px
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Libre Caslon Text
    fontSize: 36px
    fontWeight: '400'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Libre Caslon Text
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Libre Caslon Text
    fontSize: 24px
    fontWeight: '400'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Source Sans 3
    fontSize: 20px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Source Sans 3
    fontSize: 17px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  container-max: 720px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  stack-sm: 8px
  stack-md: 24px
  stack-lg: 48px
  stack-xl: 80px
---

## Brand & Style
The brand personality is intellectual, curated, and authoritative, designed for readers who value depth over speed. It targets a discerning audience—thinkers, creators, and professionals—evoking a sense of calm focus and "slow media" consumption.

The design style is **Minimalist Editorial**. It prioritizes content hierarchy through generous whitespace and masterful typography rather than decorative elements. By stripping away digital noise, the UI feels like a premium physical publication—tactile, intentional, and quiet. The experience should feel like stepping into a private library: sophisticated, hushed, and deeply immersive.

## Colors
The palette is grounded in a "paper-and-ink" philosophy. 

- **Primary (#242424):** A deep charcoal used for primary text and high-impact UI elements to ensure maximum legibility without the harshness of pure black.
- **Secondary (#F9F8F6):** A warm, parchment-inspired off-white that serves as the universal background, reducing eye strain during long-form reading.
- **Tertiary (#5D1A1A):** A muted Burgundy used sparingly as a sophisticated "mark of quality" for accents, active states, or premium labels.
- **Neutral (#706F6C):** A soft taupe-grey for secondary metadata, borders, and UI scaffolding that should recede into the background.

## Typography
Typography is the core of this design system. We use a high-contrast pairing to distinguish between "Story" and "System."

- **Headlines (Libre Caslon Text):** Traditional and authoritative. Used for titles and pull-quotes to provide a literary, editorial feel.
- **Body (Source Sans 3):** Chosen for its exceptional clarity in long-form prose. The line height is intentionally generous (1.6) to enhance the rhythm of reading.
- **Labels (Hanken Grotesk):** A sharp, modern sans-serif used for UI controls and metadata. It provides a functional contrast to the expressive serif headings.

For mobile, display sizes scale down to prevent awkward word breaks, while body text remains large to maintain a premium reading experience.

## Layout & Spacing
The layout follows a **Fixed-Width Reading Column** model for articles and a **Responsive Grid** for discovery.

- **Reading Experience:** Content is centered in a tight 720px container to ensure optimal line length (approx. 70-80 characters). This mimics the width of a book page.
- **Discovery/Home:** A 12-column grid that collapses to 1 column on mobile. In discovery mode, whitespace (stack-xl) is used to separate different content sections, allowing each article "card" to breathe.
- **Rhythm:** We use a base-8 spacing scale. Vertical rhythm is critical; use `stack-lg` for section breaks and `stack-md` for related groupings.

## Elevation & Depth
This design system avoids heavy shadows and skeuomorphism. Depth is created through **Tonal Layering** and **Soft Ambient Occlusion**.

- **Surface Levels:** The base layer is the warm off-white (#F9F8F6). Secondary surfaces (like search bars or sticky headers) use the same color but are defined by a 1px stroke of #706F6C at 15% opacity.
- **Shadows:** Use only for floating elements like dropdowns or modals. Shadows should be ultra-diffused: `0 20px 40px rgba(0,0,0,0.04)`.
- **Focus:** No "glows." Hierarchy is communicated through proximity and scale. When an element is raised, it does not gain a border; it gains a subtle backdrop blur or a very slight tint shift.

## Shapes
The shape language is understated and architectural. 

We use **Soft (0.25rem)** roundedness for most UI elements. This keeps the aesthetic feeling modern and accessible without becoming "bubbly" or overly playful. Images should either be perfectly sharp (0px) to feel like magazine clippings or use the `rounded-lg` (0.5rem) token for a slightly more contemporary app feel. Buttons and input fields must remain consistent with the `soft` profile.

## Components
- **Buttons:** Primary buttons are solid Charcoal (#242424) with white text. Secondary buttons use a 1px border of the primary color with no fill. All buttons use the `label-md` typography for a professional, sharp look.
- **Article Cards:** No borders or shadows. A card consists of a headline, a short summary in `body-md`, and metadata in `label-sm`. They are separated by generous whitespace or a thin, 1px horizontal rule.
- **Chips/Tags:** Used for categories. Styled with a transparent background and a thin #706F6C border. Text is `label-sm` with high letter spacing.
- **Inputs:** Minimalist bottom-border only or a very light 4-sided stroke. No heavy focus rings; instead, the bottom border shifts to the Burgundy accent color (#5D1A1A) on focus.
- **Lists:** Clean, left-aligned, using the `primary` color for the bullet or numbering to maintain the "literary" aesthetic.
- **Progress Indicator:** A very thin (2px) fixed bar at the top of the article page in the Burgundy accent color to track reading progress.
