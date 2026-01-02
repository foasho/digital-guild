"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { transactionHistories as mockTransactionHistories } from "@/constants/mocks";
import { useWalletStore, useWorkerStore } from "@/stores";
import type { TransactionHistory } from "@/types";

const INITIAL_BALANCE = 20000;

interface UseTransactionHistoriesResult {
  transactions: TransactionHistory[];
  balance: number;
  pending: boolean;
  addTransaction: (params: Omit<TransactionHistory, "id">) => TransactionHistory;
}

/**
 * 取引履歴を取得し、Storeに格納するhook
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
        // TODO: 本番移行では、APIから取得する予定
        const workerTx = mockTransactionHistories.filter(
          (tx) => tx.workerId === worker.id
        );
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
    (params: Omit<TransactionHistory, "id">): TransactionHistory => {
      const maxId =
        transactions.length > 0
          ? Math.max(...transactions.map((t) => t.id))
          : 0;
      const newTx: TransactionHistory = {
        ...params,
        id: maxId + 1,
      };
      addToStore(newTx);
      return newTx;
    },
    [transactions, addToStore]
  );

  return {
    transactions,
    balance,
    pending,
    addTransaction,
  };
};

export { useTransactionHistories };
