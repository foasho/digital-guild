"use client";

import { Card, CardBody, Chip, Image } from "@heroui/react";
import { Users } from "lucide-react";
import type { Job } from "@/types";

interface RequesterJobCardProps {
  job: Job;
  applicantCount: number;
  status: "open" | "in_progress" | "pending_review" | "completed";
  onClick?: () => void;
}

// ステータスラベルと色の定義
const statusConfig: Record<
  RequesterJobCardProps["status"],
  { label: string; color: "success" | "warning" | "secondary" | "default" }
> = {
  open: { label: "募集中", color: "success" },
  in_progress: { label: "進行中", color: "warning" },
  pending_review: { label: "確認待ち", color: "secondary" },
  completed: { label: "完了", color: "default" },
};

export function RequesterJobCard({
  job,
  applicantCount,
  status,
  onClick,
}: RequesterJobCardProps) {
  const { label, color } = statusConfig[status];

  // 報酬合計（reward + aiInsentiveReward）
  const totalReward = job.reward + job.aiInsentiveReward;

  return (
    <Card
      className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer rounded-xl"
      isPressable={!!onClick}
      onPress={onClick}
    >
      <CardBody className="p-4">
        <div className="flex gap-4">
          {/* 左側: ジョブ画像 */}
          <div className="shrink-0">
            <Image
              src={job.imageUrl}
              alt={job.title}
              width={80}
              height={80}
              className="object-cover rounded-xl"
              fallbackSrc="/placeholder-job.png"
            />
          </div>

          {/* 右側: ジョブ情報 */}
          <div className="flex-1 min-w-0">
            {/* タイトルとステータス */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-bold text-gray-800 text-base truncate flex-1">
                {job.title}
              </h3>
              <Chip
                size="sm"
                color={color}
                variant="flat"
                className="shrink-0"
              >
                {label}
              </Chip>
            </div>

            {/* 報酬と応募者数 */}
            <div className="flex items-center justify-between">
              <div className="text-amber-600 font-bold text-lg">
                ¥{totalReward.toLocaleString()}
              </div>
              <div className="flex items-center gap-1 text-gray-500 text-sm">
                <Users size={16} />
                <span>応募者 {applicantCount}名</span>
              </div>
            </div>

            {/* 場所 */}
            <div className="text-gray-500 text-sm mt-1 truncate">
              {job.location}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
