# Centre Pullz

A bilingual (EN / 简体中文) database of crane-game (UFO catcher) prize
weight-distribution and centre-of-gravity measurements, compiled from
[Merry☆An (@6eS8Jm4YNJpPA2D)](https://x.com/6eS8Jm4YNJpPA2D) on X.

Each entry records figure size, box weight, box size, and the measured
centre-of-gravity position (depth / height / lateral), plus the post's own
remarks (individual differences, how far the figure moves inside the box) and
an AI-written play suggestion grounded in those measurements.

Live at <https://centre-pullz.omochanochachacha11.workers.dev> (Cloudflare
Workers; redeploys automatically on push to `main`).

## Stack

- [Astro](https://astro.build) — static output, no client framework
- Content collections (`src/content.config.ts`) — one markdown file per prize,
  schema-validated at build time, so a malformed entry fails the build
- `@astrojs/sitemap` — sitemap generated at build

## Structure

```
src/
  site.ts                 # contact email, ad flag, legal "last updated" date
  content.config.ts       # schema for a prize entry
  content/prizes/*.md     # one file per entry — this is the database
  components/
    PrizeCard.astro       # large card (home page)
    PrizeRow.astro        # compact row (database page)
  layouts/Layout.astro    # head, nav, footer
  pages/
    index.astro           # landing page — hero, latest 6, makers
    database.astro        # full searchable/filterable list
    guide.astro           # beginner explainer + FAQ schema
    about.astro
    privacy.astro
    terms.astro
    404.astro
    prizes/[...slug].astro
public/
  _headers                # security headers + asset caching (Cloudflare)
  robots.txt
```

## Search

`database.astro` renders every entry server-side, then filters client-side by
toggling `hidden` on each row. That keeps the whole database in the raw HTML —
which matters, since most AI/search crawlers execute little or no JavaScript.

It's linear over the DOM, which is fine into the hundreds of rows. Past roughly
500 entries, paginate or move the index into a fetched JSON file.

## Before turning on ads

`src/site.ts` holds the switches:

1. Set `contactEmail` — AdSense and most privacy laws expect a reachable
   contact. The about/privacy/terms pages render it automatically once set.
2. Set `hasAds: true` — this swaps the Privacy Policy's advertising section from
   "no ads" to the cookie/personalisation disclosure.
3. Add `public/ads.txt` with your real publisher ID.
4. Extend the CSP in `public/_headers` — the current policy is `script-src
   'self'`, which will block ad tags until Google's domains are allowed.

## Local development

```
npm install
npm run dev
```

## Adding an entry by hand

Copy any file in `src/content/prizes/` and fill in the fields. The build fails
with a clear error if anything required is missing or malformed, since
`src/content.config.ts` validates every entry. Filenames are
`YYYY-Www-slugified-title.md` where the week is the ISO week of `publishedAt`
(JST).

Automated collection is documented in [AUTOMATION.md](AUTOMATION.md).

## Prize photos

Each entry's thumbnail is the **manufacturer's** official product image
(Banpresto / Furyu / Sega / Taito / …), hot-linked from their own site — never
re-uploaded. The credit line names the manufacturer and its domain. Diagrams are
Merry☆An's own annotated photographs, credited per entry.
