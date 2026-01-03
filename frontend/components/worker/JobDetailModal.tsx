"use client";

import { useState, useCallback, useEffect } from "react";
import { Button, Chip, Modal, ModalBody, ModalContent } from "@heroui/react";
import { Check, Loader2, TrendingUp } from "lucide-react";
import type { Job, UndertakedJob } from "@/types";
import { useWorker } from "@/hooks/workers/useWorker";
import { useUndertakedJobs } from "@/hooks/workers/useUndertakedJobs";
import { useBookmarks } from "@/hooks/workers/useBookmarks";
import { UndertakedJobApi } from "@/constants/api-mocks/undertakedJobApi";
import { RequesterNotificationApi } from "@/constants/api-mocks/requesterNotificationApi";

// 応募ステータス
type ApplyStatus = "idle" | "applying" | "complete" | "applied";

interface JobDetailModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

export function JobDetailModal({
  job,
  isOpen,
  onClose,
}: JobDetailModalProps) {
  // 内部State
  const [isAccepting, setIsAccepting] = useState(false);
  const [isApplyComplete, setIsApplyComplete] = useState(false);
  const [hasJustApplied, setHasJustApplied] = useState(false);

  // Hooks
  const { worker } = useWorker();
  const { addUndertakedJob, getByJobId } = useUndertakedJobs();
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarks();

  // モーダルが閉じる時にStateをリセット
  const handleClose = useCallback(() => {
    setIsAccepting(false);
    setIsApplyComplete(false);
    setHasJustApplied(false);
    onClose();
  }, [onClose]);

  // モーダルが開いたときにStateをリセット（別のジョブを開いた時用）
  useEffect(() => {
    if (isOpen && job) {
      setIsAccepting(false);
      setIsApplyComplete(false);
      setHasJustApplied(false);
    }
  }, [isOpen, job?.id]); // job?.idを依存配列に入れて、ジョブが変わったらリセット

  // 既にアクティブな応募/受注かどうかをチェック
  const isActivelyAccepted = useCallback(
    (jobId: number): boolean => {
      const undertakedJob = getByJobId(jobId);
      if (!undertakedJob) return false;
      return (
        undertakedJob.status === "applied" ||
        undertakedJob.status === "accepted" ||
        undertakedJob.status === "completion_reported"
      );
    },
    [getByJobId]
  );

  // ブックマークトグル
  const handleBookmarkToggle = useCallback(() => {
    if (!job || !worker) return;
    if (isBookmarked(job.id)) {
      removeBookmark(job.id);
    } else {
      addBookmark(job.id);
    }
  }, [job, worker, isBookmarked, addBookmark, removeBookmark]);

  // 応募処理
  const handleAccept = useCallback(async () => {
    if (!job || !worker || isAccepting || isApplyComplete) return;

    // 既にアクティブな応募/受注があるかチェック
    if (isActivelyAccepted(job.id) || hasJustApplied) {
      return;
    }

    setIsAccepting(true);

    try {
      const newUndertakedJob: UndertakedJob = {
        id: Date.now(),
        workerId: worker.id,
        jobId: job.id,
        status: "applied",
        requesterEvalScore: null,
        appliedAt: new Date().toISOString(),
        acceptedAt: null,
        completionReportedAt: null,
        canceledAt: null,
        finishedAt: null,
        completionMemo: null,
        completedChecklistIds: null,
      };

      // APIに保存
      await UndertakedJobApi.create(newUndertakedJob);
      // Storeに追加
      addUndertakedJob(newUndertakedJob);

      // 発注者に通知を送信
      RequesterNotificationApi.create({
        requesterId: job.requesterId,
        confirmedAt: null,
        title: "新しい応募がありました",
        description: `「${job.title}」に${worker.name}さんから応募がありました。`,
        url: `/requester/undertaked_jobs/${newUndertakedJob.id}`,
        createdAt: new Date().toISOString(),
      });

      // 1秒間Loading表現を見せる
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 応募完了状態に遷移
      setIsAccepting(false);
      setIsApplyComplete(true);

      // 1.5秒後に「応募済み」に遷移
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsApplyComplete(false);
      setHasJustApplied(true);
    } catch (error) {
      console.error("応募エラー:", error);
      setIsAccepting(false);
    }
  }, [job, worker, isAccepting, isApplyComplete, hasJustApplied, isActivelyAccepted, addUndertakedJob]);

  // 応募ステータスを判定
  const getApplyStatus = (): ApplyStatus => {
    if (!job) return "idle";
    if (isActivelyAccepted(job.id) || hasJustApplied) return "applied";
    if (isApplyComplete) return "complete";
    if (isAccepting) return "applying";
    return "idle";
  };

  const applyStatus = getApplyStatus();
  const bookmarked = job ? isBookmarked(job.id) : false;

  if (!job) return null;

  // 報酬合計
  const totalReward = job.reward + job.aiInsentiveReward;
  // AIインセンティブが含まれているかどうか
  const hasIncentive = job.aiInsentiveReward > 0;

  // 日付フォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}年${month}月${day}日〜`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      placement="bottom"
      size="full"
      scrollBehavior="inside"
      backdrop="blur"
      classNames={{
        backdrop: "bg-black/75",
        base: "m-0 sm:m-0 rounded-t-3xl rounded-b-none max-h-[70vh] bg-gray-900/95 overflow-hidden",
        body: "p-0",
        closeButton:
          "top-4 right-4 z-20 bg-black/50 text-white hover:bg-black/70",
      }}
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          },
          exit: {
            y: "100%",
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: "easeIn",
            },
          },
        },
      }}
    >
      <ModalContent className="bg-gray-900 rounded-t-3xl">
        <ModalBody className="p-0">
          {/* ヘッダー画像 */}
          <div className="relative w-full h-48 shrink-0 rounded-t-3xl overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${job.imageUrl})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

            {/* 報酬額オーバーレイ */}
            <div className="absolute bottom-4 left-4 text-white">
              <div className="text-2xl font-bold mb-1">
                ¥{totalReward.toLocaleString()} / 回
              </div>
              {/* インセンティブChip */}
              {hasIncentive && (
                <Chip
                  size="sm"
                  variant="flat"
                  startContent={<TrendingUp size={12} />}
                  classNames={{
                    base: "bg-gradient-to-r from-emerald-500/90 to-teal-500/90 border-0 shadow-lg shadow-emerald-500/30",
                    content: "text-white font-bold text-[10px] tracking-wide drop-shadow-sm",
                  }}
                >
                  報酬UP中
                </Chip>
              )}
            </div>

            {/* ブックマークボタン */}
            <button
              type="button"
              onClick={handleBookmarkToggle}
              className="absolute bottom-4 right-4 p-2 bg-black/30 hover:bg-black/50 rounded-full transition-colors"
              aria-label={bookmarked ? "ブックマーク解除" : "ブックマーク"}
            >
              <svg
                className={`w-6 h-6 ${bookmarked ? "text-amber-400 fill-amber-400" : "text-white"}`}
                fill={bookmarked ? "currentColor" : "none"}
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
                  {job.checklist.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center gap-2 text-white/90 text-sm"
                    >
                      <div className="w-5 h-5 rounded border border-white/30 shrink-0 flex items-center justify-center">
                        <span className="text-xs text-white/50">
                          {job.checklist.indexOf(item) + 1}
                        </span>
                      </div>
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 応募ボタン */}
            <div className="pt-4 pb-8">
              <Button
                fullWidth
                size="lg"
                className={
                  applyStatus === "applied"
                    ? "bg-gray-500 text-white font-bold"
                    : applyStatus === "complete"
                      ? "bg-emerald-500 text-white font-bold"
                      : applyStatus === "applying"
                        ? "bg-amber-600 text-white font-bold"
                        : "bg-amber-500 text-white font-bold"
                }
                radius="full"
                onPress={handleAccept}
                isDisabled={applyStatus !== "idle"}
              >
                {applyStatus === "applied" ? (
                  "応募済み"
                ) : applyStatus === "complete" ? (
                  <span className="flex items-center gap-2">
                    <Check size={18} />
                    応募完了しました
                  </span>
                ) : applyStatus === "applying" ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={18} className="animate-spin" />
                    応募中...
                  </span>
                ) : (
                  "応募する"
                )}
              </Button>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
