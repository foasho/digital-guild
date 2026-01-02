"use client";

import { useState, useEffect } from "react";
import { JobApi } from "@/constants/api-mocks";
import type { Job } from "@/types";

/**
 * ジョブ一覧を取得するhook
 */
const useJobs = (): Job[] => {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const fetchJobs = async (): Promise<void> => {
      const jobList = await JobApi.index();
      setJobs(jobList);
    };
    fetchJobs();
  }, []);

  return jobs;
};

/**
 * 特定のジョブを取得するhook
 */
const useJobById = (id: number): Job | undefined => {
  const [job, setJob] = useState<Job | undefined>(undefined);

  useEffect(() => {
    const fetchJob = async (): Promise<void> => {
      try {
        const jobData = await JobApi.getById({ id });
        setJob(jobData);
      } catch {
        setJob(undefined);
      }
    };
    if (id) {
      fetchJob();
    }
  }, [id]);

  return job;
};

/**
 * 発注者のジョブ一覧を取得するhook
 */
const useJobsByRequesterId = (requesterId: number): Job[] => {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const fetchJobs = async (): Promise<void> => {
      const jobList = await JobApi.getByRequesterId(requesterId);
      setJobs(jobList);
    };
    if (requesterId) {
      fetchJobs();
    }
  }, [requesterId]);

  return jobs;
};

export { useJobs, useJobById, useJobsByRequesterId };

