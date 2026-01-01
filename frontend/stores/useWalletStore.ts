import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { TransactionHistory } from "@/types";

// モック取引履歴データ
const mockTransactionHistories: TransactionHistory[] = [
  {
    id: "txn-001",
    workerId: "worker-001",
    to: "第一ホテル",
    from: "田中 一郎",
    amount: -8000,
    description: "宿泊費支払い",
    tradedAt: "2026-01-05T18:12:00Z",
  },
  {
    id: "txn-002",
    workerId: "worker-001",
    to: "田中 一郎",
    from: "あさひ旅館",
    amount: 3000,
    description: "報酬: 清掃作業",
    tradedAt: "2026-01-05T18:12:00Z",
  },
  {
    id: "txn-003",
    workerId: "worker-001",
    to: "NOMZO",
    from: "田中 一郎",
    amount: -1500,
    description: "飲食代",
    tradedAt: "2026-01-05T18:12:00Z",
  },
  {
    id: "txn-004",
    workerId: "worker-001",
    to: "田中 一郎",
    from: "道の駅あさひ",
    amount: 1200,
    description: "報酬: 農作業補助",
    tradedAt: "2026-01-04T10:30:00Z",
  },
  {
    id: "txn-005",
    workerId: "worker-001",
    to: "鮮魚センター",
    from: "田中 一郎",
    amount: -550,
    description: "報酬: 荷物運搬",
    tradedAt: "2026-01-03T14:45:00Z",
  },
];

interface WalletState {
  transactions: TransactionHistory[];
  addTransaction: (transaction: TransactionHistory) => void;
  getTransactionsByWorkerId: (workerId: string) => TransactionHistory[];
  clearTransactions: () => void;
  initializeMockData: () => void;
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
      initializeMockData: () => {
        const currentTransactions = get().transactions;
        if (currentTransactions.length === 0) {
          set({ transactions: mockTransactionHistories });
        }
      },
    }),
    {
      name: "wallet-storage",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);
