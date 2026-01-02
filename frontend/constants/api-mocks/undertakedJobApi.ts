import type { UndertakedJob } from "@/types";
import type {
  CreateUndertakedJobParams,
  UpdateUndertakedJobParams,
  GetUndertakedJobByIdParams,
  DeleteUndertakedJobByIdParams,
} from "@/types/apis/undertakedJob";

/**
 * APIはモックなので、LocalStorageで全てCRUDする
 */
class UndertakedJobApi {
  private static readonly STORAGE_KEY = "undertakedJobs";

  static async index(): Promise<UndertakedJob[]> {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || "[]");
  }

  static async getById(
    params: GetUndertakedJobByIdParams
  ): Promise<UndertakedJob> {
    const items = await this.index();
    const item = items.find((job) => job.id === params.id);
    if (!item) {
      throw new Error("Undertaked job not found");
    }
    return item;
  }

  static async getByWorkerId(workerId: number): Promise<UndertakedJob[]> {
    const items = await this.index();
    return items.filter((job) => job.workerId === workerId);
  }

  static async getByJobId(jobId: number): Promise<UndertakedJob | undefined> {
    const items = await this.index();
    return items.find((job) => job.jobId === jobId);
  }

  static async create(params: CreateUndertakedJobParams): Promise<UndertakedJob> {
    const items = await this.index();
    const maxId = items.reduce((max, item) => Math.max(max, item.id), 0);
    const newItem: UndertakedJob = { ...params, id: maxId + 1 };
    items.push(newItem);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    return newItem;
  }

  static async update(
    id: number,
    params: UpdateUndertakedJobParams
  ): Promise<UndertakedJob> {
    const items = await this.index();
    const index = items.findIndex((job) => job.id === id);
    if (index === -1) {
      throw new Error("Undertaked job not found");
    }
    items[index] = { ...items[index], ...params };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    return items[index];
  }

  static async delete(params: DeleteUndertakedJobByIdParams): Promise<void> {
    const items = await this.index();
    const index = items.findIndex((job) => job.id === params.id);
    if (index === -1) {
      throw new Error("Undertaked job not found");
    }
    items.splice(index, 1);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
  }
}

export { UndertakedJobApi };
