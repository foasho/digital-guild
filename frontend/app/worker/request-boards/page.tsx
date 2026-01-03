"use client";

import { Input } from "@heroui/react";
import { debounce } from "es-toolkit";
import { useCallback, useMemo, useState } from "react";
import { JobCard } from "@/components/worker/JobCard";
import { JobDetailModal } from "@/components/worker/JobDetailModal";
import { type FilterValues, JobFilter } from "@/components/worker/JobFilter";
import { useJobs, useBookmarks, useUndertakedJobs, useRecommendedJobs } from "@/hooks/workers";
import { useWorkerStore, useUndertakedJobStore } from "@/stores/workers";
import type { Job } from "@/types";

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
  const getByJobId = useUndertakedJobStore((state) => state.getByJobId);

  // アクティブな応募/受注かどうかをチェック（JobCard用）
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

  // 全タグ一覧を取得
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    jobs.forEach((job) => {
      job.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [jobs]);

  // フィルタリングされたジョブリスト
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // 既に受注済み/応募済みのジョブを除外
      if (isActivelyAccepted(job.id)) {
        return false;
      }

      // 検索クエリでフィルタ
      if (debouncedQuery) {
        const query = debouncedQuery.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(query);
        const matchesDescription = job.description.toLowerCase().includes(query);
        const matchesLocation = job.location.toLowerCase().includes(query);
        const matchesTags = job.tags.some((tag) =>
          tag.toLowerCase().includes(query)
        );
        if (
          !matchesTitle &&
          !matchesDescription &&
          !matchesLocation &&
          !matchesTags
        ) {
          return false;
        }
      }

      // 日付フィルター
      if (filters.dateFrom) {
        const filterDate = new Date(filters.dateFrom);
        const jobDate = new Date(job.scheduledDate);
        if (jobDate < filterDate) return false;
      }
      if (filters.dateTo) {
        const filterDate = new Date(filters.dateTo);
        const jobDate = new Date(job.scheduledDate);
        if (jobDate > filterDate) return false;
      }

      // 報酬フィルター
      if (filters.minReward !== null) {
        const totalReward = job.reward + job.aiInsentiveReward;
        if (totalReward < filters.minReward) return false;
      }

      // タグフィルター
      if (filters.selectedTags.length > 0) {
        const hasMatchingTag = job.tags.some((tag) =>
          filters.selectedTags.includes(tag)
        );
        if (!hasMatchingTag) return false;
      }

      return true;
    });
  }, [jobs, debouncedQuery, filters, isActivelyAccepted]);

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
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          }
          classNames={{
            inputWrapper: "bg-white dark:bg-gray-800 shadow-sm",
          }}
        />
        <button
          type="button"
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center justify-center w-12 h-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm shrink-0"
          aria-label="フィルター"
        >
          <svg
            className="w-5 h-5 text-gray-600 dark:text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
        </button>
      </div>

      {/* ジョブカード一覧（新しいものが上に来るように逆順表示） */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-6">
        {filteredJobs.length > 0 ? (
          [...filteredJobs].reverse().map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isBookmarked={isBookmarked(job.id)}
              isRecommended={recommendedJobIds.includes(job.id)}
              onBookmarkClick={() => handleBookmarkToggle(job.id)}
              onDetailClick={() => handleDetailClick(job)}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
            <svg
              className="w-12 h-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p>該当するジョブがありません</p>
          </div>
        )}
      </div>

      {/* 詳細モーダル（JobDetailModalが全ての責務を持つ） */}
      <JobDetailModal
        job={selectedJob}
        isOpen={isDetailModalOpen}
        onClose={handleDetailClose}
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
