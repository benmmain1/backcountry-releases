import rawSpots from "@/data/spots.json";
import { spotsArraySchema } from "./schema";
import type { CampingSpot } from "./types";

export const ALL_SPOTS: CampingSpot[] = spotsArraySchema.parse(rawSpots);

export function getSpotById(id: string): CampingSpot | undefined {
  return ALL_SPOTS.find((s) => s.id === id);
}

export function haversineMiles(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const R = 3958.8;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(h));
}
