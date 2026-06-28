const root = document.documentElement;
const motionOK = root.classList.contains("motion");
const finePointer = root.classList.contains("fine");

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

// --- scroll progress meter (always) ---
const meter = document.querySelector(".scroll-meter");
const updateMeter = () => {
  if (!meter) return;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const progress = max > 0 ? window.scrollY / max : 0;
  meter.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
};
updateMeter();

// =====================================================================
// Everything below is motion-only progressive enhancement.
// =====================================================================
if (motionOK) {
  root.classList.add("reveal-ready");

  // --- reveal on scroll (no flash: elements start hidden via CSS) ---
  const revealItems = document.querySelectorAll(
    ".section-intro, .role-card, .system-card, .skills-section .skill-cloud, .education-grid article, .press-card, .contact-copy"
  );

  const groupIndex = new Map();
  revealItems.forEach((item) => {
    const parent = item.parentElement;
    const i = (groupIndex.get(parent) || 0);
    groupIndex.set(parent, i + 1);
    item.style.transitionDelay = `${Math.min(i, 5) * 70}ms`;
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-in");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
  );
  revealItems.forEach((item) => revealObserver.observe(item));

  // --- hero scroll choreography + atmosphere fade ---
  const hero = document.querySelector(".hero");
  const heroMedia = document.querySelector(".hero-media");
  const heroGrid = document.querySelector(".hero-grid");
  const atmosphere = document.querySelector(".atmosphere");
  const darkAct = document.querySelector(".dark-act");
  let ticking = false;

  const onScroll = () => {
    ticking = false;
    updateMeter();
    const vh = window.innerHeight;

    // dissolve the living backdrop as the dark act leaves the viewport
    if (atmosphere && darkAct) {
      const bottom = darkAct.getBoundingClientRect().bottom;
      const o = Math.max(0, Math.min(1, (bottom - vh * 0.15) / (vh * 0.85)));
      atmosphere.style.opacity = o.toFixed(3);
    }

    // hero parallax only while the hero is near the viewport
    if (hero) {
      const y = window.scrollY;
      const h = hero.offsetHeight || 1;
      if (y <= h + 140) {
        const prog = Math.min(1, y / h);
        if (heroMedia) heroMedia.style.transform = `translate3d(0, ${y * 0.18}px, 0) scale(1.06)`;
        if (heroGrid) {
          heroGrid.style.transform = `translate3d(0, ${y * 0.08}px, 0)`;
          heroGrid.style.opacity = String(Math.max(0, 1 - prog * 1.15));
        }
      }
    }
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(onScroll);
      }
    },
    { passive: true }
  );
  onScroll();

  // --- card spotlight (track cursor across dark cards) ---
  document.querySelectorAll(".role-card, .system-card").forEach((card) => {
    card.addEventListener(
      "pointermove",
      (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
        card.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
      },
      { passive: true }
    );
  });

  // --- momentum smooth scroll (Lenis, if it loaded) ---
  let lenis = null;
  if (window.Lenis) {
    lenis = new window.Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }

  // anchor links scroll smoothly (with or without Lenis)
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: -84 });
      else target.scrollIntoView({ behavior: "smooth" });
    });
  });

  // --- custom cursor + magnetic buttons (fine pointers only) ---
  if (finePointer) {
    const cursor = document.querySelector(".cursor");
    const dot = document.querySelector(".cursor-dot");
    const ring = document.querySelector(".cursor-ring");

    if (cursor && dot && ring) {
      root.classList.add("cursor-active");
      let mx = window.innerWidth / 2;
      let my = window.innerHeight / 2;
      let rx = mx;
      let ry = my;

      window.addEventListener(
        "pointermove",
        (e) => {
          mx = e.clientX;
          my = e.clientY;
          dot.style.setProperty("--x", `${mx}px`);
          dot.style.setProperty("--y", `${my}px`);
        },
        { passive: true }
      );

      const ringLoop = () => {
        rx += (mx - rx) * 0.18;
        ry += (my - ry) * 0.18;
        ring.style.setProperty("--x", `${rx}px`);
        ring.style.setProperty("--y", `${ry}px`);
        requestAnimationFrame(ringLoop);
      };
      requestAnimationFrame(ringLoop);

      const hoverSel = "a, button, [data-email-link], .role-card, .system-card, .press-card, .button-primary, .button-secondary";
      document.addEventListener("pointerover", (e) => {
        if (e.target.closest(hoverSel)) cursor.classList.add("is-hover");
      });
      document.addEventListener("pointerout", (e) => {
        if (e.target.closest(hoverSel) && !e.relatedTarget?.closest?.(hoverSel)) {
          cursor.classList.remove("is-hover");
        }
      });
      document.addEventListener("pointerdown", () => cursor.classList.add("is-down"));
      document.addEventListener("pointerup", () => cursor.classList.remove("is-down"));
    }

    // magnetic CTAs
    document.querySelectorAll(".button-primary, .button-secondary").forEach((btn) => {
      const strength = 0.32;
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        btn.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });
      btn.addEventListener("pointerleave", () => {
        btn.style.transform = "";
      });
    });
  }
} else {
  // reduced motion: keep the meter live, nothing else
  window.addEventListener("scroll", updateMeter, { passive: true });
}

window.addEventListener("resize", updateMeter);
