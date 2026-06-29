const LENIS_OFFSET = -90; // px; land in-page anchors below the fixed header
const NATIVE_FOCUS_DELAY = 600; // ms; ~native smooth-scroll duration before focusing

/**
 * Momentum scrolling via Lenis (loaded from a CDN, feature-detected) plus
 * accessible in-page anchor navigation: clicking a `#hash` link smooth-scrolls
 * to the target AND moves keyboard focus to it, so the keyboard caret follows
 * the visual jump.
 *
 * Lenis is optional — if it didn't load, anchors fall back to native smooth
 * scrolling. Motion-only (the caller gates this behind `prefers-reduced-motion`).
 */
export function initSmoothScroll() {
  const lenis = window.Lenis
    ? new window.Lenis({
        duration: 1.05,
        easing: (t) => 1 - Math.pow(1 - t, 3),
        smoothWheel: true,
      })
    : null;

  if (lenis) {
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const hash = link.getAttribute("href");
      if (!hash || hash === "#") return;
      const target = document.querySelector(hash);
      if (!target) return;

      event.preventDefault();
      target.setAttribute("tabindex", "-1");
      const focusTarget = () => target.focus({ preventScroll: true });

      if (lenis) {
        lenis.scrollTo(target, { offset: LENIS_OFFSET, onComplete: focusTarget });
      } else {
        target.scrollIntoView({ behavior: "smooth" });
        window.setTimeout(focusTarget, NATIVE_FOCUS_DELAY);
      }
    });
  });
}
