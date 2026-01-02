"use client";

import { ReactNode } from "react";
import { useTimeBasedBackground } from "@/hooks/workers/useTimeBasedBackground";

interface BackgroundImageProps {
  children: ReactNode;
}

/**
 * 時間帯に応じた背景画像を表示するレイアウトコンポーネント
 *
 * - フルスクリーン背景画像（画面全体を覆う）
 * - 50%不透明度の黒オーバーレイ
 * - childrenをオーバーレイの上に配置
 */
export function BackgroundImage({ children }: BackgroundImageProps) {
  const { backgroundPath } = useTimeBasedBackground();

  return (
    <div className="relative min-h-screen w-full">
      {/* Background Image - Fixed position, covers entire screen */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundPath})` }}
        aria-hidden="true"
      />

      {/* Black Overlay - 50% opacity */}
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

      {/* Content - Positioned above the overlay */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
