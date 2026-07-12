/**
 * Entry point. Loaded as `<script type="module">`, so it is deferred by default.
 *
 * Two tiers of behaviour:
 *   - Always on: features that are cheap and safe regardless of motion settings.
 *   - Motion-only: scroll-linked enhancement, gated on `prefers-reduced-motion`
 *     (the `motion` class is set by the inline <head> script before paint).
 *
 * Adding `reveal-ready` tells the <head> failsafe that JS ran, so it won't strip
 * `motion` and leave reveal-hidden content stuck. See ARCHITECTURE.md.
 */
import { initContact } from "./contact.js?v=2";
import { initScrollProgress } from "./scroll-progress.js";
import { initReveals } from "./reveals.js";
import { initTravelDock } from "./travel-dock.js";
import { initSmoothScroll } from "./smooth-scroll.js";

const root = document.documentElement;
const motionOK = root.classList.contains("motion");

initContact();
initScrollProgress();

if (motionOK) {
  initReveals();
  root.classList.add("reveal-ready");
  initTravelDock();
  initSmoothScroll();
}
