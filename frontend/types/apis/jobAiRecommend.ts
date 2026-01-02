import type { JobAiRecommend } from "@/types";

type CreateJobAiRecommendParams = Omit<JobAiRecommend, "id" | "createdAt" | "updatedAt">;

type UpdateJobAiRecommendParams = Partial<Omit<JobAiRecommend, "id" | "createdAt" | "updatedAt">>;

type GetJobAiRecommendsByJobIdParams = {
  jobId: number;
};

type GetJobAiRecommendsByWorkerIdParams = {
  workerId: number;
};

type DeleteJobAiRecommendByIdParams = {
  id: number;
};

export type {
  CreateJobAiRecommendParams,
  UpdateJobAiRecommendParams,
  GetJobAiRecommendsByJobIdParams,
  GetJobAiRecommendsByWorkerIdParams,
  DeleteJobAiRecommendByIdParams,
};
