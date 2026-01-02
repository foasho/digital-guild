import type { BookmarkJob } from "@/types";

type CreateBookmarkJobParams = Omit<BookmarkJob, "id">;

type DeleteBookmarkJobParams = {
  id: number;
};

type DeleteBookmarkJobByJobIdParams = {
  jobId: number;
  workerId: number;
};

type GetBookmarksByWorkerIdParams = {
  workerId: number;
};

export type {
  CreateBookmarkJobParams,
  DeleteBookmarkJobParams,
  DeleteBookmarkJobByJobIdParams,
  GetBookmarksByWorkerIdParams,
};
