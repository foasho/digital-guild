"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useWalletStore } from "@/stores/useWalletStore";
import { useWorkerStore } from "@/stores/useWorkerStore";
import type { TransactionHistory } from "@/types";

// 日時フォーマット: 2026/01/05 18:12
function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}/${month}/${day} ${hours}:${minutes}`;
}

// 金額フォーマット: +3,000 or -8,000
function formatAmount(amount: number): string {
  const absAmount = Math.abs(amount).toLocaleString();
  return amount >= 0 ? `+${absAmount}` : `-${absAmount}`;
}

// 取引履歴の相手先を取得（支払い先 or 受取元）
function getCounterparty(transaction: TransactionHistory): string {
  // マイナス（支払い）の場合は to、プラス（受取）の場合は from
  return transaction.amount < 0 ? transaction.to : transaction.from;
}

// 取引履歴アイテムコンポーネント
function TransactionItem({
  transaction,
}: {
  transaction: TransactionHistory;
}) {
  const isPositive = transaction.amount >= 0;

  return (
    <div className="py-3 border-b border-white/10 last:border-b-0">
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <p className="text-white/60 text-sm">
            {formatDateTime(transaction.tradedAt)}
          </p>
          <p className="text-white font-medium truncate">
            {getCounterparty(transaction)}
          </p>
        </div>
        <div
          className={`text-right font-bold ${
            isPositive ? "text-green-400" : "text-red-400"
          }`}
        >
          {formatAmount(transaction.amount)} JPYC
        </div>
      </div>
    </div>
  );
}

export default function WalletPage() {
  const { jpycBalance } = useWorkerStore();
  const { transactions, initializeMockData } = useWalletStore();

  // Hydration対策
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    useWorkerStore.persist.rehydrate();
    useWalletStore.persist.rehydrate();
    setIsHydrated(true);
  }, []);

  // モックデータの初期化
  useEffect(() => {
    if (isHydrated) {
      initializeMockData();
    }
  }, [isHydrated, initializeMockData]);

  // 残高を表示用に整形（モックでは81,520を使用、実際のbalanceが0の場合）
  const displayBalance = jpycBalance > 0 ? jpycBalance : 81520;

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-white/50">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col px-4 py-4">
      {/* ウォレットカード */}
      <div className="bg-white rounded-2xl p-5 shadow-lg">
        {/* ヘッダー: JPYCロゴ + タイトル */}
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-amber-200">
          <Image
            src="/logo/jpyc.png"
            alt="JPYC Logo"
            width={32}
            height={32}
            className="object-contain"
          />
          <span className="text-gray-800 font-semibold text-lg tracking-wide">
            DIGITAL GUILD WALLET
          </span>
        </div>

        {/* バーコード */}
        <div className="flex justify-center mb-4">
          <Image
            src="/logo/barcode.png"
            alt="Barcode"
            width={280}
            height={60}
            className="object-contain"
          />
        </div>

        {/* QRコード + 残高 */}
        <div className="flex items-center justify-center gap-4 mb-2">
          <Image
            src="/logo/qr.png"
            alt="QR Code"
            width={80}
            height={80}
            className="object-contain"
          />
          <div className="flex items-baseline gap-2">
            <span className="text-gray-600 text-sm">残高</span>
            <span className="text-gray-900 font-bold text-3xl">
              {displayBalance.toLocaleString()}
            </span>
            <span className="text-gray-600 text-sm">JPYC</span>
          </div>
        </div>
      </div>

      {/* スキャンして支払うボタン */}
      <button
        type="button"
        className="mt-4 mx-auto flex items-center gap-2 px-8 py-3 bg-white/90 hover:bg-white rounded-full shadow-md transition-colors"
      >
        <svg
          className="w-5 h-5 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <span className="text-gray-700 font-medium">
          スキャンして支払う
        </span>
      </button>

      {/* 取引履歴セクション */}
      <div className="mt-6">
        <h2 className="text-white text-xl font-bold text-center mb-4">
          取引履歴
        </h2>

        {/* 取引履歴リスト */}
        <div className="space-y-0">
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-white/50">取引履歴がありません</p>
            </div>
          ) : (
            transactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
