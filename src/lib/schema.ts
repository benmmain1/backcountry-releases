import { z } from "zod";

export const spotSchema = z.object({
  id: z.string(),
  name: z.string(),
  region: z.enum([
    "Pacific Northwest",
    "California & Sierra Nevada",
    "Southwest Desert",
    "Rocky Mountains",
    "Great Basin & Nevada",
    "Appalachians & Southeast",
  ]),
  state: z.string(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  elevation_ft: z.number().nullable(),
  land_manager: z.string(),
  access: z.string(),
  highlight_tags: z.array(
    z.enum([
      "alpine-lake",
      "mountain-view",
      "desert-canyon",
      "sunset",
      "sunrise",
      "stargazing-dark-sky",
      "waterfall",
      "ridge-view",
      "forest-solitude",
      "hot-spring-nearby",
      "river-access",
      "coastal-view",
      "wildflowers",
      "fall-colors",
      "slot-canyon",
      "mesa-view",
    ])
  ),
  description: z.string(),
  best_season: z.string(),
  permit_or_fee: z.string(),
  nearest_town: z.string(),
  source_note: z.string(),
});

export const spotsArraySchema = z.array(spotSchema);
