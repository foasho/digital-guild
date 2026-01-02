"use client";

import { useState, useEffect } from "react";
import { JobAiRecommendApi } from "@/constants/api-mocks";
import { useWorkerStore } from "@/stores";
import type { JobAiRecommend } from "@/types";

/**
 * ワーカーへのAIレコメンドを取得するhook
 * データ取得: hooks → API → LocalStorage
 */
const useJobAiRecommends = (): JobAiRecommend[] => {
  const [recommends, setRecommends] = useState<JobAiRecommend[]>([]);
  const { worker } = useWorkerStore();

  useEffect(() => {
    const fetchRecommends = async (): Promise<void> => {
      if (!worker) return;
      const data = await JobAiRecommendApi.getByWorkerId({ workerId: worker.id });
      setRecommends(data);
    };
    fetchRecommends();
  }, [worker]);

  return recommends;
};

/**
 * ワーカーへの推奨レコメンド（confidence >= 0.7）を取得するhook
 * データ取得: hooks → API → LocalStorage
 */
const useRecommendedJobs = (): JobAiRecommend[] => {
  const [recommends, setRecommends] = useState<JobAiRecommend[]>([]);
  const { worker } = useWorkerStore();

  useEffect(() => {
    const fetchRecommends = async (): Promise<void> => {
      if (!worker) return;
      const data = await JobAiRecommendApi.getRecommendedByWorkerId(worker.id);
      setRecommends(data);
    };
    fetchRecommends();
  }, [worker]);

  return recommends;
};

export { useJobAiRecommends, useRecommendedJobs };
