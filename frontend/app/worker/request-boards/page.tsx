"use client";

import { Input } from "@heroui/react";
import { debounce } from "es-toolkit";
import { useCallback, useMemo, useState } from "react";
import { JobCard } from "@/components/worker/JobCard";
import { JobDetailModal } from "@/components/worker/JobDetailModal";
import { type FilterValues, JobFilter } from "@/components/worker/JobFilter";
import { useJobs, useBookmarks, useUndertakedJobs, useRecommendedJobs } from "@/hooks/workers";
import { useUndertakedJobStore, useWorkerStore } from "@/stores";
import { UndertakedJobApi } from "@/constants/api-mocks";
import type { Job, UndertakedJob } from "@/types";

export default function RequestBoardsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterValues>({
    dateFrom: "",
    dateTo: "",
    minReward: null,
    selectedTags: [],
  });

  // Storeからworker取得
  const { worker } = useWorkerStore();

  // hooksからデータ取得（Storeに格納される）
  const { jobs } = useJobs();
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarks();
  const { undertakedJobs } = useUndertakedJobs();
  const recommendedJobs = useRecommendedJobs();

  // Store操作
  const addUndertakedJob = useUndertakedJobStore((state) => state.addUndertakedJob);
  const getByJobId = useUndertakedJobStore((state) => state.getByJobId);

  // AIレコメンドされたジョブIDリスト
  const recommendedJobIds = useMemo(() => {
    return recommendedJobs.map((r) => r.jobId);
  }, [recommendedJobs]);

  // debounce検索（300ms）
  const debouncedSetQuery = useMemo(
    () =>
      debounce((query: string) => {
        setDebouncedQuery(query);
      }, 300),
    []
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchQuery(value);
      debouncedSetQuery(value);
    },
    [debouncedSetQuery]
  );

  // フィルタリングされたジョブ一覧
  const filteredJobs = useMemo(() => {
    let result = jobs;

    // 検索クエリでフィルター
    if (debouncedQuery) {
      const query = debouncedQuery.toLowerCase();
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(query) ||
          job.description.toLowerCase().includes(query) ||
          job.location.toLowerCase().includes(query) ||
          job.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // 日付範囲フィルター
    if (filters.dateFrom) {
      result = result.filter((job) => job.scheduledDate >= filters.dateFrom);
    }
    if (filters.dateTo) {
      result = result.filter((job) => job.scheduledDate <= filters.dateTo);
    }

    // 最低報酬フィルター
    if (filters.minReward !== null) {
      const minReward = filters.minReward;
      result = result.filter(
        (job) => job.reward + job.aiInsentiveReward >= minReward
      );
    }

    // タグフィルター
    if (filters.selectedTags.length > 0) {
      result = result.filter((job) =>
        filters.selectedTags.some((tag) => job.tags.includes(tag))
      );
    }

    return result;
  }, [jobs, debouncedQuery, filters]);

  // 利用可能なタグ一覧
  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    for (const job of jobs) {
      for (const tag of job.tags) {
        tags.add(tag);
      }
    }
    return Array.from(tags);
  }, [jobs]);

  // ブックマークのトグル
  const handleBookmarkToggle = useCallback(
    async (jobId: number) => {
      if (!worker) return;
      if (isBookmarked(jobId)) {
        await removeBookmark(jobId);
      } else {
        await addBookmark(jobId);
      }
    },
    [worker, isBookmarked, addBookmark, removeBookmark]
  );

  // 詳細モーダルを開く
  const handleDetailClick = useCallback((job: Job) => {
    setSelectedJob(job);
    setIsDetailModalOpen(true);
  }, []);

  // 詳細モーダルを閉じる
  const handleDetailClose = useCallback(() => {
    setIsDetailModalOpen(false);
    setSelectedJob(null);
  }, []);

  // 受注処理
  const handleAccept = useCallback(async () => {
    if (!selectedJob || !worker) return;

    // 既に受注済みかチェック
    if (getByJobId(selectedJob.id)) {
      return;
    }

    const newUndertakedJob: UndertakedJob = {
      id: Date.now(),
      workerId: worker.id,
      jobId: selectedJob.id,
      status: "accepted",
      requesterEvalScore: null,
      acceptedAt: new Date().toISOString(),
      canceledAt: null,
      finishedAt: null,
    };

    // APIに保存
    await UndertakedJobApi.create(newUndertakedJob);
    // Storeに追加
    addUndertakedJob(newUndertakedJob);
    handleDetailClose();
  }, [selectedJob, worker, getByJobId, addUndertakedJob, handleDetailClose]);

  // フィルター適用
  const handleFilterApply = useCallback((newFilters: FilterValues) => {
    setFilters(newFilters);
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* 検索バーとフィルターボタン */}
      <div className="p-4 flex gap-2">
        <Input
          type="text"
          placeholder="ジョブを検索..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          size="lg"
          startContent={
            <svg
              className="w-5 h-5 text-white/50 mr-2"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          }
          classNames={{
            input: "text-white placeholder:text-white/50 rounded-xl",
            inputWrapper:
              "bg-white/10 border-white/20 hover:bg-white/15 rounded-xl",
          }}
          className="flex-1"
        />
        <button
          type="button"
          onClick={() => setIsFilterOpen(true)}
          className="p-3 bg-white/10 border border-white/20 rounded-xl hover:bg-white/15 transition-colors"
          aria-label="フィルター"
        >
          <svg
            className="w-5 h-5 text-white/70"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
        </button>
      </div>

      {/* アクティブフィルター表示 */}
      {(filters.dateFrom ||
        filters.dateTo ||
        filters.minReward !== null ||
        filters.selectedTags.length > 0) && (
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-1 text-xs">
            {filters.dateFrom && (
              <span className="px-2 py-1 bg-amber-500/20 text-amber-300 rounded-full">
                {filters.dateFrom}〜
              </span>
            )}
            {filters.dateTo && (
              <span className="px-2 py-1 bg-amber-500/20 text-amber-300 rounded-full">
                〜{filters.dateTo}
              </span>
            )}
            {filters.minReward !== null && (
              <span className="px-2 py-1 bg-amber-500/20 text-amber-300 rounded-full">
                ¥{filters.minReward.toLocaleString()}以上
              </span>
            )}
            {filters.selectedTags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-amber-500/20 text-amber-300 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ジョブカード一覧 */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-6">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isRecommended={recommendedJobIds.includes(job.id)}
              isBookmarked={isBookmarked(job.id)}
              onDetailClick={() => handleDetailClick(job)}
              onBookmarkClick={() => handleBookmarkToggle(job.id)}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-white/60">
            <svg
              className="w-16 h-16 mb-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={1}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p>該当するジョブがありません</p>
          </div>
        )}
      </div>

      {/* 詳細モーダル */}
      <JobDetailModal
        job={selectedJob}
        isOpen={isDetailModalOpen}
        isBookmarked={selectedJob ? isBookmarked(selectedJob.id) : false}
        isAlreadyAccepted={selectedJob ? !!getByJobId(selectedJob.id) : false}
        onClose={handleDetailClose}
        onBookmarkClick={() =>
          selectedJob && handleBookmarkToggle(selectedJob.id)
        }
        onAcceptClick={handleAccept}
      />

      {/* フィルターモーダル */}
      <JobFilter
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleFilterApply}
        initialFilters={filters}
        availableTags={availableTags}
      />
    </div>
  );
}
