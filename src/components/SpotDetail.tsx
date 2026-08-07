"use client";

import { Compass, Footprints, MapPin, Mountain, ShieldCheck, Sun, Telescope, X } from "lucide-react";
import { ACCESS_TYPE_LABELS, HIGHLIGHT_TAG_LABELS, VIEW_OPENNESS_LABELS } from "@/lib/types";
import type { CampingSpot } from "@/lib/types";
import { SpotThumbnail } from "./SpotThumbnail";

export function SpotDetail({ spot, onClose }: { spot: CampingSpot; onClose: () => void }) {
  const gmaps = `https://www.google.com/maps/search/?api=1&query=${spot.lat},${spot.lng}`;
  const caltopo = `https://caltopo.com/map.html#ll=${spot.lat},${spot.lng}&z=13`;

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-stone-950">
      <SpotThumbnail
        lat={spot.lat}
        lng={spot.lng}
        alt={`Satellite view of ${spot.name}`}
        width={760}
        height={300}
        spanMiles={1.8}
        className="h-40 w-full shrink-0 object-cover"
      />

      <div className="flex items-start justify-between border-b border-stone-800 p-4">
        <div>
          <h2 className="text-lg font-semibold text-stone-100">{spot.name}</h2>
          <p className="text-sm text-stone-500">
            {spot.region} · {spot.state} · near {spot.nearest_town}
          </p>
        </div>
        <button onClick={onClose} className="rounded-md p-1.5 text-stone-400 hover:bg-stone-800" aria-label="Close">
          <X size={18} />
        </button>
      </div>

      <div className="space-y-5 p-4 text-sm">
        <p className="text-stone-300">{spot.description}</p>

        <div className="flex flex-wrap gap-1.5">
          {spot.highlight_tags.map((t) => (
            <span key={t} className="rounded-full bg-amber-500/15 px-2.5 py-1 text-xs text-amber-300">
              {HIGHLIGHT_TAG_LABELS[t]}
            </span>
          ))}
        </div>

        <dl className="space-y-3">
          <div className="flex gap-2">
            <MapPin size={16} className="mt-0.5 shrink-0 text-stone-500" />
            <div>
              <dt className="text-xs text-stone-500">Coordinates</dt>
              <dd className="font-mono text-stone-200">
                {spot.lat.toFixed(5)}, {spot.lng.toFixed(5)}
                {spot.elevation_ft ? ` · ${spot.elevation_ft.toLocaleString()} ft elevation` : ""}
              </dd>
            </div>
          </div>

          <div className="flex gap-2">
            <Compass size={16} className="mt-0.5 shrink-0 text-stone-500" />
            <div>
              <dt className="text-xs text-stone-500">Access</dt>
              <dd className="text-stone-200">
                {spot.access}
                {spot.access_type === "backpack-in" && spot.hike_in_distance_mi
                  ? ` (${spot.hike_in_distance_mi} mi hike-in)`
                  : ""}
              </dd>
            </div>
          </div>

          <div className="flex gap-2">
            <Footprints size={16} className="mt-0.5 shrink-0 text-stone-500" />
            <div>
              <dt className="text-xs text-stone-500">Access type</dt>
              <dd className="text-stone-200">{ACCESS_TYPE_LABELS[spot.access_type]}</dd>
            </div>
          </div>

          <div className="flex gap-2">
            <Telescope size={16} className="mt-0.5 shrink-0 text-stone-500" />
            <div>
              <dt className="text-xs text-stone-500">Landscape &amp; view</dt>
              <dd className="text-stone-200">
                {spot.landscape} · {VIEW_OPENNESS_LABELS[spot.view_openness]}
              </dd>
            </div>
          </div>

          <div className="flex gap-2">
            <Mountain size={16} className="mt-0.5 shrink-0 text-stone-500" />
            <div>
              <dt className="text-xs text-stone-500">Land manager</dt>
              <dd className="text-stone-200">{spot.land_manager}</dd>
            </div>
          </div>

          <div className="flex gap-2">
            <Sun size={16} className="mt-0.5 shrink-0 text-stone-500" />
            <div>
              <dt className="text-xs text-stone-500">Best season</dt>
              <dd className="text-stone-200">{spot.best_season}</dd>
            </div>
          </div>

          <div className="flex gap-2">
            <ShieldCheck size={16} className="mt-0.5 shrink-0 text-stone-500" />
            <div>
              <dt className="text-xs text-stone-500">Permit / fee</dt>
              <dd className="text-stone-200">{spot.permit_or_fee}</dd>
            </div>
          </div>
        </dl>

        <div className="flex gap-2 pt-2">
          <a
            href={gmaps}
            target="_blank"
            rel="noreferrer"
            className="flex-1 rounded-md border border-stone-700 px-3 py-2 text-center text-xs font-medium text-stone-300 hover:border-emerald-600 hover:text-emerald-300"
          >
            Open in Google Maps
          </a>
          <a
            href={caltopo}
            target="_blank"
            rel="noreferrer"
            className="flex-1 rounded-md border border-stone-700 px-3 py-2 text-center text-xs font-medium text-stone-300 hover:border-emerald-600 hover:text-emerald-300"
          >
            Open in CalTopo
          </a>
        </div>

        <p className="border-t border-stone-800 pt-3 text-xs text-stone-600">{spot.source_note}</p>
        <p className="text-xs text-stone-600">
          Conditions, access, and permit requirements change seasonally — always verify with the
          land manager before you go.
        </p>
      </div>
    </div>
  );
}
