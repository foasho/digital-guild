import type { Subsidy } from "@/types";

export const defaultSubsidy: Subsidy = {
  id: 1,
  requesterId: 1,
  amount: 1200000,
  sendedAt: "2025-01-01T00:00:00Z",
};

export const subsidies: Subsidy[] = [defaultSubsidy];
