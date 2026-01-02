import { create } from "zustand";
import type { Requester } from "@/types";

interface RequesterState {
  requester: Requester | null;
  setRequester: (requester: Requester) => void;
  clearRequester: () => void;
}

export const useRequesterStore = create<RequesterState>()((set) => ({
  requester: null,
  setRequester: (requester) => set({ requester }),
  clearRequester: () => set({ requester: null }),
}));

