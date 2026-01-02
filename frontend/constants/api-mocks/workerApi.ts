import type { Worker } from "@/types";
import type {
  CreateWorkerParams,
  UpdateWorkerParams,
  GetWorkerByIdParams,
  DeleteWorkerByIdParams,
} from "@/types/apis/worker";

/**
 * 労働者API（LocalStorageでCRUD）
 */
class WorkerApi {
  private static readonly STORAGE_KEY = "workers";

  static async index(): Promise<Worker[]> {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || "[]");
  }

  static async getById(params: GetWorkerByIdParams): Promise<Worker> {
    const items = await this.index();
    const item = items.find((worker) => worker.id === params.id);
    if (!item) {
      throw new Error("Worker not found");
    }
    return item;
  }

  static async create(params: CreateWorkerParams): Promise<Worker> {
    const items = await this.index();
    const maxId = items.reduce((max, item) => Math.max(max, item.id), 0);
    const now = new Date().toISOString();
    const newItem: Worker = {
      ...params,
      id: maxId + 1,
      createdAt: now,
      updatedAt: now,
    };
    items.push(newItem);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    return newItem;
  }

  static async update(id: number, params: UpdateWorkerParams): Promise<Worker> {
    const items = await this.index();
    const index = items.findIndex((worker) => worker.id === id);
    if (index === -1) {
      throw new Error("Worker not found");
    }
    items[index] = {
      ...items[index],
      ...params,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    return items[index];
  }

  static async delete(params: DeleteWorkerByIdParams): Promise<void> {
    const items = await this.index();
    const index = items.findIndex((worker) => worker.id === params.id);
    if (index === -1) {
      throw new Error("Worker not found");
    }
    items.splice(index, 1);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
  }
}

export { WorkerApi };

