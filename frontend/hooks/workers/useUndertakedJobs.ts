"use client";

import { useState, useEffect, useCallback } from "react";
import { UndertakedJobApi } from "@/constants/api-mocks";
import { useUndertakedJobStore, useWorkerStore } from "@/stores/workers";
import type { UndertakedJob } from "@/types";

interface UseUndertakedJobsResult {
  undertakedJobs: UndertakedJob[];
  pending: boolean;
  addUndertakedJob: (params: Omit<UndertakedJob, "id">) => Promise<UndertakedJob>;
  updateUndertakedJob: (id: number, updates: Partial<UndertakedJob>) => Promise<void>;
  updateStatus: (id: number, status: UndertakedJob["status"]) => Promise<void>;
  getByJobId: (jobId: number) => UndertakedJob | undefined;
  getById: (id: number) => UndertakedJob | undefined;
  refetch: () => Promise<void>;
}

/**
 * 着手ジョブ一覧を取得し、Storeに格納するhook
 * データ取得: hooks → API → LocalStorage
 * 
 * 注意: Worker側とRequester側は別のストアを使用するため、
 * ページアクセス時に毎回LocalStorageから最新データを取得する
 */
const useUndertakedJobs = (): UseUndertakedJobsResult => {
  const [pending, setPending] = useState(false);
  const { worker } = useWorkerStore();
  const {
    undertakedJobs,
    setUndertakedJobs,
    addUndertakedJob: addToStore,
    updateUndertakedJob: updateInStore,
    updateStatus: updateStatusInStore,
    getByJobId,
    getById,
  } = useUndertakedJobStore();

  const fetchUndertakedJobs = useCallback(async (): Promise<void> => {
      setPending(true);
      try {
      // 常にLocalStorageから最新データを取得
        if (worker) {
          // ワーカーがいる場合はそのワーカーの着手ジョブのみ
          const data = await UndertakedJobApi.getByWorkerId(worker.id);
          setUndertakedJobs(data);
        } else {
        // 全件
          const data = await UndertakedJobApi.index();
          setUndertakedJobs(data);
        }
      } finally {
        setPending(false);
      }
  }, [worker, setUndertakedJobs]);

  useEffect(() => {
    // マウント時に常にLocalStorageから最新データを取得
    // （発注者側で更新された場合に反映するため）
    fetchUndertakedJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addUndertakedJob = useCallback(
    async (params: Omit<UndertakedJob, "id">): Promise<UndertakedJob> => {
      // APIで作成（IDは自動生成）
      const newJob = await UndertakedJobApi.create(params);
      addToStore(newJob);
      return newJob;
    },
    [addToStore]
  );

  const updateUndertakedJob = useCallback(
    async (id: number, updates: Partial<UndertakedJob>): Promise<void> => {
      // APIで更新
      await UndertakedJobApi.update(id, updates);
      updateInStore(id, updates);
    },
    [updateInStore]
  );

  const updateStatus = useCallback(
    async (id: number, status: UndertakedJob["status"]): Promise<void> => {
      // APIで更新
      await UndertakedJobApi.update(id, { status });
      updateStatusInStore(id, status);
    },
    [updateStatusInStore]
  );

  return {
    undertakedJobs,
    pending,
    addUndertakedJob,
    updateUndertakedJob,
    updateStatus,
    getByJobId,
    getById,
    refetch: fetchUndertakedJobs,
  };
};

export { useUndertakedJobs };
