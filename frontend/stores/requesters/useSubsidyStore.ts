import { create } from "zustand";
import type { Subsidy } from "@/types";

interface SubsidyState {
  subsidies: Subsidy[];
  setSubsidies: (subsidies: Subsidy[]) => void;
  getByRequesterId: (requesterId: number) => Subsidy[];
  getTotalByRequesterId: (requesterId: number) => number;
  clearSubsidies: () => void;
}

export const useSubsidyStore = create<SubsidyState>()((set, get) => ({
  subsidies: [],
  setSubsidies: (subsidies) => set({ subsidies }),
  getByRequesterId: (requesterId) =>
    get().subsidies.filter((s) => s.requesterId === requesterId),
  getTotalByRequesterId: (requesterId) =>
    get()
      .subsidies.filter((s) => s.requesterId === requesterId)
      .reduce((sum, s) => sum + s.amount, 0),
  clearSubsidies: () => set({ subsidies: [] }),
}));

