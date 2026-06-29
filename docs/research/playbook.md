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
- Created the Wikidata person item: `Q140371357`.

Completed on June 28, 2026:

- Uploaded the headshot to Wikimedia Commons: https://commons.wikimedia.org/wiki/File:Zack_Nisbet_headshot_July_2023.jpg
- Published it under CC BY-SA 4.0 with source/author attribution to Fuqua School of Business.
- Updated website `Person.image` schema to point at the Commons-hosted headshot.
- Removed the deleted Wikidata item from website `Person.sameAs` schema.
- Confirmed the Wikidata item `Q140371357` was deleted on June 28, 2026 because it did not meet Wikidata notability review.
- Cleaned up the about.me profile at https://about.me/zacknisbet with canonical bio, website CTA, and links to GitHub, LinkedIn, Hugging Face, and X.
- Added the about.me profile to website `Person.sameAs` schema.
- Verified `zackarynisbet.com`, `www.zackarynisbet.com`, and HTTP variants redirect to `https://zacknisbet.com/`.
- Updated the X profile at https://x.com/ZackNisbet with canonical bio, broad location, and website link.
- Updated the Hugging Face profile at https://huggingface.co/zacknisbet with website, AI/ML interests, GitHub, LinkedIn, and X links.
- Corrected the canonical Hugging Face profile URL to https://huggingface.co/zacknisbet in website schema and about.me.

Still pending:

- Update remaining public profiles to point to `https://zacknisbet.com/`, especially Rammenta and K9-related pages.
- Run Google's rich result and structured data validation tools after Google recrawls.
- Send the required Wikimedia Commons permission email for the headshot if Commons requests VRT confirmation.
- Gather stronger independent, non-self sources before attempting Wikidata again or requesting undeletion.

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

Uploaded file:

- Commons page: https://commons.wikimedia.org/wiki/File:Zack_Nisbet_headshot_July_2023.jpg
- Direct image URL: https://upload.wikimedia.org/wikipedia/commons/a/a6/Zack_Nisbet_headshot_July_2023.jpg
- Filename: `Zack Nisbet headshot July 2023.jpg`
- License: CC BY-SA 4.0
- Source: Fuqua School of Business headshot session, July 2023; uploaded with permission to license under CC BY-SA 4.0.
- Author/credit: Fuqua School of Business.

Commons currently marks the file as permission pending as of June 28, 2026. If Wikimedia Commons asks for confirmation, the creator or authorized rights holder should email written consent to `permissions-commons@wikimedia.org`. If that permission is not confirmed, Commons may delete the image.

## Wikidata

Created item, now deleted:

- Deleted item: https://www.wikidata.org/wiki/Q140371357
- Deletion log: https://www.wikidata.org/wiki/Special:Log?type=delete&page=Q140371357

The item was deleted on June 28, 2026 by a Wikidata administrator for not meeting the notability policy. The website schema no longer points to this deleted item.

Do not immediately recreate the item. The next Wikidata path is:

- Build more independent, non-self source coverage.
- Keep the website, GitHub profile, LinkedIn, and public company/profile pages aligned around the same canonical identity.
- Consider an undeletion request or fresh item only after the source base is stronger and less self-promotional.

Do not expand this into a full resume. Add future claims only when a public source supports them.

## Watch period

After the site, redirects, schema, Search Console, and Commons image are complete:

- Avoid rewriting the canonical facts for 5-6 weeks.
- Search `Zack Nisbet` weekly in a clean browser.
- Watch Search Console indexing and crawl status.
- If a panel appears, claim it through Google's `Claim this knowledge panel` flow.
