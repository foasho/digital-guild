import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { BookmarkJob } from "@/types";

interface BookmarkState {
  bookmarks: BookmarkJob[];
  addBookmark: (bookmark: BookmarkJob) => void;
  removeBookmark: (jobId: string) => void;
  isBookmarked: (jobId: string) => boolean;
  clearBookmarks: () => void;
}

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      bookmarks: [],
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
    }),
    {
      name: "bookmark-storage",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);
