"use client";

import { useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import type { CampingSpot } from "@/lib/types";

const markerIcon = L.divIcon({
  className: "",
  html: `<div style="width:14px;height:14px;border-radius:50%;background:#10b981;border:2px solid white;box-shadow:0 0 0 2px rgba(0,0,0,0.4)"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const activeMarkerIcon = L.divIcon({
  className: "",
  html: `<div style="width:20px;height:20px;border-radius:50%;background:#f59e0b;border:3px solid white;box-shadow:0 0 0 3px rgba(0,0,0,0.5)"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

type BaseLayer = "satellite" | "terrain" | "street";

const LAYERS: Record<BaseLayer, { url: string; attribution: string; maxZoom: number }> = {
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics, USDA, USGS, AeroGRID, IGN",
    maxZoom: 19,
  },
  terrain: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri — Source: Esri, USGS, NOAA",
    maxZoom: 19,
  },
  street: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  },
};

function FlyToSpot({ spot }: { spot: CampingSpot | null }) {
  const map = useMap();
  useMemo(() => {
    if (spot) map.flyTo([spot.lat, spot.lng], 12, { duration: 0.8 });
  }, [spot, map]);
  return null;
}

export function MapView({
  spots,
  selectedId,
  onSelect,
}: {
  spots: CampingSpot[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const [layer, setLayer] = useState<BaseLayer>("satellite");
  const selectedSpot = spots.find((s) => s.id === selectedId) ?? null;
  const center: [number, number] = spots.length
    ? [spots[0].lat, spots[0].lng]
    : [39.5, -111.5];

  return (
    <div className="relative h-full w-full">
      <MapContainer center={center} zoom={5} scrollWheelZoom className="h-full w-full">
        <TileLayer
          key={layer}
          url={LAYERS[layer].url}
          attribution={LAYERS[layer].attribution}
          maxZoom={LAYERS[layer].maxZoom}
        />
        {spots.map((s) => (
          <Marker
            key={s.id}
            position={[s.lat, s.lng]}
            icon={s.id === selectedId ? activeMarkerIcon : markerIcon}
            eventHandlers={{ click: () => onSelect(s.id) }}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">{s.name}</p>
                <p className="text-stone-500">{s.region}, {s.state}</p>
              </div>
            </Popup>
          </Marker>
        ))}
        <FlyToSpot spot={selectedSpot} />
      </MapContainer>

      <div className="absolute right-3 top-3 z-[1000] flex overflow-hidden rounded-md border border-stone-700 bg-stone-900/90 text-xs shadow-lg backdrop-blur">
        {(["satellite", "terrain", "street"] as BaseLayer[]).map((l) => (
          <button
            key={l}
            onClick={() => setLayer(l)}
            className={`px-3 py-1.5 capitalize ${
              layer === l ? "bg-emerald-600 text-white" : "text-stone-300 hover:bg-stone-800"
            }`}
          >
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}
