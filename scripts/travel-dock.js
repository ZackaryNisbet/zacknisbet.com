import { clamp01, debounce, lerp, rafThrottle } from "./utils.js";

/**
 * Geometry for the docked clip and its frosted tray. All px unless noted.
 */
const DOCK = {
  trayPad: 16, // gap between the clip and the tray's edges
  mobileMaxWidth: 720, // viewports narrower than this use the mobile dock width
  mobileWidthRatio: 0.56, // docked clip width as a fraction of a phone viewport
  desktopWidth: 280, // docked clip width on wider screens
  edgeInset: 28, // keep the docked clip at least this far from the viewport edges
  fallbackAspect: 0.5625, // 16:9 — used until the clip's real size is measured
  panelGap: 24, // gap the desktop status card keeps above the tray
  settleDelayMs: 400, // re-measure once fonts/video metadata have settled
  resizeDebounceMs: 150,
  headerFallback: 64,
};

/**
 * Visual-viewport height. On mobile this tracks the URL bar as it shows/hides;
 * `window.innerHeight` does not, which is why the docked clip would otherwise
 * drift off the tray during scroll.
 */
const viewportHeight = () =>
  window.visualViewport ? window.visualViewport.height : window.innerHeight;

/**
 * The "In the news" travel dock.
 *
 * The clip lives in a frosted tray pinned to the bottom of the viewport. As the
 * press section scrolls toward centre, the clip lifts out of the tray and mounts
 * full-size in its in-flow home; scrolled past, it docks small at the top.
 *
 * Implementation: the clip is `position: fixed; bottom: 0` (CSS) with a JS
 * transform interpolated by `mount` (0 = docked, 1 = mounted). Because the
 * docked transform carries no viewport-height term, the clip stays glued to the
 * bottom — and to the moving mobile URL bar — exactly like the tray.
 *
 * Motion-only: the caller gates this behind `prefers-reduced-motion`. With it
 * off, the clip simply renders in flow in the press section.
 */
