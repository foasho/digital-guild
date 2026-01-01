"use client";

import { Card, CardBody } from "@heroui/react";
import type { ReactNode } from "react";

interface StatItem {
  label: string;
  value: number | string;
  icon: ReactNode;
}

interface StatsSummaryProps {
  stats: StatItem[];
}

export function StatsSummary({ stats }: StatsSummaryProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <Card
          key={`${stat.label}-${index}`}
          className="bg-white border border-gray-200 shadow-sm rounded-xl"
        >
          <CardBody className="p-4">
            <div className="flex flex-col items-center text-center">
              {/* アイコン */}
              <div className="text-gray-500 mb-2">{stat.icon}</div>

              {/* 値 */}
              <div className="text-2xl font-bold text-gray-800 mb-1">
                {typeof stat.value === "number"
                  ? stat.value.toLocaleString()
                  : stat.value}
              </div>

              {/* ラベル */}
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
