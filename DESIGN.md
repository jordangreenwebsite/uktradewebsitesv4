# UK Trade Websites — Design Specification

Last inspected: 6 November 2026.
Authoritative repository: `jordangreenwebsite/uktradewebsitesv4`.
Live design reference: https://uktradewebsites.co.uk/
Implementation: `astro/` is a new independent Astro static website, initially hosted in this branch only. The WordPress/Breakdance/Simply Static export at the repository root remains untouched as rollback.

## Mission

Preserve the existing recognisable visual identity, information, homepage sections, page slugs, contact workflow and published pricing. Replace the export pipeline with reusable Astro code, without importing WordPress themes or Breakdance scripts. When adding a page, modify only what the feature requires.

## Existing brand design tokens (verified in exported global-settings.css)

| Purpose | Value |
| --- | --- |
| Dark navy / primary | `#1E3A5F` |
| Blue heading / secondary | `#4A6FA5` |
| Orange CTA / accent | `#FF8C42` |
| Pale site background | `#F5F7FA` |
| Main text | `#1A1A1A` |
| Body | Open Sans, 16px mobile / 17px laptop and desktop |
| Headings | Montserrat |
| Homepage intro accent | Alice serif |
| Optional decorative type | Caveat |
| Original content max width | 1120px |
| Original base section spacing | 100px vertical / 20px horizontal |
| Form | navy translucent panel, orange heading and orange send button |
| Header | logo, navigation, WhatsApp CTA; hidden while scrolling down and revealed on scroll up; scrolled orange background at 50% opacity |

Astro tokens are in `astro/src/styles/global.css`. Do not introduce different brand colours or fonts without a specific user request.

## Core site navigation

- `/` Home
- `/example-websites/` Existing client websites and clearly labelled demo concepts
- `/our-process/`
- `/about-us/`
- `/contact-us/`
- `/pricing/` — separate indexable pricing and FAQ landing page, plus a highlighted link within the Trade Websites dropdown
- `/privacy-policy/`
- Trade Websites dropdown: all ten `/websites-for-.../` pages, available by keyboard and mobile accordion
- `/thank-you/` (exclude from indexing)

Homepage structure: hero and dark contact form; supported trades and features; three aligned price cards (Starter, Trade Growth, No Upfront), an immediate separate white floral Prunus Media referral with the retained authentic logo, SEO-hosting inclusion; portfolio previews, agency relationship and CTA/footer.

## Business data

- Single source of truth: `astro/src/data/site.ts`
- Starter Website: 1–5 pages, £149 upfront + £39/month for standard hosting/technical upkeep, 12-month minimum term.
- Trade Growth Website: 5–9 pages, £249 upfront + £39/month for standard hosting/technical upkeep, 12-month minimum term; five-page enquiries may be quoted in Starter or Growth depending on design and scope.
- No Upfront Website: template-led 5–9-page build with client-provided content, £0 upfront + £65/month for the first 12 months, then £39/month hosting. The first year is £780 versus £717 for upfront Growth.
- Ongoing SEO is £195/month and includes standard £39/month website hosting while SEO remains active. The pricing offer shows the separate £39/month fee struck out, followed by free standard hosting and concise supporting terms. If a customer is financing the no-upfront build, the £26/month build-cost component remains due through month 12.
- Projects with 10+ pages or bespoke requirements are referred to Prunus Media. No separate Lead Generation Website package.
- Preserve package wording until owner requests changes. Do not invent warranties, ratings, customer counts or testimonials.
- Formspree endpoint is kept from the exported site (check live delivery before switching).
- WhatsApp is normalised to wa.me and the form thank-you redirect uses `.co.uk`.
- Preserve existing factual attribution of UK Trade Websites to Prunus Media; these are different businesses/brands and must not share pricing or implementation.

## Reusable Astro components

- `BaseLayout.astro`: document head, canonical URLs, Open Graph, Twitter tags, Organization and WebSite schema.
- `Header.astro`, `Footer.astro`: consistent menus, brand and CTAs.
- `ContactForm.astro`: one maintained form.
- `Pricing.astro`: data-driven package cards.
- `PortfolioCard.astro`: images and concept/client labels.
- `TradeLanding.astro`: trade-specific SEO layout with a single shared visual design.
- `src/data/trades.ts`: unique trade names, services and descriptions for the ten new pages.
- `src/data/trade-seo.ts`: per-trade primary search intent, unique title/meta description and useful supplementary copy.

## November 6 SEO offer and arrow typography

- The navy SEO banner presents ongoing SEO at £195/month, visibly strikes through the otherwise £39/month hosting fee, and states free standard hosting while SEO remains active.
- Keep the explanation short: no-upfront website build repayments of £26/month still apply for the first 12 months.
- Portfolio CTAs and other site arrows use plain text arrows (such as → and ↓), not emoji-style ↗ or ⬇. Use the `text-arrow` CSS class to force typographic rendering.
- The general pricing small print is concise, while retaining clear exclusions for ongoing SEO, domain renewals, unlimited edits, and paid tools.

