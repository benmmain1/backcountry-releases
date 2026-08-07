"use client";

import { HIGHLIGHT_TAG_LABELS } from "@/lib/types";
import type { CampingSpot } from "@/lib/types";

export function SpotList({
  spots,
  selectedId,
  onSelect,
}: {
  spots: CampingSpot[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  if (spots.length === 0) {
    return (
      <div className="p-6 text-center text-sm text-stone-500">
        No spots match those filters. Try widening your search.
      </div>
    );
  }

  return (
    <ul className="divide-y divide-stone-800">
      {spots.map((s) => (
        <li key={s.id}>
          <button
            onClick={() => onSelect(s.id)}
            className={`block w-full px-4 py-3 text-left transition ${
              s.id === selectedId ? "bg-emerald-600/10" : "hover:bg-stone-900"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="font-medium text-stone-100">{s.name}</p>
              {s.elevation_ft && (
                <span className="shrink-0 text-xs text-stone-500">{s.elevation_ft.toLocaleString()} ft</span>
              )}
            </div>
            <p className="mt-0.5 text-xs text-stone-500">
              {s.region} · {s.state} · near {s.nearest_town}
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1">
              {s.highlight_tags.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-stone-800 px-2 py-0.5 text-[10px] text-stone-400"
                >
                  {HIGHLIGHT_TAG_LABELS[t]}
                </span>
              ))}
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}
