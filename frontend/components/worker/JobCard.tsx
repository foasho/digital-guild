"use client";

import { Button, Card, CardBody, Chip } from "@heroui/react";
import { TrendingUp } from "lucide-react";
import type { Job } from "@/types";

interface JobCardProps {
  job: Job;
  isRecommended?: boolean;
  isBookmarked?: boolean;
  onDetailClick: () => void;
  onBookmarkClick: () => void;
}

export function JobCard({
  job,
  isRecommended = false,
  isBookmarked = false,
  onDetailClick,
  onBookmarkClick,
}: JobCardProps) {
  // 報酬合計（reward + aiInsentiveReward）
  const totalReward = job.reward + job.aiInsentiveReward;
  // AIインセンティブが含まれているかどうか
  const hasIncentive = job.aiInsentiveReward > 0;

  // 日付フォーマット（2026年1月6日〜）
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}年${month}月${day}日〜`;
  };

  return (
    <Card
      className="relative w-full overflow-hidden rounded-xl drop-shadow-lg hover:drop-shadow-2xl transition-all duration-300"
      radius="lg"
      shadow="md"
    >
      {/* 背景画像 + グラデーションオーバーレイ（下部をより暗く） */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${job.imageUrl})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />

      {/* コンテンツ */}
      <CardBody className="relative z-10 flex flex-col min-h-[200px] p-4">
        {/* 上部: 報酬とおすすめバッジ */}
        <div className="flex justify-between items-start">
          {/* 左上: 報酬額とインセンティブChip */}
          <div className="flex flex-col gap-1.5">
            <div className="text-white font-extrabold text-2xl drop-shadow-md">
              <span className="text-amber-300">¥</span>
              <span className="text-amber-100">{totalReward.toLocaleString()}</span>
              <span className="text-base font-bold text-white/80 ml-1">/ 回</span>
            </div>
            {/* インセンティブChip */}
            {hasIncentive && (
              <Chip
                size="sm"
                variant="flat"
                startContent={<TrendingUp size={12} />}
                classNames={{
                  base: "bg-gradient-to-r from-emerald-500/90 to-teal-500/90 border-0 shadow-lg shadow-emerald-500/30 animate-pulse",
                  content: "text-white font-bold text-[10px] tracking-wide drop-shadow-sm",
                }}
              >
                報酬UP中
              </Chip>
            )}
          </div>

          {/* 右上: AIレコメンドバッジ（グラデーションリボン風） */}
          {isRecommended && (
            <div className="absolute top-0 right-0 overflow-hidden w-28 h-28 pointer-events-none">
              <div
                className="absolute top-4 right-[-32px] w-36 text-center text-[10px] font-bold text-white pl-3 py-1.5 transform rotate-45 shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #f59e0b 0%, #ea580c 50%, #dc2626 100%)",
                  boxShadow: "0 2px 8px rgba(245, 158, 11, 0.5)",
                }}
              >
                あなたにおすすめ
              </div>
            </div>
          )}
        </div>

        {/* 中央スペーサー */}
        <div className="flex-1" />

        {/* 下部: ジョブ情報とアクション */}
        <div className="flex justify-between items-end gap-2">
          {/* 左下: ジョブ情報 */}
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold text-lg mb-1 truncate">
              {job.title}
            </h3>
            <div className="flex items-center gap-1 text-white/90 text-sm mb-1">
              <svg
                className="w-4 h-4 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="truncate">{job.location}</span>
            </div>
            <div className="flex items-center gap-1 text-white/90 text-sm mb-2">
              <svg
                className="w-4 h-4 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{formatDate(job.scheduledDate)}</span>
            </div>
            <p className="text-white/80 text-sm line-clamp-1">
              {job.description}
            </p>
          </div>

          {/* 右下: ブックマークとボタン */}
          <div className="flex flex-col items-end gap-2 shrink-0">
            {/* ブックマークアイコン */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onBookmarkClick();
              }}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              aria-label={isBookmarked ? "ブックマーク解除" : "ブックマーク"}
            >
              <svg
                className={`w-6 h-6 ${isBookmarked ? "text-amber-400 fill-amber-400" : "text-white"}`}
                fill={isBookmarked ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </button>

            {/* 詳細ボタン */}
            <Button
              size="sm"
              className="bg-white/25 transition-colors duration-300 hover:bg-white/35 text-white font-semibold px-4"
              radius="full"
              variant="solid"
              onPress={onDetailClick}
            >
              詳細はこちら
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
