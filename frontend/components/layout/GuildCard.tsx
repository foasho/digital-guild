"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardBody } from "@heroui/react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import {
  useWorkerStore,
  useTrustPassportStore,
  useUndertakedJobStore,
} from "@/stores";
import {
  undertakedJobs as defaultUndertakedJobs,
  workerSkills as defaultWorkerSkills,
} from "@/constants/mocks";

const DEFAULT_NAME = "田中　一郎";
const DEFAULT_BALANCE = 81520;
const DEFAULT_RANK = "BRONZE";
const DEFAULT_REGISTERED_AT = "2026-01-07T00:00:00Z";
const DEFAULT_CERT_ID = "17695712143";
const DEFAULT_WORKER_ID = "worker-1";

// Rank-based styling configurations
const rankStyles = {
  BRONZE: {
    opacity: 0.5,
    ringColor: "ring-white/90",
    // Bronze: GOLDと区別しやすいように、赤みのある銅色寄りに
    frameFrom: "#D8A37A",
    frameTo: "#7A3A12",
    bgFrom: "#B86B2E",
    bgMid: "#D9A06B",
    bgTo: "#5A260D",
  },
  SILVER: {
    opacity: 0.5,
    ringColor: "ring-white/90",
    frameFrom: "#E5E7EB",
    frameTo: "#9CA3AF",
    bgFrom: "#9CA3AF",
    bgMid: "#E5E7EB",
    bgTo: "#6B7280",
  },
  GOLD: {
    opacity: 0.8,
    ringColor: "ring-white/90",
    frameFrom: "#FDE68A",
    frameTo: "#D97706",
    bgFrom: "#D9A441",
    bgMid: "#F3D08B",
    bgTo: "#8A5A18",
  },
  PLATINUM: {
    opacity: 0.9,
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
  const passportSkills = useTrustPassportStore((state) => state.skills);
  const storeUndertakedJobs = useUndertakedJobStore(
    (state) => state.undertakedJobs,
  );

  // Rehydrate stores on mount
  useEffect(() => {
    useWorkerStore.persist.rehydrate();
    useTrustPassportStore.persist.rehydrate();
    useUndertakedJobStore.persist.rehydrate();
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
  const displayWorkerId =
    isHydrated && worker?.id ? worker.id : DEFAULT_WORKER_ID;

  const formattedBalance = displayBalance.toLocaleString();

  // Get rank-specific styles
  const currentRankStyle = rankStyles[displayRank] || rankStyles.BRONZE;
  // NOTE: このアプリは背景に黒マスク（bg-black/50）が乗るため、
  // 数値のopacity=0.5でも「見た目の50%透過」に見えにくい。
  // 体感で50%くらい透けて見えるように、実際の描画は係数で落とす。
  const visualOpacity = Math.min(1, currentRankStyle.opacity * 0.6);

  // ステータス詳細を undertakedJobs から算出
  const statusDetail = useMemo(() => {
    // storeにデータがあればそれを使う、なければモックデータをフォールバック
    const jobs =
      isHydrated && storeUndertakedJobs.length > 0
        ? storeUndertakedJobs
        : defaultUndertakedJobs;

    // 完了済みジョブ（当該ワーカーの）
    const completedJobs = jobs.filter(
      (j) => j.workerId === displayWorkerId && j.status === "completed",
    );

    // 作業実績数（最大50）
    const completedCount = Math.min(50, completedJobs.length);

    // 評価平均（requesterEvalScore が null でないもの）
    const scoredJobs = completedJobs.filter(
      (j) => j.requesterEvalScore !== null,
    );
    const avgRating =
      scoredJobs.length > 0
        ? scoredJobs.reduce((sum, j) => sum + (j.requesterEvalScore ?? 0), 0) /
          scoredJobs.length
        : 0;

    // 信頼度 = 完了ジョブ数（最大50） + 評価平均 × 10
    const trustScore = Math.min(
      100,
      Math.round(completedCount + avgRating * 10),
    );

  
    const canceledJobs = jobs.filter(
      (j) => j.workerId === displayWorkerId && j.status === "canceled",
    );

    return {
      completedJobs: completedCount,
      avgRating,
      trustScore,
      canceledJobs: canceledJobs.length,
    };
  }, [isHydrated, storeUndertakedJobs, displayWorkerId]);

  // スキル統計を workerSkills から算出
  const skillStats = useMemo(() => {
    // storeにデータがあればそれを使う、なければモックデータをフォールバック
    const skills =
      isHydrated && passportSkills.length > 0
        ? passportSkills
        : defaultWorkerSkills;

    // 当該ワーカーのスキルのみ
    const workerSkillList = skills.filter(
      (s) => s.workerId === displayWorkerId,
    );

    // スキル名でグルーピングしてカウント
    const countMap = new Map<string, number>();
    for (const s of workerSkillList) {
      countMap.set(s.name, (countMap.get(s.name) ?? 0) + 1);
    }

    // 配列に変換してソート
    const sorted = Array.from(countMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    const total = workerSkillList.length;
    const topTwo = sorted.slice(0, 2);

    return { total, topTwo };
  }, [isHydrated, passportSkills, displayWorkerId]);

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
        <div className="relative rounded-[16px] p-[2px] shadow-[0_14px_28px_rgba(0,0,0,0.35)] active:scale-[0.99] transition-transform">
          {/* フレーム（opacity適用。子要素は透過させないため、背景レイヤーとして描画） */}
          <div
            className="absolute inset-0 rounded-[16px] pointer-events-none"
            style={{
              background: `linear-gradient(135deg, ${currentRankStyle.frameFrom}, ${currentRankStyle.frameTo})`,
              opacity: visualOpacity,
            }}
          />

          <Card
            className="relative overflow-hidden rounded-[14px] border"
            shadow="none"
            radius="none"
            style={{
              background: "transparent",
              borderColor: `rgba(255,255,255,${0.25 * visualOpacity})`,
            }}
          >
            {/* 背景グラデ（rankStyles.opacity で透過。文字/枠は透過させない） */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `linear-gradient(135deg, ${currentRankStyle.bgFrom}, ${currentRankStyle.bgMid} 55%, ${currentRankStyle.bgTo})`,
                opacity: visualOpacity,
              }}
            />

            {/* 中央の光沢ストライプ */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0) 35%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0) 65%)",
                opacity: 0.6 * visualOpacity,
              }}
            />

            {/* 微細パターン */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.35) 1px, transparent 0)",
                backgroundSize: "18px 18px",
                opacity: 0.1 * visualOpacity,
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
                    冒険者
                  </div>
                  <div className="mt-1 text-lg font-extrabold tracking-wide truncate">
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
                        <div className="text-xs opacity-90">Rank</div>
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
                    <div className="px-4 pt-5 flex items-end justify-between">
                      <div>
                        <div className="text-xs font-semibold opacity-90 tracking-wider">
                          CURRENT RANK
                        </div>
                        <div className="mt-2 text-4xl leading-none font-extrabold tracking-widest drop-shadow-[0_2px_0_rgba(0,0,0,0.15)]">
                          {displayRank}
                        </div>
                      </div>

                      {/* eKYC 取得済みバッジ */}
                      <div className="flex flex-col items-center gap-1">
                        <svg
                          viewBox="0 0 64 80"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-10 h-12 drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
                        >
                          {/* メダル本体 */}
                          <circle
                            cx="32"
                            cy="28"
                            r="20"
                            fill="rgba(255,255,255,0.15)"
                            stroke="rgba(255,255,255,0.8)"
                            strokeWidth="2"
                          />
                          <circle
                            cx="32"
                            cy="28"
                            r="14"
                            fill="rgba(255,255,255,0.1)"
                            stroke="rgba(255,255,255,0.5)"
                            strokeWidth="1"
                          />
                          {/* リボン */}
                          <path
                            d="M24 44 L20 72 L32 64 L44 72 L40 44"
                            fill="rgba(255,255,255,0.25)"
                            stroke="rgba(255,255,255,0.6)"
                            strokeWidth="1"
                          />
                        </svg>
                        <div className="text-xs font-semibold opacity-90 whitespace-nowrap">
                          eKYC 取得済み
                        </div>
                      </div>
                    </div>

                    <div className="px-4 pb-4 pt-3">
                      <div className="flex justify-end text-sm">
                        登録: {displayRegisteredAt}
                      </div>

                      <div className="mt-2 grid grid-cols-[auto_1fr] items-end gap-4">
                        <div className="text-sm">ID: {displayCertId}</div>
                        <div className="text-right text-sm">
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

        {/* ワンポイントヒント */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              key="rank-hint"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="mt-2 px-1 text-center text-xs text-white/80">
                {displayRank === "PLATINUM" ? (
                  <span>🎉 最高ランク達成！</span>
                ) : (
                  <span>
                    💡 あと{" "}
                    <span className="font-bold text-white">
                      {displayRank === "BRONZE"
                        ? 70 - statusDetail.trustScore
                        : displayRank === "SILVER"
                          ? 80 - statusDetail.trustScore
                          : 90 - statusDetail.trustScore}
                    </span>{" "}
                    ポイントで{" "}
                    <span className="font-bold text-white">
                      {displayRank === "BRONZE"
                        ? "SILVER"
                        : displayRank === "SILVER"
                          ? "GOLD"
                          : "PLATINUM"}
                    </span>{" "}
                    へ昇格
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ギルド証の下：ステータス詳細 */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              key="status-detail"
              initial={{ height: 0, opacity: 0, y: -4 }}
              animate={{ height: "auto", opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -4 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="mt-3 rounded-2xl bg-black/45 backdrop-blur-md border border-white/10 px-4 py-3 text-white">
                <div className="text-center text-sm font-semibold tracking-wide text-white/90">
                  ステータス詳細
                </div>

                <div className="mt-3 grid grid-cols-2 gap-4">
                  {/* 信頼度 */}
                  <div>
                    <div className="text-center text-xs text-white/70">
                      信頼度
                    </div>
                    <div className="mt-1 text-center text-3xl font-extrabold tracking-tight">
                      {statusDetail.trustScore}
                    </div>
                    <div className="mt-2 space-y-1 px-3 text-xs text-white/70">
                      <div className="flex justify-between">
                        <span>作業実績数</span>
                        <span>{statusDetail.completedJobs}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>作業者評価</span>
                        <span>{statusDetail.avgRating.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>キャンセル率</span>
                        <span>2.0%</span>
                      </div>
                    </div>
                  </div>

                  {/* スキル */}
                  <div>
                    <div className="text-center text-xs text-white/70">
                      スキル
                    </div>
                    <div className="mt-1 text-center text-3xl font-extrabold tracking-tight">
                      {skillStats.total}
                    </div>
                    <div className="mt-2 space-y-1 px-3 text-xs text-white/70">
                      {skillStats.topTwo.map((s) => (
                        <div key={s.name} className="flex justify-between">
                          <span>{s.name}</span>
                          <span>{s.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}
