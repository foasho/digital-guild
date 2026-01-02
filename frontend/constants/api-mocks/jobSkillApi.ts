import type { JobSkill } from "@/types";
import type {
  CreateJobSkillParams,
  GetJobSkillsByJobIdParams,
  DeleteJobSkillByIdParams,
} from "@/types/apis/jobSkill";

/**
 * ジョブスキルAPI（LocalStorageでCRUD）
 */
class JobSkillApi {
  private static readonly STORAGE_KEY = "jobSkills";

  static async index(): Promise<JobSkill[]> {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || "[]");
  }

  static async getByJobId(params: GetJobSkillsByJobIdParams): Promise<JobSkill[]> {
    const items = await this.index();
    return items.filter((skill) => skill.jobId === params.jobId);
  }

  static async create(params: CreateJobSkillParams): Promise<JobSkill> {
    const items = await this.index();
    const maxId = items.reduce((max, item) => Math.max(max, item.id), 0);
    const newItem: JobSkill = { ...params, id: maxId + 1 };
    items.push(newItem);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    return newItem;
  }

  static async delete(params: DeleteJobSkillByIdParams): Promise<void> {
    const items = await this.index();
    const index = items.findIndex((skill) => skill.id === params.id);
    if (index === -1) {
      throw new Error("JobSkill not found");
    }
    items.splice(index, 1);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
  }

  static async deleteByJobId(jobId: number): Promise<void> {
    const items = await this.index();
    const filtered = items.filter((skill) => skill.jobId !== jobId);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
  }
}

export { JobSkillApi };

