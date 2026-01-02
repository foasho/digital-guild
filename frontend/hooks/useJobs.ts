"use client";

import { useState, useEffect, useCallback } from "react";
import { jobs as mockJobs } from "@/constants/mocks";
import { useJobStore } from "@/stores";
import type { Job, ChecklistItem } from "@/types";

interface UseJobsResult {
  jobs: Job[];
  pending: boolean;
  addJob: (params: Omit<Job, "id" | "createdAt" | "updatedAt">) => Job;
  updateJob: (id: number, updates: Partial<Job>) => void;
  deleteJob: (id: number) => void;
  getJobById: (id: number) => Job | undefined;
}

/**
 * ジョブ一覧を取得し、Storeに格納するhook
 */
const useJobs = (): UseJobsResult => {
  const [pending, setPending] = useState(false);
  const {
    jobs,
    setJobs,
    addJob: addJobToStore,
    updateJob: updateJobInStore,
    deleteJob: deleteJobFromStore,
    getJobById,
  } = useJobStore();

  useEffect(() => {
    const fetchJobs = async (): Promise<void> => {
      if (jobs.length > 0) return; // 既にロード済み
      setPending(true);
      try {
        // TODO: 本番移行では、APIから取得する予定
        setJobs(mockJobs);
      } finally {
        setPending(false);
      }
    };
    fetchJobs();
  }, [jobs.length, setJobs]);

  const addJob = useCallback(
    (params: Omit<Job, "id" | "createdAt" | "updatedAt">): Job => {
      const maxId = jobs.length > 0 ? Math.max(...jobs.map((j) => j.id)) : 0;
      const now = new Date().toISOString();
      const newJob: Job = {
        ...params,
        id: maxId + 1,
        createdAt: now,
        updatedAt: now,
      };
      addJobToStore(newJob);
      return newJob;
    },
    [jobs, addJobToStore]
  );

  const updateJob = useCallback(
    (id: number, updates: Partial<Job>): void => {
      updateJobInStore(id, { ...updates, updatedAt: new Date().toISOString() });
    },
    [updateJobInStore]
  );

  const deleteJob = useCallback(
    (id: number): void => {
      deleteJobFromStore(id);
    },
    [deleteJobFromStore]
  );

  return { jobs, pending, addJob, updateJob, deleteJob, getJobById };
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
    // Storeにデータがない場合はモックからロード
    if (jobs.length === 0) {
      setPending(true);
      setJobs(mockJobs);
      setPending(false);
    }
  }, [jobs.length, setJobs]);

  return { job: job || mockJobs.find((j) => j.id === id), pending };
};

/**
 * 発注者のジョブ一覧を取得するhook
 */
const useJobsByRequesterId = (requesterId: number): Job[] => {
  const { jobs } = useJobStore();
  return jobs.filter((job) => job.requesterId === requesterId);
};

export { useJobs, useJobById, useJobsByRequesterId };
