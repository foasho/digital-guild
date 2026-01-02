"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { JobMapMarker } from "@/components/worker/JobMapMarker";
import type { Job } from "@/types";

interface MapComponentProps {
  jobs: Job[];
  isBookmarked: (jobId: number) => boolean;
  onMarkerClick: (job: Job) => void;
  flyToPosition?: { lat: number; lng: number } | null;
}

// 日本の中心座標
const JAPAN_CENTER: [number, number] = [36.5, 138];
const DEFAULT_ZOOM = 5;
const FLY_TO_ZOOM = 10;

function MapResizer() {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(container);

    // 初期描画直後にも1回だけサイズ計算を強制
    setTimeout(() => map.invalidateSize(), 0);

    return () => observer.disconnect();
  }, [map]);

  return null;
}

// 指定座標へスムーズに移動するコンポーネント
function MapFlyTo({ position }: { position: { lat: number; lng: number } | null }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo([position.lat, position.lng], FLY_TO_ZOOM, {
        duration: 1.2,
      });
    }
  }, [map, position]);

  return null;
}

export default function MapComponent({
  jobs,
  isBookmarked,
  onMarkerClick,
  flyToPosition,
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
        background: "#f8fafc",
        zIndex: 1,
        position: "relative",
      }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapResizer />
      <MapFlyTo position={flyToPosition ?? null} />
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
