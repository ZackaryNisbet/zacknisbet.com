import { rafThrottle } from "./utils.js";

/** Past this many pixels of scroll, the header switches to its solid state. */
const HEADER_SOLID_AT = 8;

/**
 * Drive the fixed top progress meter (scaleX 0 -> 1 across the page) and toggle
 * the header's scrolled state. Always on — cheap, and independent of motion
 * preferences.
 */
export function initScrollProgress() {
  const meter = document.querySelector(".scroll-meter");
  const header = document.querySelector(".site-header");
  if (!meter && !header) return;

  const update = () => {
    const y = window.scrollY;
    if (meter) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      meter.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
    }
    if (header) header.classList.toggle("is-scrolled", y > HEADER_SOLID_AT);
  };

  window.addEventListener("scroll", rafThrottle(update), { passive: true });
  update();
}
