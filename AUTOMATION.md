# Automation (Hermes Agent)

Recurring job that keeps the site current. Runs every 3 days. The site is a
bilingual (EN/ZH) database of Merry☆An's crane-prize center-of-gravity
measurements — no other source.

## 1. Harvest Merry☆An's measurement posts

Source: X account **@6eS8Jm4YNJpPA2D** (Merry☆An). All pipeline is free, no
paid X API.

1. **Collect tweet IDs** — browser tool (logged-in Chrome): open the profile
   Posts tab and the search
   `from:6eS8Jm4YNJpPA2D #重心情報` (Latest tab); scroll repeatedly
   (scrollIntoView on the last `[data-testid="cellInnerDiv"]` + window.scrollTo
   + wheel events) to load as much history as X allows. Collect every
   `a[href*="/status/"]` ID. X pagination is limited — collect what's
   reachable; subsequent runs continue the backfill. If the browser is
   unavailable, fall back to curl on the profile page (embeds ~5 recent IDs).
2. **Fetch full data** — `curl https://cdn.syndication.twimg.com/tweet-result?id={ID}&token=x`
   (no auth). Gives `created_at` (UTC — convert to JST +9h for `publishedAt`),
   `text`, `mediaDetails[].media_url_https` (the annotated COG photo).
3. **Filter** — keep only posts containing `重心情報`. Skip クレ活/雑談.
   **Dedupe by sourceUrl** against `src/content/prizes/*.md` — never re-add an
   existing tweet URL.

## 2. Parse each measurement post

- Prize name (first line after `＃重心情報`)
- `【Figure size】` e.g. `21cm` or `16×12cm`
- `【Box weight】` e.g. `405g` (qualifiers like やや重め → note, not the value)
- `【Box size】縦X×横Y×奥行Zcm` → `X × Y × Zcm (H×W×D)`
- COG lines `🟨裏/上/右/左/中/表…` — distances from back/top, side offsets,
  ranges (㍉=mm). e.g. `裏1cm重心`, `上2.5㍉〜7.5㍉重心(5㍉幅動)`
- Notes: `箱はいれ方で個体差あり` (individual differences by packing),
  `箱中はほぼ動かない/ブリスターで…動く` (internal movement)

## 3. Manufacturer thumbnail

Identify the maker from the brand (never guess — verify by search):
Taito (AMP+, T-most, 全力造形, Vivit — taito.co.jp og:image via curl),
Sega (XStellar, Yumemirize, Luminasta, GLITTER&GLAMOURS, Grandista —
segaplaza.jp is a JS app, use the browser for og:image), Banpresto/Bandai
Spirits (bsp-prize.jp og:image via curl), Furyu (furyuprize.com), Bushiroad
(prize.bushiroad-creative.com). `imageUrl` = direct official image,
`imageCredit` = "Photo via <Maker> (<domain>)". Verify 200 image/*. If the
maker can't be verified, fall back to the tweet's own photo.

`diagramUrl` = the tweet's annotated photo (`mediaDetails[].media_url_https`),
`diagramCredit` = "Diagram via Merry☆An (x.com)".

## 4. Translate, write tips, emit

- Translate prize name → `titleEn`/`titleZh` (keep `titleJa` original)
- `cog[]` — one bilingual `{en, zh}` line per COG measurement
- `noteEn`/`noteZh` — translate the remarks faithfully, no embellishment
- `tipEn`/`tipZh` — AI-generated hashi-watashi (橋渡し) playing tips grounded
  in the measured COG: where to aim first, push vs tilt, honest confidence
  caveats. 2–4 sentences each.
- One `.md` per post at `src/content/prizes/YYYY-Www-slugified-title.md`
  matching `src/content.config.ts`. `publishedAt` in JST.

## 5. Build and release

`npm install` if needed, `npm run build` (schema errors fail loudly — fix
them), commit `add: <week label> — <count> new entries`, push to main.
Netlify redeploys automatically.
