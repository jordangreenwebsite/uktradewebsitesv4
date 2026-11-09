# UK Trade Websites — Blog Publishing Guide

## Current implementation (2026-11-09)
- Index: `/blog/` → `src/pages/blog/index.astro`
- Articles: `/blog/<filename-without-md>/` → `src/pages/blog/[slug].astro`
- Markdown posts: `src/content/blog/*.md`
- Validation: `src/content.config.ts`
- Navigation: **About** dropdown → About Us, Contact Us, Blog (desktop and mobile).
- Astro builds the pages statically and adds them to the sitemap. Posts use canonical URLs, BlogPosting JSON-LD, relevant page titles and descriptions.

## Add an article
Create a **new** lowercase, hyphenated Markdown filename in `src/content/blog/`, for example `how-to-show-your-roofing-work.md`.

Use this frontmatter:

```yaml
---
title: "How to Show Your Roofing Work on Your Website"
description: "A useful and distinctive search-result description, ideally about 120–155 characters, explaining what this article teaches UK roofing businesses."
summary: "A concise one- or two-sentence introduction for the blog listing card."
category: "Website planning"
date: 2026-11-09
---
```

Write the article with Markdown headings (start sections at `##`, not `#` because the template supplies the article's single H1), paragraphs, links and lists. The filename becomes the article slug. Use an `updated:` date only when a published article receives a material revision.

Run `npm run build` in the `astro` folder before publishing. Review the site at desktop and mobile width and verify that article links work. Cloudflare deployment must be checked separately from successful GitHub CI.

## Editorial standards
- Prioritise real questions from UK tradespeople: what to show on service pages, how to handle quote requests, why local customers search for a trade, how to choose useful website features.
- Write actionable, distinctive advice. Avoid generic filler, clickbait, keyword repetition or unsupported rankings/performance claims.
- Check claims that could change (laws, pricing, Google features, standards). Note whether something is an example or based on measured evidence.
- Keep brand and business facts accurate. Never invent testimonials, photos of completed work, customer results, accreditations or case study figures.
- Include natural links to relevant service pages or our work when they genuinely help. No artificial link stuffing.
- If using images, confirm rights and source; optimise and self-host when practical, with descriptive alt text.
- Draft articles for human approval before a new ongoing content automation is activated. **No automatic blog publisher is installed by this change.**
