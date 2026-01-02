"use client";

import { useState, useEffect, useCallback } from "react";
import { undertakedJobs as mockUndertakedJobs } from "@/constants/mocks";
import { useUndertakedJobStore, useWorkerStore } from "@/stores";
import type { UndertakedJob } from "@/types";

interface UseUndertakedJobsResult {
  undertakedJobs: UndertakedJob[];
  pending: boolean;
  addUndertakedJob: (params: Omit<UndertakedJob, "id">) => UndertakedJob;
  updateUndertakedJob: (id: number, updates: Partial<UndertakedJob>) => void;
  updateStatus: (id: number, status: UndertakedJob["status"]) => void;
  getByJobId: (jobId: number) => UndertakedJob | undefined;
  getById: (id: number) => UndertakedJob | undefined;
}

/**
 * 着手ジョブ一覧を取得し、Storeに格納するhook
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

  useEffect(() => {
    const fetchUndertakedJobs = async (): Promise<void> => {
      if (undertakedJobs.length > 0) return; // 既にロード済み
      setPending(true);
      try {
        // TODO: 本番移行では、APIから取得する予定
        // ワーカーがいる場合はそのワーカーの着手ジョブのみ
        if (worker) {
          const workerJobs = mockUndertakedJobs.filter(
            (job) => job.workerId === worker.id
          );
          setUndertakedJobs(workerJobs);
        } else {
          // 全件（発注者向け）
          setUndertakedJobs(mockUndertakedJobs);
        }
      } finally {
        setPending(false);
      }
    };
    fetchUndertakedJobs();
  }, [worker, undertakedJobs.length, setUndertakedJobs]);

  const addUndertakedJob = useCallback(
    (params: Omit<UndertakedJob, "id">): UndertakedJob => {
      const maxId =
        undertakedJobs.length > 0
          ? Math.max(...undertakedJobs.map((j) => j.id))
          : 0;
      const newJob: UndertakedJob = {
        ...params,
        id: maxId + 1,
      };
      addToStore(newJob);
      return newJob;
    },
    [undertakedJobs, addToStore]
  );

  const updateUndertakedJob = useCallback(
    (id: number, updates: Partial<UndertakedJob>): void => {
      updateInStore(id, updates);
    },
    [updateInStore]
  );

  const updateStatus = useCallback(
    (id: number, status: UndertakedJob["status"]): void => {
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
  };
};

export { useUndertakedJobs };
