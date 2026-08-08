# Backcountry — orientation for Claude sessions

Read this before touching anything. This repo has bitten multiple sessions
(including this one) with the same two mistakes: confusing which app you're
in, and trusting local/branch state instead of what's actually live. Both
are avoidable if you check the things listed below first.

## What this repo actually is

This is **`benmmain1/backcountry-releases`**, and on this branch lineage
(`claude/map-ui-redesign-fhhhxr` and its descendants) it is a **single-file
static web app**: `index.html` + `style.json`, built on MapLibre GL JS,
deployed as-is with no build step. That's the whole app: no framework, no
bundler, no server.

**There is also a completely different Next.js app living on other
branches in this same repo** (e.g. `claude/backcountry-camping-finder-gxtc68`)
with its own `src/`, `package.json`, `AGENTS.md`/`CLAUDE.md`, an AI search
feature, and its own `src/data/spots.json`. **It is not the same app.** It
is not deployed by the workflow below. If you're on the static-site
lineage, do not reference features, files, or data from that Next.js app —
they don't exist here. If you're unsure which one you're in, run
`ls` — if you see `index.html` + `style.json` at the repo root, you're in
the static site.

## The shared-bucket trap — check this before trusting any local file

`.github/workflows/deploy-r2.yml` triggers on push to **any** `claude/**`
branch and uploads `index.html`, `style.json`, and any `*.pmtiles` in the
repo root straight to the **same** public R2 bucket
(`pub-0f98a7bc5f124d2c91ecc5e8ae899144.r2.dev`) — the one actually serving
the live site. There is no merge gate. Whichever branch pushes last wins,
regardless of which branch you're working on.

**Consequence:** the file in your local branch checkout is not guaranteed
to match what's live. Multiple sessions on multiple branches have pushed
to this same bucket. Before making claims about "what's currently live" or
building features on top of a committed file, verify against the real
endpoints, not your git checkout:

```
curl -s https://jxrbtqujdnuxvyoerfug.supabase.co/storage/v1/object/public/region-packs/ut/manifest.json
curl -sI https://pub-0f98a7bc5f124d2c91ecc5e8ae899144.r2.dev/ut/<file>.pmtiles
```

The **manifest.json above is the source of truth** for what the real data
pipeline has actually published — `pmtiles_file`, `terrain_pmtiles_file`,
`spots_file`, `spot_count`. If `style.json` hardcodes a URL that doesn't
match what the manifest claims, that's a red flag: it means someone
(possibly a past session) added something manually, outside the pipeline.

## Known-stale things (do not resurrect without re-checking live state)

- **The 82-spot "gem spots" pilot dataset** (`spots-ut-pilot.pmtiles`,
  Manti-La Sal National Forest) was removed 2026-08-08. It was a one-off,
  hand-added file from an earlier session, never tracked by the real
  pipeline (`manifest.json` reported `spot_count: 0, spots_file: null`
  the entire time it existed). If a future manifest fetch shows
  `spots_file` actually populated, that's the real pipeline's output —
  wire *that* in, not a recreated pilot file.
- The R2 bucket itself still has the old `spots-ut-pilot.pmtiles` object
  sitting in it (deploys only upload, never delete, and there's no R2
  credential access from this repo to remove it manually). It's just
  unreferenced now.

## Current real features on this static-site lineage

- MapLibre map over Esri satellite imagery, with an OpenTopoMap-based
  "topo" basemap toggle (free, keyless, CORS-verified directly).
- Real 3D terrain (`setTerrain` off the `terrain-ut.pmtiles` raster-dem
  source), zoom-scaled pitch ceiling to avoid the tile/memory blowup a
  near-horizon tilt causes at wide zoom (this crashed the tab twice
  before the fix — keep the zoom-scaling if touching this).
- Named peak/place labels via Wikidata's public SPARQL endpoint (CORS-
  verified; Overpass API has better data but no CORS headers, dead end).
- A campsite scanner (grid search + ray-cast openness/flatness over the
  real DEM, filtered against real land-ownership/wilderness/closures/
  MVUM-dispersed-route layers via `queryRenderedFeatures`) with
  "Scan Preferences" checkboxes (water/wooded/panoramic/tent/hammock/
  trailer) that steer it, using USGS/MRLC's NLCD map service for tree
  canopy and water classification (free, CORS-verified).
- An on-device "save spot" feature (localStorage only — there is no
  backend here to publish to a shared list; every save UI says so).

## Before you ship a claim or a feature

1. If you're about to say "the live site currently has X," verify against
   the real URLs above, not a git checkout.
2. If you're about to add a third-party data source, check it's actually
   reachable with CORS from a browser (`curl -sI` and look for
   `access-control-allow-origin`) before writing code against it —
   Overpass and LANDFIRE's REST catalog both looked promising and were
   dead ends; NLCD and Wikidata's SPARQL endpoint both checked out.
3. Prefer a real DOM+MapLibre test harness (jsdom, with a mocked `Map`
   class that actually populates layers/sources from the `style` object
   the way real MapLibre does) over just `new Function(source)` syntax
   checks — syntax checking cannot catch a variable that's out of scope,
   which is exactly the class of bug that shipped here twice. `eslint`
   with `no-undef` against the extracted inline script is a fast
   complementary check for the same class of bug.
