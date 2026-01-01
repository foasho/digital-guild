import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Rank, TrustPassport, WorkerSkill } from "@/types";

interface TrustPassportState {
  passport: TrustPassport | null;
  skills: WorkerSkill[];
  setPassport: (passport: TrustPassport) => void;
  updateTrustScore: (score: number) => void;
  addSkill: (skill: WorkerSkill) => void;
  removeSkill: (skillId: string) => void;
  getRank: () => Rank;
  clearPassport: () => void;
}

const calculateRank = (score: number): Rank => {
  if (score >= 90) return "Platinum";
  if (score >= 80) return "Gold";
  if (score >= 70) return "Silver";
  return "Bronze";
};

export const useTrustPassportStore = create<TrustPassportState>()(
  persist(
    (set, get) => ({
      passport: null,
      skills: [],
      setPassport: (passport) => set({ passport }),
      updateTrustScore: (score) =>
        set((state) => ({
          passport: state.passport
            ? {
                ...state.passport,
                trustScore: Math.min(100, Math.max(0, score)),
              }
            : null,
        })),
      addSkill: (skill) =>
        set((state) => ({
          skills: [...state.skills, skill],
        })),
      removeSkill: (skillId) =>
        set((state) => ({
          skills: state.skills.filter((s) => s.id !== skillId),
        })),
      getRank: () => {
        const passport = get().passport;
        return passport ? calculateRank(passport.trustScore) : "Bronze";
      },
      clearPassport: () => set({ passport: null, skills: [] }),
    }),
    {
      name: "trust-passport-storage",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);
