import { UndertakedJob } from "@/types";
import { CreateUndertakedJobParams, UpdateUndertakedJobParams, GetUndertakedJobByIdParams, DeleteUndertakedJobByIdParams } from "@/types/apis/undertakedJob";

/**
 * APIはモックなので、LocalStorageで全てCRUDする
 */
class UndertakedJobApi {
  private static readonly BASE_URL = "/api/undertaked-jobs";

  static async index(): Promise<UndertakedJob[]> {
    return JSON.parse(localStorage.getItem("undertakedJobs") || "[]");
  }

  static async create(params: CreateUndertakedJobParams): Promise<UndertakedJob> {
    const undertakedJobs = await this.index();
    const createdUndertakedJob = { ...params, id: undertakedJobs.length + 1 };
    undertakedJobs.push(createdUndertakedJob);
    localStorage.setItem("undertakedJobs", JSON.stringify(undertakedJobs));
    return createdUndertakedJob;
  }

  static async update(id: string, params: UpdateUndertakedJobParams): Promise<UndertakedJob> {
    const undertakedJobs = await this.index();
    const index = undertakedJobs.findIndex((job) => job.id === id);
    if (index === -1) {
      throw new Error("Undertaked job not found");
    }
    undertakedJobs[index] = { ...undertakedJobs[index], ...params };
    localStorage.setItem("undertakedJobs", JSON.stringify(undertakedJobs));
    return undertakedJobs[index];
  }

  static async delete(params: DeleteUndertakedJobByIdParams): Promise<void> {
    const undertakedJobs = await this.index();
    const index = undertakedJobs.findIndex((job) => job.id === params.id);
    if (index === -1) {
      throw new Error("Undertaked job not found");
    }
    undertakedJobs.splice(index, 1);
    localStorage.setItem("undertakedJobs", JSON.stringify(undertakedJobs));
  }

  static async getById(params: GetUndertakedJobByIdParams): Promise<UndertakedJob> {
    const undertakedJobs = await this.index();
    const undertakedJob = undertakedJobs.find((job) => job.id === params.id);
    if (!undertakedJob) {
      throw new Error("Undertaked job not found");
    }
    return undertakedJob;
  }
}

export { UndertakedJobApi };
