import type { TransactionHistory } from "@/types";
import type {
  CreateTransactionHistoryParams,
  GetTransactionsByWorkerIdParams,
  DeleteTransactionHistoryByIdParams,
} from "@/types/apis/transactionHistory";

/**
 * 取引履歴API（LocalStorageでCRUD）
 */
class TransactionHistoryApi {
  private static readonly STORAGE_KEY = "transactionHistories";

  static async index(): Promise<TransactionHistory[]> {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || "[]");
  }

  static async getByWorkerId(
    params: GetTransactionsByWorkerIdParams
  ): Promise<TransactionHistory[]> {
    const items = await this.index();
    return items.filter(
      (transaction) => transaction.workerId === params.workerId
    );
  }

  static async create(
    params: CreateTransactionHistoryParams
  ): Promise<TransactionHistory> {
    const items = await this.index();
    const maxId = items.reduce((max, item) => Math.max(max, item.id), 0);
    const newItem: TransactionHistory = { ...params, id: maxId + 1 };
    items.push(newItem);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    return newItem;
  }

  static async delete(
    params: DeleteTransactionHistoryByIdParams
  ): Promise<void> {
    const items = await this.index();
    const index = items.findIndex(
      (transaction) => transaction.id === params.id
    );
    if (index === -1) {
      throw new Error("TransactionHistory not found");
    }
    items.splice(index, 1);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
  }

  /**
   * 残高を計算する
   */
  static async calculateBalance(workerId: number): Promise<number> {
    const items = await this.getByWorkerId({ workerId });
    const INITIAL_BALANCE = 20000;
    return items.reduce((sum, tx) => sum + tx.amount, INITIAL_BALANCE);
  }
}

export { TransactionHistoryApi };

