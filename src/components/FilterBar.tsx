"use client";

import { HIGHLIGHT_TAG_LABELS, REGIONS, type HighlightTag, type Region } from "@/lib/types";

export interface Filters {
  query: string;
  regions: Region[];
  tags: HighlightTag[];
  vehicleFriendly: boolean;
}

export const EMPTY_FILTERS: Filters = { query: "", regions: [], tags: [], vehicleFriendly: false };

const ALL_TAGS = Object.keys(HIGHLIGHT_TAG_LABELS) as HighlightTag[];

export function FilterBar({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
}) {
  function toggleRegion(r: Region) {
    const has = filters.regions.includes(r);
    onChange({
      ...filters,
      regions: has ? filters.regions.filter((x) => x !== r) : [...filters.regions, r],
    });
  }

  function toggleTag(t: HighlightTag) {
    const has = filters.tags.includes(t);
    onChange({
      ...filters,
      tags: has ? filters.tags.filter((x) => x !== t) : [...filters.tags, t],
    });
  }

  return (
    <div className="space-y-4 border-b border-stone-800 p-4">
      <input
        value={filters.query}
        onChange={(e) => onChange({ ...filters, query: e.target.value })}
        placeholder="Search by name, state, or town…"
        className="w-full rounded-md border border-stone-700 bg-stone-900 px-3 py-2 text-sm outline-none focus:border-emerald-600"
      />

      <label className="flex items-center gap-2 text-sm text-stone-300">
        <input
          type="checkbox"
          checked={filters.vehicleFriendly}
          onChange={(e) => onChange({ ...filters, vehicleFriendly: e.target.checked })}
          className="h-4 w-4 rounded border-stone-600 accent-emerald-600"
        />
        Sedan / standard vehicle accessible only
      </label>

      <div>
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-stone-500">Region</p>
        <div className="flex flex-wrap gap-1.5">
          {REGIONS.map((r) => (
            <button
              key={r}
              onClick={() => toggleRegion(r)}
              className={`rounded-full border px-2.5 py-1 text-xs ${
                filters.regions.includes(r)
                  ? "border-emerald-600 bg-emerald-600/20 text-emerald-300"
                  : "border-stone-700 text-stone-400 hover:border-stone-500"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-stone-500">Vibe</p>
        <div className="flex flex-wrap gap-1.5">
          {ALL_TAGS.map((t) => (
            <button
              key={t}
              onClick={() => toggleTag(t)}
              className={`rounded-full border px-2.5 py-1 text-xs ${
                filters.tags.includes(t)
                  ? "border-amber-500 bg-amber-500/20 text-amber-300"
                  : "border-stone-700 text-stone-400 hover:border-stone-500"
              }`}
            >
              {HIGHLIGHT_TAG_LABELS[t]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function applyFilters(spots: import("@/lib/types").CampingSpot[], filters: Filters) {
  const q = filters.query.trim().toLowerCase();
  return spots.filter((s) => {
    if (q) {
      const hay = `${s.name} ${s.state} ${s.nearest_town} ${s.region}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (filters.regions.length && !filters.regions.includes(s.region)) return false;
    if (filters.tags.length && !filters.tags.some((t) => s.highlight_tags.includes(t))) return false;
    if (filters.vehicleFriendly) {
      const accessLower = s.access.toLowerCase();
      if (accessLower.includes("4wd") || accessLower.includes("high-clearance") || accessLower.includes("high clearance")) {
        return false;
      }
    }
    return true;
  });
}
