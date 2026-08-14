---
name: Tierras de Lava
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#20201f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353535'
  on-surface: '#e5e2e1'
  on-surface-variant: '#dfbfbe'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#a68a89'
  outline-variant: '#584141'
  surface-tint: '#ffb3b2'
  primary: '#ffb3b2'
  on-primary: '#680014'
  primary-container: '#801020'
  on-primary-container: '#ff888b'
  inverse-primary: '#ab323b'
  secondary: '#f6bc69'
  on-secondary: '#452b00'
  secondary-container: '#784f00'
  on-secondary-container: '#fec36f'
  tertiary: '#b6d088'
  on-tertiary: '#233600'
  tertiary-container: '#32460d'
  on-tertiary-container: '#9bb470'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdad9'
  primary-fixed-dim: '#ffb3b2'
  on-primary-fixed: '#410009'
  on-primary-fixed-variant: '#8a1926'
  secondary-fixed: '#ffddb3'
  secondary-fixed-dim: '#f6bc69'
  on-secondary-fixed: '#291800'
  on-secondary-fixed-variant: '#624000'
  tertiary-fixed: '#d2eca2'
  tertiary-fixed-dim: '#b6d088'
  on-tertiary-fixed: '#131f00'
  on-tertiary-fixed-variant: '#394d14'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353535'
typography:
  headline-xl:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 36px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Montserrat
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Montserrat
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-sm:
    fontFamily: Montserrat
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  section-gap-desktop: 120px
  section-gap-mobile: 64px
  grid-margin: 24px
  grid-gutter: 24px
---

## Brand & Style
The design system draws inspiration from the raw, volcanic landscapes of the Canary Islands and the artisanal heritage of "Hermanos Moreno." The visual language balances **Rustic-Canarian tradition** with **Contemporary Minimalist** sensibilities.

The style is **Tactile and Artisanal**. It avoids clinical perfection in favor of organic textures, high-contrast typography, and a sense of "physicality." Surfaces should feel like they have weight and history, utilizing subtle grain and depth to move away from a "digital-first" corporate aesthetic. The goal is to evoke the warmth of a family-run *guachinche* through a sophisticated, modern lens.

## Colors
The palette is rooted in the island’s natural materials:
- **Volcanic Stone (Neutral):** A deep, textured charcoal (`#1A1A1A`) serves as the canvas, providing a grounded, moody atmosphere.
- **Red Wine (Primary):** A rich, deep burgundy (`#801020`) used for primary actions and key brand moments, representing the Malvasía wines of the region.
- **Warm Wood & Ochre (Secondary):** Earthy golds (`#C28E40`) and deep browns (`#4A3728`) provide warmth and highlight interactive elements.
- **Olive Green (Tertiary):** A muted green (`#556B2F`) used sparingly for success states or botanical accents.

Avoid pure white; use a "Bone" or "Parchment" off-white for text to maintain a soft, organic feel against the dark backgrounds.

## Typography
The typography creates a tension between the **literary elegance** of the headline serif and the **industrial clarity** of the body sans-serif.

- **Headlines:** Use **Playfair Display**. It should be set with tight letter-spacing for large displays. Its high contrast stems from traditional calligraphy, mirroring the "handcrafted" brand pillar.
- **Body & UI:** Use **Montserrat**. This geometric sans-serif provides a modern counterpoint. For labels and small caps, increase letter-spacing to ensure legibility against dark, textured backgrounds.

## Layout & Spacing
The layout follows a **Fluid Grid** model with generous margins to allow high-quality food photography to breathe. 

- **Desktop:** 12-column grid. Use asymmetrical layouts where imagery overlaps columns to create a dynamic, editorial feel.
- **Mobile:** 4-column grid. Prioritize vertical stacking with full-bleed imagery to maximize the "sensory" impact of the dishes.
- **Rhythm:** Use an 8px base unit. Section spacing should be exceptionally large to prevent the dark UI from feeling cramped or "heavy."

## Elevation & Depth
Depth is achieved through **Tonal Layering** and **Subtle Textures** rather than traditional shadows.
- **Surface 0:** The base background, ideally using a very low-opacity SVG noise texture to mimic volcanic grain.
- **Surface 1:** Elevated cards use a slightly lighter shade of the charcoal neutral or a deep "Wood" brown.
- **Outlines:** Instead of shadows, use "Ghost Borders"—1px solid strokes in a muted gold or low-opacity white to define containers.
- **Imagery:** Food photos should have soft, feathered vignettes or be placed within containers with slightly irregular, hand-cut corner feels.

## Shapes
The design system uses **Soft (0.25rem)** roundedness. This avoids the "bubbly" look of modern tech apps while softening the aggressive edges of a brutalist layout. It feels like "honed stone"—structured but smoothed by hand. For specific decorative elements, like image frames, consider using a larger `rounded-lg` (0.5rem) to suggest the organic shape of traditional clay pottery.

## Components
- **Buttons:** Primary buttons are solid "Red Wine" with "Bone" text. Use a subtle scale-down effect (98%) on press to simulate physical resistance. Secondary buttons use the "Ghost" style with a "Wood" ochre border.
- **Food Cards:** Cards are the hero. Use high-aspect-ratio imagery. Title (Serif) sits over the image or immediately below in a high-contrast weight. Include "Artisanal Tags" (chips) using the Olive Green for dietary or "Chef's Special" markers.
- **Inputs:** Simple under-lined fields or low-opacity dark fills. Avoid heavy boxes. Focus states should transition the underline to the Primary Red Wine color.
- **Lists (Menu):** Use a classic "Dotted Leader" (Name ....... Price) to evoke traditional bistro menus, but rendered in a clean Montserrat font for clarity.
- **Navigation:** A minimal top bar that becomes translucent on scroll. Use the Serif font for the logo and the Sans-serif for navigation links.