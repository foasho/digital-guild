import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { TransactionHistory } from "@/types";

interface WalletState {
  transactions: TransactionHistory[];
  addTransaction: (transaction: TransactionHistory) => void;
  getTransactionsByWorkerId: (workerId: string) => TransactionHistory[];
  clearTransactions: () => void;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      transactions: [],
      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [transaction, ...state.transactions],
        })),
      getTransactionsByWorkerId: (workerId) =>
        get().transactions.filter((t) => t.workerId === workerId),
      clearTransactions: () => set({ transactions: [] }),
    }),
    {
      name: "wallet-storage",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);
