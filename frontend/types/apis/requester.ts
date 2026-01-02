import type { Requester } from "@/types";

type CreateRequesterParams = Omit<Requester, "id" | "createdAt">;

type UpdateRequesterParams = Partial<Omit<Requester, "id" | "createdAt">>;

type GetRequesterByIdParams = {
  id: number;
};

type DeleteRequesterByIdParams = {
  id: number;
};

export type {
  CreateRequesterParams,
  UpdateRequesterParams,
  GetRequesterByIdParams,
  DeleteRequesterByIdParams,
};

