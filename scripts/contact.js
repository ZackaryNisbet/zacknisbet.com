const COPY_RESET_DELAY = 1800;

async function copyText(value) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const field = document.createElement("textarea");
  field.value = value;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.opacity = "0";
  field.style.pointerEvents = "none";
  document.body.append(field);
  field.select();
  field.setSelectionRange(0, value.length);

  const copied = document.execCommand("copy");
  field.remove();
  if (!copied) throw new Error("Copy command was rejected");
}

/**
 * Footer year, the obfuscated email link, and contact-detail copy controls.
 */
export function initContact() {
  const year = document.querySelector("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  const link = document.querySelector("[data-email-link]");
  if (link) {
    const { user, domain } = link.dataset;
    if (user && domain) link.href = `mailto:${user}@${domain}`;
  }

  const resetTimers = new WeakMap();

  document.querySelectorAll("[data-copy-target]").forEach((button) => {
    button.addEventListener("click", async () => {
      const target = document.getElementById(button.dataset.copyTarget);
      const label = button.querySelector(".copy-button-label");
      const copyName = button.dataset.copyName || "value";
      const value = target?.textContent.trim();
      if (!target || !label || !value) return;

      const activeTimer = resetTimers.get(button);
      if (activeTimer) clearTimeout(activeTimer);

      try {
        await copyText(value);
        delete button.dataset.state;
        void button.offsetWidth;
        button.dataset.state = "copied";
        button.setAttribute("aria-label", `Copied ${copyName}`);
        label.textContent = "Copied";
      } catch {
        button.dataset.state = "error";
        button.setAttribute("aria-label", `Could not copy ${copyName}`);
        label.textContent = "Try again";
      }

      const timer = window.setTimeout(() => {
        delete button.dataset.state;
        button.setAttribute("aria-label", `Copy ${copyName}`);
        label.textContent = "Copy";
        resetTimers.delete(button);
      }, COPY_RESET_DELAY);
      resetTimers.set(button, timer);
    });
  });
}
