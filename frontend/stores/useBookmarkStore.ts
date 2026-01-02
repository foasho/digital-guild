import { create } from "zustand";
import type { BookmarkJob } from "@/types";

interface BookmarkState {
  bookmarks: BookmarkJob[];
  setBookmarks: (bookmarks: BookmarkJob[]) => void;
  addBookmark: (bookmark: BookmarkJob) => void;
  removeBookmark: (jobId: number) => void;
  isBookmarked: (jobId: number) => boolean;
  clearBookmarks: () => void;
}

export const useBookmarkStore = create<BookmarkState>()((set, get) => ({
  bookmarks: [],
  setBookmarks: (bookmarks) => set({ bookmarks }),
  addBookmark: (bookmark) =>
    set((state) => ({
      bookmarks: [...state.bookmarks, bookmark],
    })),
  removeBookmark: (jobId) =>
    set((state) => ({
      bookmarks: state.bookmarks.filter((b) => b.jobId !== jobId),
    })),
  isBookmarked: (jobId) => get().bookmarks.some((b) => b.jobId === jobId),
  clearBookmarks: () => set({ bookmarks: [] }),
}));
