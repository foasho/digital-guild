"use client";

import {
  Button,
  Card,
  CardBody,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  Tab,
  Tabs,
} from "@heroui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CompletionReportModal } from "@/components/worker";
import { useJobs, useUndertakedJobs } from "@/hooks";
import { useUndertakedJobStore } from "@/stores/useUndertakedJobStore";
import type { Job, UndertakedJob } from "@/types";

// ステータスの日本語ラベル
const statusLabels: Record<UndertakedJob["status"], string> = {
  accepted: "着手中",
  in_progress: "作業中",
  completed: "完了",
  canceled: "キャンセル",
};

// ステータスのカスタムスタイル（透過背景でChipらしく）
const statusStyles: Record<
  UndertakedJob["status"],
  { bg: string; text: string; border: string }
> = {
  accepted: { bg: "bg-amber-500/25", text: "text-amber-300", border: "border-amber-400/50" },
  in_progress: { bg: "bg-blue-500/25", text: "text-blue-300", border: "border-blue-400/50" },
  completed: { bg: "bg-emerald-500/25", text: "text-emerald-300", border: "border-emerald-400/50" },
  canceled: { bg: "bg-red-500/25", text: "text-red-300", border: "border-red-400/50" },
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
  onDetailClick,
  onCompletionReportClick,
}: {
  undertakedJob: UndertakedJob;
  job: Job;
  onDetailClick?: () => void;
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
            size="md"
            variant="flat"
            classNames={{
              base: `px-3 py-1 border backdrop-blur-sm ${statusStyles[undertakedJob.status].bg} ${statusStyles[undertakedJob.status].border}`,
              content: `font-semibold text-sm ${statusStyles[undertakedJob.status].text}`,
            }}
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

          {/* 着手中の場合: 詳細と完了報告ボタン */}
          {isInProgress && (
            <div className="flex justify-end gap-2">
              {onDetailClick && (
                <button
                  type="button"
                  onClick={onDetailClick}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-full text-sm transition-colors backdrop-blur-sm border border-white/30"
                >
                  詳細
                </button>
              )}
              {onCompletionReportClick && (
                <button
                  type="button"
                  onClick={onCompletionReportClick}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-full text-sm transition-colors"
                >
                  完了報告
                </button>
              )}
            </div>
          )}

          {/* 完了済みの場合: 詳細ボタン */}
          {!isInProgress && onDetailClick && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onDetailClick}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-full text-sm transition-colors backdrop-blur-sm border border-white/30"
              >
                詳細
              </button>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}

