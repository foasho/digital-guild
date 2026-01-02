"use client";

import { useState, useEffect, useCallback } from "react";
import { UndertakedJobApi } from "@/constants/api-mocks";
import { useUndertakedJobStore, useJobStore } from "@/stores/requesters";
import type { UndertakedJob } from "@/types";

interface UseUndertakedJobsResult {
  undertakedJobs: UndertakedJob[];
  pending: boolean;
  updateUndertakedJob: (id: number, updates: Partial<UndertakedJob>) => Promise<void>;
  getById: (id: number) => UndertakedJob | undefined;
  getByJobId: (jobId: number) => UndertakedJob | undefined;
  getByRequesterId: (requesterId: number) => UndertakedJob[];
}

/**
 * 着手ジョブ一覧を取得し、Storeに格納するhook（発注者視点）
 * データ取得: hooks → API → LocalStorage
 */
const useUndertakedJobs = (): UseUndertakedJobsResult => {
  const [pending, setPending] = useState(false);
  const {
    undertakedJobs,
    setUndertakedJobs,
    updateUndertakedJob: updateInStore,
    getById,
    getByJobId,
    getByRequesterId: getByRequesterIdFromStore,
  } = useUndertakedJobStore();
  const { jobs } = useJobStore();

  useEffect(() => {
    const fetchUndertakedJobs = async (): Promise<void> => {
      if (undertakedJobs.length > 0) return;
      setPending(true);
      try {
        const data = await UndertakedJobApi.index();
        setUndertakedJobs(data);
      } finally {
        setPending(false);
      }
    };
    fetchUndertakedJobs();
  }, [undertakedJobs.length, setUndertakedJobs]);

  const updateUndertakedJob = useCallback(
    async (id: number, updates: Partial<UndertakedJob>): Promise<void> => {
      await UndertakedJobApi.update(id, updates);
      updateInStore(id, updates);
    },
    [updateInStore]
  );

  const getByRequesterId = useCallback(
    (requesterId: number): UndertakedJob[] => {
      return getByRequesterIdFromStore(requesterId, jobs);
    },
    [getByRequesterIdFromStore, jobs]
  );

  return {
    undertakedJobs,
    pending,
    updateUndertakedJob,
    getById,
    getByJobId,
    getByRequesterId,
  };
};

export { useUndertakedJobs };

