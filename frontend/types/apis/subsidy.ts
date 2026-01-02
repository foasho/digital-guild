import type { Subsidy } from "@/types";

type CreateSubsidyParams = Omit<Subsidy, "id">;

type UpdateSubsidyParams = Partial<Omit<Subsidy, "id">>;

type GetSubsidyByIdParams = {
  id: number;
};

type GetSubsidiesByRequesterIdParams = {
  requesterId: number;
};

type DeleteSubsidyByIdParams = {
  id: number;
};

export type {
  CreateSubsidyParams,
  UpdateSubsidyParams,
  GetSubsidyByIdParams,
  GetSubsidiesByRequesterIdParams,
  DeleteSubsidyByIdParams,
};
