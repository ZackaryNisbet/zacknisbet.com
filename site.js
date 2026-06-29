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

  // --- "In the news" clip: scroll-scrubbed "develop into focus" reveal ---
  const reel = document.querySelector(".news-reel");
  const newsVideo = reel && reel.querySelector(".news-video");
  if (reel && newsVideo) {
    const startVideo = () => {
      if (!newsVideo.src && newsVideo.dataset.src) newsVideo.src = newsVideo.dataset.src;
      const played = newsVideo.play();
      if (played && played.catch) played.catch(() => {});
    };
    // crossfade the live video over the still poster once it actually plays
    newsVideo.addEventListener("playing", () => newsVideo.classList.add("is-live"), { once: true });

    // lazy-load + play/pause as the clip enters/leaves the viewport
    if ("IntersectionObserver" in window) {
      const playObserver = new IntersectionObserver(
        (entries) => entries.forEach((e) => (e.isIntersecting ? startVideo() : newsVideo.pause())),
        { threshold: 0.1 }
      );
      playObserver.observe(reel);
    }

    // the still resolves into the live clip, scrubbed to scroll via one custom property
    let latched = false;
    const develop = () => {
      const r = reel.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const p = Math.max(0, Math.min(1, (vh * 0.82 - r.top) / vh));
      reel.style.setProperty("--develop", p.toFixed(3));
      if (p >= 0.55 && !latched) { latched = true; startVideo(); }
    };
    let dTick = false;
    const onDevelop = () => {
      if (!dTick) { dTick = true; requestAnimationFrame(() => { dTick = false; develop(); }); }
    };
    window.addEventListener("scroll", onDevelop, { passive: true });
    window.addEventListener("resize", onDevelop, { passive: true });
    develop();
  }

  // --- wayfinding rail: a thin brass line in the left gutter that fills as you scroll ---
  if (window.matchMedia("(min-width: 1240px)").matches) {
    const fill = document.querySelector(".wayfinder-fill");
    if (fill) {
      root.classList.add("rail-on");
      let rTick = false;
      const updateRail = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const prog = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
        fill.style.transform = `scaleY(${prog.toFixed(4)})`;
      };
      window.addEventListener(
        "scroll",
        () => { if (!rTick) { rTick = true; requestAnimationFrame(() => { rTick = false; updateRail(); }); } },
        { passive: true }
      );
      window.addEventListener("resize", updateRail, { passive: true });
      updateRail();
    }
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
