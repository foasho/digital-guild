import type { WorkerSkill } from "@/types";
import type {
  CreateWorkerSkillParams,
  GetWorkerSkillsByWorkerIdParams,
  DeleteWorkerSkillByIdParams,
} from "@/types/apis/workerSkill";

/**
 * 労働者スキルAPI（LocalStorageでCRUD）
 */
class WorkerSkillApi {
  private static readonly STORAGE_KEY = "workerSkills";

  static async index(): Promise<WorkerSkill[]> {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || "[]");
  }

  static async getByWorkerId(
    params: GetWorkerSkillsByWorkerIdParams
  ): Promise<WorkerSkill[]> {
    const items = await this.index();
    return items.filter((skill) => skill.workerId === params.workerId);
  }

  static async create(params: CreateWorkerSkillParams): Promise<WorkerSkill> {
    const items = await this.index();
    const maxId = items.reduce((max, item) => Math.max(max, item.id), 0);
    const newItem: WorkerSkill = { ...params, id: maxId + 1 };
    items.push(newItem);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    return newItem;
  }

  static async delete(params: DeleteWorkerSkillByIdParams): Promise<void> {
    const items = await this.index();
    const index = items.findIndex((skill) => skill.id === params.id);
    if (index === -1) {
      throw new Error("WorkerSkill not found");
    }
    items.splice(index, 1);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
  }
}

export { WorkerSkillApi };

