const MILES_PER_DEGREE_LAT = 69;

export function satelliteThumbnailUrl(
  lat: number,
  lng: number,
  opts: { width?: number; height?: number; spanMiles?: number } = {}
): string {
  const width = opts.width ?? 400;
  const height = opts.height ?? 300;
  const spanMiles = opts.spanMiles ?? 1.4;

  const latSpan = spanMiles / MILES_PER_DEGREE_LAT;
  const lngSpan = spanMiles / (MILES_PER_DEGREE_LAT * Math.cos((lat * Math.PI) / 180));

  const minLat = lat - latSpan / 2;
  const maxLat = lat + latSpan / 2;
  const minLng = lng - lngSpan / 2;
  const maxLng = lng + lngSpan / 2;

  const params = new URLSearchParams({
    bbox: `${minLng},${minLat},${maxLng},${maxLat}`,
    bboxSR: "4326",
    size: `${width},${height}`,
    imageSR: "4326",
    format: "jpg",
    f: "image",
  });

  return `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export?${params.toString()}`;
}
