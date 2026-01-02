import type { Job } from "@/types";
import type {
  CreateJobParams,
  UpdateJobParams,
  GetJobByIdParams,
  DeleteJobByIdParams,
} from "@/types/apis/job";

/**
 * ジョブAPI（LocalStorageでCRUD）
 */
class JobApi {
  private static readonly STORAGE_KEY = "jobs";

  static async index(): Promise<Job[]> {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || "[]");
  }

  static async getById(params: GetJobByIdParams): Promise<Job> {
    const items = await this.index();
    const item = items.find((job) => job.id === params.id);
    if (!item) {
      throw new Error("Job not found");
    }
    return item;
  }

  static async getByRequesterId(requesterId: number): Promise<Job[]> {
    const items = await this.index();
    return items.filter((job) => job.requesterId === requesterId);
  }

  static async create(params: CreateJobParams): Promise<Job> {
    const items = await this.index();
    const maxId = items.reduce((max, item) => Math.max(max, item.id), 0);
    const now = new Date().toISOString();
    const newItem: Job = {
      ...params,
      id: maxId + 1,
      createdAt: now,
      updatedAt: now,
    };
    items.push(newItem);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    return newItem;
  }

  static async update(id: number, params: UpdateJobParams): Promise<Job> {
    const items = await this.index();
    const index = items.findIndex((job) => job.id === id);
    if (index === -1) {
      throw new Error("Job not found");
    }
    items[index] = {
      ...items[index],
      ...params,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    return items[index];
  }

  static async delete(params: DeleteJobByIdParams): Promise<void> {
    const items = await this.index();
    const index = items.findIndex((job) => job.id === params.id);
    if (index === -1) {
      throw new Error("Job not found");
    }
    items.splice(index, 1);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
  }
}

export { JobApi };

