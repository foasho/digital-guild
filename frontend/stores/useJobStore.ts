import { create } from "zustand";
import type { Job } from "@/types";

interface JobState {
  jobs: Job[];
  setJobs: (jobs: Job[]) => void;
  addJob: (job: Job) => void;
  updateJob: (id: number, job: Partial<Job>) => void;
  deleteJob: (id: number) => void;
  getJobById: (id: number) => Job | undefined;
}

export const useJobStore = create<JobState>()((set, get) => ({
  jobs: [],
  setJobs: (jobs) => set({ jobs }),
  addJob: (job) =>
    set((state) => ({
      jobs: [...state.jobs, job],
    })),
  updateJob: (id, updatedJob) =>
    set((state) => ({
      jobs: state.jobs.map((job) =>
        job.id === id ? { ...job, ...updatedJob } : job
      ),
    })),
  deleteJob: (id) =>
    set((state) => ({
      jobs: state.jobs.filter((job) => job.id !== id),
    })),
  getJobById: (id) => get().jobs.find((job) => job.id === id),
}));
