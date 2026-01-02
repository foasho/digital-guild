import type { Subsidy } from "@/types";
import type {
  CreateSubsidyParams,
  UpdateSubsidyParams,
  GetSubsidyByIdParams,
  GetSubsidiesByRequesterIdParams,
  DeleteSubsidyByIdParams,
} from "@/types/apis/subsidy";

/**
 * 補助金API（LocalStorageでCRUD）
 */
class SubsidyApi {
  private static readonly STORAGE_KEY = "subsidies";

  static async index(): Promise<Subsidy[]> {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || "[]");
  }

  static async getById(params: GetSubsidyByIdParams): Promise<Subsidy> {
    const items = await this.index();
    const item = items.find((subsidy) => subsidy.id === params.id);
    if (!item) {
      throw new Error("Subsidy not found");
    }
    return item;
  }

  static async getByRequesterId(
    params: GetSubsidiesByRequesterIdParams
  ): Promise<Subsidy[]> {
    const items = await this.index();
    return items.filter((subsidy) => subsidy.requesterId === params.requesterId);
  }

  static async create(params: CreateSubsidyParams): Promise<Subsidy> {
    const items = await this.index();
    const maxId = items.reduce((max, item) => Math.max(max, item.id), 0);
    const newItem: Subsidy = { ...params, id: maxId + 1 };
    items.push(newItem);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    return newItem;
  }

  static async update(id: number, params: UpdateSubsidyParams): Promise<Subsidy> {
    const items = await this.index();
    const index = items.findIndex((subsidy) => subsidy.id === id);
    if (index === -1) {
      throw new Error("Subsidy not found");
    }
    items[index] = { ...items[index], ...params };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    return items[index];
  }

  static async delete(params: DeleteSubsidyByIdParams): Promise<void> {
    const items = await this.index();
    const index = items.findIndex((subsidy) => subsidy.id === params.id);
    if (index === -1) {
      throw new Error("Subsidy not found");
    }
    items.splice(index, 1);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
  }
}

export { SubsidyApi };

