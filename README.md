# IceyCrew AI Style Assistant · clickable prototype

A high-fidelity, clickable prototype of the **IceyCrew AI Style Assistant**: VIP members photograph an outfit and get a score out of 100, what is working, what could be better and three to five tips to level it up, personalised to their style profile and colour season. Built from the v1 Contractor Brief (`AI_Style_Assistant_v1.pdf`) shared by iceycrew (Hazel) in the Fiverr chat and the discovery call on 10 Nov 2026. Two platforms: the Member App (iPhone frame) and the Admin Panel (browser frame). React + Vite + Tailwind v4 + Framer Motion, local demo data only, deploys to Vercel with zero config.

```
REFERENCE BOARD
Ref 1:  Flighty → the single most important fact (the score) is one oversized numeral with tiny labels around it; status is typeset over the photographic hero; the day's conditions (weather, occasion) sit as chips on the image, not in a form below it.
Ref 2:  Copilot Money → a number is never alone: it carries its unit, its delta ("up 12 on your last fit") and a comparison; secondary figures sit in a strip under the headline figure; a tinted page, never flat grey.
Ref 3:  Linear (admin) → borderless lists separated by rhythm and weight; a master list with the inspector beside it, never in a modal; filter chips in a row; one accent used sparingly on the active state.
Signature move: THE ICE RING. Every score (overall, the four sub-scores, the daily allowance, the helpfulness average, the spend cap) sits in a thin gold ring with a diamond marker at its angle: the IceyCrew mark, worn by the number. Every outfit reference carries the four-cell scorecard strip: Fit · Colour · Cohesion · Occasion.

ART DIRECTION
Direction:   Gallery Gold (custom, derived from the brief §6: off-white #FAFAF8, near-black #111111, grey #8A8A8A, one accent = the IceyCrew logo colour, taken from the store's gold "IC" diamond mark)
Style lens:  apple-design (fluid, physical motion; translucent docks; typographic hierarchy by size and weight): a camera-first phone app held in one hand, often in a mirror
Personality: sleek, assured, warm
Palette:     accent #E6B316 (gold) · support #F2CF55 (gold on dark) · base #FAFAF8 · on-accent #111111 · ink #111111 · night #0A0A0A · ruby #C8333F (refused / lapsed) · blue #2332D5 (info, the store's link blue)
Type:        Playfair Display (display, like the serif "IC" of the mark) / Outfit (text, the store's own face) / DM Mono (meta)   · scale: 11 / 13 / 15 / 17 / 22 / 34 / 56 / 80
Surface:     off-white paper with near-black blocks and gold accents; photography with ink scrims; glass docks
Radius:      22 / 16 / 12 / 999
Theme:       light, no toggle (dark mode is a Figma deliverable, brief §6)
Motion:      fluid-liquid (ui 520/34; sheets 380/32; pops 460/18)
Signature:   the Ice Ring (a score in a gold ring with a diamond marker) and the scorecard strip (Fit · Colour · Cohesion · Occasion) on every outfit
Device:      the facet: the diamond from the mark drawn as thin gold facet lines, cut into the corner of heroes and success moments
Composition: full-bleed hero (8 screens) · oversized numeral (9) · list-dense editorial (9) · asymmetric bento (6) · horizontal rail (4) · split panel (6) · stacked sheet (10) · overlapping / offset (3: the score card lapping the analysis hero, the raised camera tab, the swipe deck's peeking card) · chart-led (4) · timeline spine (1: the full feature list) · map or canvas (1: the camera viewfinder)
Rejected:    Obsidian Gold (dark luxury) was the first reach for "VIP" and "gold": discarded because the brief asks for off-white, generous white space and photography as the hero, and a style assistant is used in daylight in front of a mirror. Also rejected Orchid (beauty/social, too loud against outfit photography).
Skills used: phase 1 full-output-enforcement · phase 2 ui-ux-pro-max, design-system, ui-styling · phase 3 impeccable, high-end-visual-design, design-taste-frontend, emil-design-eng, apple-design · phase 4 apple-design, animation-vocabulary, find-animation-opportunities · phase 5 dataviz · phase 6 design-taste-frontend, impeccable, improve-animations
```

## The story

Today is **Tuesday 10 November 2026, 08:14 in Chicago** (41°F, light rain, wind 14 mph).

- **Maya Delgado (Member App)**, VIP since 3 Mar 2026 (order #IC-48213, renews 3 Dec), scans her work outfit: a burgundy wool coat over a camel knit. The Ice Ring lands on **84**: Fit 88 · Colour 91 · Cohesion 82 · Occasion 74. Her profile is *elevated streetwear*; her colour season is *Deep Autumn*, gold first. She has used 3 of 10 scans today. Her history holds 11 scored analyses since March, one refusal and one failure.
- **Hazel (Admin Panel)** runs the platform: 1,284 members (1,163 active), 318 scans so far today, helpfulness 4.4, AI spend at 70% of the $1,500 cap, 6 new bug reports, the Shopify adapter live and a CRM adapter staged.

The newsletter feed is the real **"The Edit · Week of November 8, 2026"** edition published at iceycrew.com/pages/style-tips (titles, sources and takeaways as the page lists them), rendered as cards that open in an in-app browser.

## Run

```bash
npm install
npm run dev          # http://localhost:5302
npm run build        # tsc --noEmit && vite build → dist/
```

Deploy with `vercel --prod` (zero config).

## Visitor journey logging

Every visit becomes rows in a Google Sheet, tab `prototype logs`, one row per event: `page_view`, `view` (every screen change, including open sheets, modals and drawers, named like `app:analysis:a-today+report-a-problem`), `action` (every tap on a button, tab, switch or link, renamed to its intent such as `analysis_requested` where the control calls `track()`), and `session_end` with the total duration. Filter by `session_id` and sort by `seq` to replay one visitor.

- `apps-script/iceycrew-logger.gs`: receives batches, appends with one `setValues()`, auto-creates the tab and header, rejects batches without the secret, `doGet()` health check, `testWrite()` for the editor. **Paste the sheet ID into `SHEET_ID` first.**
- `src/lib/tracker.js`: batches events (2.5 s idle or 12 events), `fetch` with `no-cors` + `text/plain`, `sendBeacon` on `pagehide`. While `ENDPOINT` is the placeholder, on localhost, or under an automated browser, events are logged to the console and never sent.

Setup, in order: create the sheet "hazel logs" → Extensions → Apps Script → paste the `.gs`, set `SHEET_ID` → run `testWrite` once and approve permissions → Deploy → New deployment → Web app, execute as Me, access Anyone → open the `/exec` URL and check `sheet_reachable: true` → paste the `/exec` URL into `ENDPOINT` in `src/lib/tracker.js` → build and deploy. After any later edit to the script: Deploy → Manage deployments → edit → Version: New version.

## Assumed values to confirm

Every number in the demo is a demo value. The ones the brief leaves open: cost per analysis ($0.11), the vision provider (OpenAI GPT-5 Vision, with Claude and Gemini as alternatives), the AI spend cap ($1,500/month, alert at 80%), member counts and the four-market split, the swipe deck's 24 starter images (Unsplash stand-ins for the licensed set), the colour quiz's eight questions and the season mapping, the onboarding question wording, the newsletter pull interval (every 6 h), hosting regions (us-east-1 primary, ca-central-1 replica), the subscription app on Shopify (to be confirmed by IceyCrew), the CRM named in the staged adapter (HubSpot, illustrative), and the app's name (placeholder: the IceyCrew mark with "Style Assistant").
