import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { UndertakedJob } from "@/types";

interface UndertakedJobState {
  undertakedJobs: UndertakedJob[];
  addUndertakedJob: (job: UndertakedJob) => void;
  updateStatus: (id: string, status: UndertakedJob["status"]) => void;
  updateUndertakedJob: (id: string, updates: Partial<UndertakedJob>) => void;
  getByJobId: (jobId: string) => UndertakedJob | undefined;
  getById: (id: string) => UndertakedJob | undefined;
  clearUndertakedJobs: () => void;
}

export const useUndertakedJobStore = create<UndertakedJobState>()(
  persist(
    (set, get) => ({
      undertakedJobs: [],
      addUndertakedJob: (job) =>
        set((state) => ({
          undertakedJobs: [...state.undertakedJobs, job],
        })),
      updateStatus: (id, status) =>
        set((state) => ({
          undertakedJobs: state.undertakedJobs.map((job) =>
            job.id === id ? { ...job, status } : job,
          ),
        })),
      updateUndertakedJob: (id, updates) =>
        set((state) => ({
          undertakedJobs: state.undertakedJobs.map((job) =>
            job.id === id ? { ...job, ...updates } : job,
          ),
        })),
      getByJobId: (jobId) =>
        get().undertakedJobs.find((job) => job.jobId === jobId),
      getById: (id) => get().undertakedJobs.find((job) => job.id === id),
      clearUndertakedJobs: () => set({ undertakedJobs: [] }),
    }),
    {
      name: "undertaked-job-storage",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);
