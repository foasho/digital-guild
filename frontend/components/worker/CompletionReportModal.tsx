"use client";

import {
  Button,
  Checkbox,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      placement="center"
      size="lg"
      scrollBehavior="inside"
      classNames={{
        base: "bg-gray-900 border border-white/10",
        header: "border-b border-white/10",
        body: "py-4",
        footer: "border-t border-white/10",
        closeButton: "text-white hover:bg-white/10",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-xl font-bold text-white">完了報告</h2>
          <p className="text-sm text-white/60 font-normal">{job.title}</p>
        </ModalHeader>

        <ModalBody>
          {/* チェックリスト */}
          {job.checklist.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-amber-400">
                作業チェックリスト
              </h3>
              <div className="space-y-2">
                {job.checklist.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 p-3 bg-white/5 rounded-lg"
                  >
                    <Checkbox
                      isSelected={checkedItems.has(item.id)}
                      onValueChange={(isChecked) =>
                        handleCheckChange(item.id, isChecked)
                      }
                      classNames={{
                        wrapper:
                          "before:border-white/30 after:bg-amber-500 group-data-[selected=true]:after:bg-amber-500",
                        icon: "text-white",
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-white/90 text-sm">
                        {index + 1}. {item.text}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* メモ入力欄 */}
          <div className="space-y-2 mt-4">
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
        </ModalBody>

        <ModalFooter>
          <Button
            variant="flat"
            onPress={handleClose}
            className="text-white/70 bg-white/10 hover:bg-white/20"
          >
            キャンセル
          </Button>
          <Button
            onPress={handleSubmit}
            isLoading={isSubmitting}
            isDisabled={job.checklist.length > 0 && !allChecked}
            className="bg-amber-500 text-white font-semibold hover:bg-amber-600"
          >
            完了報告を送信
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
