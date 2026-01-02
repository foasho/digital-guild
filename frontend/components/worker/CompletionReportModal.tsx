"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  Textarea,
} from "@heroui/react";
import { useState } from "react";
import type { Job, UndertakedJob } from "@/types";

interface CompletionReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  undertakedJob: UndertakedJob;
  job: Job;
  onSubmit: () => void;
}

export function CompletionReportModal({
  isOpen,
  onClose,
  undertakedJob: _undertakedJob,
  job,
  onSubmit,
}: CompletionReportModalProps) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [memo, setMemo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // チェックリストのチェック状態を切り替え
  const handleCheckChange = (itemId: string, isChecked: boolean) => {
    const newCheckedItems = new Set(checkedItems);
    if (isChecked) {
      newCheckedItems.add(itemId);
    } else {
      newCheckedItems.delete(itemId);
    }
    setCheckedItems(newCheckedItems);
  };

  // 全てのチェックリストがチェックされているか
  const allChecked =
    job.checklist.length > 0 && checkedItems.size === job.checklist.length;

  // 送信処理
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // 少し遅延を入れてUX向上
      await new Promise((resolve) => setTimeout(resolve, 500));
      onSubmit();
      // モーダルを閉じる前に状態をリセット
      setCheckedItems(new Set());
      setMemo("");
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  // モーダルを閉じるときに状態をリセット
  const handleClose = () => {
    setCheckedItems(new Set());
    setMemo("");
    onClose();
  };

  // 報酬合計
  const totalReward = job.reward + job.aiInsentiveReward;

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
        base: "m-0 sm:m-0 rounded-t-3xl rounded-b-none max-h-[80vh] bg-gray-900/95",
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
          <div className="relative w-full h-40 shrink-0">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${job.imageUrl})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/30" />

            {/* タイトルオーバーレイ */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="text-amber-400 text-sm font-semibold mb-1">
                完了報告
              </div>
              <h2 className="text-xl font-bold text-white">{job.title}</h2>
              <div className="text-white/70 text-sm mt-1">
                ¥{totalReward.toLocaleString()} / 回
              </div>
            </div>
          </div>

          {/* コンテンツ */}
          <div className="p-4 space-y-4">
            {/* チェックリスト */}
            {job.checklist.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-amber-400">
                    作業チェックリスト
                  </h3>
                  <span className="text-xs text-white/40">
                    {checkedItems.size}/{job.checklist.length}
                  </span>
                </div>
                {/* プログレスバー */}
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 transition-all duration-300 ease-out"
                    style={{
                      width: `${(checkedItems.size / job.checklist.length) * 100}%`,
                    }}
                  />
                </div>
                {/* チェックリストアイテム */}
                <div className="bg-white/5 rounded-lg border border-white/10 divide-y divide-white/5">
                  {job.checklist.map((item, index) => {
                    const isChecked = checkedItems.has(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleCheckChange(item.id, !isChecked)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors ${
                          isChecked ? "bg-amber-500/10" : "hover:bg-white/5"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                            isChecked
                              ? "bg-amber-500 border-amber-500"
                              : "border-white/30"
                          }`}
                        >
                          {isChecked && (
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={3}
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                        <span
                          className={`text-sm transition-colors ${
                            isChecked ? "text-white/60 line-through" : "text-white/90"
                          }`}
                        >
                          {item.text}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {/* 完了メッセージ */}
                {allChecked && (
                  <div className="flex items-center justify-center gap-1.5 py-1 text-emerald-400 text-sm">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-medium">すべて完了！</span>
                  </div>
                )}
              </div>
            )}

            {/* メモ入力欄 */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-amber-400">
                メモ（任意）
              </h3>
              <Textarea
                placeholder="作業に関するメモがあれば入力してください..."
                value={memo}
                onValueChange={setMemo}
                minRows={3}
                maxRows={5}
                classNames={{
                  inputWrapper:
                    "bg-white/5 border border-white/10 hover:bg-white/10 group-data-[focus=true]:bg-white/10",
                  input: "text-white placeholder:text-white/40",
                }}
              />
            </div>

            {/* ボタン */}
            <div className="pt-4 pb-8 space-y-3">
              <Button
                fullWidth
                size="lg"
                onPress={handleSubmit}
                isLoading={isSubmitting}
                isDisabled={job.checklist.length > 0 && !allChecked}
                className="bg-amber-500 text-white font-bold disabled:bg-gray-600 disabled:opacity-50"
                radius="full"
              >
                完了報告を送信
              </Button>
              <Button
                fullWidth
                size="lg"
                variant="flat"
                onPress={handleClose}
                className="text-white/70 bg-white/10 hover:bg-white/20"
                radius="full"
              >
                キャンセル
              </Button>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
