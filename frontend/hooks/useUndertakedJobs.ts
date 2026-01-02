"use client";

import { useState, useEffect } from "react";
import { UndertakedJobApi } from "@/constants/api-mocks";
import type { UndertakedJob } from "@/types";

/**
 * 着手ジョブ一覧を取得するhook
 */
const useUndertakedJobs = (): UndertakedJob[] => {
  const [undertakedJobs, setUndertakedJobs] = useState<UndertakedJob[]>([]);

  useEffect(() => {
    const fetchUndertakedJobs = async (): Promise<void> => {
      const jobs = await UndertakedJobApi.index();
      setUndertakedJobs(jobs);
    };
    fetchUndertakedJobs();
  }, []);

  return undertakedJobs;
};

/**
 * 特定のワーカーの着手ジョブを取得するhook
 */
const useUndertakedJobsByWorkerId = (workerId: number): UndertakedJob[] => {
  const [undertakedJobs, setUndertakedJobs] = useState<UndertakedJob[]>([]);

  useEffect(() => {
    const fetchUndertakedJobs = async (): Promise<void> => {
      const jobs = await UndertakedJobApi.getByWorkerId(workerId);
      setUndertakedJobs(jobs);
    };
    if (workerId) {
      fetchUndertakedJobs();
    }
  }, [workerId]);

  return undertakedJobs;
};

export { useUndertakedJobs, useUndertakedJobsByWorkerId };
