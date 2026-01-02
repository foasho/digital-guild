"use client";

import { Card, CardBody, Progress } from "@heroui/react";
import { Coins, TrendingUp, Wallet, Zap } from "lucide-react";
import type { Subsidy } from "@/types";

interface SubsidyPanelProps {
  subsidies: Subsidy[];
  usedAmount: number;
}

export function SubsidyPanel({ subsidies, usedAmount }: SubsidyPanelProps) {
  const totalSubsidy = subsidies.reduce((acc, s) => acc + s.amount, 0);
  const remainingAmount = totalSubsidy - usedAmount;
  const usedPercentage =
    totalSubsidy > 0 ? Math.round((usedAmount / totalSubsidy) * 100) : 0;

  const formatAmount = (amount: number) => {
    if (amount >= 10000) {
      return `${(amount / 10000).toFixed(1)}万`;
    }
    return amount.toLocaleString();
  };

  return (
    <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 shadow-sm rounded-2xl overflow-hidden">
      <CardBody className="p-5">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 rounded-xl">
              <Coins className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">公的補助金</h3>
              <p className="text-xs text-gray-500">AIインセンティブ原資</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full text-xs font-medium">
            <TrendingUp className="w-3 h-3" />
            <span>インセンティブ</span>
          </div>
        </div>

        {/* 金額情報 */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white/60 rounded-xl p-3">
            <div className="flex items-center gap-1 text-gray-500 text-xs mb-1">
              <Wallet className="w-3 h-3" />
              <span>総額</span>
            </div>
            <p className="text-xl font-bold text-gray-800">
              ¥{formatAmount(totalSubsidy)}
            </p>
          </div>
          <div className="bg-white/60 rounded-xl p-3">
            <div className="flex items-center gap-1 text-gray-500 text-xs mb-1">
              <Zap className="w-3 h-3" />
              <span>残高</span>
            </div>
            <p className="text-xl font-bold text-emerald-600">
              ¥{formatAmount(remainingAmount)}
            </p>
          </div>
        </div>

        {/* プログレスバー */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-600">
            <span>使用済み: ¥{usedAmount.toLocaleString()}</span>
            <span>{usedPercentage}%</span>
          </div>
          <Progress
            value={usedPercentage}
            size="sm"
            classNames={{
              base: "max-w-full",
              track: "bg-emerald-100",
              indicator: "bg-gradient-to-r from-emerald-400 to-teal-500",
            }}
          />
        </div>

        {/* AIインセンティブ説明 */}
        <div className="mt-4 p-3 bg-white/80 rounded-xl border border-emerald-100">
          <p className="text-xs text-gray-600 leading-relaxed">
            <span className="font-semibold text-emerald-700">
              AIエージェント
            </span>
            が天候・曜日・エリアに応じてインセンティブを自動調整し、ジョブの平準化を支援します。
          </p>
        </div>
      </CardBody>
    </Card>
  );
}

