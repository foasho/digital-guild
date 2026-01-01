"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { JobMapMarker } from "@/components/worker/JobMapMarker";
import type { Job } from "@/types";

interface MapComponentProps {
  jobs: Job[];
  isBookmarked: (jobId: string) => boolean;
  onMarkerClick: (job: Job) => void;
}

// 日本の中心座標
const JAPAN_CENTER: [number, number] = [36.5, 138];
const DEFAULT_ZOOM = 5;

export default function MapComponent({
  jobs,
  isBookmarked,
  onMarkerClick,
}: MapComponentProps) {
  const [isMounted, setIsMounted] = useState(false);

  // クライアントサイドマウント確認
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // SSRガード & マウント確認
  if (typeof window === "undefined" || !isMounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-zinc-900">
        <div className="text-white/60">Loading map...</div>
      </div>
    );
  }

  return (
    <MapContainer
      center={JAPAN_CENTER}
      zoom={DEFAULT_ZOOM}
      className="w-full h-full"
      style={{
        background: "#1a1a2e",
        zIndex: 1,
        position: "relative",
      }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      {jobs.map((job) => (
        <JobMapMarker
          key={job.id}
          job={job}
          isBookmarked={isBookmarked(job.id)}
          onClick={() => onMarkerClick(job)}
        />
      ))}
    </MapContainer>
  );
}
