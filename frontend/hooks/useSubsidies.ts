"use client";

import { useState, useEffect } from "react";
import { SubsidyApi } from "@/constants/api-mocks";
import type { Subsidy } from "@/types";

/**
 * 補助金一覧を取得するhook
 */
const useSubsidies = (): Subsidy[] => {
  const [subsidies, setSubsidies] = useState<Subsidy[]>([]);

  useEffect(() => {
    const fetchSubsidies = async (): Promise<void> => {
      const list = await SubsidyApi.index();
      setSubsidies(list);
    };
    fetchSubsidies();
  }, []);

  return subsidies;
};

/**
 * 発注者の補助金を取得するhook
 */
const useSubsidiesByRequesterId = (requesterId: number): Subsidy[] => {
  const [subsidies, setSubsidies] = useState<Subsidy[]>([]);

  useEffect(() => {
    const fetchSubsidies = async (): Promise<void> => {
      const list = await SubsidyApi.getByRequesterId({ requesterId });
      setSubsidies(list);
    };
    if (requesterId) {
      fetchSubsidies();
    }
  }, [requesterId]);

  return subsidies;
};

export { useSubsidies, useSubsidiesByRequesterId };

