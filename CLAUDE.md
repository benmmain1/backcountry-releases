# Backcountry — orientation for Claude sessions

Read this before touching anything. This repo has bitten multiple sessions
with the same mistakes: confusing which app you're in, building on the
wrong branch, and trusting local/branch state instead of what's actually
live. All three are avoidable if you check the things listed below first.

## What this repo actually is

This is **`benmmain1/backcountry-releases`**. On `main` — the only branch
that deploys, and the only one you should build on — it is a **single-file
static web app**: `index.html` + `style.json`, built on MapLibre GL JS,
deployed as-is with no build step. That's the whole app: no framework, no
bundler, no server.

**There is also a completely different Next.js app living on other
branches in this same repo** (e.g. `claude/backcountry-camping-finder-gxtc68`)
with its own `src/`, `package.json`, `AGENTS.md`/`CLAUDE.md`, an AI search
feature, and its own `src/data/spots.json`. **It is not the same app, it is
not on `main`, and it is not deployed by the workflow below.** Do not
reference features, files, or data from it — they don't exist here. If
you're unsure which one you're in, run `ls` — if you see `index.html` +
`style.json` at the repo root, you're in the static site.

## Work on `main`. Do not resurrect an old `claude/*` branch as your base.

Before ~Aug 9 2026, `deploy-r2.yml` fired on push to **any** `claude/**`
branch, straight to the live bucket, with no merge gate — whichever branch
happened to push last won, regardless of which branch anyone was actually
working on. Multiple sessions each built in isolation on their own branch,
each believing theirs was "the app." One branch (`satellite-peaks-trails-
search-1lskhn`) ended up furthest ahead — AI Trail Guide, 3D terrain,
basemap toggle, campsite scanner — and was merged into the newly-created
`main`. The others (`map-ui-redesign-fhhhxr`, `3d-map-viewing-a5dyzr`,
`downloaded-regions-display-lbuh40`, `glitching-submission-issue-shre25`,
`hidden-gem-picture-sources-2waxar`) are dead ends: earlier or divergent
states, superseded by what's on `main` now. **Do not branch from any of
them.** `git log --oneline -1 <branch>` will show you're looking at
history older than `main`'s if you're ever unsure.

The fix going forward: `deploy-r2.yml` now only triggers on push to `main`.
Feature work still happens on a `claude/*` branch (branched from `main`),
but nothing reaches production until that branch is merged into `main`.
Before starting work, confirm you branched from `main` — not from muscle
memory of an old branch name, not from whatever this session's harness
happened to check out.

## The shared-bucket trap — still worth knowing about

`.github/workflows/deploy-r2.yml` uploads `index.html`, `style.json`, and
any `*.pmtiles` in the repo root straight to the public R2 bucket
(`pub-0f98a7bc5f124d2c91ecc5e8ae899144.r2.dev`) on every push to `main`.
The bucket also holds large data files (`.pmtiles` map data, the Android
APK) that don't live in this repo — deploys upload, never delete.

Before making claims about "what's currently live," verify against the
real endpoints, not just your git checkout — a push to `main` needs a
few seconds to land, and someone else may have pushed since you last
checked:

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

## Current real features on `main`

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
