"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { Compass, MessageCircleQuestion, Mountain } from "lucide-react";
import { ALL_SPOTS } from "@/lib/spots";
import { applyFilters, EMPTY_FILTERS, FilterBar, type Filters } from "@/components/FilterBar";
import { SpotList } from "@/components/SpotList";
import { SpotDetail } from "@/components/SpotDetail";
import { AIChatPanel } from "@/components/AIChatPanel";

const MapView = dynamic(() => import("@/components/MapView").then((m) => m.MapView), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-stone-900 text-stone-500">
      Loading map…
    </div>
  ),
});

export default function Home() {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  const filtered = useMemo(() => applyFilters(ALL_SPOTS, filters), [filters]);
  const selectedSpot = filtered.find((s) => s.id === selectedId) ?? null;

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center justify-between border-b border-stone-800 bg-stone-950 px-4 py-3">
        <div className="flex items-center gap-2">
          <Mountain className="text-emerald-500" size={22} />
          <div>
            <h1 className="text-sm font-semibold tracking-tight text-stone-100">Backcountry Releases</h1>
            <p className="text-xs text-stone-500">
              {ALL_SPOTS.length ? `${ALL_SPOTS.length} researched dispersed spots` : "Spots worth finding"}
            </p>
          </div>
        </div>
        <button
          onClick={() => setChatOpen(true)}
          className="flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-500"
        >
          <MessageCircleQuestion size={16} />
          Ask the AI Trail Guide
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="flex w-[340px] shrink-0 flex-col overflow-hidden border-r border-stone-800">
          <FilterBar filters={filters} onChange={setFilters} />
          <div className="flex-1 overflow-y-auto">
            <SpotList spots={filtered} selectedId={selectedId} onSelect={setSelectedId} />
          </div>
        </aside>

        <main className="relative flex-1">
          {ALL_SPOTS.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-stone-500">
              <Compass size={32} />
              <p className="text-sm">Spot database is loading…</p>
            </div>
          ) : (
            <MapView spots={filtered} selectedId={selectedId} onSelect={setSelectedId} />
          )}
        </main>

        {selectedSpot && (
          <div className="w-[380px] shrink-0 border-l border-stone-800">
            <SpotDetail spot={selectedSpot} onClose={() => setSelectedId(null)} />
          </div>
        )}
      </div>

      <footer className="flex items-center justify-center gap-1.5 border-t border-stone-800 bg-stone-950 px-4 py-1.5 text-[11px] text-stone-600">
        Leave these places better than you found them — practice{" "}
        <a
          href="https://lnt.org/why/7-principles/"
          target="_blank"
          rel="noreferrer"
          className="text-stone-500 underline decoration-stone-700 hover:text-emerald-400"
        >
          Leave No Trace
        </a>{" "}
        and always verify current conditions with the land manager.
      </footer>

      {chatOpen && <AIChatPanel onClose={() => setChatOpen(false)} />}
    </div>
  );
}
