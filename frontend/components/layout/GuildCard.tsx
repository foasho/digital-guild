"use client";

import { useEffect, useState } from "react";
import { Card, CardBody } from "@heroui/react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useWorkerStore, useTrustPassportStore } from "@/stores";

const DEFAULT_NAME = "田中　一郎";
const DEFAULT_BALANCE = 81520;
const DEFAULT_RANK = "BRONZE";
const DEFAULT_REGISTERED_AT = "2026-01-07T00:00:00Z";
const DEFAULT_CERT_ID = "17695712143";

// Rank-based styling configurations
const rankStyles = {
  BRONZE: {
    ringColor: "ring-white/90",
    frameFrom: "#E7C892",
    frameTo: "#A8772D",
    bgFrom: "#C98C3B",
    bgMid: "#E1C08A",
    bgTo: "#7A4D1B",
  },
  SILVER: {
    ringColor: "ring-white/90",
    frameFrom: "#E5E7EB",
    frameTo: "#9CA3AF",
    bgFrom: "#9CA3AF",
    bgMid: "#E5E7EB",
    bgTo: "#6B7280",
  },
  GOLD: {
    ringColor: "ring-white/90",
    frameFrom: "#FDE68A",
    frameTo: "#D97706",
    bgFrom: "#D9A441",
    bgMid: "#F3D08B",
    bgTo: "#8A5A18",
  },
  PLATINUM: {
    ringColor: "ring-white/90",
    frameFrom: "#BAE6FD",
    frameTo: "#67E8F9",
    bgFrom: "#3BA7C9",
    bgMid: "#A7E8F6",
    bgTo: "#1E6A82",
  },
};

type RankType = keyof typeof rankStyles;

function formatRegisteredAt(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "2026/01/07";
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

function toCertificateId(input: string): string {
  if (/^\d{6,}$/.test(input)) return input;
  // stable hash -> 11 digits
  let h = 5381;
  for (let i = 0; i < input.length; i++) h = (h * 33) ^ input.charCodeAt(i);
  const mod = 100_000_000_000; // 1e11
  const n = Math.abs(h) % mod;
  return String(n).padStart(11, "0");
}

export function GuildCard() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

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
  const displayRegisteredAt = formatRegisteredAt(
    isHydrated && worker?.createdAt ? worker.createdAt : DEFAULT_REGISTERED_AT,
  );
  const displayCertId =
    isHydrated && worker?.id ? toCertificateId(worker.id) : DEFAULT_CERT_ID;

  const formattedBalance = displayBalance.toLocaleString();

  // Get rank-specific styles
  const currentRankStyle = rankStyles[displayRank] || rankStyles.BRONZE;

  return (
    <div className="mx-4 relative">
      <button
        type="button"
        className="block w-full text-left rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        aria-expanded={isExpanded}
        aria-label="ギルド証を開閉"
        onClick={() => setIsExpanded((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsExpanded((v) => !v);
          }
        }}
      >
        <div
          className="relative rounded-[16px] p-[2px] shadow-[0_14px_28px_rgba(0,0,0,0.35)] active:scale-[0.99] transition-transform"
          style={{
            background: `linear-gradient(135deg, ${currentRankStyle.frameFrom}, ${currentRankStyle.frameTo})`,
          }}
        >
          <Card
            className="relative overflow-hidden rounded-[14px] border border-white/25"
            shadow="none"
            radius="none"
            style={{
              background: `linear-gradient(135deg, ${currentRankStyle.bgFrom}, ${currentRankStyle.bgMid} 55%, ${currentRankStyle.bgTo})`,
            }}
          >
            {/* 中央の光沢ストライプ */}
            <div
              className="absolute inset-0 pointer-events-none opacity-60"
              style={{
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0) 35%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0) 65%)",
              }}
            />

            {/* 微細パターン */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.10]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.35) 1px, transparent 0)",
                backgroundSize: "18px 18px",
              }}
            />

            <CardBody className="relative p-0 text-white">
              {/* ヘッダー（折りたたみでも共通） */}
              <div className="flex items-start gap-3 px-4 pt-3">
                <div className="relative shrink-0">
                  <div
                    className={`relative w-12 h-12 rounded-full overflow-hidden ring-2 ${currentRankStyle.ringColor} bg-black/10`}
                  >
                    <Image
                      src="/avatar4.png"
                      alt={displayName}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold tracking-wider opacity-95">
                    探索者
                  </div>
                  <div className="mt-1 text-xl font-extrabold tracking-wide truncate">
                    {displayName}
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <div className="text-lg font-extrabold tracking-tight">
                    {formattedBalance}{" "}
                    <span className="text-sm font-bold opacity-95">JPYC</span>
                  </div>
                  <div className="my-1 flex items-center justify-end gap-2">
                    {!isExpanded && (
                      <>
                        <div className="text-xs opacity-90">class</div>
                        <div className="text-sm font-extrabold tracking-widest">
                          {displayRank}
                        </div>
                      </>
                    )}
                    <motion.span
                      className="opacity-70"
                      animate={{
                        rotate: isExpanded ? 180 : 0,
                        opacity: isExpanded ? 0 : 0.7,
                      }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      aria-hidden="true"
                    >
                      <ChevronDown size={14} />
                    </motion.span>
                  </div>
                </div>
              </div>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    key="expanded"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pt-5">
                      <div className="text-lg font-semibold opacity-95">
                        class
                      </div>
                      <div className="mt-2 text-4xl leading-none font-extrabold tracking-widest drop-shadow-[0_2px_0_rgba(0,0,0,0.15)]">
                        {displayRank}
                      </div>
                    </div>

                    <div className="px-4 pb-4 pt-6">
                      <div className="flex justify-end text-base">
                        登録: {displayRegisteredAt}
                      </div>

                      <div className="mt-4 grid grid-cols-[auto_1fr] items-end gap-4">
                        <div className="text-base">
                          ID: {displayCertId}
                        </div>
                        <div className="text-base text-right">
                          デジタルギルド公式認証
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardBody>
          </Card>
        </div>
      </button>
    </div>
  );
}
