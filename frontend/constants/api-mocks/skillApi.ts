import type { Skill } from "@/types";
import type {
  CreateSkillParams,
  UpdateSkillParams,
  GetSkillByIdParams,
  DeleteSkillByIdParams,
} from "@/types/apis/skill";

/**
 * スキルマスタAPI（LocalStorageでCRUD）
 */
class SkillApi {
  private static readonly STORAGE_KEY = "skills";

  static async index(): Promise<Skill[]> {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || "[]");
  }

  static async getById(params: GetSkillByIdParams): Promise<Skill> {
    const items = await this.index();
    const item = items.find((skill) => skill.id === params.id);
    if (!item) {
      throw new Error("Skill not found");
    }
    return item;
  }

  static async getByName(name: string): Promise<Skill | undefined> {
    const items = await this.index();
    return items.find((skill) => skill.name === name);
  }

  static async create(params: CreateSkillParams): Promise<Skill> {
    const items = await this.index();
    // 既に同名のスキルが存在するかチェック
    const exists = items.some((skill) => skill.name === params.name);
    if (exists) {
      throw new Error("Skill with this name already exists");
    }
    const maxId = items.reduce((max, item) => Math.max(max, item.id), 0);
    const newItem: Skill = { ...params, id: maxId + 1 };
    items.push(newItem);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    return newItem;
  }

  static async update(id: number, params: UpdateSkillParams): Promise<Skill> {
    const items = await this.index();
    const index = items.findIndex((skill) => skill.id === id);
    if (index === -1) {
      throw new Error("Skill not found");
    }
    items[index] = { ...items[index], ...params };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    return items[index];
  }

  static async delete(params: DeleteSkillByIdParams): Promise<void> {
    const items = await this.index();
    const index = items.findIndex((skill) => skill.id === params.id);
    if (index === -1) {
      throw new Error("Skill not found");
    }
    items.splice(index, 1);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
  }
}

export { SkillApi };

