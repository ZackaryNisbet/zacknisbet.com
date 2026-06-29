/**
 * Footer year + obfuscated email link.
 *
 * The address is kept out of the static HTML (in `data-user` / `data-domain`)
 * to deter naive scrapers. On init we assemble a real `mailto:` href so the
 * control is a genuine, keyboard- and screen-reader-usable link rather than a
 * JS-only click handler.
 */
export function initContact() {
  const year = document.querySelector("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  const link = document.querySelector("[data-email-link]");
  if (!link) return;
  const { user, domain } = link.dataset;
  if (user && domain) link.href = `mailto:${user}@${domain}`;
}
