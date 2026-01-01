"use client";

import { Card, CardBody } from "@heroui/react";
import type { ReactNode } from "react";

interface StatItem {
  label: string;
  value: number | string;
  icon: ReactNode;
  color?: "blue" | "green" | "yellow" | "purple" | "red" | "gray";
}

interface StatsSummaryProps {
  stats: StatItem[];
}

const colorClasses = {
  blue: {
    bg: "bg-blue-100",
    text: "text-blue-600",
  },
  green: {
    bg: "bg-green-100",
    text: "text-green-600",
  },
  yellow: {
    bg: "bg-yellow-100",
    text: "text-yellow-600",
  },
  purple: {
    bg: "bg-purple-100",
    text: "text-purple-600",
  },
  red: {
    bg: "bg-red-100",
    text: "text-red-600",
  },
  gray: {
    bg: "bg-gray-100",
    text: "text-gray-600",
  },
};

export function StatsSummary({ stats }: StatsSummaryProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((stat, index) => {
        const color = stat.color || "gray";
        const colorClass = colorClasses[color];

        return (
          <Card
            key={`${stat.label}-${index}`}
            className="bg-white border border-gray-200 shadow-sm rounded-xl"
          >
            <CardBody className="p-6">
              <div className="flex flex-col items-center text-center">
                {/* アイコン（円形背景付き） */}
                <div
                  className={`w-12 h-12 rounded-full ${colorClass.bg} flex items-center justify-center mb-3`}
                >
                  <div className={colorClass.text}>{stat.icon}</div>
                </div>

                {/* 値 */}
                <div className="text-3xl font-extrabold text-gray-800 mb-2">
                  {typeof stat.value === "number"
                    ? stat.value.toLocaleString()
                    : stat.value}
                </div>

                {/* ラベル */}
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
}