## November 6 pricing and mobile correction

- Three UK Trade website offers appear as equal-width, centred cards in one desktop row and stack in the same order on narrow screens: Starter, Trade Growth, No Upfront.
- The Prunus Media referral appears immediately below the three offers as its own white panel with floral linework, a retained real logo asset and an external link to prunusmedia.com. SEO hosting is a separate band below.
- Starter is 1–5 pages (not 1–3); Growth is 5–9, with five-page builds scoped according to complexity.
- The mobile navigation panel is positioned relative to the complete header inner container rather than the narrow hamburger element so that it cannot extend beyond the left edge of the phone.
- Browser QA now measures opened-menu viewport bounds, equal desktop card sizing and grid centring, three-card mobile stacking, referral placement and presence of the actual logo. Visual checks should cover both homepage and pricing routes.

## November 6 audit and visual refinements

- Header primary links and "Trade Websites" have matched font weight, with a centrally aligned desktop menu and dark hover contrast over the 50%-opaque orange scroll header.
- Homepage hero keeps the working contact form on the right and sales copy on the left, with more reliable responsive balance and extra clearance below the overlapping header.
- Contact hero leaves enough top space for the WhatsApp button and form, while the Home, Contact, About and trade-page orange wave shapes taper instead of ending abruptly.
- New trade-page hero headings are larger Montserrat with more legible introductory text. Established core-page styling remains otherwise unchanged.
- The About photo no longer has a visible "Jordan & Mikie" caption (descriptive image alt text remains).
- The four pricing selections use `#package=...` anchors, not crawler-visible query strings; the form still accepts legacy `?package=...` links. This avoids audit-reported duplicate crawl URLs without losing plan preselection.
- Public Organization schema includes verified UK-wide areaServed and the published email/WhatsApp sales contact point. Do **not** fabricate an address, LocalBusiness classification, phone call availability, business hours, ratings or official social profiles.
- `/robots.txt` is a public allow-all text file with a sitemap declaration. Cloudflare has an explicit text/plain header. Browser and build checks cover core SEO, menu and hero overlap.
- The HTTPS portfolio link to PawPrints/Cotswold Pawprints replaces its insecure HTTP predecessor.
- Concept/demo previews are not promoted above the lead form until meaningful, working demo destinations are ready.

## SEO and technical rules

- Use full canonical addresses on https://uktradewebsites.co.uk (not `.local` or `.com`).
- Every page must have one H1, unique page title and relevant meta description.
- Generated XML sitemap from @astrojs/sitemap; `robots.txt` points to it.
- Schema only for truthful facts: Organization, WebSite, WebPage, and Service on trade pages. Never fabricated reviews or LocalBusiness addresses.
- Existing slugs are retained; the ten new `/websites-for-.../` pages use meaningful industry-specific service descriptions.
- Give meaningful images descriptive alt text, explicit dimensions, loading hints. Keep originals in the source repository for this migration.
- Avoid stuffing area names and repeating trade keywords; connect homepage and trade pages through internal links.
- Do not use meta-keywords: Google ignores that tag. Use unique, natural HTML titles, descriptions and relevant page text.
- Provide Organization, WebSite, WebPage, Service and BreadcrumbList JSON-LD with only verifiable properties.
- Each trade page appears in the desktop dropdown, nested mobile menu and homepage trade links; friendly shortcut slugs 301 redirect to the canonical URL.
- GitHub Actions runs Astro build/static SEO QA and Playwright navigation checks on main.
- Do not use noindex on public service pages. Keep thank-you and 404 noindexed.
- Do not add broken or placeholder navigation links.

## Pages and examples

The portfolio includes real clients and demo concepts. Don't represent demo sites as commissioned jobs. Any additional example websites should have separate deploys and be explicitly labelled as demonstrations until bought or approved.

## Release gates

1. Build from repo checkout: `cd astro && npm install && npm run build`.
2. The automated build checks the existing pages, ten trade pages, sitemap, canonicals, missing assets and legacy references.
3. Compare desktop (e.g. 1440px) and mobile (e.g. 390px) screenshots against the current live site. The intent is fidelity, but a visual review is still necessary to verify exact correspondence.
4. Verify both upfront tiers, the no-upfront option and Formspree submission/thank-you flow in a non-production preview.
5. Verify external examples and the navigation, privacy policy, noindex and indexing.
6. Configure Cloudflare Pages with root directory `astro`, build `npm run build`, output `dist` (from root directory).
7. Do not switch the production domain until preview accepted. Keep legacy checkout / deployment settings as fallback.

This specification is a reference; it does not certify that visual and functional acceptance testing has passed.
