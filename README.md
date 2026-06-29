# zacknisbet.com

The canonical personal site for **Zack Nisbet** — founder, software engineer, and
operator. It doubles as the authoritative, crawlable source for the "Zack Nisbet"
entity (the thing a Google Knowledge Panel reads from), so it is built to be fast,
accessible, and machine-legible first.

It is deliberately **buildless**: hand-authored HTML, CSS, and vanilla JS, served
exactly as committed. No framework, no bundler. See
[ARCHITECTURE.md](ARCHITECTURE.md) for the reasoning.

## Stack

- **HTML / CSS / vanilla JS** — CSS split into cascade-ordered partials; JS as
  native ES modules (`type="module"`).
- **[Lenis](https://github.com/darkroomengineering/lenis)** for momentum scroll,
  loaded from a CDN and feature-detected (optional).
- **Vercel** for hosting (static; canonical-domain redirects + headers in
  `vercel.json`).

## Repo layout

| Path                   | What it is                                                               |
| ---------------------- | ------------------------------------------------------------------------ |
| `index.html`           | The page: `<head>` meta + JSON-LD entity graph, then the body.           |
| `styles/`              | CSS partials (`tokens` → `base` → `layout` → components → `responsive`). |
| `scripts/`             | Browser ES modules (`main.js` is the entry point).                       |
| `tools/check-site.mjs` | Pre-deploy contract gate (SEO, a11y, DOM, JSON-LD).                      |
| `assets/`              | Images, logos, press media.                                              |
| `vercel.json`          | Hosting config: clean URLs, redirects, headers.                          |
| `docs/`                | [Product](docs/PRODUCT.md), [Design](docs/DESIGN.md), research notes.    |

## Prerequisites

- **Python 3** — for the static dev server (`npm run start`).
- **Node 18+** — for the checks and formatting (version pinned in `.nvmrc`).

## Local development

```sh
npm run start   # serves the repo at http://localhost:4173
```

Because there's no build, any edit is live on the next refresh.

## Quality checks

```sh
npm run check         # contract gate: JSON-LD entity graph, SEO meta,
                      # heading order, image alts, the DOM hooks the JS needs,
                      # and that every referenced file exists
npm run format        # Prettier (write)
npm run format:check  # Prettier (verify)
```

CI ([.github/workflows/ci.yml](.github/workflows/ci.yml)) runs `check` and
`format:check` on every push and pull request.

## Deployment

Production is **https://zacknisbet.com/**. `zackarynisbet.com`,
`www.zacknisbet.com`, and `www.zackarynisbet.com` redirect to the canonical apex
via `vercel.json`. Deploys are static — no build command — so the committed files
are what serve. Run `npm run check` before shipping.

## Docs

- [ARCHITECTURE.md](ARCHITECTURE.md) — how it's built and why (no-build rationale,
  the progressive-enhancement contract, the travel dock, the entity layer).
- [docs/PRODUCT.md](docs/PRODUCT.md) — what the site is for and who it serves.
- [docs/DESIGN.md](docs/DESIGN.md) — the visual system; tokens in `styles/tokens.css`.
- [docs/research/](docs/research/) — knowledge-panel research notes (working material).
- [llms.txt](llms.txt) — a machine-readable summary for LLMs.

## License

All rights reserved — source-visible, not open source. See [LICENSE](LICENSE).
