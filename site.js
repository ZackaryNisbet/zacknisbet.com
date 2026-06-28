const year = document.querySelector("#year");

if (year) {
  year.textContent = String(new Date().getFullYear());
}

const emailLink = document.querySelector("[data-email-link]");

if (emailLink) {
  emailLink.addEventListener("click", (event) => {
    event.preventDefault();
    const user = emailLink.dataset.user || "";
    const domain = emailLink.dataset.domain || "";
    if (user && domain) {
      window.location.href = `mailto:${user}@${domain}`;
    }
  });
}

const meter = document.querySelector(".scroll-meter");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const updateMeter = () => {
  if (!meter) return;

  const max = document.documentElement.scrollHeight - window.innerHeight;
  const progress = max > 0 ? window.scrollY / max : 0;
  meter.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
};

updateMeter();
window.addEventListener("scroll", updateMeter, { passive: true });
window.addEventListener("resize", updateMeter);

if (!reducedMotion.matches) {
  document.documentElement.classList.add("motion-ok");

  const revealItems = document.querySelectorAll(
    ".section-intro, .role-card, .system-card, .skill-cloud span, .education-grid article, .press-card, .contact-copy"
  );

  revealItems.forEach((item, index) => {
    item.dataset.reveal = "";
    item.style.animationDelay = `${Math.min(index % 6, 5) * 42}ms`;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.08
    }
  );

  revealItems.forEach((item) => observer.observe(item));
}
