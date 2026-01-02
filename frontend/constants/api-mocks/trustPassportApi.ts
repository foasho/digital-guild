import type { TrustPassport } from "@/types";
import type {
  CreateTrustPassportParams,
  UpdateTrustPassportParams,
  GetTrustPassportByIdParams,
  GetTrustPassportByWorkerIdParams,
  DeleteTrustPassportByIdParams,
} from "@/types/apis/trustPassport";

/**
 * ギルド証API（LocalStorageでCRUD）
 */
class TrustPassportApi {
  private static readonly STORAGE_KEY = "trustPassports";

  static async index(): Promise<TrustPassport[]> {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || "[]");
  }

  static async getById(
    params: GetTrustPassportByIdParams
  ): Promise<TrustPassport> {
    const items = await this.index();
    const item = items.find((passport) => passport.id === params.id);
    if (!item) {
      throw new Error("TrustPassport not found");
    }
    return item;
  }

  static async getByWorkerId(
    params: GetTrustPassportByWorkerIdParams
  ): Promise<TrustPassport | undefined> {
    const items = await this.index();
    return items.find((passport) => passport.workerId === params.workerId);
  }

  static async create(
    params: CreateTrustPassportParams
  ): Promise<TrustPassport> {
    const items = await this.index();
    const maxId = items.reduce((max, item) => Math.max(max, item.id), 0);
    const newItem: TrustPassport = { ...params, id: maxId + 1 };
    items.push(newItem);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    return newItem;
  }

  static async update(
    id: number,
    params: UpdateTrustPassportParams
  ): Promise<TrustPassport> {
    const items = await this.index();
    const index = items.findIndex((passport) => passport.id === id);
    if (index === -1) {
      throw new Error("TrustPassport not found");
    }
    items[index] = { ...items[index], ...params };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    return items[index];
  }

  static async updateByWorkerId(
    workerId: number,
    params: UpdateTrustPassportParams
  ): Promise<TrustPassport> {
    const items = await this.index();
    const index = items.findIndex((passport) => passport.workerId === workerId);
    if (index === -1) {
      throw new Error("TrustPassport not found");
    }
    items[index] = { ...items[index], ...params };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    return items[index];
  }

  static async delete(params: DeleteTrustPassportByIdParams): Promise<void> {
    const items = await this.index();
    const index = items.findIndex((passport) => passport.id === params.id);
    if (index === -1) {
      throw new Error("TrustPassport not found");
    }
    items.splice(index, 1);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
  }
}

export { TrustPassportApi };

