import type { TrustPassport } from "@/types";

type CreateTrustPassportParams = Omit<TrustPassport, "id">;

type UpdateTrustPassportParams = Partial<Omit<TrustPassport, "id">>;

type GetTrustPassportByIdParams = {
  id: number;
};

type GetTrustPassportByWorkerIdParams = {
  workerId: number;
};

type DeleteTrustPassportByIdParams = {
  id: number;
};

export type {
  CreateTrustPassportParams,
  UpdateTrustPassportParams,
  GetTrustPassportByIdParams,
  GetTrustPassportByWorkerIdParams,
  DeleteTrustPassportByIdParams,
};
