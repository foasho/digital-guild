import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Requester } from "@/types";

interface RequesterState {
  requester: Requester | null;
  setRequester: (requester: Requester) => void;
  clearRequester: () => void;
}

export const useRequesterStore = create<RequesterState>()(
  persist(
    (set) => ({
      requester: null,
      setRequester: (requester) => set({ requester }),
      clearRequester: () => set({ requester: null }),
    }),
    {
      name: "requester-storage",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);
