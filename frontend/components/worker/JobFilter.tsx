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
  Slider,
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
  // Sliderの都合上、内部では number で扱う（0は「指定なし」）
  const [minReward, setMinReward] = useState<number>(
    initialFilters.minReward ?? 0,
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
      minReward: minReward > 0 ? minReward : null,
      selectedTags,
    });
    onClose();
  };

  const handleReset = () => {
    setDateFrom("");
    setDateTo("");
    setMinReward(0);
    setSelectedTags([]);
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
        backdrop: "bg-black/50",
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
      <ModalContent className="bg-zinc-900 rounded-t-3xl">
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
                  inputWrapper:
                    "bg-zinc-800 border-zinc-700 rounded-2xl shadow-sm",
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
                  inputWrapper:
                    "bg-zinc-800 border-zinc-700 rounded-2xl shadow-sm",
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
            <div className="space-y-2">
              <div className="text-xs text-white/60 pb-2">
                {minReward > 0
                  ? `¥${minReward.toLocaleString()}以上`
                  : "指定なし"}
              </div>
              <Slider
                aria-label="最低報酬額"
                size="sm"
                value={minReward}
                onChange={(value) =>
                  setMinReward(Array.isArray(value) ? value[0] : value)
                }
                minValue={0}
                maxValue={50000}
                step={500}
                showTooltip
                formatOptions={{
                  style: "currency",
                  currency: "JPY",
                  maximumFractionDigits: 0,
                }}
                tooltipProps={{
                  classNames: {
                    base: "bg-zinc-800 text-white border border-white/10",
                    content: "text-xs",
                    arrow: "bg-zinc-800 border border-white/10",
                  },
                }}
                classNames={{
                  base: "px-1",
                  track: "bg-white/15",
                  filler: "bg-amber-500",
                  thumb: "bg-amber-500 ring-2 ring-amber-300/40 shadow-md",
                }}
              />
            </div>
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
                  as="button"
                  size="sm"
                  radius="full"
                  variant="bordered"
                  aria-pressed={selectedTags.includes(tag)}
                  className="cursor-pointer px-3"
                  classNames={{
                    base: selectedTags.includes(tag)
                      ? "bg-amber-500/90 border-amber-500/80 text-white"
                      : "bg-transparent border-white/30 text-white/70 hover:border-amber-500/50 hover:bg-white/5",
                  }}
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
            className="text-white/70 rounded-full px-6"
          >
            リセット
          </Button>
          <Button
            onPress={handleApply}
            className="bg-amber-500 text-white font-semibold rounded-full px-6"
          >
            適用する
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
