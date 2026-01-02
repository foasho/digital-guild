"use client";

import { useState, useEffect } from "react";
import { subsidies as mockSubsidies } from "@/constants/mocks";
import type { Subsidy } from "@/types";

/**
 * 補助金一覧を取得するhook
 */
const useSubsidies = (): Subsidy[] => {
  const [subsidies, setSubsidies] = useState<Subsidy[]>([]);

  useEffect(() => {
    // TODO: 本番移行では、APIから取得する予定
    setSubsidies(mockSubsidies);
  }, []);

  return subsidies;
};

/**
 * 発注者の補助金を取得するhook
 */
const useSubsidiesByRequesterId = (requesterId: number): Subsidy[] => {
  const [subsidies, setSubsidies] = useState<Subsidy[]>([]);

  useEffect(() => {
    // TODO: 本番移行では、APIから取得する予定
    const filtered = mockSubsidies.filter((s) => s.requesterId === requesterId);
    setSubsidies(filtered);
  }, [requesterId]);

  return subsidies;
};

export { useSubsidies, useSubsidiesByRequesterId };
