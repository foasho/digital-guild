"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { BookmarkJobApi } from "@/constants/api-mocks";
import { useBookmarkStore, useWorkerStore } from "@/stores/workers";
import type { BookmarkJob } from "@/types";

interface UseBookmarksResult {
  bookmarks: BookmarkJob[];
  pending: boolean;
  addBookmark: (jobId: number) => Promise<BookmarkJob>;
  removeBookmark: (jobId: number) => Promise<void>;
  isBookmarked: (jobId: number) => boolean;
}

/**
 * 現在のワーカーのブックマーク一覧を取得し、Storeに格納するhook
 * データ取得: hooks → API → LocalStorage
 */
const useBookmarks = (): UseBookmarksResult => {
  const [pending, setPending] = useState(false);
  const hasFetched = useRef(false);
  const { worker } = useWorkerStore();
  const {
    bookmarks,
    setBookmarks,
    addBookmark: addToStore,
    removeBookmark: removeFromStore,
  } = useBookmarkStore();

  // bookmarksの変更を追跡するためにuseCallbackでラップ
  const isBookmarked = useCallback(
    (jobId: number): boolean => {
      return bookmarks.some((b) => b.jobId === jobId);
    },
    [bookmarks]
  );

  useEffect(() => {
    const fetchBookmarks = async (): Promise<void> => {
      if (!worker || hasFetched.current) return;
      hasFetched.current = true;
      setPending(true);
      try {
        // APIからデータ取得（LocalStorageと同期）
        const data = await BookmarkJobApi.getByWorkerId({ workerId: worker.id });
        setBookmarks(data);
      } finally {
        setPending(false);
      }
    };
    fetchBookmarks();
  }, [worker, setBookmarks]);

  const addBookmark = useCallback(
    async (jobId: number): Promise<BookmarkJob> => {
      if (!worker) throw new Error("Worker not found");
      // APIで作成（IDは自動生成）
      const newBookmark = await BookmarkJobApi.create({
        jobId,
        workerId: worker.id,
      });
      addToStore(newBookmark);
      return newBookmark;
    },
    [worker, addToStore]
  );

  const removeBookmark = useCallback(
    async (jobId: number): Promise<void> => {
      if (!worker) throw new Error("Worker not found");
      // APIで削除
      await BookmarkJobApi.deleteByJobId({ jobId, workerId: worker.id });
      removeFromStore(jobId);
    },
    [worker, removeFromStore]
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
