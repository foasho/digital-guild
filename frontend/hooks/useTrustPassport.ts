"use client";

import { useState, useEffect, useCallback } from "react";
import { TrustPassportApi, WorkerSkillApi } from "@/constants/api-mocks";
import type { TrustPassport, WorkerSkill, Rank } from "@/types";

const calculateRank = (score: number): Rank => {
  if (score >= 90) return "Platinum";
  if (score >= 80) return "Gold";
  if (score >= 70) return "Silver";
  return "Bronze";
};

/**
 * ギルド証（TrustPassport）を取得・操作するhook
 */
const useTrustPassport = (workerId: number) => {
  const [passport, setPassport] = useState<TrustPassport | null>(null);
  const [skills, setSkills] = useState<WorkerSkill[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async (): Promise<void> => {
    if (!workerId) return;
    setLoading(true);
    try {
      const [passportData, skillsData] = await Promise.all([
        TrustPassportApi.getByWorkerId({ workerId }),
        WorkerSkillApi.getByWorkerId({ workerId }),
      ]);
      setPassport(passportData || null);
      setSkills(skillsData);
    } finally {
      setLoading(false);
    }
  }, [workerId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateTrustScore = useCallback(
    async (score: number): Promise<void> => {
      if (!passport) return;
      const clampedScore = Math.min(100, Math.max(0, score));
      const updated = await TrustPassportApi.update(passport.id, {
        trustScore: clampedScore,
      });
      setPassport(updated);
    },
    [passport]
  );

  const addSkill = useCallback(
    async (name: string, jobId: number): Promise<WorkerSkill> => {
      const newSkill = await WorkerSkillApi.create({
        workerId,
        name,
        jobId,
        createdAt: new Date().toISOString(),
      });
      setSkills((prev) => [...prev, newSkill]);
      return newSkill;
    },
    [workerId]
  );

  const getRank = useCallback((): Rank => {
    return passport ? calculateRank(passport.trustScore) : "Bronze";
  }, [passport]);

  return {
    passport,
    skills,
    loading,
    updateTrustScore,
    addSkill,
    getRank,
    refetch: fetchData,
  };
};

export { useTrustPassport };

