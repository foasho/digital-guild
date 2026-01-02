import type { RequirementSkill } from "@/types";
import type {
  CreateRequirementSkillParams,
  UpdateRequirementSkillParams,
  GetRequirementSkillsByJobIdParams,
  DeleteRequirementSkillByIdParams,
} from "@/types/apis/requirementSkill";

/**
 * 募集条件スキルAPI（LocalStorageでCRUD）
 */
class RequirementSkillApi {
  private static readonly STORAGE_KEY = "requirementSkills";

  static async index(): Promise<RequirementSkill[]> {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || "[]");
  }

  static async getByJobId(
    params: GetRequirementSkillsByJobIdParams
  ): Promise<RequirementSkill[]> {
    const items = await this.index();
    return items.filter((skill) => skill.jobId === params.jobId);
  }

  static async create(
    params: CreateRequirementSkillParams
  ): Promise<RequirementSkill> {
    const items = await this.index();
    const maxId = items.reduce((max, item) => Math.max(max, item.id), 0);
    const newItem: RequirementSkill = { ...params, id: maxId + 1 };
    items.push(newItem);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    return newItem;
  }

  static async update(
    id: number,
    params: UpdateRequirementSkillParams
  ): Promise<RequirementSkill> {
    const items = await this.index();
    const index = items.findIndex((skill) => skill.id === id);
    if (index === -1) {
      throw new Error("RequirementSkill not found");
    }
    items[index] = { ...items[index], ...params };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    return items[index];
  }

  static async delete(params: DeleteRequirementSkillByIdParams): Promise<void> {
    const items = await this.index();
    const index = items.findIndex((skill) => skill.id === params.id);
    if (index === -1) {
      throw new Error("RequirementSkill not found");
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

export { RequirementSkillApi };

