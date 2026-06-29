/**
 * Pre-deploy contract gate for zacknisbet.com.
 *
 * The site's job is to be a fast, crawlable, accessible entity source that feeds
 * a Google Knowledge Panel. This script fails the build if any of the contracts
 * that job depends on regress:
 *
 *   1. Structured data — the JSON-LD @graph parses and the Person node keeps its
 *      identity fields (name, alternateName, the canonical sameAs profiles).
 *   2. SEO essentials — canonical, viewport, and the Open Graph / Twitter tags.
 *   3. Accessibility — exactly one <h1>, no skipped heading levels, every <img>
 *      has an alt attribute, and a skip link exists.
 *   4. DOM contract — the hooks the browser modules query are present, so an
 *      HTML rename can't silently break the scripts.
 *   5. Referenced files exist — every stylesheet/script/asset the page links to.
 *
 * Zero dependencies; runs anywhere Node 18+ is available. Wired into CI.
 */
import { existsSync, readFileSync } from "node:fs";

const html = readFileSync("index.html", "utf8");
const failures = [];

/** Record a failure if `ok` is false. */
const check = (ok, message) => {
  if (!ok) failures.push(message);
};
const hasClass = (name) => new RegExp(`class="[^"]*\\b${name}\\b`).test(html);
const includesAll = (label, needles) =>
  needles.forEach((n) => check(html.includes(n), `${label}: missing \`${n}\``));

// 1. Structured data ---------------------------------------------------------
const ldMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
check(Boolean(ldMatch), "JSON-LD: <script type=application/ld+json> block not found");
if (ldMatch) {
  let graph;
  try {
    graph = JSON.parse(ldMatch[1]);
  } catch (err) {
    failures.push(`JSON-LD: does not parse — ${err.message}`);
  }
  if (graph) {
    const nodes = graph["@graph"] ?? [graph];
    const person = nodes.find((n) => n["@type"] === "Person");
    check(Boolean(person), "JSON-LD: no Person node in @graph");
    if (person) {
      check(person.name === "Zack Nisbet", "JSON-LD: Person.name is not 'Zack Nisbet'");
      check(Array.isArray(person.alternateName), "JSON-LD: Person.alternateName missing");
      const sameAs = person.sameAs ?? [];
      ["linkedin.com/in/zacknisbet", "github.com/ZackaryNisbet"].forEach((u) =>
        check(
          sameAs.some((s) => s.includes(u)),
          `JSON-LD: Person.sameAs missing ${u}`,
        ),
      );
    }
  }
}

// 2. SEO essentials ----------------------------------------------------------
includesAll("SEO", [
  '<link rel="canonical" href="https://zacknisbet.com/">',
  '<meta name="viewport"',
  '<meta property="og:title"',
  '<meta property="og:image"',
  '<meta property="og:url"',
  '<meta name="twitter:card"',
]);

// 3. Accessibility -----------------------------------------------------------
const h1Count = (html.match(/<h1[\s>]/g) ?? []).length;
check(h1Count === 1, `A11y: expected exactly one <h1>, found ${h1Count}`);
check(hasClass("skip-link"), "A11y: skip link is missing");

const headingLevels = [...html.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]));
let prev = 0;
headingLevels.forEach((level) => {
  if (level > prev + 1) {
    failures.push(`A11y: heading level jumps from h${prev} to h${level} (skipped a level)`);
  }
  prev = level;
});

const imagesWithoutAlt = (html.match(/<img\b[^>]*>/g) ?? []).filter((tag) => !/\salt=/.test(tag));
check(
  imagesWithoutAlt.length === 0,
  `A11y: ${imagesWithoutAlt.length} <img> without an alt attribute`,
);

// 4. DOM contract — selectors the browser modules query ----------------------
const requiredClasses = [
  "scroll-meter", // scroll-progress.js
  "site-header", // scroll-progress.js + travel-dock.js
  "hero-inner", // travel-dock.js (panel clearance)
  "news-reel", // travel-dock.js
  "news-stage", // travel-dock.js
  "news-video", // travel-dock.js
];
requiredClasses.forEach((c) =>
  check(hasClass(c), `DOM contract: .${c} not found (a script depends on it)`),
);
check(/id="year"/.test(html), "DOM contract: #year not found (contact.js)");
check(/data-email-link/.test(html), "DOM contract: [data-email-link] not found (contact.js)");

// 5. Referenced files exist --------------------------------------------------
const refs = [
  ...[...html.matchAll(/<link[^>]+href="(\/[^"]+\.css)"/g)].map((m) => m[1]),
  ...[...html.matchAll(/<script[^>]+src="(\/[^"]+\.js)"/g)].map((m) => m[1]),
];
refs.forEach((ref) =>
  check(existsSync(`.${ref}`), `Broken reference: ${ref} does not exist on disk`),
);
["sitemap.xml", "robots.txt", "favicon.svg"].forEach((f) =>
  check(existsSync(f), `Missing expected file: ${f}`),
);

// Report ---------------------------------------------------------------------
if (failures.length) {
  console.error(`✗ ${failures.length} check(s) failed:\n  - ${failures.join("\n  - ")}`);
  process.exit(1);
}
console.log("✓ Site checks passed.");
