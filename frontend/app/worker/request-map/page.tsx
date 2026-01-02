"use client";

import { Input } from "@heroui/react";
import { debounce } from "es-toolkit";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Send, X } from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { JobDetailModal } from "@/components/worker/JobDetailModal";
import { useJobs, useBookmarks, useUndertakedJobs, useWorker } from "@/hooks/workers";
import type { Job } from "@/types";

// SSR無効化でMapコンポーネントをdynamic import
const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-zinc-900">
      <div className="text-white/60">Loading map...</div>
    </div>
  ),
});

export default function RequestMapPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [flyToPosition, setFlyToPosition] = useState<{ lat: number; lng: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // hooksからデータ取得
  const { worker } = useWorker();
  const { jobs, pending: jobsPending } = useJobs();
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const { addUndertakedJob, getByJobId, pending: undertakedPending } = useUndertakedJobs();

  const isHydrated = !jobsPending && !undertakedPending;

  // 検索バー展開時に入力欄にフォーカス
  useEffect(() => {
    if (isSearchExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchExpanded]);

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

  // 検索結果の最新ジョブを見つけてマップを移動
  useEffect(() => {
    if (debouncedQuery && filteredJobs.length > 0) {
      // createdAtで降順ソートして最新のものを取得
      const sortedJobs = [...filteredJobs].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      });
      const latestJob = sortedJobs[0];
      setFlyToPosition({ lat: latestJob.latitude, lng: latestJob.longitude });
    }
  }, [debouncedQuery, filteredJobs]);

  // ブックマークのトグル
  const handleBookmarkToggle = useCallback(
    (jobId: number) => {
      if (!worker) return;
      if (isBookmarked(jobId)) {
        removeBookmark(jobId);
      } else {
        addBookmark(jobId);
      }
    },
    [worker, isBookmarked, addBookmark, removeBookmark]
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
    if (!selectedJob || !worker) return;

    // 既に受注済みかチェック
    if (getByJobId(selectedJob.id)) {
      return;
    }

    // hooksのaddUndertakedJobを使用（IDは自動生成）
    addUndertakedJob({
      workerId: worker.id,
      jobId: selectedJob.id,
      status: "accepted",
      requesterEvalScore: null,
      acceptedAt: new Date().toISOString(),
      completionReportedAt: null,
      canceledAt: null,
      finishedAt: null,
      completionMemo: null,
      completedChecklistIds: null,
    });
    handleDetailClose();
  }, [selectedJob, worker, getByJobId, addUndertakedJob, handleDetailClose]);

  // 検索バーの展開/折りたたみをトグル
  const toggleSearch = useCallback(() => {
    setIsSearchExpanded((prev) => !prev);
    if (isSearchExpanded) {
      setSearchQuery("");
      setDebouncedQuery("");
      setFlyToPosition(null);
    }
  }, [isSearchExpanded]);

  // 検索を即座に実行（送信ボタン or Enterキー）
  const handleSearchSubmit = useCallback(() => {
    if (!searchQuery.trim()) return;
    
    const query = searchQuery.toLowerCase();
    const matchedJobs = jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query) ||
        job.tags.some((tag) => tag.toLowerCase().includes(query)),
    );

    if (matchedJobs.length > 0) {
      // createdAtで降順ソートして最新のものを取得
      const sortedJobs = [...matchedJobs].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      });
      const latestJob = sortedJobs[0];
      setFlyToPosition({ lat: latestJob.latitude, lng: latestJob.longitude });
    }
    // debounced queryも即座に更新
    setDebouncedQuery(searchQuery);
  }, [searchQuery, jobs]);

  return (
    <div className="relative w-full h-full">
      {/* マップコンポーネント */}
      <MapComponent
        jobs={filteredJobs}
        isBookmarked={(jobId) => isHydrated && isBookmarked(jobId)}
        onMarkerClick={handleMarkerClick}
        flyToPosition={flyToPosition}
      />

      {/* 右下の検索UI */}
      <div className="absolute bottom-6 right-4 z-[1000] flex items-center gap-2">
        <AnimatePresence>
          {isSearchExpanded && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 260, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <Input
                ref={inputRef}
                type="text"
                placeholder="場所・タイトルで検索..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearchSubmit();
                  }
                }}
                classNames={{
                  base: "h-10",
                  input: "text-gray-700 placeholder:text-gray-400 text-sm !pe-0 focus:outline-none",
                  inputWrapper:
                    "bg-white/95 backdrop-blur-sm border border-gray-200 hover:bg-white shadow-md h-10 min-h-10 rounded-full !pl-4 !pr-0.5 !outline-none !ring-0 !ring-offset-0 focus-within:!ring-0 focus-within:!border-gray-200 data-[focus=true]:!ring-0 data-[focus=true]:!border-gray-200 data-[focus-visible=true]:!ring-0 data-[focus-visible=true]:!ring-offset-0 data-[hover=true]:!border-gray-200 group-data-[focus=true]:!ring-0 group-data-[focus-visible=true]:!ring-0",
                }}
                size="sm"
                endContent={
                  <button
                    type="button"
                    onClick={handleSearchSubmit}
                    className="p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="検索を実行"
                    disabled={!searchQuery.trim()}
                  >
                    <Send size={14} />
                  </button>
                }
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 検索開閉ボタン */}
        <motion.button
          type="button"
          onClick={toggleSearch}
          className="p-3 rounded-full shadow-md bg-white/95 backdrop-blur-sm text-gray-500 hover:bg-white hover:text-gray-700 transition-colors"
          aria-label={isSearchExpanded ? "検索を閉じる" : "検索を開く"}
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isSearchExpanded ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <X size={20} />
              </motion.span>
            ) : (
              <motion.span
                key="search"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Search size={20} />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* 検索結果が0件の場合の表示 */}
      <AnimatePresence>
        {debouncedQuery && filteredJobs.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-4 left-4 right-4 z-[1000]"
          >
            <div className="bg-white/95 backdrop-blur-sm rounded-lg p-3 text-center text-gray-600 text-sm shadow-md">
              「{debouncedQuery}」に該当する案件はありません
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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

        /* HeroUI Inputのフォーカスアウトライン無効化 */
        [data-slot="input-wrapper"] {
          outline: none !important;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1) !important;
        }
        [data-slot="input-wrapper"]:focus-within {
          outline: none !important;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1) !important;
        }
        [data-slot="inner-wrapper"] {
          outline: none !important;
        }
        [data-slot="input"] {
          outline: none !important;
        }
        [data-slot="input"]:focus {
          outline: none !important;
        }
      `}</style>
    </div>
  );
}
