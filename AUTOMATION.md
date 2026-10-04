# Automation

Recurring job that keeps Centre Pullz current. Runs weekly. The site is a
bilingual (EN/ZH) database of Merry☆An's crane-prize centre-of-gravity
measurements — no other source.

Everything below is free: no paid X API, no auth.

## 1. Collect tweet IDs

**Use the Wayback Machine CDX index, not X.** X's own pagination is limited,
requires a logged-in browser, and walls anonymous access. The Internet Archive
has the account indexed and returns the whole history in one request:

```
http://web.archive.org/cdx/search/cdx?url=twitter.com/6eS8Jm4YNJpPA2D/status/*&output=text&fl=timestamp,original&collapse=urlkey
```

Note `twitter.com`, not `x.com` — the archive is indexed under the old domain
(the `x.com` prefix returns almost nothing). As of 2026-09-27 this returned
**9,748 tweet IDs** spanning 2019-12 → present, with the snapshot timestamp for
each, which step 2 needs.

Tweet IDs are Snowflake IDs, so you can date-filter before fetching anything:
`((id >> 22) + 1288834974657)` is the post time in epoch ms.

For the last day or two — too recent to be archived — `curl https://x.com/6eS8Jm4YNJpPA2D`
still embeds the ~5 most recent IDs.

## 2. Fetch each post

`curl "https://cdn.syndication.twimg.com/tweet-result?id={ID}&token=x"` (no
auth) gives `created_at` (UTC — add 9h for JST `publishedAt`), `text`, and
`mediaDetails[].media_url_https` (the annotated COG photo).

**This endpoint truncates long posts.** The response carries a `note_tweet`
field, but it holds only an id — never the text. Computing the "real"
syndication token doesn't help either; the response is identical.

To get the full body, fetch the archived snapshot using the timestamp from
step 1:

```
http://web.archive.org/web/{TIMESTAMP}id_/https://twitter.com/6eS8Jm4YNJpPA2D/status/{ID}
```

**The `id_` suffix on the timestamp is required.** Without it the archive
wraps the snapshot in its own HTML toolbar page and you get no JSON at all —
silently, with a 200.

The archived page is a JSON API response (X API v2 shape) containing the
complete post. Extract it with
`"note_tweet":\{.*?"text":"((?:[^"\\]|\\.)*)"` and JSON-unescape the capture;
`note_tweet` is often `{"entities":{}}` and the tweet's own full-length
`text` field follows it immediately, so the same regex works either way.

