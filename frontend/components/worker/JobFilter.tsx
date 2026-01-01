"use client";

import {
  Button,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useState } from "react";

interface JobFilterProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterValues) => void;
  initialFilters: FilterValues;
  availableTags: string[];
}

export interface FilterValues {
  dateFrom: string;
  dateTo: string;
  minReward: number | null;
  selectedTags: string[];
}

export function JobFilter({
  isOpen,
  onClose,
  onApply,
  initialFilters,
  availableTags,
}: JobFilterProps) {
  const [dateFrom, setDateFrom] = useState(initialFilters.dateFrom);
  const [dateTo, setDateTo] = useState(initialFilters.dateTo);
  const [minReward, setMinReward] = useState<string>(
    initialFilters.minReward?.toString() || "",
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(
    initialFilters.selectedTags,
  );

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleApply = () => {
    onApply({
      dateFrom,
      dateTo,
      minReward: minReward ? Number.parseInt(minReward, 10) : null,
      selectedTags,
    });
    onClose();
  };

  const handleReset = () => {
    setDateFrom("");
    setDateTo("");
    setMinReward("");
    setSelectedTags([]);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      placement="bottom"
      size="full"
      classNames={{
        base: "m-0 sm:m-0 rounded-t-3xl rounded-b-none max-h-[60vh]",
        header: "border-b border-white/10",
        body: "py-4",
        footer: "border-t border-white/10",
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
      <ModalContent className="bg-zinc-900">
        <ModalHeader className="text-white">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-amber-400"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            フィルター
          </div>
        </ModalHeader>
        <ModalBody className="space-y-6">
          {/* 日時範囲 */}
          <div>
            <h3 className="text-sm font-semibold text-amber-400 mb-3">
              日時範囲
            </h3>
            <div className="flex gap-2 items-center">
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                classNames={{
                  input: "text-white",
                  inputWrapper: "bg-zinc-800 border-zinc-700",
                }}
                size="sm"
              />
              <span className="text-white/60">〜</span>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                classNames={{
                  input: "text-white",
                  inputWrapper: "bg-zinc-800 border-zinc-700",
                }}
                size="sm"
              />
            </div>
          </div>

          {/* 報酬最小値 */}
          <div>
            <h3 className="text-sm font-semibold text-amber-400 mb-3">
              最低報酬額
            </h3>
            <Input
              type="number"
              placeholder="例: 5000"
              value={minReward}
              onChange={(e) => setMinReward(e.target.value)}
              startContent={<span className="text-white/60 text-sm">¥</span>}
              endContent={<span className="text-white/60 text-sm">以上</span>}
              classNames={{
                input: "text-white",
                inputWrapper: "bg-zinc-800 border-zinc-700",
              }}
              size="sm"
            />
          </div>

          {/* スキルタグ */}
          <div>
            <h3 className="text-sm font-semibold text-amber-400 mb-3">
              スキルタグ
            </h3>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <Chip
                  key={tag}
                  variant={selectedTags.includes(tag) ? "solid" : "bordered"}
                  className={
                    selectedTags.includes(tag)
                      ? "bg-amber-500 text-white cursor-pointer"
                      : "border-white/30 text-white/70 cursor-pointer hover:border-amber-500/50"
                  }
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </Chip>
              ))}
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="gap-2">
          <Button
            variant="ghost"
            onPress={handleReset}
            className="text-white/70"
          >
            リセット
          </Button>
          <Button
            onPress={handleApply}
            className="bg-amber-500 text-white font-semibold"
          >
            適用する
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
