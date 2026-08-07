# Backcountry Releases

Find the backcountry and dispersed camping spots worth finding — the ones
with incredible views that never show up on a developed-campground
reservation system because there is no reservation system. This app curates
real "found" spots (BLM land, National Forest dispersed sites, remote
overlanding pull-offs) and layers an AI trail guide on top so you can search
them conversationally.

## What's here

- **Curated spot database** (`src/data/spots.json`) — researched dispersed
  camping locations with coordinates, access difficulty, land manager,
  permit/fee info, best season, and why the spot is worth the drive.
- **Map explorer** — satellite, topo, and street map layers (Esri World
  Imagery / Topo, OpenStreetMap) with pins for every spot, so you can eyeball
  terrain before you commit to a road.
- **Filters** — region, "vibe" tags (alpine lake, dark-sky stargazing, ridge
  view, etc.), and a sedan-accessible-only toggle.
- **AI Trail Guide (bring your own key)** — a chat panel that answers
  questions against the spot database using whichever AI provider you
  configure: Anthropic, OpenAI, Google Gemini, or any OpenAI-compatible
  endpoint (Groq, Together, local Ollama, etc.).

## Bring-your-own-API-key design

Your API key is entered client-side and stored only in your browser's
`localStorage`. When you send a chat message, the key is passed to our
`/api/ai-search` route for that single request, forwarded directly to your
chosen provider, and never written to a database or log. There is no vendor
lock-in — swap providers or models any time from the settings panel (gear
icon in the chat panel).

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Adding more spots

Append objects matching the schema in `src/lib/schema.ts` /
`src/lib/types.ts` to `src/data/spots.json`. Every entry should trace back to
a real, verifiable source (BLM/USFS recreation pages, FreeCampsites.net,
Campendium, iOverlander, etc.) — this project's whole value is trustworthy
curation, not volume.

## Ethics

Dispersed camping means no infrastructure and no one picking up after you.
Practice [Leave No Trace](https://lnt.org/why/7-principles/), respect
seasonal closures and fire restrictions, and always confirm current
conditions with the land manager before you go — access and regulations
change.
