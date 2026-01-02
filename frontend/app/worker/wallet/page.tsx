"use client";

import Image from "next/image";
import { useTransactionHistories, useWorker } from "@/hooks";
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
    <div className="py-4 px-3 bg-white/5 rounded-xl mb-3 last:mb-0 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
      <div className="flex justify-between items-center">
        <div className="flex-1 min-w-0">
          <p className="text-white/50 text-xs mb-1">
            {formatDateTime(transaction.tradedAt)}
          </p>
          <p className="text-white font-medium truncate">
            {getCounterparty(transaction)}
          </p>
        </div>
        <div
          className={`text-right font-bold text-lg ${
            isPositive
              ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]"
              : "text-rose-400 drop-shadow-[0_0_8px_rgba(251,113,133,0.5)]"
          }`}
        >
          {formatAmount(transaction.amount)} JPYC
        </div>
      </div>
    </div>
  );
}

export default function WalletPage() {
  // hooksから取得
  const { worker, pending: workerPending } = useWorker();
  const { transactions, balance, pending: txPending } = useTransactionHistories();

  const isLoading = workerPending || txPending;

  if (isLoading || !worker) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-white/50">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col px-4 py-4">
      {/* ウォレットカード */}
      <div className="relative bg-linear-to-br from-white via-gray-50 to-amber-50 rounded-2xl p-5 shadow-xl drop-shadow-2xl overflow-hidden">
        {/* 光沢効果 - 左上から右下へのハイライト */}
        <div className="absolute inset-0 bg-linear-to-br from-white/80 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-radial from-white/60 to-transparent rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-amber-100/40 to-transparent pointer-events-none" />

        {/* ヘッダー: JPYCロゴ + タイトル */}
        <div className="relative flex items-center justify-between mb-4 pb-3 border-b border-amber-200/60">
          <Image
            src="/logo/jpyc.png"
            alt="JPYC Logo"
            width={72}
            height={32}
            className="object-contain"
          />
          <span className="text-gray-800 font-semibold text-lg tracking-wide text-right">
            DIGITAL GUILD WALLET
          </span>
        </div>

        {/* バーコード */}
        <div className="relative flex justify-center mb-4">
          <Image
            src="/logo/barcode.png"
            alt="Barcode"
            width={280}
            height={60}
            className="object-contain"
          />
        </div>

        {/* QRコード + 残高 */}
        <div className="relative flex items-center justify-center gap-4 mb-2">
          <Image
            src="/logo/qr.png"
            alt="QR Code"
            width={80}
            height={80}
            className="object-contain"
          />
          <div className="flex items-baseline gap-2">
            <span className="text-gray-500 text-sm font-medium">残高</span>
            <span className="text-gray-900 font-bold text-3xl drop-shadow-sm">
              {balance.toLocaleString()}
            </span>
            <span className="text-gray-500 text-sm font-medium">JPYC</span>
          </div>
        </div>

        {/* カード下部の光沢ライン */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-amber-200/50 to-transparent" />
      </div>

      {/* スキャンして支払うボタン */}
      <button
        type="button"
        className="mt-4 mx-auto flex items-center gap-2 px-8 py-3 cursor-pointer border-white/20 border bg-white/15 hover:bg-white/55 rounded-full shadow-md transition-colors"
      >
        <svg
          className="w-5 h-5 text-white"
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
        <span className="text-white font-medium">スキャンして支払う</span>
      </button>

      {/* 取引履歴セクション */}
      <div className="mt-6">
        <h2 className="text-white text-xl font-bold text-center mb-4 drop-shadow-lg">
          取引履歴
        </h2>

        {/* 取引履歴リスト */}
        <div className="flex flex-col">
          {transactions.length === 0 ? (
            <div className="text-center py-8 bg-white/5 rounded-xl">
              <p className="text-white/50">取引履歴がありません</p>
            </div>
          ) : (
            transactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
