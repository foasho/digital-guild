import { create } from "zustand";
import type { Worker } from "@/types";

interface WorkerState {
  worker: Worker | null;
  jpycBalance: number;
  setWorker: (worker: Worker) => void;
  setBalance: (balance: number) => void;
  updateBalance: (amount: number) => void;
  clearWorker: () => void;
}

export const useWorkerStore = create<WorkerState>()((set) => ({
  worker: null,
  jpycBalance: 0,
  setWorker: (worker) => set({ worker }),
  setBalance: (balance) => set({ jpycBalance: balance }),
  updateBalance: (amount) =>
    set((state) => ({ jpycBalance: state.jpycBalance + amount })),
  clearWorker: () => set({ worker: null, jpycBalance: 0 }),
}));
