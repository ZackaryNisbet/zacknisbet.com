# Zack Nisbet Knowledge Panel Playbook

## Current execution status

Completed on June 27, 2026:

- Created the canonical local repository at `/Users/zacknisbet/Developer/zacknisbet.com`.
- Created the public GitHub repository: https://github.com/ZackaryNisbet/zacknisbet.com
- Connected the Vercel project to the GitHub repository and renamed the Vercel project to `zacknisbet-com`.
- Verified `zacknisbet.com` as a Google Search Console Domain property for `zacknisbet@gmail.com`.
- Added the Google Search Console TXT verification record in GoDaddy DNS. Do not remove this record.
- Submitted `https://zacknisbet.com/sitemap.xml` in Search Console. Status returned `Success` with 1 discovered page.
- Ran URL Inspection for `https://zacknisbet.com/`; Google reported `Discovered - currently not indexed`.
- Requested indexing for `https://zacknisbet.com/`; Search Console confirmed `Indexing requested`.
- Updated the public GitHub profile to include the canonical tagline and website.
- Prepared `outputs/wikidata-source-packet.md` for Phase 3.
- Completed Wikidata account warm-up with 5 legitimate non-self edits.
- Created the Wikidata person item: https://www.wikidata.org/wiki/Q140371357
- Added the Wikidata item to the website `Person.sameAs` schema.

Still pending:

- Update remaining public profiles to point to `https://zacknisbet.com/`, especially LinkedIn, Hugging Face, X, Rammenta, and K9-related pages.
- Run Google's rich result and structured data validation tools after Google recrawls.
- Upload a freely licensed headshot to Wikimedia Commons only if Zack wants the image to be reusable under Commons licensing.

## Canonical setup

1. Use `zacknisbet.com` as the canonical domain.
2. Redirect `zackarynisbet.com` and `www` variants to `https://zacknisbet.com/`.
3. Keep public name as `Zack Nisbet`.
4. Use `Zackary Nisbet` and `Zackary Paul Nisbet` as alternate names in schema and profile bios.
5. Use the tagline `Founder, Software Engineer, and Operator` everywhere.

## Website

The site in this workspace includes:

- `index.html` with `Person`, `WebSite`, `ProfilePage`, and `Organization` JSON-LD.
- `robots.txt` pointing to the sitemap.
- `sitemap.xml` with `https://zacknisbet.com/`.
- `llms.txt` with concise canonical facts.
- `vercel.json` redirects for `www.zacknisbet.com`, `zackarynisbet.com`, and `www.zackarynisbet.com`.
- `outputs/source-inventory.md` with the expanded public-source list, including Duke, SUNY Poly, K9 Resorts, PR Newswire, Franchising.com, Patch, citybiz, Chicago Tribune, Daily Herald, and Deerfield municipal records.

After deployment, run:

1. Schema.org validator: https://validator.schema.org/
2. Google Rich Results Test: https://search.google.com/test/rich-results
3. Google Search Console URL inspection for `https://zacknisbet.com/`
4. Request indexing for the homepage.

## Public profile cleanup

Set the same core line across LinkedIn, GitHub bio, Hugging Face bio, X, and any founder/product pages:

> Zack Nisbet is a founder, software engineer, and operator.

Use this short bio:

> Zack Nisbet is a founder, software engineer, and operator. He founded Rammenta, co-founded and operated a K9 Resorts franchisee group, and previously worked at Wolfspeed. Zack holds a Master of Management Studies from Duke University's Fuqua School of Business and a B.S. in Cybersecurity and Computer Science from SUNY Polytechnic Institute.

## Wikimedia Commons headshot

1. Use a headshot Zack owns or has written permission to license freely.
2. Upload to Wikimedia Commons as CC BY-SA 4.0 or another accepted free license.
3. Use a descriptive filename, for example `Zack Nisbet headshot 2026.jpg`.
4. Add it to the Wikidata person item as `P18`.

## Wikidata

Created item:

- https://www.wikidata.org/wiki/Q140371357

Current conservative statements:

- Instance of: human
- Name and alternate names
- Occupation: entrepreneur, software engineer
- Official website: `https://zacknisbet.com/`
- Education: Duke Fuqua, SUNY Polytechnic Institute
- GitHub account: `ZackaryNisbet`
- LinkedIn personal profile ID: `zacknisbet`

References added:

- Fuqua education: Duke Fuqua article.
- SUNY Poly education: SUNY Poly profile.
- Entrepreneur occupation: K9 Resorts article.

Do not expand this into a full resume. Add future claims only when a public source supports them.

## Watch period

After the site, redirects, schema, and Wikidata item are complete:

- Avoid rewriting the canonical facts for 5-6 weeks.
- Search `Zack Nisbet` weekly in a clean browser.
- Watch Search Console indexing and crawl status.
- If a panel appears, claim it through Google's `Claim this knowledge panel` flow.