export function initTravelDock() {
  const reel = document.querySelector(".news-reel");
  const stage = reel?.querySelector(".news-stage");
  const video = reel?.querySelector(".news-video");
  if (!reel || !stage || !video) return;

  const root = document.documentElement;
  const heroInner = document.querySelector(".hero-inner");
  const header = document.querySelector(".site-header");

  // Reserve the clip's in-flow footprint so the layout doesn't collapse when the
  // clip is lifted out to `position: fixed`.
  const slot = document.createElement("div");
  slot.className = "news-slot";
  stage.before(slot);

  // The frosted bar the docked clip rests in.
  const tray = document.createElement("div");
  tray.className = "news-tray";
  tray.setAttribute("aria-hidden", "true");
  document.body.appendChild(tray);

  root.classList.add("travel-on");
  stage.classList.add("traveling");
  autoplayWhileVisible(video);

  // Measured geometry, refreshed by measure().
  let homeWidth = 0;
  let homeHeight = 0;
  let dockWidth = DOCK.desktopWidth;
  let headerHeight = DOCK.headerFallback;
  let trayHeight = 0;

  const dockHeight = () => dockWidth * (homeHeight / homeWidth || DOCK.fallbackAspect);

  /** Read layout-dependent sizes. Runs on load, resize, and viewport changes. */
  const measure = () => {
    // Read the clip's natural in-flow size with no stale inline width applied.
    stage.style.width = "";
    stage.classList.remove("traveling");
    const naturalWidth = stage.offsetWidth;
    const naturalHeight = stage.offsetHeight;
    stage.classList.add("traveling");

    // Ignore bogus 0-size reads (e.g. a backgrounded tab collapses layout) so a
    // single bad measure can never poison the scale with a divide-by-zero.
    if (naturalWidth > 0 && naturalHeight > 0) {
      homeWidth = naturalWidth;
      homeHeight = naturalHeight;
      slot.style.height = `${homeHeight}px`;
    }
    if (homeWidth > 0) stage.style.width = `${homeWidth}px`;

    const vw = window.innerWidth || root.clientWidth || 0;
    if (vw > 0) {
      const target = vw < DOCK.mobileMaxWidth ? vw * DOCK.mobileWidthRatio : DOCK.desktopWidth;
      dockWidth = Math.round(Math.min(target, vw - DOCK.edgeInset));
    }
    headerHeight = header ? header.offsetHeight : DOCK.headerFallback;

    trayHeight = Math.round(dockHeight() + DOCK.trayPad * 2);
    tray.style.height = `${trayHeight}px`;
    tray.style.top = "auto";
    tray.style.bottom = "0px";

    // Park the desktop status card a constant gap above the docked tray. The
    // hero can overflow a short viewport, so key the offset off the real heights.
    if (heroInner) {
      const clear = Math.max(
        28,
        Math.round(heroInner.offsetHeight - viewportHeight() + trayHeight + DOCK.panelGap),
      );
      root.style.setProperty("--panel-clear", `${clear}px`);
    }
  };

  /** Position the clip + tray for the current scroll offset. Runs every frame. */
  const place = () => {
    if (!(homeWidth > 0 && homeHeight > 0)) return;

    const home = slot.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = viewportHeight();
    const slotCentre = home.top + home.height / 2;
    // 0 = fully docked, 1 = mounted full-size in the press section.
    const mount = clamp01(1 - Math.abs(slotCentre - vh * 0.5) / (vh * 0.6));
    // Once the section's centre passes above the viewport centre, dock at the top.
    const dockTop = slotCentre < vh * 0.5;
    reel.style.setProperty("--mount", mount.toFixed(3));

    // The tray rides whichever side the clip docks on and fades as it mounts.
    if (dockTop) {
      tray.style.top = `${headerHeight}px`;
      tray.style.bottom = "auto";
    } else {
      tray.style.top = "auto";
      tray.style.bottom = "0px";
    }
    tray.style.opacity = (1 - mount).toFixed(3);
    tray.style.transform = `translateY(${(mount * (dockTop ? -100 : 100)).toFixed(1)}%)`;

    // Clip: position:fixed; bottom:0; left:0; transform-origin:bottom left.
    // The docked translateY has no `vh` term, so it stays glued to the bottom as
    // the URL bar moves. Mounted, it aligns its bottom-left with the slot.
    const clipHeight = dockHeight();
    const dockedX = (vw - dockWidth) / 2;
    const dockedY = dockTop ? headerHeight + DOCK.trayPad + clipHeight - vh : -DOCK.trayPad;
    const scale = lerp(dockWidth / homeWidth, 1, mount);
    const translateX = lerp(dockedX, home.left, mount);
    const translateY = lerp(dockedY, home.bottom - vh, mount);
    stage.style.transform =
      `translate3d(${translateX.toFixed(1)}px, ${translateY.toFixed(1)}px, 0) ` +
      `scale(${scale.toFixed(4)})`;
  };

  const refresh = () => {
    measure();
    place();
  };
  const onScroll = rafThrottle(place);
  const onResize = debounce(refresh, DOCK.resizeDebounceMs);

  refresh();
  window.addEventListener("load", refresh);
  window.setTimeout(refresh, DOCK.settleDelayMs);
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize);
  if (window.visualViewport) {
    // The mobile URL bar showing/hiding changes the real viewport bottom but
    // doesn't reliably fire window resize/scroll — refresh through the same gates.
    window.visualViewport.addEventListener("resize", onResize, { passive: true });
    window.visualViewport.addEventListener("scroll", onScroll, { passive: true });
  }
}

/**
 * Lazily load and autoplay the muted clip, pausing it while the tab is hidden.
 * @param {HTMLVideoElement} video
 */
function autoplayWhileVisible(video) {
  const play = () => {
    if (!video.src && video.dataset.src) video.src = video.dataset.src;
    video.play().catch(() => {}); // autoplay can be blocked; ignore
  };
  video.addEventListener("playing", () => video.classList.add("is-live"), { once: true });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) video.pause();
    else play();
  });
  play();
}
