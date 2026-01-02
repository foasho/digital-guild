import type { Worker } from "@/types";

type CreateWorkerParams = Omit<Worker, "id" | "createdAt" | "updatedAt">;

type UpdateWorkerParams = Partial<Omit<Worker, "id" | "createdAt" | "updatedAt">>;

type GetWorkerByIdParams = {
  id: number;
};

type DeleteWorkerByIdParams = {
  id: number;
};

export type {
  CreateWorkerParams,
  UpdateWorkerParams,
  GetWorkerByIdParams,
  DeleteWorkerByIdParams,
};

