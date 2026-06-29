const root = document.documentElement;
const motionOK = root.classList.contains("motion");

// --- year + obfuscated email (always) ---
const year = document.querySelector("#year");
if (year) year.textContent = String(new Date().getFullYear());

const emailLink = document.querySelector("[data-email-link]");
if (emailLink) {
  emailLink.addEventListener("click", (event) => {
    event.preventDefault();
    const user = emailLink.dataset.user || "";
    const domain = emailLink.dataset.domain || "";
    if (user && domain) window.location.href = `mailto:${user}@${domain}`;
  });
}

// --- scroll progress meter + header state (always) ---
const meter = document.querySelector(".scroll-meter");
const header = document.querySelector(".site-header");

const onScroll = () => {
  const y = window.scrollY;
  if (meter) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    meter.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
  }
  if (header) header.classList.toggle("is-scrolled", y > 8);
};

let ticking = false;
window.addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => { ticking = false; onScroll(); });
    }
  },
  { passive: true }
);
onScroll();

// =====================================================================
// Motion-only progressive enhancement.
// =====================================================================
if (motionOK) {
  // --- reveal on scroll (elements hidden from first paint via CSS) ---
  const revealItems = document.querySelectorAll(
    ".section-head, .role-card, .system-card, .skill-cloud, .education-grid article, .press-card, .contact-copy"
  );
  const revealAll = () => revealItems.forEach((i) => i.classList.add("in"));

  try {
    if (!("IntersectionObserver" in window)) throw new Error("no IntersectionObserver");

    const groupIndex = new Map();
    revealItems.forEach((item) => {
      const parent = item.parentElement;
      const i = groupIndex.get(parent) || 0;
      groupIndex.set(parent, i + 1);
      item.style.transitionDelay = `${Math.min(i, 6) * 60}ms`;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            entry.target.style.willChange = "auto";
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );
    revealItems.forEach((item) => observer.observe(item));
  } catch (e) {
    revealAll();
  }

  root.classList.add("reveal-ready");

  // --- "In the news" clip: docks at the bottom, mounts at the section, then docks at the top ---
  const reel = document.querySelector(".news-reel");
  const stage = reel && reel.querySelector(".news-stage");
  const newsVideo = reel && reel.querySelector(".news-video");
  if (reel && stage && newsVideo) {
    const startVideo = () => {
      if (!newsVideo.src && newsVideo.dataset.src) newsVideo.src = newsVideo.dataset.src;
      const played = newsVideo.play();
      if (played && played.catch) played.catch(() => {});
    };
    newsVideo.addEventListener("playing", () => newsVideo.classList.add("is-live"), { once: true });

    // reserve the clip's home space, then float the stage and lerp it between a
    // small centered dock and that home slot as the section passes through center
    const slot = document.createElement("div");
    slot.className = "news-slot";
    stage.before(slot);
    root.classList.add("travel-on");
    stage.classList.add("traveling");
    startVideo();
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) newsVideo.pause(); else startVideo();
    });

    const clamp01 = (v) => Math.max(0, Math.min(1, v));
    const lerp = (a, b, t) => a + (b - a) * t;

    let homeW = 0, homeH = 0, dockW = 300, headerH = 64;
    const measure = () => {
      // read the clip's natural in-flow size with no stale inline width applied
      stage.style.width = "";
      stage.classList.remove("traveling");
      const w = stage.offsetWidth;
      const h = stage.offsetHeight;
      stage.classList.add("traveling");
      // ignore bogus 0-size reads (e.g. a backgrounded tab collapses layout) so a
      // single bad measure can never poison the scale with a divide-by-zero
      if (w > 0 && h > 0) {
        homeW = w;
        homeH = h;
        slot.style.height = homeH + "px";
      }
      if (homeW > 0) stage.style.width = homeW + "px";
      const vw = window.innerWidth || document.documentElement.clientWidth || 0;
      if (vw > 0) dockW = Math.round(Math.min(vw < 720 ? vw * 0.6 : 340, vw - 28));
      const headerEl = document.querySelector(".site-header");
      headerH = headerEl ? headerEl.offsetHeight : 64;
    };

    const place = () => {
      if (!(homeW > 0 && homeH > 0)) return;
      const home = slot.getBoundingClientRect();
      const vw = window.innerWidth, vh = window.innerHeight;
      const slotCenter = home.top + home.height / 2;
      const b = clamp01(1 - Math.abs(slotCenter - vh * 0.5) / (vh * 0.6));
      reel.style.setProperty("--mount", b.toFixed(3));
      const dockH = dockW * (homeH / homeW || 0.5625);
      const goingTop = slotCenter < vh * 0.5;
      const dockTop = goingTop ? headerH + 14 : vh - dockH - 18;
      const dockLeft = (vw - dockW) / 2;
      const s = lerp(dockW / homeW, 1, b);
      const tx = lerp(dockLeft, home.left, b);
      const ty = lerp(dockTop, home.top, b);
      stage.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0) scale(${s.toFixed(4)})`;
    };

    measure();
    place();
    // re-measure once everything (fonts, video metadata) has settled
    window.addEventListener("load", () => { measure(); place(); });
    setTimeout(() => { measure(); place(); }, 400);
    let tick = false;
    window.addEventListener(
      "scroll",
      () => { if (!tick) { tick = true; requestAnimationFrame(() => { tick = false; place(); }); } },
      { passive: true }
    );
    let rt;
    window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { measure(); place(); }, 150); });
  }

  // --- momentum smooth scroll (Lenis, if it loaded) ---
  let lenis = null;
  if (window.Lenis) {
    lenis = new window.Lenis({
      duration: 1.05,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    });
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }

  // anchor links: smooth scroll + move keyboard focus to the target
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.setAttribute("tabindex", "-1");
      const focusTarget = () => target.focus({ preventScroll: true });
      if (lenis) lenis.scrollTo(target, { offset: -90, onComplete: focusTarget });
      else { target.scrollIntoView({ behavior: "smooth" }); setTimeout(focusTarget, 600); }
    });
  });
}
