"use client";

import { useEffect, useState } from "react";
import { Card, CardBody } from "@heroui/react";
import Image from "next/image";
import { useWorkerStore, useTrustPassportStore } from "@/stores";

const DEFAULT_NAME = "田中　一郎";
const DEFAULT_BALANCE = 81520;
const DEFAULT_RANK = "BRONZE";

// Rank-based styling configurations
const rankStyles = {
  BRONZE: {
    borderColor: "border-orange-500",
    glowColor: "shadow-orange-500/50",
    ringColor: "ring-orange-400",
    ringGlow: "shadow-orange-400/60",
    gradientFrom: "from-orange-900/20",
    gradientTo: "to-amber-800/10",
  },
  SILVER: {
    borderColor: "border-slate-400",
    glowColor: "shadow-slate-400/50",
    ringColor: "ring-slate-300",
    ringGlow: "shadow-slate-300/60",
    gradientFrom: "from-slate-700/20",
    gradientTo: "to-gray-600/10",
  },
  GOLD: {
    borderColor: "border-yellow-400",
    glowColor: "shadow-yellow-400/50",
    ringColor: "ring-yellow-300",
    ringGlow: "shadow-yellow-300/60",
    gradientFrom: "from-yellow-800/20",
    gradientTo: "to-amber-700/10",
  },
  PLATINUM: {
    borderColor: "border-cyan-300",
    glowColor: "shadow-cyan-300/50",
    ringColor: "ring-cyan-200",
    ringGlow: "shadow-cyan-200/60",
    gradientFrom: "from-cyan-800/20",
    gradientTo: "to-blue-700/10",
  },
};

type RankType = keyof typeof rankStyles;

export function GuildCard() {
  const [isHydrated, setIsHydrated] = useState(false);

  const worker = useWorkerStore((state) => state.worker);
  const jpycBalance = useWorkerStore((state) => state.jpycBalance);
  const getRank = useTrustPassportStore((state) => state.getRank);

  // Rehydrate stores on mount
  useEffect(() => {
    useWorkerStore.persist.rehydrate();
    useTrustPassportStore.persist.rehydrate();
    setIsHydrated(true);
  }, []);

  // Use default values until hydration is complete or if store is empty
  const displayName = isHydrated && worker?.name ? worker.name : DEFAULT_NAME;
  const displayBalance =
    isHydrated && jpycBalance > 0 ? jpycBalance : DEFAULT_BALANCE;
  const displayRank = (
    isHydrated ? getRank().toUpperCase() : DEFAULT_RANK
  ) as RankType;

  const formattedBalance = displayBalance.toLocaleString();

  // Get rank-specific styles
  const currentRankStyle = rankStyles[displayRank] || rankStyles.BRONZE;

  return (
    <div className="mx-4 relative group">
      {/* Outer glow effect */}
      <div
        className={`absolute -inset-1 rounded-2xl blur-md opacity-60 ${currentRankStyle.glowColor} bg-current transition-opacity duration-300 group-hover:opacity-80`}
        style={{
          background:
            displayRank === "BRONZE"
              ? "linear-gradient(135deg, rgba(234,88,12,0.4), rgba(217,119,6,0.2))"
              : displayRank === "SILVER"
                ? "linear-gradient(135deg, rgba(148,163,184,0.4), rgba(107,114,128,0.2))"
                : displayRank === "GOLD"
                  ? "linear-gradient(135deg, rgba(250,204,21,0.4), rgba(245,158,11,0.2))"
                  : "linear-gradient(135deg, rgba(103,232,249,0.4), rgba(59,130,246,0.2))",
        }}
      />

      <Card
        className={`relative overflow-hidden border-2 ${currentRankStyle.borderColor} backdrop-blur-sm`}
        radius="lg"
        shadow="lg"
        style={{
          background:
            "linear-gradient(145deg, rgba(30,41,59,0.95), rgba(15,23,42,0.98))",
        }}
      >
        {/* Subtle shine effect overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            background:
              "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.05) 50%, transparent 55%)",
          }}
        />

        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: "16px 16px",
          }}
        />

        <CardBody className="relative flex flex-row items-center gap-3 p-3">
          {/* Left: Avatar with rank-colored ring */}
          <div className="relative shrink-0">
            {/* Outer decorative ring with glow */}
            <div
              className={`absolute -inset-1 rounded-full ${currentRankStyle.ringGlow} blur-sm`}
              style={{
                background:
                  displayRank === "BRONZE"
                    ? "linear-gradient(135deg, rgba(251,146,60,0.6), rgba(234,88,12,0.4))"
                    : displayRank === "SILVER"
                      ? "linear-gradient(135deg, rgba(203,213,225,0.6), rgba(148,163,184,0.4))"
                      : displayRank === "GOLD"
                        ? "linear-gradient(135deg, rgba(253,224,71,0.6), rgba(250,204,21,0.4))"
                        : "linear-gradient(135deg, rgba(165,243,252,0.6), rgba(103,232,249,0.4))",
              }}
            />

            {/* Avatar container with ring */}
            <div
              className={`relative w-14 h-14 rounded-full ring-2 ${currentRankStyle.ringColor} ring-offset-2 ring-offset-slate-900 overflow-hidden`}
            >
              <Image
                src="/avatar4.png"
                alt={displayName}
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
          </div>

          {/* Center: Label and Name */}
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-xs text-slate-400 tracking-wider uppercase">
              探索者
            </span>
            <span className="text-base font-bold text-white truncate drop-shadow-sm">
              {displayName}
            </span>
          </div>

          {/* Right: Balance and Class */}
          <div className="flex flex-col items-end shrink-0">
            {/* Enhanced JPYC balance display */}
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-white tracking-tight drop-shadow-md">
                {formattedBalance}
              </span>
              <span className="text-sm font-semibold text-slate-300">JPYC</span>
            </div>

            {/* Rank badge */}
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-xs text-slate-400">class</span>
              <span
                className={`text-xs font-bold tracking-wider ${
                  displayRank === "BRONZE"
                    ? "text-orange-400"
                    : displayRank === "SILVER"
                      ? "text-slate-300"
                      : displayRank === "GOLD"
                        ? "text-yellow-400"
                        : "text-cyan-300"
                }`}
              >
                {displayRank}
              </span>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
