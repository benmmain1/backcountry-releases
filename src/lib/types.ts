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
  | "mesa-view"
  | "meadow"
  | "glacier-view"
  | "big-peak-backdrop";

export type Landscape =
  | "Alpine & Summit"
  | "Mountain Meadow"
  | "Desert & Mesa"
  | "Canyon & Gorge"
  | "Forest"
  | "Lakeside & River"
  | "Coastal"
  | "Grassland & Plateau";

export type ViewOpenness =
  | "panoramic-360"
  | "open-vista"
  | "partially-open"
  | "framed";

export type AccessType = "sedan" | "high-clearance-4wd" | "backpack-in";

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
  access_type: AccessType;
  hike_in_distance_mi: number | null;
  landscape: Landscape;
  view_openness: ViewOpenness;
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
  meadow: "Meadow",
  "glacier-view": "Glacier View",
  "big-peak-backdrop": "Big Peak Backdrop",
};

export const REGIONS: Region[] = [
  "Pacific Northwest",
  "California & Sierra Nevada",
  "Southwest Desert",
  "Rocky Mountains",
  "Great Basin & Nevada",
  "Appalachians & Southeast",
];

export const LANDSCAPES: Landscape[] = [
  "Alpine & Summit",
  "Mountain Meadow",
  "Desert & Mesa",
  "Canyon & Gorge",
  "Forest",
  "Lakeside & River",
  "Coastal",
  "Grassland & Plateau",
];

export const VIEW_OPENNESS_LABELS: Record<ViewOpenness, string> = {
  "panoramic-360": "Panoramic 360°",
  "open-vista": "Open Vista",
  "partially-open": "Partially Open",
  framed: "Framed by Trees",
};

export const VIEW_OPENNESS_ORDER: ViewOpenness[] = [
  "panoramic-360",
  "open-vista",
  "partially-open",
  "framed",
];

export const ACCESS_TYPE_LABELS: Record<AccessType, string> = {
  sedan: "Sedan Accessible",
  "high-clearance-4wd": "High-Clearance / 4WD",
  "backpack-in": "Backpack-In Only",
};
