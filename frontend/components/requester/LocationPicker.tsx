"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { MapPin, Navigation, Crosshair, Locate } from "lucide-react";
import { Button } from "@heroui/react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface LocationPickerProps {
  latitude: number;
  longitude: number;
  onLocationChange: (lat: number, lng: number) => void;
}

export function LocationPicker({
  latitude,
  longitude,
  onLocationChange,
}: LocationPickerProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [displayCoords, setDisplayCoords] = useState({ lat: latitude, lng: longitude });

  // 日本の主要地点プリセット
  const presetLocations = [
    { name: "東京", lat: 35.6762, lng: 139.6503 },
    { name: "大阪", lat: 34.6937, lng: 135.5023 },
    { name: "札幌", lat: 43.0618, lng: 141.3545 },
    { name: "福岡", lat: 33.5904, lng: 130.4017 },
    { name: "愛媛", lat: 33.8416, lng: 132.7657 },
    { name: "山形", lat: 38.2404, lng: 140.3634 },
  ];

  // マップ中心位置を更新
  const updateCenterPosition = useCallback(() => {
    if (mapRef.current) {
      const center = mapRef.current.getCenter();
      setDisplayCoords({ lat: center.lat, lng: center.lng });
    }
  }, []);

  // マップ移動終了時に座標を確定
  const handleMoveEnd = useCallback(() => {
    if (mapRef.current) {
      const center = mapRef.current.getCenter();
      onLocationChange(center.lat, center.lng);
    }
  }, [onLocationChange]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // マップ初期化
    const map = L.map(mapContainerRef.current, {
      center: [latitude, longitude],
      zoom: 12,
      zoomControl: false,
    });

    // タイルレイヤー追加
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
    }).addTo(map);

    // ズームコントロール（右下）
    L.control.zoom({ position: "bottomright" }).addTo(map);

    // マップ移動時に座標を更新
    map.on("move", updateCenterPosition);
    map.on("moveend", handleMoveEnd);

    mapRef.current = map;
    setIsMapReady(true);
    setDisplayCoords({ lat: latitude, lng: longitude });

    return () => {
      map.off("move", updateCenterPosition);
      map.off("moveend", handleMoveEnd);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // 外部から座標が変更された場合
  useEffect(() => {
    if (mapRef.current && isMapReady) {
      const currentCenter = mapRef.current.getCenter();
      // 座標が大きく変わった場合のみ移動（プリセットクリック時など）
      if (
        Math.abs(currentCenter.lat - latitude) > 0.001 ||
        Math.abs(currentCenter.lng - longitude) > 0.001
      ) {
        mapRef.current.setView([latitude, longitude], mapRef.current.getZoom());
        setDisplayCoords({ lat: latitude, lng: longitude });
      }
    }
  }, [latitude, longitude, isMapReady]);

  const handlePresetClick = (lat: number, lng: number) => {
    onLocationChange(lat, lng);
    if (mapRef.current) {
      mapRef.current.setView([lat, lng], 12, { animate: true });
    }
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude: lat, longitude: lng } = position.coords;
          onLocationChange(lat, lng);
          if (mapRef.current) {
            mapRef.current.setView([lat, lng], 15, { animate: true });
          }
          setIsLocating(false);
        },
        (error) => {
          console.error("位置情報の取得に失敗しました:", error);
          setIsLocating(false);
        },
        { enableHighAccuracy: true }
      );
    }
  };

  return (
    <div className="space-y-3">
      {/* プリセット地点 */}
      <div className="flex flex-wrap gap-2">
        {presetLocations.map((loc) => (
          <Button
            key={loc.name}
            size="sm"
            variant="flat"
            className="bg-gray-100 hover:bg-sky-100 hover:text-sky-700 text-gray-600"
            onPress={() => handlePresetClick(loc.lat, loc.lng)}
          >
            {loc.name}
          </Button>
        ))}
      </div>

      {/* マップ */}
      <div className="relative rounded-xl overflow-hidden border-2 border-gray-200 hover:border-sky-300 transition-colors">
        <div
          ref={mapContainerRef}
          className="h-[220px] lg:h-[280px] w-full"
          style={{ zIndex: 0 }}
        />

        {/* 中央固定ピン（Uberスタイル） */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="relative flex flex-col items-center">
            <div className="w-4 h-4 rounded-full bg-gray-900 shadow-lg" />
            {/* 中心点への線 */}
            <div className="w-0.5 h-6 bg-gray-900" />
            {/* 影 */}
            <div className="w-3 h-1.5 bg-black/30 rounded-full blur-[2px] -mt-0.5" />
          </div>
        </div>

        {/* 現在地ボタン（右下、ズームコントロールの上） */}
        <button
          onClick={handleCurrentLocation}
          disabled={isLocating}
          className={`absolute bottom-24 right-2 z-20 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center transition-all hover:bg-gray-50 active:scale-95 ${
            isLocating ? "animate-pulse" : ""
          }`}
          title="現在地に移動"
        >
          {isLocating ? (
            <div className="w-5 h-5 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Locate className="w-5 h-5 text-sky-600" />
          )}
        </button>

        {/* 座標表示（左下） */}
        <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md z-20">
          <div className="flex items-center gap-2">
            <Crosshair size={14} className="text-sky-500" />
            <div className="text-xs">
              <span className="text-gray-500">緯度:</span>
              <span className="font-mono text-gray-700 ml-1">
                {displayCoords.lat.toFixed(6)}
              </span>
            </div>
            <div className="text-xs">
              <span className="text-gray-500">経度:</span>
              <span className="font-mono text-gray-700 ml-1">
                {displayCoords.lng.toFixed(6)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 操作ガイド */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-gray-200 rounded flex items-center justify-center">
            <Navigation size={10} className="text-gray-500" />
          </div>
          <span>マップをドラッグして位置を選択</span>
        </div>
        <span className="text-gray-300">|</span>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-sky-100 rounded-full flex items-center justify-center">
            <Locate size={10} className="text-sky-500" />
          </div>
          <span>現在地へ移動</span>
        </div>
      </div>
    </div>
  );
}
