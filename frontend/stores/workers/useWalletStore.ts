import { create } from "zustand";
import type { TransactionHistory } from "@/types";

interface WalletState {
  transactions: TransactionHistory[];
  setTransactions: (transactions: TransactionHistory[]) => void;
  addTransaction: (transaction: TransactionHistory) => void;
  getTransactionsByWorkerId: (workerId: number) => TransactionHistory[];
  clearTransactions: () => void;
}

export const useWalletStore = create<WalletState>()((set, get) => ({
  transactions: [],
  setTransactions: (transactions) => set({ transactions }),
  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [transaction, ...state.transactions],
    })),
  getTransactionsByWorkerId: (workerId) =>
    get().transactions.filter((t) => t.workerId === workerId),
  clearTransactions: () => set({ transactions: [] }),
}));
