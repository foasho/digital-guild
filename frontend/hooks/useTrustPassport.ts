"use client";

import { useState, useEffect, useCallback } from "react";
import {
  trustPassports as mockTrustPassports,
  workerSkills as mockWorkerSkills,
} from "@/constants/mocks";
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
  updateTrustScore: (score: number) => void;
  addSkill: (name: string, jobId: number) => WorkerSkill;
  getRank: () => Rank;
}

/**
 * ギルド証（TrustPassport）を取得し、Storeに格納するhook
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
        // TODO: 本番移行では、APIから取得する予定
        const workerPassport = mockTrustPassports.find(
          (p) => p.workerId === worker.id
        );
        const workerSkillsList = mockWorkerSkills.filter(
          (s) => s.workerId === worker.id
        );
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
    (score: number): void => {
      const clampedScore = Math.min(100, Math.max(0, score));
      updateScoreInStore(clampedScore);
    },
    [updateScoreInStore]
  );

  const addSkill = useCallback(
    (name: string, jobId: number): WorkerSkill => {
      if (!worker) throw new Error("Worker not found");
      const maxId = skills.length > 0 ? Math.max(...skills.map((s) => s.id)) : 0;
      const newSkill: WorkerSkill = {
        id: maxId + 1,
        workerId: worker.id,
        name,
        jobId,
        createdAt: new Date().toISOString(),
      };
      addSkillToStore(newSkill);
      return newSkill;
    },
    [worker, skills, addSkillToStore]
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
