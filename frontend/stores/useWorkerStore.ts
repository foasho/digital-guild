import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Worker } from "@/types";

interface WorkerState {
  worker: Worker | null;
  jpycBalance: number;
  setWorker: (worker: Worker) => void;
  updateBalance: (amount: number) => void;
  clearWorker: () => void;
}

export const useWorkerStore = create<WorkerState>()(
  persist(
    (set) => ({
      worker: null,
      jpycBalance: 0,
      setWorker: (worker) => set({ worker }),
      updateBalance: (amount) =>
        set((state) => ({ jpycBalance: state.jpycBalance + amount })),
      clearWorker: () => set({ worker: null, jpycBalance: 0 }),
    }),
    {
      name: "worker-storage",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);
