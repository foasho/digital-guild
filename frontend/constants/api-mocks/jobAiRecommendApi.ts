import type { JobAiRecommend } from "@/types";
import type {
  CreateJobAiRecommendParams,
  UpdateJobAiRecommendParams,
  GetJobAiRecommendsByJobIdParams,
  GetJobAiRecommendsByWorkerIdParams,
  DeleteJobAiRecommendByIdParams,
} from "@/types/apis/jobAiRecommend";

/**
 * AIレコメンドAPI（LocalStorageでCRUD）
 */
class JobAiRecommendApi {
  private static readonly STORAGE_KEY = "jobAiRecommends";

  static async index(): Promise<JobAiRecommend[]> {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || "[]");
  }

  static async getByJobId(
    params: GetJobAiRecommendsByJobIdParams
  ): Promise<JobAiRecommend[]> {
    const items = await this.index();
    return items.filter((recommend) => recommend.jobId === params.jobId);
  }

  static async getByWorkerId(
    params: GetJobAiRecommendsByWorkerIdParams
  ): Promise<JobAiRecommend[]> {
    const items = await this.index();
    return items.filter((recommend) => recommend.workerId === params.workerId);
  }

  /**
   * 確度0.7以上のレコメンドを取得
   */
  static async getRecommendedByWorkerId(
    workerId: number
  ): Promise<JobAiRecommend[]> {
    const items = await this.getByWorkerId({ workerId });
    return items.filter((recommend) => recommend.confidence >= 0.7);
  }

  static async create(
    params: CreateJobAiRecommendParams
  ): Promise<JobAiRecommend> {
    const items = await this.index();
    const maxId = items.reduce((max, item) => Math.max(max, item.id), 0);
    const now = new Date().toISOString();
    const newItem: JobAiRecommend = {
      ...params,
      id: maxId + 1,
      createdAt: now,
      updatedAt: now,
    };
    items.push(newItem);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    return newItem;
  }

  static async update(
    id: number,
    params: UpdateJobAiRecommendParams
  ): Promise<JobAiRecommend> {
    const items = await this.index();
    const index = items.findIndex((recommend) => recommend.id === id);
    if (index === -1) {
      throw new Error("JobAiRecommend not found");
    }
    items[index] = {
      ...items[index],
      ...params,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    return items[index];
  }

  static async delete(params: DeleteJobAiRecommendByIdParams): Promise<void> {
    const items = await this.index();
    const index = items.findIndex((recommend) => recommend.id === params.id);
    if (index === -1) {
      throw new Error("JobAiRecommend not found");
    }
    items.splice(index, 1);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
  }

  static async deleteByJobId(jobId: number): Promise<void> {
    const items = await this.index();
    const filtered = items.filter((recommend) => recommend.jobId !== jobId);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
  }
}

export { JobAiRecommendApi };

