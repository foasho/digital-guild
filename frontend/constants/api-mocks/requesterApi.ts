import type { Requester } from "@/types";
import type {
  CreateRequesterParams,
  UpdateRequesterParams,
  GetRequesterByIdParams,
  DeleteRequesterByIdParams,
} from "@/types/apis/requester";

/**
 * 発注者API（LocalStorageでCRUD）
 */
class RequesterApi {
  private static readonly STORAGE_KEY = "requesters";

  static async index(): Promise<Requester[]> {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || "[]");
  }

  static async getById(params: GetRequesterByIdParams): Promise<Requester> {
    const items = await this.index();
    const item = items.find((requester) => requester.id === params.id);
    if (!item) {
      throw new Error("Requester not found");
    }
    return item;
  }

  static async create(params: CreateRequesterParams): Promise<Requester> {
    const items = await this.index();
    const maxId = items.reduce((max, item) => Math.max(max, item.id), 0);
    const newItem: Requester = {
      ...params,
      id: maxId + 1,
      createdAt: new Date().toISOString(),
    };
    items.push(newItem);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    return newItem;
  }

  static async update(
    id: number,
    params: UpdateRequesterParams
  ): Promise<Requester> {
    const items = await this.index();
    const index = items.findIndex((requester) => requester.id === id);
    if (index === -1) {
      throw new Error("Requester not found");
    }
    items[index] = { ...items[index], ...params };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    return items[index];
  }

  static async delete(params: DeleteRequesterByIdParams): Promise<void> {
    const items = await this.index();
    const index = items.findIndex((requester) => requester.id === params.id);
    if (index === -1) {
      throw new Error("Requester not found");
    }
    items.splice(index, 1);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
  }
}

export { RequesterApi };

