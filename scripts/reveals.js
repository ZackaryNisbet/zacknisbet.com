/** Elements that fade/slide in as they enter the viewport. */
const REVEAL_SELECTOR =
  ".section-head, .role-card, .system-card, .skill-cloud, .education-grid article, .press-card, .contact-copy";

const STAGGER_MS = 60; // delay between siblings in the same group
const MAX_STAGGER_STEPS = 6; // cap so long lists don't trail forever

/**
 * Reveal elements on scroll, staggered per sibling group. They are hidden from
 * first paint by CSS under `html.motion`; this adds `.in` to release them.
 *
 * Content must never get trapped hidden: if IntersectionObserver is missing, or
 * observer setup throws, we reveal everything immediately.
 */
export function initReveals() {
  const items = document.querySelectorAll(REVEAL_SELECTOR);
  const revealAll = () => items.forEach((el) => el.classList.add("in"));

  if (!("IntersectionObserver" in window)) {
    revealAll();
    return;
  }

  try {
    const indexInGroup = new Map();
    items.forEach((el) => {
      const i = indexInGroup.get(el.parentElement) || 0;
      indexInGroup.set(el.parentElement, i + 1);
      el.style.transitionDelay = `${Math.min(i, MAX_STAGGER_STEPS) * STAGGER_MS}ms`;
    });

    const observer = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("in");
          entry.target.style.willChange = "auto";
          obs.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );
    items.forEach((el) => observer.observe(el));
  } catch (err) {
    console.warn("reveal observer failed; showing all content", err);
    revealAll();
  }
}
