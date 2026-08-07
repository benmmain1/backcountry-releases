"use client";

import { useState } from "react";
import { Mountain } from "lucide-react";
import { satelliteThumbnailUrl } from "@/lib/thumbnail";

export function SpotThumbnail({
  lat,
  lng,
  alt,
  className,
  width = 400,
  height = 300,
  spanMiles = 1.4,
}: {
  lat: number;
  lng: number;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  spanMiles?: number;
}) {
  const [errored, setErrored] = useState(false);
  const src = satelliteThumbnailUrl(lat, lng, { width, height, spanMiles });

  if (errored) {
    return (
      <div className={`flex items-center justify-center bg-stone-800 text-stone-600 ${className ?? ""}`}>
        <Mountain size={20} />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- external, dynamically-computed satellite tile per spot; Next/Image optimization isn't useful here
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setErrored(true)}
      className={className}
    />
  );
}
