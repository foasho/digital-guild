"use client";

import L from "leaflet";
import { Marker } from "react-leaflet";
import type { Job } from "@/types";

interface JobMapMarkerProps {
  job: Job;
  isBookmarked: boolean;
  onClick: () => void;
}

// カスタムマーカーアイコンを作成
function createMarkerIcon(job: Job, isBookmarked: boolean): L.DivIcon {
  const borderColor = isBookmarked ? "#f59e0b" : "#6b7280";
  const borderWidth = isBookmarked ? "3px" : "2px";

  // ブックマークアイコン（右上に小さく表示）
  const bookmarkIcon = isBookmarked
    ? `<div style="
        position: absolute;
        top: -4px;
        right: -4px;
        width: 18px;
        height: 18px;
        background: #f59e0b;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 1px 3px rgba(0,0,0,0.3);
      ">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
          <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
        </svg>
      </div>`
    : "";

  const html = `
    <div style="
      position: relative;
      width: 50px;
      height: 50px;
    ">
      <div style="
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: ${borderWidth} solid ${borderColor};
        overflow: hidden;
        background: #1f2937;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        <img
          src="${job.imageUrl}"
          alt="${job.title}"
          style="
            width: 100%;
            height: 100%;
            object-fit: cover;
          "
        />
      </div>
      ${bookmarkIcon}
      <div style="
        position: absolute;
        bottom: -8px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-top: 10px solid ${borderColor};
      "></div>
    </div>
  `;

  return L.divIcon({
    html,
    className: "job-map-marker",
    iconSize: [50, 60],
    iconAnchor: [25, 60],
    popupAnchor: [0, -60],
  });
}

export function JobMapMarker({
  job,
  isBookmarked,
  onClick,
}: JobMapMarkerProps) {
  const icon = createMarkerIcon(job, isBookmarked);

  return (
    <Marker
      position={[job.latitude, job.longitude]}
      icon={icon}
      eventHandlers={{
        click: onClick,
      }}
    />
  );
}
