"use client";

import { Card, CardBody, Chip, Tab, Tabs } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import { CompletionReportModal } from "@/components/worker";
import { useJobStore } from "@/stores/useJobStore";
import { useUndertakedJobStore } from "@/stores/useUndertakedJobStore";
import type { Job, UndertakedJob } from "@/types";

// ステータスの日本語ラベル
const statusLabels: Record<UndertakedJob["status"], string> = {
  accepted: "着手中",
  in_progress: "作業中",
  completed: "完了",
  canceled: "キャンセル",
};

// ステータスの色
const statusColors: Record<
  UndertakedJob["status"],
  "warning" | "primary" | "success" | "danger"
> = {
  accepted: "warning",
  in_progress: "primary",
  completed: "success",
  canceled: "danger",
};

// 星評価を表示するコンポーネント
function StarRating({ score }: { score: number }) {
  const maxStars = 5;
  const fullStars = Math.floor(score);
  const hasHalfStar = score - fullStars >= 0.5;

  return (
    <div className="flex items-center gap-1">
      {[...Array(maxStars)].map((_, index) => {
        const starKey = `star-${index}`;
        if (index < fullStars) {
          return (
            <span key={starKey} className="text-amber-400 text-lg">
              ★
            </span>
          );
        }
        if (index === fullStars && hasHalfStar) {
          return (
            <span key={starKey} className="text-amber-400 text-lg relative">
              <span className="text-white/30">★</span>
              <span className="absolute inset-0 overflow-hidden w-1/2">★</span>
            </span>
          );
        }
        return (
          <span key={starKey} className="text-white/30 text-lg">
            ☆
          </span>
        );
      })}
      <span className="text-white/70 text-sm ml-1">({score.toFixed(1)})</span>
    </div>
  );
}

