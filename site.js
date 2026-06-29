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
