# OKLA — project guide for Claude Code

## What this is
OKLA is a Moroccan restaurant platform (discovery, table reservation, online ordering,
real-time delivery tracking, and an AI assistant). This repo is the **front-end demo** for a
final-year project (PFE) soutenance. It will be **screen-recorded** — there is no live audience
interaction — so visual polish, smooth animation, and reliability matter most.

IMPORTANT SCOPE RULES:
- Everything is **mocked**. No backend, no database, no real API, no real AI. All data lives in
  `src/data.js`. The assistant is **scripted** (pre-written Q&A) on purpose — do NOT wire a real LLM.
- UI text is in **French**.
- **Reservation is the centerpiece** (it's the part being presented). Keep `/reservation` the most
  polished surface. The *livraison/delivery* flow belongs to another group — only touch it if asked.

## Stack & how to run / verify
- Vite + React 18 + Tailwind CSS v3 + Framer Motion + react-router-dom + lucide-react.
- `npm install` then `npm run dev` (http://localhost:5173). 
- **After any change, run `npm run build` and make sure it compiles with no errors before finishing.**
- Do NOT use localStorage/sessionStorage. Do NOT add heavy new dependencies without asking.

## File map
- `src/App.jsx` — `<Nav/>` + routes: `/` → Marketing, `/reservation` → Reservation, `/app` → AppDemo
- `src/main.jsx` — BrowserRouter entry
- `src/index.css` — Tailwind + body background (radial glows + subtle grain) + `.font-head`
- `tailwind.config.js` — **custom brand colors live here** (see below) + fonts
- `src/data.js` — all mock data: `restaurants`, `features`, `steps`, `chatThread`, `tangier`, `reservationScript`
- `src/components/` — `Logo.jsx` (inline SVG: pin + cloche + fork), `Nav.jsx`, `PhoneTracking.jsx` (live-tracking phone)
- `src/sections/` — `Hero`, `Features`, `HowItWorks`, `LiveTracking`, `Chatbot`, `Restaurants`, `CTA`, `Footer`
- `src/pages/` — `Marketing.jsx` (composes sections), `AppDemo.jsx` (clickable phone, 5 screens + tab bar), `Reservation.jsx` (Tangier map + list + pickers + confirmation + scripted assistant)

## Brand system (follow exactly)
Colors are Tailwind classes (defined in `tailwind.config.js`) AND used inline as hex:
- terracotta `#D96C3B` — warm ACCENT only (not the dominant color)
- cacao `#3A2A1A` — text + dark backgrounds (title/CTA/conclusion)
- cream `#FFF4E6` — light background
- olive `#6F8F45` (darker `#5E7A39`) — **PRIMARY / lead color**: primary buttons, active states, success, "open", maps' routes/pins
- saffron `#F2B84B` — ratings / small accents
- brick `#C94C3D` — errors / "EN DIRECT" badge only
- card `#FFFCF6`, sand `#E8E2D8` (borders), muted `#8B7A68` (secondary text)
Fonts: Poppins (headings, `font-head`), Inter (body). Logo: keep the pin+cloche+fork SVG in `Logo.jsx`.
Tagline: « Réservez. Dégustez. Profitez. »

**PALETTE RULE (the user cares about this):** lead with OLIVE GREEN; use terracotta sparingly as a
warm accent — overusing orange is tiring. When adding UI, default primary actions/active states to olive.

## Conventions
- Animation: Framer Motion. Marketing = expressive (staggered load, `whileInView` scroll reveals,
  floating loops). App + reservation = calmer/snappier. 
- **Map markers must use SVG `<animateMotion>` + `<mpath>`** (already used) — NOT CSS `offset-path`
  (it's unreliable in Safari). Keep that approach.
- Routing via react-router `<Link>`. Match existing component patterns and inline-style + Tailwind mix.
- Keep restaurant/food imagery as CSS gradients OR locally-hosted images in `/public` — never hotlink
  external image URLs (they break during recording).

## Already built (don't redo / don't break)
- Marketing `/`: Hero (with live-tracking phone + floating chips), Features, HowItWorks, LiveTracking,
  Chatbot section (with the "LLM conçu/modélisé, non codé" PFE note), Restaurants, CTA, Footer.
- App `/app`: clickable phone — home → restaurant detail → reserve → live tracking → assistant, with tab bar.
- Reservation `/reservation`: stylised **Tangier map** (layered sea, beach, parks, médina blocks, animated
  ferry via SMIL animateMotion+mpath, lighthouse, labeled pins) with clickable pins + restaurant list +
  date chips + party stepper + per-restaurant time slots + confirmation modal + a **conversational scripted
  AI assistant** (the green ✨ button). The assistant now accepts FREE-TEXT input in **French AND Moroccan
  darija** (latin script): `src/assistant/engine.js` normalizes the text, detects the language, matches it
  to an intent via weighted keywords, and replies in the same language with a word-by-word streaming effect,
  fake RAG "sources" chips, and a page action (`select`, `prefill`, `highlight`, `offers`, `budget`,
  `detail`, `drawer`, `confirm` — handled in `Reservation.jsx`'s `onAction`). The chat UI lives in
  `src/components/reservation/Assistant.jsx`. The questions to type during the recording are listed in
  `ASSISTANT_QUESTIONS.md`. To add a Q&A: add an intent in `engine.js` (kw FR+darija, fr/da replies,
  action, sources). Keep this working — it's the demo's highlight. Still NO real LLM.

## Candidate tasks (the user will pick)
- Swap the stylised Tangier map for a real **Leaflet + free tiles** map (note: needs internet for tiles).
- Add more Tangier restaurants/neighborhoods to `tangier`; add opening hours; add a menu/pre-order step.
- Marketing polish: download real food photos into `/public` and use them; word-by-word hero headline; dark mode.
- App: add a payment screen / profile screen.
- Responsiveness + accessibility pass.

## Working style
Read a file before editing it. Make small, focused changes. Keep everything in French. Keep the build green
(`npm run build`). Preserve the brand + the green-led palette. Ask before large refactors or new deps.

---
First task: <write what you want here, e.g. "Replace the Tangier map on /reservation with a real Leaflet map using free OpenStreetMap/Carto tiles, keep the brand-styled pins and selection behavior.">