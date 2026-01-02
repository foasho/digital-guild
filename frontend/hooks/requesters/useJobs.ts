"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { JobApi } from "@/constants/api-mocks";
import { useJobStore } from "@/stores/requesters";
import type { Job } from "@/types";

interface UseJobsResult {
  jobs: Job[];
  pending: boolean;
  addJob: (params: Omit<Job, "id" | "createdAt" | "updatedAt">) => Promise<Job>;
  updateJob: (id: number, updates: Partial<Job>) => Promise<void>;
  deleteJob: (id: number) => Promise<void>;
  getJobById: (id: number) => Job | undefined;
  refetch: () => Promise<void>;
}

/**
 * ジョブ一覧を取得し、Storeに格納するhook（発注者視点）
 * データ取得: hooks → API → LocalStorage
 */
const useJobs = (): UseJobsResult => {
  const [pending, setPending] = useState(false);
  const hasFetched = useRef(false);
  const {
    jobs,
    setJobs,
    addJob: addJobToStore,
    updateJob: updateJobInStore,
    deleteJob: deleteJobFromStore,
    getJobById,
  } = useJobStore();

  const fetchJobs = useCallback(async (): Promise<void> => {
    setPending(true);
    try {
      // 常にLocalStorageから最新データを取得
      const data = await JobApi.index();
      setJobs(data);
    } finally {
      setPending(false);
    }
  }, [setJobs]);

  useEffect(() => {
    // 初回マウント時のみフェッチ
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchJobs();
    }
  }, [fetchJobs]);

  const addJob = useCallback(
    async (params: Omit<Job, "id" | "createdAt" | "updatedAt">): Promise<Job> => {
      // APIで作成（IDは自動生成）
      const newJob = await JobApi.create(params);
      addJobToStore(newJob);
      return newJob;
    },
    [addJobToStore]
  );

  const updateJob = useCallback(
    async (id: number, updates: Partial<Job>): Promise<void> => {
      // APIで更新
      await JobApi.update(id, updates);
      updateJobInStore(id, { ...updates, updatedAt: new Date().toISOString() });
    },
    [updateJobInStore]
  );

  const deleteJob = useCallback(
    async (id: number): Promise<void> => {
      // APIで削除
      await JobApi.delete({ id });
      deleteJobFromStore(id);
    },
    [deleteJobFromStore]
  );

  return { jobs, pending, addJob, updateJob, deleteJob, getJobById, refetch: fetchJobs };
};

interface UseJobByIdResult {
  job: Job | undefined;
  pending: boolean;
}

/**
 * 特定のジョブを取得するhook
 */
const useJobById = (id: number): UseJobByIdResult => {
  const [pending, setPending] = useState(false);
  const { getJobById, jobs, setJobs } = useJobStore();
  const job = getJobById(id);

  useEffect(() => {
    const fetchJob = async (): Promise<void> => {
      // Storeにデータがない場合はAPIからロード
      if (jobs.length === 0) {
        setPending(true);
        try {
          const data = await JobApi.index();
          setJobs(data);
        } finally {
          setPending(false);
        }
      }
    };
    fetchJob();
  }, [jobs.length, setJobs]);

  return { job, pending };
};

/**
 * 発注者のジョブ一覧を取得するhook
 */
const useJobsByRequesterId = (requesterId: number): Job[] => {
  const { jobs } = useJobStore();
  return jobs.filter((job) => job.requesterId === requesterId);
};

export { useJobs, useJobById, useJobsByRequesterId };

