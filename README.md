# Center Pull

A database of crane-game (UFO catcher) prize weight-distribution /
center-of-gravity measurements, compiled from
[Merry☆An (@6eS8Jm4YNJpPA2D)](https://x.com/6eS8Jm4YNJpPA2D) on X and
translated into English and Simplified Chinese.

Each entry records the figure size, box weight, box size, and the measured
center-of-gravity position (depth / height / lateral), plus the post's own
remarks (individual differences, how much the figure moves in the box).

## Stack

- [Astro](https://astro.build) — static site
- Content collections (`src/content.config.ts`) — one markdown file per
  prize entry, schema-validated at build time
- Live at <https://centre-pullz.omochanochachacha11.workers.dev> (Cloudflare
  Workers; deploys automatically on push to `main`)

## Structure

```
src/
  content.config.ts       # schema for a prize entry
  content/prizes/*.md     # one file per entry — this is the database
  components/
    PrizeCard.astro       # card used in the list
  layouts/Layout.astro
  pages/
    index.astro           # the database (all entries, newest first)
    prizes/[...slug].astro
```

## Prize photos

Each entry's thumbnail is the **manufacturer's** official product image
(Taito / Sega / Banpresto / etc.), linked directly — never re-uploaded. The
credit line names the manufacturer and its site.

## Local development

```
npm install
npm run dev
```

## Adding an entry by hand

Copy one of the existing files in `src/content/prizes/` and fill in the
fields — the build fails with a clear error if anything required is missing,
since `src/content.config.ts` validates every entry.
