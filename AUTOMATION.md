# Weekly automation (Hermes Agent)

This doc is the checklist for the recurring job that keeps the site current.
Runs every 3 days. Each run should end with one new commit to this repo
containing one new `.md` file per new prize entry, pushed to GitHub —
Cloudflare Pages picks up the push and redeploys automatically.

## 1. Scrape smacre.jp

Three kinds of posts to pull, matching `sourceType` in the schema:

- **`prediction`** — the weekly "重心予測" post (e.g. "重心予測（2026年8月第5週）").
  This is the main one; check for a new post every run.
- **`technique`** — posts filed under a capture-technique category
  (橋渡し, 末広がり, 剣山, and others). Pull any new posts since the last run.
- **`case_study`** — older 攻略ケース posts. These can be backfilled more
  slowly since they're not time-sensitive; a few per week is fine.

For each post, grab: title, publish date, figure/box size and weight if
given, the technique category, and the raw Japanese description of where the
weight sits. Keep the original post URL — it's required (`sourceUrl`) and
shown on every entry page as an attribution link.

## 2. Translate

Translate the title and the weight-distribution description into English
and Simplified Chinese. Use the DeepSeek tokens already set up for the
Chiikawa site. Keep translations close to the source rather than
embellishing — these are read as practical instructions, not marketing copy.

## 3. Generate the targeting summary

This is the one field that's AI-written rather than translated: a short
paragraph (2–4 sentences) explaining, in plain terms, where to aim the claw
and which direction to push for a hashi-watashi (or other technique)
attempt, based on the translated weight-distribution text. Write one version
in English (`summaryEn`) and one in Simplified Chinese (`summaryZh`). If
multiple posts report the same figure with consistent findings, say so and
mark confidence `"high"`; if it's a single report or plush/soft-prize case
with no fixed center of gravity, mark it `"low"` and say that explicitly
rather than inventing false precision.

## 4. Estimate the center-of-gravity coordinates

`centerOfGravity.x` / `.y` are percentages (0–100) locating the weight
inside the box, top-left origin. There's no exact source for this number —
estimate it from the described position (e.g. "1.5–2cm in from the front,
2.5cm down from the top" on a 15×14cm box maps to roughly x≈15, y≈18). Set
`zoneRadius` larger when the source describes more play/variation between
individual boxes, smaller when it's tightly consistent. Set `pushDirection`
only when the source clearly implies a push direction; leave it unset
otherwise.

## 5. Attach the photo

If the source post has a photo of the prize, set `imageUrl` to that image's
direct URL and `imageCredit` to a short attribution string (e.g. "Photo via
smacre.jp"). Leave both fields out entirely if there's no photo on the
source post — the site handles a missing image fine, don't substitute a
stock or unrelated image. Don't rehost/re-upload the image yourself unless
told to; linking directly to the source URL is the default.

## 6. Write the file

One markdown file per entry in `src/content/prizes/`, filename pattern
`YYYY-Www-slugified-title.md`, matching the shape of the three example
entries already in that folder. Fields are validated against
`src/content.config.ts` — a build will fail loudly if a required field is
missing or a value doesn't match the schema, which is deliberate: better to
catch a bad scrape at build time than publish a wrong target zone.

## 7. Commit and push

Commit message convention: `add: <week label> — <count> new entries`. Push
to `main`; Netlify handles the rest.

## Open items to sort out before the first real run

- Confirm smacre.jp doesn't rate-limit or block repeated weekly requests —
  it's a normal WordPress site so this is unlikely, but worth a light touch
  (a few seconds between requests) rather than hammering it.
- Decide how far back to backfill `case_study` posts, and at what pace.
- Double-check translations occasionally against the original — DeepSeek is
  good but not perfect on gaming slang and figure-name transliteration.
