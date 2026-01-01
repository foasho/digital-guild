"use client";

import Image from "next/image";
import { Smartphone } from "lucide-react";

/**
 * MobileOnlyOverlay
 * sm(640px)以上の画面サイズで表示される全画面オーバーレイ
 * スマホでのアクセスを促すQRコードとメッセージを表示
 */
export function MobileOnlyOverlay() {
  return (
    <div className="hidden sm:flex fixed inset-0 z-[9999] bg-white flex-col items-center justify-center p-8">
      {/* アイコン */}
      <div className="mb-6">
        <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center">
          <Smartphone size={32} className="text-sky-600" />
        </div>
      </div>

      {/* タイトル */}
      <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">
        Digital GUILD
      </h1>
      <p className="text-gray-500 mb-8 text-center">
        Worker App
      </p>

      {/* QRコード */}
      <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 shadow-lg mb-6">
        <Image
          src="/links/worker.png"
          alt="QRコード"
          width={200}
          height={200}
          className="w-48 h-48"
          priority
        />
      </div>

      {/* メッセージ */}
      <p className="text-gray-700 text-center font-medium mb-2">
        こちらをスマホで読み取り
      </p>
      <p className="text-gray-700 text-center font-medium">
        アプリを開いてください。
      </p>

      {/* 補足 */}
      <p className="text-gray-400 text-sm mt-8 text-center">
        このアプリはスマートフォン専用です
      </p>
    </div>
  );
}
