# Architecture

How `zacknisbet.com` is built, and the reasoning behind the choices that aren't
obvious from reading the source.

## The shape of it

A hand-authored static site: one `index.html`, a set of CSS partials in
`styles/`, and a set of ES modules in `scripts/`. No framework, no bundler, no
transpiler. Vercel serves the files as they are committed.

```
index.html              One document. <head> meta + JSON-LD, then the page.
styles/                 CSS, split by concern and linked in cascade order:
  tokens.css              design tokens (:root) — the single source of truth
  base.css                reset, elements, focus, skip link, shared type
  layout.css              header/nav, shell, the numbered section system, footer
  hero.css                hero, the floating status card, the on-air cue
  sections.css            experience, projects, skills, education, press, contact
  travel-dock.css         the "In the news" clip + frosted tray (paired with the module)
  motion.css              reveal-on-scroll rules + keyframes
  responsive.css          all breakpoints — the single source of truth (lap 920 / phone 560)
scripts/                ES modules (type="module"), one concern each:
  main.js                 entry: wires the features, gated on motion
  utils.js                rafThrottle, debounce, clamp01, lerp
  contact.js              year + obfuscated email
  scroll-progress.js      progress meter + header state
  reveals.js              IntersectionObserver reveals (+ no-IO fallback)
  travel-dock.js          the scroll-linked clip dock (the most complex unit)
  smooth-scroll.js        Lenis + accessible anchor navigation
tools/check-site.mjs    pre-deploy contract gate (run by `npm run check` + CI)
docs/                   PRODUCT (why), DESIGN (visual system), research/ (notes)
```

## Why no build step

This is a small, content-stable, three-author-decision site. A bundler would buy
minification and request-bundling, but at this size (a few hundred lines of JS, a
few hundred of CSS, served over HTTP/2) those savings are negligible — and they'd
cost the property that makes the repo worth reading: **what you see in the source
is exactly what ships.**

So the split is done with native browser primitives instead of tooling:

- **CSS** is several `<link>`s in cascade order. HTTP/2 multiplexes them, so first
  paint is essentially identical to one concatenated file, and each concern is its
  own file.
- **JS** is native ES modules (`<script type="module">`). Real module scope and
  imports, zero tooling. Modules are deferred by default.

The only "toolchain" is `tools/check-site.mjs` — a zero-dependency Node script
that guards the contracts below. If performance ever demanded bundling, a ~10-line
esbuild step could emit a concatenated artifact while keeping these files as the
source of truth; it isn't needed today.

## Progressive enhancement contract

**Content must never depend on JavaScript, and must never get trapped hidden.**

An inline script in `<head>` (kept inline so it runs before first paint) sets
classes on `<html>`:

- `js` — JavaScript is running.
- `motion` — added only when `prefers-reduced-motion` is _not_ reduce. Every
  scroll-linked enhancement (reveals, the travel dock, Lenis) is gated on it, in
  CSS and in `main.js`.

Reveal-on-scroll hides elements from first paint (under `html.motion`) and
`reveals.js` adds `.in` to release them. The risk is obvious: if the script never
runs, that content stays invisible. Two guards prevent it:

1. A 3-second failsafe in the `<head>` script strips `motion` if `reveal-ready`
   was never set, so the reveal-hidden CSS stops applying and everything shows.
2. `main.js` sets `reveal-ready` immediately after wiring reveals, and `reveals.js`
   falls back to revealing everything if `IntersectionObserver` is missing or
   throws.

With JS off entirely, `motion` is never added, nothing is hidden, and the page is
fully readable and crawlable.

## The travel dock

The "In the news" clip (`scripts/travel-dock.js`) is the one genuinely tricky
piece. It rides a frosted tray pinned to the bottom of the viewport; as the press
section scrolls toward centre the clip lifts out and mounts full-size in its
in-flow home, then docks small at the top once scrolled past.

- A `news-slot` reserves the clip's in-flow footprint so the layout doesn't
  collapse when the clip is lifted to `position: fixed`.
- The clip is **bottom-anchored** (`position: fixed; bottom: 0`) and its docked
  transform carries no viewport-height term. That's deliberate: it keeps the clip
  glued to the bottom — and to the moving **mobile URL bar** — in lockstep with
  the tray. Earlier versions anchored to the top using `innerHeight`, which lies
  as the URL bar shows/hides, and the clip drifted off the tray on scroll.
- `measure()` reads sizes (on load/resize/visualViewport change); `place()` runs
  every frame and only writes transforms — no layout reads on the scroll path.
- `measure()` ignores 0-size reads so a collapsed/backgrounded layout can never
  poison the scale with a divide-by-zero.

Under reduced motion none of this runs and the clip is just an in-flow video.

## SEO / entity layer

The site's product goal (see [docs/PRODUCT.md](docs/PRODUCT.md)) is to be the
canonical, crawlable source for the **Zack Nisbet** entity. The JSON-LD `@graph`
in `index.html` is the spine: a linked Person / WebSite / ProfilePage /
Organization graph with `sameAs` profiles and a `subjectOf` press list.
`tools/check-site.mjs` parses that graph and fails the build if the Person node or
its identity fields regress.

## Invariants

Things to keep true when editing (`npm run check` enforces most):

- Never gate content behind JS. The 3s failsafe is the contract.
- Keep the JSON-LD Person fields in sync with `docs/PRODUCT.md`.
- Keep heading order valid: one `<h1>`, sections led by `<h2>`, entries `<h3>`.
- Don't viewport-scale font size (a deliberate design rule — see DESIGN.md).
- The Lenis CDN tag must stay `defer`; `main.js` feature-detects it.
- Run `npm run check` before deploying.
