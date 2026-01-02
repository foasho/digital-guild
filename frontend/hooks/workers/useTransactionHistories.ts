"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { TransactionHistoryApi } from "@/constants/api-mocks";
import { useWalletStore, useWorkerStore } from "@/stores/workers";
import type { TransactionHistory } from "@/types";

const INITIAL_BALANCE = 20000;

interface UseTransactionHistoriesResult {
  transactions: TransactionHistory[];
  balance: number;
  pending: boolean;
  addTransaction: (params: Omit<TransactionHistory, "id">) => Promise<TransactionHistory>;
}

/**
 * 取引履歴を取得し、Storeに格納するhook
 * データ取得: hooks → API → LocalStorage
 */
const useTransactionHistories = (): UseTransactionHistoriesResult => {
  const [pending, setPending] = useState(false);
  const { worker } = useWorkerStore();
  const { transactions, setTransactions, addTransaction: addToStore } =
    useWalletStore();

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      if (!worker || transactions.length > 0) return;
      setPending(true);
      try {
        // APIからデータ取得
        const workerTx = await TransactionHistoryApi.getByWorkerId({
          workerId: worker.id,
        });
        setTransactions(workerTx);
      } finally {
        setPending(false);
      }
    };
    fetchData();
  }, [worker, transactions.length, setTransactions]);

  // 残高計算
  const balance = useMemo(() => {
    return transactions.reduce((sum, tx) => sum + tx.amount, INITIAL_BALANCE);
  }, [transactions]);

  const addTransaction = useCallback(
    async (params: Omit<TransactionHistory, "id">): Promise<TransactionHistory> => {
      // APIで作成（IDは自動生成）
      const newTx = await TransactionHistoryApi.create(params);
      addToStore(newTx);
      return newTx;
    },
    [addToStore]
  );

  return {
    transactions,
    balance,
    pending,
    addTransaction,
  };
};

export { useTransactionHistories };
