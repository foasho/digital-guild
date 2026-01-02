"use client";

import { useState, useEffect, useCallback } from "react";
import { bookmarkJobs as mockBookmarkJobs } from "@/constants/mocks";
import { useBookmarkStore, useWorkerStore } from "@/stores";
import type { BookmarkJob } from "@/types";

interface UseBookmarksResult {
  bookmarks: BookmarkJob[];
  pending: boolean;
  addBookmark: (jobId: number) => BookmarkJob;
  removeBookmark: (jobId: number) => void;
  isBookmarked: (jobId: number) => boolean;
}

/**
 * 現在のワーカーのブックマーク一覧を取得し、Storeに格納するhook
 */
const useBookmarks = (): UseBookmarksResult => {
  const [pending, setPending] = useState(false);
  const { worker } = useWorkerStore();
  const {
    bookmarks,
    setBookmarks,
    addBookmark: addToStore,
    removeBookmark: removeFromStore,
    isBookmarked,
  } = useBookmarkStore();

  useEffect(() => {
    const fetchBookmarks = async (): Promise<void> => {
      if (!worker || bookmarks.length > 0) return;
      setPending(true);
      try {
        // TODO: 本番移行では、APIから取得する予定
        const workerBookmarks = mockBookmarkJobs.filter(
          (b) => b.workerId === worker.id
        );
        setBookmarks(workerBookmarks);
      } finally {
        setPending(false);
      }
    };
    fetchBookmarks();
  }, [worker, bookmarks.length, setBookmarks]);

  const addBookmark = useCallback(
    (jobId: number): BookmarkJob => {
      if (!worker) throw new Error("Worker not found");
      const maxId =
        bookmarks.length > 0 ? Math.max(...bookmarks.map((b) => b.id)) : 0;
      const newBookmark: BookmarkJob = {
        id: maxId + 1,
        jobId,
        workerId: worker.id,
      };
      addToStore(newBookmark);
      return newBookmark;
    },
    [worker, bookmarks, addToStore]
  );

  const removeBookmark = useCallback(
    (jobId: number): void => {
      removeFromStore(jobId);
    },
    [removeFromStore]
  );

  return {
    bookmarks,
    pending,
    addBookmark,
    removeBookmark,
    isBookmarked,
  };
};

export { useBookmarks };
