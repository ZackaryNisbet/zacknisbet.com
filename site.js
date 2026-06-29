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

  // --- "In the news" clip: lazy play, then shrink + dock to a corner on scroll ---
  const reel = document.querySelector(".news-reel");
  const newsVideo = reel && reel.querySelector(".news-video");
  if (reel && newsVideo) {
    // lazy-load + play only while the clip is on screen
    if ("IntersectionObserver" in window) {
      const playObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              if (!newsVideo.src && newsVideo.dataset.src) newsVideo.src = newsVideo.dataset.src;
              const played = newsVideo.play();
              if (played && played.catch) played.catch(() => {});
            } else {
              newsVideo.pause();
            }
          });
        },
        { threshold: 0.12 }
      );
      playObserver.observe(reel);
    }

    // sticky shrink-to-corner dock (desktop + motion only)
    if (window.matchMedia("(min-width: 940px)").matches) {
      const spacer = document.createElement("div");
      spacer.className = "news-reel-spacer";
      reel.before(spacer);
      root.classList.add("float-news");

      const dismiss = document.createElement("button");
      dismiss.type = "button";
      dismiss.className = "news-dismiss";
      dismiss.setAttribute("aria-label", "Dismiss the clip");
      dismiss.textContent = "×";
      reel.appendChild(dismiss);

      const DOCK_W = 340;
      let homeH = 0;
      let mode = "home";
      let dismissed = false;
      let returnedAt = -1e9;

      const measure = () => {
        reel.classList.remove("floating");
        homeH = reel.offsetHeight;
        spacer.style.height = homeH + "px";
        reel.classList.add("floating");
      };

      const set = (w, top, left, anim) => {
        reel.classList.toggle("flip-anim", anim);
        reel.style.width = w + "px";
        reel.style.top = top + "px";
        reel.style.left = left + "px";
      };

      const contact = document.querySelector("#contact");

      const place = () => {
        if (dismissed) return;
        const r = spacer.getBoundingClientRect();
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        if (r.top > -homeH * 0.5) {
          // HOME: track the reserved slot exactly (animate briefly on return)
          if (mode !== "home") { mode = "home"; reel.classList.remove("docked"); returnedAt = performance.now(); }
          set(r.width, r.top, r.left, performance.now() - returnedAt < 720);
        } else {
          // DOCKED: corner player; hops to the left as contact comes up so it never covers it
          if (mode !== "docked") { mode = "docked"; reel.classList.add("docked"); }
          const dockH = (DOCK_W * 9) / 16;
          const toLeft = contact && contact.getBoundingClientRect().top < vh * 0.7;
          set(DOCK_W, vh - dockH - 26, toLeft ? 26 : vw - DOCK_W - 26, true);
        }
      };

      dismiss.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        dismissed = true;
        reel.style.display = "none";
        spacer.style.height = "0px";
        newsVideo.pause();
      });

      measure();
      place();

      let queued = false;
      window.addEventListener(
        "scroll",
        () => {
          if (!queued) {
            queued = true;
            requestAnimationFrame(() => { queued = false; place(); });
          }
        },
        { passive: true }
      );

      let resizeTimer;
      window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => { if (!dismissed) { measure(); place(); } }, 150);
      });
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
