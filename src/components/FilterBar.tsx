"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  ACCESS_TYPE_LABELS,
  HIGHLIGHT_TAG_LABELS,
  LANDSCAPES,
  REGIONS,
  VIEW_OPENNESS_LABELS,
  VIEW_OPENNESS_ORDER,
  type AccessType,
  type HighlightTag,
  type Landscape,
  type Region,
  type ViewOpenness,
} from "@/lib/types";

export interface Filters {
  query: string;
  regions: Region[];
  tags: HighlightTag[];
  landscapes: Landscape[];
  viewOpenness: ViewOpenness[];
  accessTypes: AccessType[];
}

export const EMPTY_FILTERS: Filters = {
  query: "",
  regions: [],
  tags: [],
  landscapes: [],
  viewOpenness: [],
  accessTypes: [],
};

const ALL_TAGS = Object.keys(HIGHLIGHT_TAG_LABELS) as HighlightTag[];
const ALL_ACCESS_TYPES = Object.keys(ACCESS_TYPE_LABELS) as AccessType[];

function PillGroup<T extends string>({
  label,
  options,
  labelFor,
  selected,
  onToggle,
  activeClass,
}: {
  label: string;
  options: T[];
  labelFor: (v: T) => string;
  selected: T[];
  onToggle: (v: T) => void;
  activeClass: string;
}) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-stone-500">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onToggle(opt)}
            className={`rounded-full border px-2.5 py-1 text-xs ${
              selected.includes(opt) ? activeClass : "border-stone-700 text-stone-400 hover:border-stone-500"
            }`}
          >
            {labelFor(opt)}
          </button>
        ))}
      </div>
    </div>
  );
}

export function FilterBar({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
}) {
  const [advancedOpen, setAdvancedOpen] = useState(false);

  function toggle<K extends keyof Filters>(key: K, value: Filters[K] extends (infer U)[] ? U : never) {
    const list = filters[key] as unknown as string[];
    const has = list.includes(value as string);
    onChange({
      ...filters,
      [key]: has ? list.filter((x) => x !== value) : [...list, value],
    });
  }

  const advancedActiveCount = filters.landscapes.length + filters.viewOpenness.length + filters.accessTypes.length;

  return (
    <div className="space-y-4 border-b border-stone-800 p-4">
      <input
        value={filters.query}
        onChange={(e) => onChange({ ...filters, query: e.target.value })}
        placeholder="Search by name, state, or town…"
        className="w-full rounded-md border border-stone-700 bg-stone-900 px-3 py-2 text-sm outline-none focus:border-emerald-600"
      />

      <PillGroup
        label="Region"
        options={REGIONS}
        labelFor={(r) => r}
        selected={filters.regions}
        onToggle={(r) => toggle("regions", r)}
        activeClass="border-emerald-600 bg-emerald-600/20 text-emerald-300"
      />

      <PillGroup
        label="Vibe"
        options={ALL_TAGS}
        labelFor={(t) => HIGHLIGHT_TAG_LABELS[t]}
        selected={filters.tags}
        onToggle={(t) => toggle("tags", t)}
        activeClass="border-amber-500 bg-amber-500/20 text-amber-300"
      />

      <button
        onClick={() => setAdvancedOpen((v) => !v)}
        className="flex w-full items-center justify-between text-xs font-semibold uppercase tracking-wide text-stone-500 hover:text-stone-300"
      >
        <span>
          Landscape &amp; access{advancedActiveCount ? ` (${advancedActiveCount})` : ""}
        </span>
        <ChevronDown size={14} className={`transition-transform ${advancedOpen ? "rotate-180" : ""}`} />
      </button>

      {advancedOpen && (
        <div className="space-y-4">
          <PillGroup
            label="Landscape"
            options={LANDSCAPES}
            labelFor={(l) => l}
            selected={filters.landscapes}
            onToggle={(l) => toggle("landscapes", l)}
            activeClass="border-sky-500 bg-sky-500/20 text-sky-300"
          />

          <PillGroup
            label="View openness"
            options={VIEW_OPENNESS_ORDER}
            labelFor={(v) => VIEW_OPENNESS_LABELS[v]}
            selected={filters.viewOpenness}
            onToggle={(v) => toggle("viewOpenness", v)}
            activeClass="border-violet-500 bg-violet-500/20 text-violet-300"
          />

          <PillGroup
            label="Access"
            options={ALL_ACCESS_TYPES}
            labelFor={(a) => ACCESS_TYPE_LABELS[a]}
            selected={filters.accessTypes}
            onToggle={(a) => toggle("accessTypes", a)}
            activeClass="border-rose-500 bg-rose-500/20 text-rose-300"
          />
        </div>
      )}
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
    if (filters.landscapes.length && !filters.landscapes.includes(s.landscape)) return false;
    if (filters.viewOpenness.length && !filters.viewOpenness.includes(s.view_openness)) return false;
    if (filters.accessTypes.length && !filters.accessTypes.includes(s.access_type)) return false;
    return true;
  });
}
