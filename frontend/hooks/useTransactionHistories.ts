"use client";

import { useState, useEffect, useCallback } from "react";
import { TransactionHistoryApi } from "@/constants/api-mocks";
import type { TransactionHistory } from "@/types";

const INITIAL_BALANCE = 20000;

/**
 * 取引履歴を取得・操作するhook
 */
const useTransactionHistories = (workerId: number) => {
  const [transactions, setTransactions] = useState<TransactionHistory[]>([]);
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async (): Promise<void> => {
    if (!workerId) return;
    setLoading(true);
    try {
      const [txList, calculatedBalance] = await Promise.all([
        TransactionHistoryApi.getByWorkerId({ workerId }),
        TransactionHistoryApi.calculateBalance(workerId),
      ]);
      setTransactions(txList);
      setBalance(calculatedBalance);
    } finally {
      setLoading(false);
    }
  }, [workerId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addTransaction = useCallback(
    async (
      params: Omit<TransactionHistory, "id">
    ): Promise<TransactionHistory> => {
      const newTx = await TransactionHistoryApi.create(params);
      setTransactions((prev) => [newTx, ...prev]);
      setBalance((prev) => prev + params.amount);
      return newTx;
    },
    []
  );

  return {
    transactions,
    balance,
    loading,
    addTransaction,
    refetch: fetchData,
  };
};

export { useTransactionHistories };

