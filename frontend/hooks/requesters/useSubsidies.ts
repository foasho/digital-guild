"use client";

import { useState, useEffect } from "react";
import { SubsidyApi } from "@/constants/api-mocks";
import { useSubsidyStore } from "@/stores/requesters";
import type { Subsidy } from "@/types";

interface UseSubsidiesResult {
  subsidies: Subsidy[];
  pending: boolean;
  getByRequesterId: (requesterId: number) => Subsidy[];
  getTotalByRequesterId: (requesterId: number) => number;
}

/**
 * 補助金一覧を取得し、Storeに格納するhook
 * データ取得: hooks → API → LocalStorage
 */
const useSubsidies = (): UseSubsidiesResult => {
  const [pending, setPending] = useState(false);
  const {
    subsidies,
    setSubsidies,
    getByRequesterId,
    getTotalByRequesterId,
  } = useSubsidyStore();

  useEffect(() => {
    const fetchSubsidies = async (): Promise<void> => {
      if (subsidies.length > 0) return;
      setPending(true);
      try {
        const data = await SubsidyApi.index();
        setSubsidies(data);
      } finally {
        setPending(false);
      }
    };
    fetchSubsidies();
  }, [subsidies.length, setSubsidies]);

  return {
    subsidies,
    pending,
    getByRequesterId,
    getTotalByRequesterId,
  };
};

/**
 * 発注者IDで補助金を取得するhook
 * 自動的にデータをロードし、フィルタリングして返す
 */
const useSubsidiesByRequesterId = (requesterId: number): Subsidy[] => {
  const { subsidies, setSubsidies } = useSubsidyStore();
  const [filteredSubsidies, setFilteredSubsidies] = useState<Subsidy[]>([]);

  useEffect(() => {
    const fetchSubsidies = async (): Promise<void> => {
      if (subsidies.length > 0) {
        // 既にロード済みの場合はフィルタリングのみ
        setFilteredSubsidies(subsidies.filter((s) => s.requesterId === requesterId));
        return;
      }
      try {
        const data = await SubsidyApi.index();
        setSubsidies(data);
        setFilteredSubsidies(data.filter((s) => s.requesterId === requesterId));
      } catch (error) {
        console.error("Failed to fetch subsidies:", error);
      }
    };
    fetchSubsidies();
  }, [subsidies, setSubsidies, requesterId]);

  return filteredSubsidies;
};

export { useSubsidies, useSubsidiesByRequesterId };

