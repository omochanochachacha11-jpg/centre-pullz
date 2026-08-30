# Center Pull

A weekly-updated database of crane-game (UFO catcher) prize weight
distribution / center-of-gravity reports, translated from
[smacre.jp](https://smacre.jp/) into English and Simplified Chinese, with
short AI-written notes on where to target the claw for techniques like
hashi-watashi (橋渡し).

## Stack

- [Astro](https://astro.build) — static site
- Content collections (`src/content.config.ts`) — one markdown file per
  prize entry, schema-validated at build time
- Deployed via GitHub → Netlify (same setup as the Chiikawa site)
- Kept up to date weekly by Hermes Agent — see `AUTOMATION.md`

## Structure

```
src/
  content.config.ts       # schema for a prize entry
  content/prizes/*.md     # one file per entry — this is the database
  components/
    CogDiagram.astro      # the center-of-gravity target diagram
    PrizeCard.astro       # card used in the feed and database grid
  layouts/Layout.astro
  pages/
    index.astro           # homepage — this week's manifest
    database.astro        # full filterable database
    prizes/[...slug].astro
```

## Local development

```
npm install
npm run dev
```

## Adding an entry by hand

Copy one of the existing files in `src/content/prizes/` and fill in the
fields — the build will fail with a clear error if anything required is
missing or malformed, since the schema in `src/content.config.ts` validates
every entry. See `AUTOMATION.md` for how Hermes Agent should populate these
automatically.

## Deploying

Push to GitHub, connect the repo to Netlify (build command `npm run build`,
publish directory `dist`) — identical setup to the Chiikawa site.
