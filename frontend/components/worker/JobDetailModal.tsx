"use client";

import { Button, Chip, Modal, ModalBody, ModalContent } from "@heroui/react";
import type { Job } from "@/types";

interface JobDetailModalProps {
  job: Job | null;
  isOpen: boolean;
  isBookmarked: boolean;
  isAlreadyAccepted: boolean;
  onClose: () => void;
  onBookmarkClick: () => void;
  onAcceptClick: () => void;
}

export function JobDetailModal({
  job,
  isOpen,
  isBookmarked,
  isAlreadyAccepted,
  onClose,
  onBookmarkClick,
  onAcceptClick,
}: JobDetailModalProps) {
  if (!job) return null;

  // 報酬合計
  const totalReward = job.reward + job.aiInsentiveReward;

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
      onClose={onClose}
      placement="bottom"
      size="full"
      scrollBehavior="inside"
      classNames={{
        base: "m-0 sm:m-0 rounded-t-3xl rounded-b-none max-h-[70vh]",
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
      <ModalContent>
        <ModalBody className="p-0">
          {/* ヘッダー画像 */}
          <div className="relative w-full h-48 shrink-0">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${job.imageUrl})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

            {/* 報酬額オーバーレイ */}
            <div className="absolute bottom-4 left-4 text-white">
              <div className="text-2xl font-bold">
                ¥{totalReward.toLocaleString()} / 回
              </div>
            </div>

            {/* ブックマークボタン */}
            <button
              type="button"
              onClick={onBookmarkClick}
              className="absolute bottom-4 right-4 p-2 bg-black/30 hover:bg-black/50 rounded-full transition-colors"
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

            {/* 受注ボタン */}
            <div className="pt-4 pb-8">
              <Button
                fullWidth
                size="lg"
                className={
                  isAlreadyAccepted
                    ? "bg-gray-500 text-white font-bold"
                    : "bg-amber-500 text-white font-bold"
                }
                radius="lg"
                onPress={onAcceptClick}
                isDisabled={isAlreadyAccepted}
              >
                {isAlreadyAccepted ? "受注済み" : "受注する"}
              </Button>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
