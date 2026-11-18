# Mikie's concept homepage area

**Decision:** 16 November 2026. This repository is the existing UK Trade Websites Astro site. Its regular pages, SEO, pricing, blogs, site components and hosting configuration are NOT Mikie's editing area.

## Allowed working directory

Mikie may create and revise ONLY her own prospect concepts inside:

`astro/public/concept-websites/<prospect-slug>/`

Example source:
`astro/public/concept-websites/rennco/index.html`

Intended public URL after a successful Cloudflare production deployment:
`https://uktradewebsites.co.uk/concept-websites/rennco/`

Each concept must be independent and self-contained:
- `index.html` holds a complete, responsive, professional homepage.
- Put additional images, CSS, or scripts inside that same prospect's subfolder.
- Use straightforward lowercase, hyphenated slugs. Never overwrite another person's existing concept.
- Keep the page a static sales concept, not a new main-site Astro route.
- No changes to `astro/src/`, `astro/astro.config.mjs`, `astro/public/_headers`, `astro/public/_redirects`, `.github/`, or any code outside the owned concept folder.
- To propose changes elsewhere, ask Jordan; do not carry them out.

## Sales and brand standard

Both authorised brands may use this isolated concept area. The registered prospect brand selects the appropriate default catalogue.

Each concept:
1. Is an outstanding, polished, mobile-first homepage based on the specific prospect and their real services. Use accurate UK English, one specific, useful SEO H1, fast-loading imagery, clear service value and visible contact/purchase calls to action.
2. Has a top disclosure: **Prepared by UK Trades & Prunus Media** and **Website concept only — not the business's official website**.
3. Uses authentic prospect-approved photos if available. Otherwise use licensed illustrative imagery and identify it as illustrative. Never invent jobs, reviews, awards, credentials or business contact details.
4. Includes `<meta name="robots" content="noindex,nofollow,noarchive">` inside `<head>`. The site also provides scoped `X-Robots-Tag` headers for `/concept-websites/*`; do not remove either control. Do not put concept URLs in navigation, XML sitemaps, or public portfolio listings without Jordan's approval.
5. Every sales CTA, logo and prospect-facing menu link MUST target the personalised shared checkout: `https://prunusmedia.com/buy-now/?concept=<exact-folder-slug>`. Example: JSE uses `https://prunusmedia.com/buy-now/?concept=jse-window-cleaning`. Never use the UK Trades homepage, WhatsApp or the prospect's actual contact links as the sales destination, even if an old copied prompt says otherwise. Preserve genuine in-page controls, internal demo navigation when specifically requested and licence attribution links. The authorised maintainer registers each exact concept URL in the shared portal, verifies the personalised quote and enabled plans, and confirms deployment before sales outreach. Mikie can build/revise within her concept folder; she does not edit the portal or Stripe.
6. Leaves existing published UK Trade Websites homepage, styles, menus, prices, forms, SEO and all other code untouched. No direct editing of the prospect's current live website.
7. Is tested at narrow/mobile and desktop widths; check all images, links and buttons before sharing.
8. Is committed/updated in its own concept subfolder, followed by verified deployment. Never claim a live link solely from a GitHub commit. Jordan receives a concise handover with prospect, source, link, CTA destination, assets/licences and any missing facts.

## Important access limitation

This document is an **editing policy**, not a GitHub permission boundary. A normal GitHub collaborator with `write` permissions can technically edit the entire repository. To enforce protection, Jordan must configure protected `main` plus PR review/required checks or an equivalent isolated submission process. Until such protection is enabled, Mikie should **submit concept-only pull requests for Jordan to review**, and the AI must refuse to edit outside her concept folder.

The `astro/public/` directory is copied into Astro's static build, so a new `concept-websites/<slug>/index.html` can become a clean public path without editing existing Astro pages. The concept URLs are omitted from Astro's generated sitemap because they are not Astro page routes.

## Sharing previews (18 November 2026)
Every concept must have a personalised Open Graph title, description, absolute OG image URL, image dimensions/alt text and Twitter large-image card. Use a 1200 × 630 JPEG featuring the actual approved prospect logo and/or licensed imagery and its business name; clearly label it a website concept, not their official site. Use `share.jpg` in the concept folder for an approved custom 1200 × 630 image. The production build automatically generates a branded fallback share-preview.jpg and complete metadata for every existing and future concept (including nested demo routes). Do not hotlink the social preview itself. Keep the existing noindex/nofollow rules and purchase links. Verify published image and metadata before sharing; preview display depends on the receiving app and its cache.
