export type Region =
  | "Pacific Northwest"
  | "California & Sierra Nevada"
  | "Southwest Desert"
  | "Rocky Mountains"
  | "Great Basin & Nevada"
  | "Appalachians & Southeast";

export type HighlightTag =
  | "alpine-lake"
  | "mountain-view"
  | "desert-canyon"
  | "sunset"
  | "sunrise"
  | "stargazing-dark-sky"
  | "waterfall"
  | "ridge-view"
  | "forest-solitude"
  | "hot-spring-nearby"
  | "river-access"
  | "coastal-view"
  | "wildflowers"
  | "fall-colors"
  | "slot-canyon"
  | "mesa-view";

export interface CampingSpot {
  id: string;
  name: string;
  region: Region;
  state: string;
  lat: number;
  lng: number;
  elevation_ft: number | null;
  land_manager: string;
  access: string;
  highlight_tags: HighlightTag[];
  description: string;
  best_season: string;
  permit_or_fee: string;
  nearest_town: string;
  source_note: string;
}

export const HIGHLIGHT_TAG_LABELS: Record<HighlightTag, string> = {
  "alpine-lake": "Alpine Lake",
  "mountain-view": "Mountain View",
  "desert-canyon": "Desert Canyon",
  sunset: "Sunset",
  sunrise: "Sunrise",
  "stargazing-dark-sky": "Dark Sky",
  waterfall: "Waterfall",
  "ridge-view": "Ridge View",
  "forest-solitude": "Forest Solitude",
  "hot-spring-nearby": "Hot Spring Nearby",
  "river-access": "River Access",
  "coastal-view": "Coastal View",
  wildflowers: "Wildflowers",
  "fall-colors": "Fall Colors",
  "slot-canyon": "Slot Canyon",
  "mesa-view": "Mesa View",
};

export const REGIONS: Region[] = [
  "Pacific Northwest",
  "California & Sierra Nevada",
  "Southwest Desert",
  "Rocky Mountains",
  "Great Basin & Nevada",
  "Appalachians & Southeast",
];
