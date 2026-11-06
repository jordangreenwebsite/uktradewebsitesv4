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
- `/privacy-policy/`
- Trade Websites dropdown: all ten `/websites-for-.../` pages, available by keyboard and mobile accordion
- `/thank-you/` (exclude from indexing)

Homepage structure: hero and dark contact form; supported trades and features; three paid-upfront price cards; no-upfront plan; agency relationship; portfolio previews; why a trade website matters; what makes the sites different; CTA/footer.

## Business data

- Single source of truth: `astro/src/data/site.ts`
- Starter Website: £149 upfront + £39/month, 12-month contract.
- Trade Growth Website: £249 upfront + £59/month, 12-month contract.
- Lead Generation Website: £399 upfront + £99/month, 12-month contract.
- Trade Growth no-upfront: £79/month, 12-month contract.
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
4. Verify all four pricing plans and Formspree submission/thank-you flow in a non-production preview.
5. Verify external examples and the navigation, privacy policy, noindex and indexing.
6. Configure Cloudflare Pages with root directory `astro`, build `npm run build`, output `dist` (from root directory).
7. Do not switch the production domain until preview accepted. Keep legacy checkout / deployment settings as fallback.

This specification is a reference; it does not certify that visual and functional acceptance testing has passed.