The response has no charset header, so HTTP clients that guess Latin-1 (e.g.
PowerShell's `Invoke-WebRequest.Content`) will mojibake it. Read the raw bytes
and decode as UTF-8.

Wayback rate-limits under load; back off and retry rather than hammering it.

**Completeness check:** `https://publish.twitter.com/oembed?url=<tweet url>`
renders the post and marks truncation with a trailing `…`. A body with no `…`
is complete. Use this to verify anything you couldn't pull from the archive.

If a post is still truncated and has no snapshot yet (i.e. posted in the last
day or two), **skip it** — the next run will pick it up. Dedupe is by
`sourceUrl`, so a thin entry written now is never corrected later.

## 3. Filter

Keep only posts whose text **starts with** `＃重心情報`. That is the structured
measurement format the schema expects.

Do not match on `重心情報` appearing anywhere, which also catches:

- `【獲得個体の重心情報】` — an older prose review format with no structured
  fields. Not usable as-is.
- Companion photo posts and replies that quote a measurement post.

Also skip `＃重心情報` posts that carry no measurements at all — recolour/
re-release announcements pointing at a previously measured prize. Without COG
data the play tips would be ungrounded.

**Dedupe by `sourceUrl`** against `src/content/prizes/*.md` before doing any
work — never re-add an existing tweet URL.

## 4. Parse

- Prize name (the lines after `＃重心情報`)
- `【Figure size】` e.g. `21cm` or `16×12cm`
- `【Box weight】` e.g. `405g` (qualifiers like 箱やや重め → note, not the value)
- `【Box size】縦H×横W×奥行Dcm` → `H × W × Dcm (H×W×D)`
- COG lines `🟨裏/上/右/左/中/表…` (㍉ = mm, ㎝ = cm). Ranges like
  `上2.5㍉〜7.5㍉重心(5㍉幅動)` keep both ends and the play figure.
- Notes: `箱はいれ方で個体差あり` (individual differences by packing),
  `箱中はほぼ動かない` / `ブリスターで…動く` (internal movement)

## 5. Manufacturer and official image

Identify the maker from the brand, then confirm on that maker's **own**
catalogue site. Verified working routes:

| Maker | Search | Image |
|---|---|---|
| Banpresto | `https://bsp-prize.jp/search/?kw=<kw>` (server-rendered; the param is **`kw`** — `keyword` is silently ignored) | `og:image` on `/item/<id>/`, via curl |
| Furyu | `https://furyuprize.com/search?keyword=<kw>` (server-rendered) | results embed `<img src=".../prz/pi-main-<id>.webp" alt="<name>">` directly |
| Sega | `https://segaplaza.jp/search/?q=<kw>&type=prize` (needs a browser — JS-rendered) | `og:image` on `/prize/<CODE>/`, readable by curl (path is `images-v3`) |
| Taito | `https://www.taito.co.jp/api/Prize/?date=&isDesc=true&keyword=&limit=100&offset=<n>&sortName=TaitoPrizeRank` — JSON, curl-friendly; page with `offset` (≈257 items total). `keyword` is accepted but **always returns `[]`**, so pull the whole list and filter locally | `ImagePath` + `ImageName01` → `https://www.taito.co.jp/Content/images/zone/prize/<ImageName01>` |

**Trap:** `taito.co.jp/prize/<id>` pages list prizes *available in Taito
arcades*, including other makers' products. They do not establish the
manufacturer. にゃーるずこれくしょん appears there but is Banpresto. The
`/api/Prize/` records above carry a `MakerName` field, which *does* settle it
(`（株）タイトー` for Taito's own).

Brand → maker, confirmed so far:

- **Furyu** — ぬーどるストッパー, BiCute, Exc∞d, Trio-Try-iT, サマードレス, ムチュート
- **Banpresto** — Grandista, MAXIMATIC, MAXIMATICPLUS, MATCH MAKERS,
  History Box, Mometria, GLITTER&GLAMOURS, ESPRESTO, SOFVIMATES,
  Eternal Romance, フィギュア-sweets flavor-, 英雄勇像, おすわりフィギュア,
  にゃーるずこれくしょん
- **Sega** — Luminasta, XStellar, Yumemirize, FIGURIZMα
- **Taito** — Aqua Float Girls, Desktop Cute, Coreful, AMP+, T-most

Set `imageUrl` to the official product image and `imageCredit` to
`Photo via <Maker> (<domain>)`. Verify it returns HTTP 200 with an `image/*`
content type. If the maker can't be verified, fall back to the tweet's own
photo credited to Merry☆An.

`diagramUrl` = the tweet's annotated photo (`mediaDetails[0].media_url_https`),
`diagramCredit` = `Diagram via Merry☆An (x.com)`.

## 6. Translate, write tips, emit

- Translate the prize name → `titleEn` / `titleZh` (keep `titleJa` original).
  Match existing conventions — check a sibling entry from the same line first.
- `cog[]` — one bilingual `{en, zh}` line per measured axis
- `noteEn` / `noteZh` — translate the remarks faithfully, no embellishment
- `tipEn` / `tipZh` — play tips grounded in the measured COG: where to aim,
  push vs tilt, honest caveats. **Write for someone new to crane games** —
  plain language, explain *why*, no jargon like "profile" or "pinned axis".
  2–4 sentences each.
- One `.md` per post at `src/content/prizes/YYYY-Www-slugified-title.md`
  matching `src/content.config.ts`. `publishedAt` in JST; the filename week is
  the ISO week of that date.

## 7. Build and release

`npm install` if `node_modules` is missing, then `npm run build` (schema errors
fail loudly — fix them). Commit `add: <week label> — <count> new entries` and
push to `main`. Cloudflare redeploys automatically.

Report: count of new entries, their titles, the commit hash, and roughly how
many measurement posts remain un-harvested.
