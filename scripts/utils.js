/**
 * Tiny shared helpers. No dependencies; safe to import from any module.
 */

/**
 * Wrap `fn` so it runs at most once per animation frame (trailing edge).
 * Use for scroll/resize handlers to keep work off the input thread.
 * @template {(...args: any[]) => void} F
 * @param {F} fn
 * @returns {(...args: Parameters<F>) => void}
 */
export function rafThrottle(fn) {
  let scheduled = false;
  return (...args) => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      fn(...args);
    });
  };
}

/**
 * Run `fn` only after `ms` of quiet. Trailing edge.
 * @template {(...args: any[]) => void} F
 * @param {F} fn
 * @param {number} ms
 * @returns {(...args: Parameters<F>) => void}
 */
export function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = window.setTimeout(() => fn(...args), ms);
  };
}

/** Clamp `value` to the [0, 1] range. */
export const clamp01 = (value) => Math.max(0, Math.min(1, value));

/** Linear interpolation from `from` to `to` by factor `t` (0..1). */
export const lerp = (from, to, t) => from + (to - from) * t;
