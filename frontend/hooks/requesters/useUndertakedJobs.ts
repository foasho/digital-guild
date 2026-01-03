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
  refetch: () => Promise<void>;
}

/**
 * 着手ジョブ一覧を取得し、Storeに格納するhook（発注者視点）
 * データ取得: hooks → API → LocalStorage
 * 
 * 注意: Worker側とRequester側は別のストアを使用するため、
 * ページアクセス時に毎回LocalStorageから最新データを取得する
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

  const fetchUndertakedJobs = useCallback(async (): Promise<void> => {
    setPending(true);
    try {
      // 常にLocalStorageから最新データを取得
      const data = await UndertakedJobApi.index();
      setUndertakedJobs(data);
    } finally {
      setPending(false);
    }
  }, [setUndertakedJobs]);

  useEffect(() => {
    // マウント時に常にLocalStorageから最新データを取得
    // （労働者側で更新された場合に反映するため）
      fetchUndertakedJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    refetch: fetchUndertakedJobs,
  };
};

export { useUndertakedJobs };

