"use client";

import { useState, useEffect, useCallback } from "react";
import { BookmarkJobApi } from "@/constants/api-mocks";
import type { BookmarkJob } from "@/types";

/**
 * ブックマーク一覧を取得・操作するhook
 */
const useBookmarks = (workerId: number) => {
  const [bookmarks, setBookmarks] = useState<BookmarkJob[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = useCallback(async (): Promise<void> => {
    if (!workerId) return;
    setLoading(true);
    try {
      const bookmarkList = await BookmarkJobApi.getByWorkerId({ workerId });
      setBookmarks(bookmarkList);
    } finally {
      setLoading(false);
    }
  }, [workerId]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const addBookmark = useCallback(
    async (jobId: number): Promise<BookmarkJob> => {
      const newBookmark = await BookmarkJobApi.create({ jobId, workerId });
      setBookmarks((prev) => [...prev, newBookmark]);
      return newBookmark;
    },
    [workerId]
  );

  const removeBookmark = useCallback(
    async (jobId: number): Promise<void> => {
      await BookmarkJobApi.deleteByJobId({ jobId, workerId });
      setBookmarks((prev) => prev.filter((b) => b.jobId !== jobId));
    },
    [workerId]
  );

  const isBookmarked = useCallback(
    (jobId: number): boolean => {
      return bookmarks.some((b) => b.jobId === jobId);
    },
    [bookmarks]
  );

  return {
    bookmarks,
    loading,
    addBookmark,
    removeBookmark,
    isBookmarked,
    refetch: fetchBookmarks,
  };
};

export { useBookmarks };

