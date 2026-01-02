import type { UndertakedJob } from "@/types";

type CreateUndertakedJobParams = Omit<UndertakedJob, "id">;

type UpdateUndertakedJobParams = Partial<Omit<UndertakedJob, "id">>;

type GetUndertakedJobByIdParams = {
  id: number;
};

type DeleteUndertakedJobByIdParams = {
  id: number;
};

export type {
  CreateUndertakedJobParams,
  UpdateUndertakedJobParams,
  GetUndertakedJobByIdParams,
  DeleteUndertakedJobByIdParams,
};
