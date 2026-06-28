# Zack Nisbet Personal Site Design

## Register

brand

## Design Direction

The site is a technical operator dossier, not a generic portfolio. The first viewport uses the K9 Resorts photo as a blended image plane, with restrained identity copy, current status, and no initials badge. The page then moves directly into professional experience, technical projects, skills, education, press coverage, and contact.

## Color

Use a dark green-black first act with a light paper second act. Accents come from the photo and K9/Rammenta signals:

- Ink: `oklch(0.115 0.018 163)`
- Paper: `oklch(0.95 0.014 86)`
- Red accent: `oklch(0.61 0.18 24)`
- Green: `oklch(0.7 0.13 152)`
- Coral: `oklch(0.64 0.16 35)`
- Blue: `oklch(0.62 0.13 236)`

## Typography

Use Archivo for display and Manrope for text. Keep headings strong but controlled, especially in the hero and resume sections. Do not scale font size with viewport width.

## Layout

- Header uses the full name, not a monogram.
- Hero image is masked and merged into the page rather than placed as a rectangle.
- Experience and technical projects mirror the resume content.
- Press cards use dates and thumbnails where reliable metadata exists.
- Footer links are compact icon-level controls.
- Contact is direct action links, no static form.

## Motion

The site should feel like a living instrument: bold and immersive, never quiet-for-quiet's-sake. All motion is progressive enhancement, gated behind `prefers-reduced-motion` and pointer capability, and no motion is required for crawlers to understand the content.

- Hero: a cursor-reactive WebGL field (domain-warped emerald flow with brass/gold veins) where a warm light tracks the pointer and bends the flow toward it. Falls back to the CSS gradient when WebGL or motion is unavailable.
- Custom cursor (fine pointers only): a dot plus a lagging ring that grows over interactive targets. Native cursor is only hidden once JS has activated the replacement.
- Magnetic primary/secondary CTAs; cursor-tracked spotlight on the dark system cards.
- Momentum smooth-scroll with scroll-linked hero parallax and fade.
- Scroll reveals must be hidden from the first paint (synchronous `<head>` class), never shown-then-hidden, so nothing flashes. A timeout safety net reveals everything if scripts fail.
