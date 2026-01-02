"use client";

import { useState, useEffect } from "react";
import { JobAiRecommendApi } from "@/constants/api-mocks";
import type { JobAiRecommend } from "@/types";

/**
 * ワーカーへのAIレコメンドを取得するhook
 */
const useJobAiRecommends = (workerId: number): JobAiRecommend[] => {
  const [recommends, setRecommends] = useState<JobAiRecommend[]>([]);

  useEffect(() => {
    const fetchRecommends = async (): Promise<void> => {
      const list = await JobAiRecommendApi.getByWorkerId({ workerId });
      setRecommends(list);
    };
    if (workerId) {
      fetchRecommends();
    }
  }, [workerId]);

  return recommends;
};

/**
 * ワーカーへの推奨レコメンド（confidence >= 0.7）を取得するhook
 */
const useRecommendedJobs = (workerId: number): JobAiRecommend[] => {
  const [recommends, setRecommends] = useState<JobAiRecommend[]>([]);

  useEffect(() => {
    const fetchRecommends = async (): Promise<void> => {
      const list = await JobAiRecommendApi.getRecommendedByWorkerId(workerId);
      setRecommends(list);
    };
    if (workerId) {
      fetchRecommends();
    }
  }, [workerId]);

  return recommends;
};

export { useJobAiRecommends, useRecommendedJobs };

