import { create } from "zustand";
import type { UndertakedJob } from "@/types";

interface UndertakedJobState {
  undertakedJobs: UndertakedJob[];
  setUndertakedJobs: (jobs: UndertakedJob[]) => void;
  addUndertakedJob: (job: UndertakedJob) => void;
  updateStatus: (id: number, status: UndertakedJob["status"]) => void;
  updateUndertakedJob: (id: number, updates: Partial<UndertakedJob>) => void;
  getByJobId: (jobId: number) => UndertakedJob | undefined;
  getById: (id: number) => UndertakedJob | undefined;
  getByRequesterId: (requesterId: number, jobs: { id: number; requesterId: number }[]) => UndertakedJob[];
  clearUndertakedJobs: () => void;
}

export const useUndertakedJobStore = create<UndertakedJobState>()(
  (set, get) => ({
    undertakedJobs: [],
    setUndertakedJobs: (undertakedJobs) => set({ undertakedJobs }),
    addUndertakedJob: (job) =>
      set((state) => ({
        undertakedJobs: [...state.undertakedJobs, job],
      })),
    updateStatus: (id, status) =>
      set((state) => ({
        undertakedJobs: state.undertakedJobs.map((job) =>
          job.id === id ? { ...job, status } : job
        ),
      })),
    updateUndertakedJob: (id, updates) =>
      set((state) => ({
        undertakedJobs: state.undertakedJobs.map((job) =>
          job.id === id ? { ...job, ...updates } : job
        ),
      })),
    getByJobId: (jobId) =>
      get().undertakedJobs.find((job) => job.jobId === jobId),
    getById: (id) => get().undertakedJobs.find((job) => job.id === id),
    getByRequesterId: (requesterId, jobs) => {
      const requesterJobIds = jobs
        .filter((job) => job.requesterId === requesterId)
        .map((job) => job.id);
      return get().undertakedJobs.filter((uj) =>
        requesterJobIds.includes(uj.jobId)
      );
    },
    clearUndertakedJobs: () => set({ undertakedJobs: [] }),
  })
);

