import type { Job } from "@/types";

type CreateJobParams = Omit<Job, "id" | "createdAt" | "updatedAt">;

type UpdateJobParams = Partial<Omit<Job, "id" | "createdAt" | "updatedAt">>;

type GetJobByIdParams = {
  id: number;
};

type DeleteJobByIdParams = {
  id: number;
};

export type {
  CreateJobParams,
  UpdateJobParams,
  GetJobByIdParams,
  DeleteJobByIdParams,
};
