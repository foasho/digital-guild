import type { BookmarkJob } from "@/types";
import type {
  CreateBookmarkJobParams,
  DeleteBookmarkJobParams,
  DeleteBookmarkJobByJobIdParams,
  GetBookmarksByWorkerIdParams,
} from "@/types/apis/bookmarkJob";

/**
 * ブックマークAPI（LocalStorageでCRUD）
 */
class BookmarkJobApi {
  private static readonly STORAGE_KEY = "bookmarkJobs";

  static async index(): Promise<BookmarkJob[]> {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || "[]");
  }

  static async getByWorkerId(
    params: GetBookmarksByWorkerIdParams
  ): Promise<BookmarkJob[]> {
    const items = await this.index();
    return items.filter((bookmark) => bookmark.workerId === params.workerId);
  }

  static async isBookmarked(jobId: number, workerId: number): Promise<boolean> {
    const items = await this.index();
    return items.some(
      (bookmark) => bookmark.jobId === jobId && bookmark.workerId === workerId
    );
  }

  static async create(params: CreateBookmarkJobParams): Promise<BookmarkJob> {
    const items = await this.index();
    // 既にブックマーク済みなら既存のものを返す（べき等な作成）
    const existing = items.find(
      (bookmark) =>
        bookmark.jobId === params.jobId && bookmark.workerId === params.workerId
    );
    if (existing) {
      return existing;
    }
    const maxId = items.reduce((max, item) => Math.max(max, item.id), 0);
    const newItem: BookmarkJob = { ...params, id: maxId + 1 };
    items.push(newItem);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    return newItem;
  }

  static async delete(params: DeleteBookmarkJobParams): Promise<void> {
    const items = await this.index();
    const index = items.findIndex((bookmark) => bookmark.id === params.id);
    if (index === -1) {
      // 既に削除済みの場合は何もしない（べき等な削除）
      return;
    }
    items.splice(index, 1);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
  }

  static async deleteByJobId(
    params: DeleteBookmarkJobByJobIdParams
  ): Promise<void> {
    const items = await this.index();
    const index = items.findIndex(
      (bookmark) =>
        bookmark.jobId === params.jobId && bookmark.workerId === params.workerId
    );
    if (index === -1) {
      // 既に削除済みの場合は何もしない（べき等な削除）
      return;
    }
    items.splice(index, 1);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
  }
}

export { BookmarkJobApi };

