import type { TransactionHistory } from "@/types";

type CreateTransactionHistoryParams = Omit<TransactionHistory, "id">;

type GetTransactionsByWorkerIdParams = {
  workerId: number;
};

type DeleteTransactionHistoryByIdParams = {
  id: number;
};

export type {
  CreateTransactionHistoryParams,
  GetTransactionsByWorkerIdParams,
  DeleteTransactionHistoryByIdParams,
};
