"use client";

import { Input } from "@heroui/react";
import { debounce } from "es-toolkit";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { JobDetailModal } from "@/components/worker/JobDetailModal";
import { jobs as mockJobs } from "@/constants/mocks/jobs";
import { useBookmarkStore, useJobStore, useUndertakedJobStore } from "@/stores";
import type { Job, UndertakedJob } from "@/types";

// Leaflet CSSをインポート
import "leaflet/dist/leaflet.css";

// SSR無効化でMapコンポーネントをdynamic import
const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-zinc-900">
      <div className="text-white/60">Loading map...</div>
    </div>
  ),
});

// 現在のワーカーID（モック）
const CURRENT_WORKER_ID = "worker-1";

export default function RequestMapPage() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // ストアからデータ取得
  const jobs = useJobStore((state) => state.jobs);
  const setJobs = useJobStore((state) => state.setJobs);
  const addBookmark = useBookmarkStore((state) => state.addBookmark);
  const removeBookmark = useBookmarkStore((state) => state.removeBookmark);
  const isBookmarked = useBookmarkStore((state) => state.isBookmarked);
  const addUndertakedJob = useUndertakedJobStore(
    (state) => state.addUndertakedJob,
  );
  const getByJobId = useUndertakedJobStore((state) => state.getByJobId);

  // 初期化・ハイドレーション
  useEffect(() => {
    useJobStore.persist.rehydrate();
    useBookmarkStore.persist.rehydrate();
    useUndertakedJobStore.persist.rehydrate();
    setIsHydrated(true);
  }, []);

  // モックデータの初期化
  useEffect(() => {
    if (isHydrated && jobs.length === 0) {
      setJobs(mockJobs);
    }
  }, [isHydrated, jobs.length, setJobs]);

  // debounce検索（300ms）
  const debouncedSetQuery = useMemo(
    () =>
      debounce((query: string) => {
        setDebouncedQuery(query);
      }, 300),
    [],
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchQuery(value);
      debouncedSetQuery(value);
    },
    [debouncedSetQuery],
  );

  // フィルタリングされたジョブ一覧
  const filteredJobs = useMemo(() => {
    if (!debouncedQuery) return jobs;

    const query = debouncedQuery.toLowerCase();
    return jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query) ||
        job.tags.some((tag) => tag.toLowerCase().includes(query)),
    );
  }, [jobs, debouncedQuery]);

  // ブックマークのトグル
  const handleBookmarkToggle = useCallback(
    (jobId: string) => {
      if (isBookmarked(jobId)) {
        removeBookmark(jobId);
      } else {
        addBookmark({
          id: `bookmark-${Date.now()}`,
          jobId,
          workerId: CURRENT_WORKER_ID,
        });
      }
    },
    [isBookmarked, addBookmark, removeBookmark],
  );

  // マーカークリックで詳細モーダルを開く
  const handleMarkerClick = useCallback((job: Job) => {
    setSelectedJob(job);
    setIsDetailModalOpen(true);
  }, []);

  // 詳細モーダルを閉じる
  const handleDetailClose = useCallback(() => {
    setIsDetailModalOpen(false);
    setSelectedJob(null);
  }, []);

  // 受注処理
  const handleAccept = useCallback(() => {
    if (!selectedJob) return;

    // 既に受注済みかチェック
    if (getByJobId(selectedJob.id)) {
      return;
    }

    const newUndertakedJob: UndertakedJob = {
      id: `undertaked-${Date.now()}`,
      workerId: CURRENT_WORKER_ID,
      jobId: selectedJob.id,
      status: "accepted",
      requesterEvalScore: null,
      acceptedAt: new Date().toISOString(),
      canceledAt: null,
      finishedAt: null,
    };

    addUndertakedJob(newUndertakedJob);
    handleDetailClose();
  }, [selectedJob, getByJobId, addUndertakedJob, handleDetailClose]);

  // 検索バーの展開/折りたたみをトグル
  const toggleSearch = useCallback(() => {
    setIsSearchExpanded((prev) => !prev);
    if (isSearchExpanded) {
      setSearchQuery("");
      setDebouncedQuery("");
    }
  }, [isSearchExpanded]);

  return (
    <div className="relative w-full h-full">
      {/* マップコンポーネント */}
      <MapComponent
        jobs={filteredJobs}
        isBookmarked={(jobId) => isHydrated && isBookmarked(jobId)}
        onMarkerClick={handleMarkerClick}
      />

      {/* 右下の検索UI */}
      <div className="absolute bottom-6 right-4 z-[1000] flex items-center gap-2">
        {/* 展開時の検索バー */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isSearchExpanded ? "w-64 opacity-100" : "w-0 opacity-0"
          }`}
        >
          <Input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            classNames={{
              input: "text-white placeholder:text-white/50",
              inputWrapper:
                "bg-zinc-800/90 backdrop-blur-sm border-white/20 hover:bg-zinc-700/90 shadow-lg",
            }}
            size="lg"
          />
        </div>

        {/* 検索アイコンボタン */}
        <button
          type="button"
          onClick={toggleSearch}
          className={`search-button-pulse p-4 rounded-full shadow-lg transition-all duration-200 ${
            isSearchExpanded
              ? "search-expanded bg-amber-500 text-white"
              : "bg-zinc-800/90 backdrop-blur-sm text-white hover:bg-zinc-700/90"
          }`}
          aria-label={isSearchExpanded ? "Close search" : "Open search"}
        >
          {isSearchExpanded ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
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
          )}
        </button>
      </div>

      {/* 検索結果が0件の場合の表示 */}
      {debouncedQuery && filteredJobs.length === 0 && (
        <div className="absolute top-4 left-4 right-4 z-[1000]">
          <div className="bg-zinc-800/90 backdrop-blur-sm rounded-lg p-3 text-center text-white/80 text-sm">
            No jobs found for "{debouncedQuery}"
          </div>
        </div>
      )}

      {/* 詳細モーダル */}
      <JobDetailModal
        job={selectedJob}
        isOpen={isDetailModalOpen}
        isBookmarked={
          selectedJob ? isHydrated && isBookmarked(selectedJob.id) : false
        }
        isAlreadyAccepted={selectedJob ? !!getByJobId(selectedJob.id) : false}
        onClose={handleDetailClose}
        onBookmarkClick={() =>
          selectedJob && handleBookmarkToggle(selectedJob.id)
        }
        onAcceptClick={handleAccept}
      />

      {/* カスタムマーカースタイル & Leaflet修正 */}
      <style jsx global>{`
        /* Leaflet コンテナのz-index修正 */
        .leaflet-container {
          z-index: 1 !important;
        }

        /* Leaflet タイルレイヤーの表示修正 */
        .leaflet-tile-pane {
          z-index: 1 !important;
        }

        .leaflet-overlay-pane {
          z-index: 2 !important;
        }

        .leaflet-marker-pane {
          z-index: 3 !important;
        }

        .leaflet-tooltip-pane {
          z-index: 4 !important;
        }

        .leaflet-popup-pane {
          z-index: 5 !important;
        }

        /* カスタムマーカースタイル */
        .job-map-marker {
          background: transparent !important;
          border: none !important;
        }

        /* マーカーホバーエフェクト */
        .job-map-marker:hover {
          transform: scale(1.1);
          transition: transform 0.2s ease-in-out;
        }

        .job-map-marker .marker-pin {
          transition: all 0.2s ease-in-out;
        }

        .job-map-marker:hover .marker-pin {
          filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.4));
        }

        /* 検索ボタンのパルスアニメーション */
        @keyframes pulse-ring {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.15);
            opacity: 0.4;
          }
          100% {
            transform: scale(1);
            opacity: 0.8;
          }
        }

        .search-button-pulse {
          position: relative;
        }

        .search-button-pulse::before {
          content: "";
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f59e0b, #f97316);
          opacity: 0;
          z-index: -1;
          animation: pulse-ring 2s ease-in-out infinite;
        }

        .search-button-pulse:not(.search-expanded)::before {
          opacity: 0.6;
        }
      `}</style>
    </div>
  );
}
