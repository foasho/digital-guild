"use client";

import { useState, useEffect } from "react";
import { jobAiRecommends as mockJobAiRecommends } from "@/constants/mocks";
import { useWorkerStore } from "@/stores";
import type { JobAiRecommend } from "@/types";

/**
 * ワーカーへのAIレコメンドを取得するhook
 */
const useJobAiRecommends = (): JobAiRecommend[] => {
  const [recommends, setRecommends] = useState<JobAiRecommend[]>([]);
  const { worker } = useWorkerStore();

  useEffect(() => {
    if (!worker) return;
    // TODO: 本番移行では、APIから取得する予定
    const filtered = mockJobAiRecommends.filter(
      (r) => r.workerId === worker.id
    );
    setRecommends(filtered);
  }, [worker]);

  return recommends;
};

/**
 * ワーカーへの推奨レコメンド（confidence >= 0.7）を取得するhook
 */
const useRecommendedJobs = (): JobAiRecommend[] => {
  const [recommends, setRecommends] = useState<JobAiRecommend[]>([]);
  const { worker } = useWorkerStore();

  useEffect(() => {
    if (!worker) return;
    // TODO: 本番移行では、APIから取得する予定
    const filtered = mockJobAiRecommends.filter(
      (r) => r.workerId === worker.id && r.confidence >= 0.7
    );
    setRecommends(filtered);
  }, [worker]);

  return recommends;
};

export { useJobAiRecommends, useRecommendedJobs };
