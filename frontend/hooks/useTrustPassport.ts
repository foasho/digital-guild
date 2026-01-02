"use client";

import { useState, useEffect, useCallback } from "react";
import { TrustPassportApi, WorkerSkillApi } from "@/constants/api-mocks";
import { useTrustPassportStore, useWorkerStore } from "@/stores";
import type { TrustPassport, WorkerSkill, Rank } from "@/types";

const calculateRank = (score: number): Rank => {
  if (score >= 90) return "Platinum";
  if (score >= 80) return "Gold";
  if (score >= 70) return "Silver";
  return "Bronze";
};

interface UseTrustPassportResult {
  passport: TrustPassport | null;
  skills: WorkerSkill[];
  pending: boolean;
  updateTrustScore: (score: number) => Promise<void>;
  addSkill: (name: string, jobId: number) => Promise<WorkerSkill>;
  getRank: () => Rank;
}

/**
 * ギルド証（TrustPassport）を取得し、Storeに格納するhook
 * データ取得: hooks → API → LocalStorage
 */
const useTrustPassport = (): UseTrustPassportResult => {
  const [pending, setPending] = useState(false);
  const { worker } = useWorkerStore();
  const {
    passport,
    skills,
    setPassport,
    setSkills,
    updateTrustScore: updateScoreInStore,
    addSkill: addSkillToStore,
    getRank: getRankFromStore,
  } = useTrustPassportStore();

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      if (!worker || passport) return;
      setPending(true);
      try {
        // APIからデータ取得
        const [workerPassport, workerSkillsList] = await Promise.all([
          TrustPassportApi.getByWorkerId({ workerId: worker.id }),
          WorkerSkillApi.getByWorkerId({ workerId: worker.id }),
        ]);
        if (workerPassport) {
          setPassport(workerPassport);
        }
        setSkills(workerSkillsList);
      } finally {
        setPending(false);
      }
    };
    fetchData();
  }, [worker, passport, setPassport, setSkills]);

  const updateTrustScore = useCallback(
    async (score: number): Promise<void> => {
      if (!passport) return;
      const clampedScore = Math.min(100, Math.max(0, score));
      // APIで更新
      await TrustPassportApi.update(passport.id, { trustScore: clampedScore });
      updateScoreInStore(clampedScore);
    },
    [passport, updateScoreInStore]
  );

  const addSkill = useCallback(
    async (name: string, jobId: number): Promise<WorkerSkill> => {
      if (!worker) throw new Error("Worker not found");
      // APIで作成（IDは自動生成）
      const newSkill = await WorkerSkillApi.create({
        workerId: worker.id,
        name,
        jobId,
        createdAt: new Date().toISOString(),
      });
      addSkillToStore(newSkill);
      return newSkill;
    },
    [worker, addSkillToStore]
  );

  const getRank = useCallback((): Rank => {
    return getRankFromStore();
  }, [getRankFromStore]);

  return {
    passport,
    skills,
    pending,
    updateTrustScore,
    addSkill,
    getRank,
  };
};

export { useTrustPassport };
