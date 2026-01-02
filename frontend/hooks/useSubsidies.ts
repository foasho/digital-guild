"use client";

import { useState, useEffect } from "react";
import { SubsidyApi } from "@/constants/api-mocks";
import type { Subsidy } from "@/types";

/**
 * 補助金一覧を取得するhook
 * データ取得: hooks → API → LocalStorage
 */
const useSubsidies = (): Subsidy[] => {
  const [subsidies, setSubsidies] = useState<Subsidy[]>([]);

  useEffect(() => {
    const fetchSubsidies = async (): Promise<void> => {
      const data = await SubsidyApi.index();
      setSubsidies(data);
    };
    fetchSubsidies();
  }, []);

  return subsidies;
};

/**
 * 発注者の補助金を取得するhook
 * データ取得: hooks → API → LocalStorage
 */
const useSubsidiesByRequesterId = (requesterId: number): Subsidy[] => {
  const [subsidies, setSubsidies] = useState<Subsidy[]>([]);

  useEffect(() => {
    const fetchSubsidies = async (): Promise<void> => {
      const data = await SubsidyApi.getByRequesterId({ requesterId });
      setSubsidies(data);
    };
    fetchSubsidies();
  }, [requesterId]);

  return subsidies;
};

export { useSubsidies, useSubsidiesByRequesterId };