// ジョブカード（着手中/完了済み用）
function UndertakedJobCard({
  undertakedJob,
  job,
  onCompletionReportClick,
}: {
  undertakedJob: UndertakedJob;
  job: Job;
  onCompletionReportClick?: () => void;
}) {
  const totalReward = job.reward + job.aiInsentiveReward;

  // 日付フォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}年${month}月${day}日`;
  };

  const isInProgress =
    undertakedJob.status === "accepted" ||
    undertakedJob.status === "in_progress";
  const isCompleted = undertakedJob.status === "completed";

  return (
    <Card
      className="relative w-full overflow-hidden rounded-xl"
      radius="lg"
      shadow="md"
    >
      {/* 背景画像 + 50%黒マスク */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${job.imageUrl})` }}
      />
      <div className="absolute inset-0 bg-black/60" />

      {/* コンテンツ */}
      <CardBody className="relative z-10 flex flex-col min-h-[200px] p-4">
        {/* 上部: 報酬とステータスバッジ */}
        <div className="flex justify-between items-start">
          {/* 左上: 報酬額 */}
          <div className="text-white font-bold text-lg">
            ¥{totalReward.toLocaleString()} / 回
          </div>

          {/* 右上: ステータスバッジ */}
          <Chip
            size="sm"
            color={statusColors[undertakedJob.status]}
            variant="flat"
          >
            {statusLabels[undertakedJob.status]}
          </Chip>
        </div>

        {/* 中央スペーサー */}
        <div className="flex-1" />

        {/* 下部: ジョブ情報とアクション */}
        <div className="flex flex-col gap-3">
          {/* ジョブ情報 */}
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
            <div className="flex items-center gap-1 text-white/90 text-sm">
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
          </div>

          {/* 完了済みの場合: 評価表示 */}
          {isCompleted && undertakedJob.requesterEvalScore !== null && (
            <div className="flex items-center gap-2">
              <span className="text-white/70 text-sm">発注者評価:</span>
              <StarRating score={undertakedJob.requesterEvalScore} />
            </div>
          )}

          {/* 着手中の場合: 完了報告ボタン */}
          {isInProgress && onCompletionReportClick && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onCompletionReportClick}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-full text-sm transition-colors"
              >
                完了報告
              </button>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}

// 空の状態表示
function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <svg
        className="w-16 h-16 text-white/20 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
      <p className="text-white/50 text-lg">{message}</p>
    </div>
  );
}

export default function WorkerJobsPage() {
  const { getJobById } = useJobStore();
  const { undertakedJobs, updateUndertakedJob } = useUndertakedJobStore();

  const [selectedTab, setSelectedTab] = useState<string>("in_progress");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUndertakedJob, setSelectedUndertakedJob] =
    useState<UndertakedJob | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // Hydration対策
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    useJobStore.persist.rehydrate();
    useUndertakedJobStore.persist.rehydrate();
    setIsHydrated(true);
  }, []);

  // 着手中のジョブ（accepted または in_progress）
  const inProgressJobs = useMemo(() => {
    return undertakedJobs.filter(
      (uj) => uj.status === "accepted" || uj.status === "in_progress",
    );
  }, [undertakedJobs]);

  // 完了済みのジョブ
  const completedJobs = useMemo(() => {
    return undertakedJobs.filter((uj) => uj.status === "completed");
  }, [undertakedJobs]);

  // 完了報告モーダルを開く
  const handleOpenCompletionModal = (undertakedJob: UndertakedJob) => {
    const job = getJobById(undertakedJob.jobId);
    if (job) {
      setSelectedUndertakedJob(undertakedJob);
      setSelectedJob(job);
      setIsModalOpen(true);
    }
  };

  // 完了報告の送信処理
  const handleCompletionSubmit = () => {
    if (selectedUndertakedJob) {
      // ステータスを completed に更新し、finishedAt を設定
      updateUndertakedJob(selectedUndertakedJob.id, {
        status: "completed",
        finishedAt: new Date().toISOString(),
        // モックとしてランダムな評価スコアを設定（実際は発注者が評価）
        requesterEvalScore: Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
      });
    }
  };

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-white/50">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* ヘッダー */}
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-2xl font-bold text-white">マイジョブ</h1>
        <p className="text-white/60 text-sm mt-1">受注したジョブの管理</p>
      </div>

      {/* タブ切り替え */}
      <div className="px-4 py-2">
        <Tabs
          selectedKey={selectedTab}
          onSelectionChange={(key) => setSelectedTab(key as string)}
          variant="underlined"
          classNames={{
            tabList:
              "gap-6 w-full relative rounded-none p-0 border-b border-white/10",
            cursor: "w-full bg-amber-500",
            tab: "max-w-fit px-0 h-12",
            tabContent:
              "group-data-[selected=true]:text-amber-400 text-white/60",
          }}
        >
          <Tab
            key="in_progress"
            title={
              <div className="flex items-center gap-2">
                <span>着手中</span>
                {inProgressJobs.length > 0 && (
                  <Chip
                    size="sm"
                    variant="flat"
                    className="bg-amber-500/20 text-amber-400"
                  >
                    {inProgressJobs.length}
                  </Chip>
                )}
              </div>
            }
          />
          <Tab
            key="completed"
            title={
              <div className="flex items-center gap-2">
                <span>完了済み</span>
                {completedJobs.length > 0 && (
                  <Chip
                    size="sm"
                    variant="flat"
                    className="bg-white/10 text-white/60"
                  >
                    {completedJobs.length}
                  </Chip>
                )}
              </div>
            }
          />
        </Tabs>
      </div>

      {/* ジョブリスト */}
      <div className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">
        {selectedTab === "in_progress" &&
          (inProgressJobs.length === 0 ? (
            <EmptyState message="着手中のジョブがありません" />
          ) : (
            inProgressJobs.map((undertakedJob) => {
              const job = getJobById(undertakedJob.jobId);
              if (!job) return null;
              return (
                <UndertakedJobCard
                  key={undertakedJob.id}
                  undertakedJob={undertakedJob}
                  job={job}
                  onCompletionReportClick={() =>
                    handleOpenCompletionModal(undertakedJob)
                  }
                />
              );
            })
          ))}

        {selectedTab === "completed" &&
          (completedJobs.length === 0 ? (
            <EmptyState message="完了済みのジョブがありません" />
          ) : (
            completedJobs.map((undertakedJob) => {
              const job = getJobById(undertakedJob.jobId);
              if (!job) return null;
              return (
                <UndertakedJobCard
                  key={undertakedJob.id}
                  undertakedJob={undertakedJob}
                  job={job}
                />
              );
            })
          ))}
      </div>

      {/* 完了報告モーダル */}
      {selectedUndertakedJob && selectedJob && (
        <CompletionReportModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          undertakedJob={selectedUndertakedJob}
          job={selectedJob}
          onSubmit={handleCompletionSubmit}
        />
      )}
    </div>
  );
}
