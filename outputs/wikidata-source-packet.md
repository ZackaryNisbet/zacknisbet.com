# Zack Nisbet Wikidata Source Packet

Prepared June 27, 2026.

## Status

- No existing Wikidata item was found for `Zack Nisbet`, `Zackary Nisbet`, or `Zackary Paul Nisbet` via Wikidata entity search.
- GitHub profile now uses the canonical tagline and website:
  - Name: `Zackary Paul Nisbet`
  - Bio: `Founder, Software Engineer, and Operator`
  - Website: `zacknisbet.com`
- Search Console Domain property is verified for `zacknisbet.com`.
- Sitemap is submitted and the homepage has been manually requested for indexing.

## Policy posture

Use a conservative living-person item. Wikidata is not a resume, press kit, or SEO page.

Relevant policy pages:

- https://www.wikidata.org/wiki/Wikidata:Notability
- https://www.wikidata.org/wiki/Wikidata:Living_people
- https://www.wikidata.org/wiki/Wikidata:Autobiography

Do not create or expand the item with promotional, unsourced, private, or current-job-search claims.

## Recommendation

Proceed with Phase 3 only after the Wikidata account has several legitimate non-self edits.

The source set is usable for a minimal item because Zack is identifiable across institutional, official franchise, local news, and profile sources. It is still not a strong celebrity/public-office type case, so the item should be sparse and strictly referenced.

## Item shell

- Label: `Zack Nisbet`
- Description: `American founder, software engineer, and operator`
- Aliases:
  - `Zackary Nisbet`
  - `Zackary Paul Nisbet`

## Candidate statements

Only add statements that can be supported by references.

| Statement | Value | ID | Use now? | Reference strategy |
| --- | --- | --- | --- | --- |
| instance of | human | `Q5` | Yes | Can be left unreferenced or referenced to institutional profile sources. |
| official website | `https://zacknisbet.com/` | `P856` | Yes | Reference the website itself. |
| occupation | entrepreneur | `Q131524` | Yes | Duke Fuqua, K9 Resorts, Patch/Chicago Tribune/Daily Herald coverage. |
| occupation | software engineer | `Q1709010` | Maybe | Add only if using a source that explicitly supports software/technical role, such as SUNY Poly plus GitHub as identifier context. |
| occupation | businessperson | `Q43845` | Maybe | Add only if entrepreneur is not broad enough. Avoid redundant occupation stuffing. |
| educated at | Fuqua School of Business | `Q2568866` | Yes | Duke Fuqua article. |
| educated at | SUNY Polytechnic Institute | `Q18155496` | Yes | SUNY Poly profile. |
| GitHub account | `ZackaryNisbet` | `P2037` | Yes | Identifier. |
| LinkedIn personal profile ID | `zacknisbet` | `P6634` | Yes | Identifier. |
| image | Commons file, after upload | `P18` | Later | Only after uploading an owned/licensed image to Wikimedia Commons. |

## Claims to avoid

- Residence or location.
- Citizenship unless independently needed and clearly sourced.
- Current job search or role-search status.
- Founder/investor status unless a non-self source directly supports it.
- Revenue, performance, audit, profitability, or internal business metrics.
- Full resume chronology.
- Promotional wording such as `visionary`, `leading`, `best`, `award-winning`, or similar.

## Reference properties

For every meaningful statement, add:

- `P854` reference URL.
- `P813` retrieved date.
- `P1476` title, when useful.
- `P123` publisher, when the publisher has a Wikidata item and it is easy to resolve.

## Best references to use first

1. Duke Fuqua article
   - URL: https://blogs.fuqua.duke.edu/duke-mms/2024/04/29/zackary-nisbet/from-fuqua-to-ceo-my-journey-to-becoming-a-franchisee
   - Title: `From Fuqua to CEO: My Journey to Becoming a Franchisee`
   - Use for: Fuqua education, entrepreneurship/franchisee context.
   - Caveat: This is institutional but autobiographical, so do not rely on it alone for notability.

2. SUNY Poly profile
   - URL: https://webapp.sunypoly.edu/stories/zackary-nisbet-23-network-and-computer-security-cybersecurity/
   - Title: `Zackary Nisbet '23 - Network and Computer Security: Cybersecurity`
   - Use for: SUNY Poly education and technical background.

3. K9 Resorts official article
   - URL: https://www.k9resorts.com/about-us/articles/news/k9-resorts-takes-flight-with-11-unit-agreement-in-los-angeles-marks-first-location-near-an-airport/
   - Use for: franchisee/operator context.
   - Caveat: Official company source, good for verification but weaker for independent notability.

4. Patch Deerfield
   - URL: https://patch.com/illinois/deerfield/ritz-carlton-dogs-set-open-first-il-location-deerfield
   - Use for: independent local coverage of K9 Resorts franchise context.

5. Chicago Tribune
   - URL: https://www.chicagotribune.com/2025/06/21/pet-hotel-ritz-carlton-dogs/
   - Use for: independent regional coverage of the K9 Resorts opening.
   - Caveat: May be paywalled or syndicated.

6. Daily Herald
   - URL: https://www.dailyherald.com/20250908/business/palatine-council-has-reservations-about-dog-resort/
   - Use for: independent local coverage of K9 Resorts expansion context.

7. Village of Deerfield meeting minutes
   - URL: https://www.deerfield.il.us/AgendaCenter/ViewFile/Minutes/_06272024-1113
   - Use for: municipal source support only if needed.
   - Caveat: Do not add address-level or location-sensitive details.

## Account warm-up edits

Before creating the self-related item, make 5-10 ordinary edits unrelated to Zack. Suitable edits:

- Add official website to a local business or organization that clearly lacks it.
- Add reference URLs to existing claims from official pages.
- Fix labels, descriptions, or aliases for non-controversial public entities.
- Add missing identifiers only when the match is obvious.

Avoid controversial biographies, living-person edits, politics, medical claims, and anything promotional during warm-up.

## Creation sequence

1. Create or log into a Wikidata account.
2. Make 5-10 normal, non-self edits.
3. Create the new item with only label, description, and aliases.
4. Add `P31: Q5`.
5. Add `P856: https://zacknisbet.com/`.
6. Add one education claim at a time, each with a reference.
7. Add one occupation claim at a time, each with a reference.
8. Add GitHub and LinkedIn identifiers.
9. Stop. Do not expand the item into a full resume.

## Post-creation checks

- Search the item label in Wikidata and Google after 24-72 hours.
- Keep the website schema `sameAs` list aligned once a Q-ID exists.
- Add the Wikidata URL to `sameAs` in `index.html` only after the item survives initial review.
- Do not remove the Search Console DNS TXT record.