// 着手中ジョブの詳細モーダル
function UndertakedJobDetailModal({
  job,
  undertakedJob,
  isOpen,
  onClose,
  onCompletionReportClick,
}: {
  job: Job | null;
  undertakedJob: UndertakedJob | null;
  isOpen: boolean;
  onClose: () => void;
  onCompletionReportClick?: () => void;
}) {
  if (!job || !undertakedJob) return null;

  const totalReward = job.reward + job.aiInsentiveReward;
  const isInProgress =
    undertakedJob.status === "accepted" ||
    undertakedJob.status === "in_progress";

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}年${month}月${day}日`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      placement="bottom"
      size="full"
      scrollBehavior="inside"
      backdrop="blur"
      classNames={{
        backdrop: "bg-black/75",
        base: "m-0 sm:m-0 rounded-t-3xl rounded-b-none max-h-[75vh] bg-gray-900/95",
        body: "p-0",
        closeButton:
          "top-4 right-4 z-20 bg-black/50 text-white hover:bg-black/70",
      }}
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.3, ease: "easeOut" },
          },
          exit: {
            y: "100%",
            opacity: 0,
            transition: { duration: 0.2, ease: "easeIn" },
          },
        },
      }}
    >
      <ModalContent>
        <ModalBody className="p-0">
          {/* ヘッダー画像 */}
          <div className="relative w-full h-48 shrink-0">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${job.imageUrl})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

            {/* 報酬額とステータス */}
            <div className="absolute bottom-4 left-4 text-white">
              <div className="text-2xl font-bold">
                ¥{totalReward.toLocaleString()} / 回
              </div>
            </div>
            <div className="absolute bottom-4 right-4">
              <Chip
                size="md"
                variant="flat"
                classNames={{
                  base: `px-3 py-1 border backdrop-blur-sm ${statusStyles[undertakedJob.status].bg} ${statusStyles[undertakedJob.status].border}`,
                  content: `font-semibold text-sm ${statusStyles[undertakedJob.status].text}`,
                }}
              >
                {statusLabels[undertakedJob.status]}
              </Chip>
            </div>
          </div>

          {/* コンテンツ */}
          <div className="p-4 space-y-4">
            {/* タイトル */}
            <h2 className="text-xl font-bold text-white">{job.title}</h2>

            {/* 場所と日時 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white/90">
                <svg
                  className="w-5 h-5 shrink-0 text-amber-400"
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
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <svg
                  className="w-5 h-5 shrink-0 text-amber-400"
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

            {/* タグ */}
            {job.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {job.tags.map((tag) => (
                  <Chip
                    key={tag}
                    size="sm"
                    variant="flat"
                    classNames={{
                      base: "bg-amber-500/20 border border-amber-500/30",
                      content: "text-amber-200 text-xs",
                    }}
                  >
                    {tag}
                  </Chip>
                ))}
              </div>
            )}

            {/* 説明 */}
            <div>
              <h3 className="text-sm font-semibold text-amber-400 mb-2">
                仕事内容
              </h3>
              <p className="text-white/90 text-sm leading-relaxed">
                {job.description}
              </p>
            </div>

            {/* チェックリスト */}
            {job.checklist.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-amber-400 mb-2">
                  作業チェックリスト
                </h3>
                <ul className="space-y-2">
                  {job.checklist.map((item, index) => (
                    <li
                      key={item.id}
                      className="flex items-center gap-2 text-white/90 text-sm"
                    >
                      <div className="w-5 h-5 rounded border border-white/30 shrink-0 flex items-center justify-center">
                        <span className="text-xs text-white/50">{index + 1}</span>
                      </div>
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 着手中の場合は完了報告ボタン */}
            {isInProgress && onCompletionReportClick && (
              <div className="pt-4 pb-8">
                <Button
                  fullWidth
                  size="lg"
                  className="bg-amber-500 text-white font-bold"
                  radius="full"
                  onPress={() => {
                    onClose();
                    onCompletionReportClick();
                  }}
                >
                  完了報告
                </Button>
              </div>
            )}

            {/* 完了済みの場合は閉じるボタン */}
            {!isInProgress && (
              <div className="pt-4 pb-8">
                <Button
                  fullWidth
                  size="lg"
                  className="bg-white/20 text-white font-bold"
                  radius="full"
                  onPress={onClose}
                >
                  閉じる
                </Button>
              </div>
            )}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
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
  // フックからデータ取得
  const { jobs, getJobById } = useJobs();
  const { undertakedJobs } = useUndertakedJobs();
  const { updateUndertakedJob } = useUndertakedJobStore();

  const [selectedTab, setSelectedTab] = useState<string>("in_progress");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedUndertakedJob, setSelectedUndertakedJob] =
    useState<UndertakedJob | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // Hydration対策
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
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

  // 詳細モーダルを開く
  const handleOpenDetailModal = (undertakedJob: UndertakedJob) => {
    const job = getJobById(undertakedJob.jobId);
    if (job) {
      setSelectedUndertakedJob(undertakedJob);
      setSelectedJob(job);
      setIsDetailModalOpen(true);
    }
  };

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
      {/* タブ切り替え */}
      <div className="px-4 py-2 text-center">
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
                  onDetailClick={() => handleOpenDetailModal(undertakedJob)}
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
                  onDetailClick={() => handleOpenDetailModal(undertakedJob)}
                />
              );
            })
          ))}
      </div>

      {/* 詳細モーダル */}
      <UndertakedJobDetailModal
        job={selectedJob}
        undertakedJob={selectedUndertakedJob}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onCompletionReportClick={
          selectedUndertakedJob
            ? () => handleOpenCompletionModal(selectedUndertakedJob)
            : undefined
        }
      />

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
