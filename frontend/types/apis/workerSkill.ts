import type { WorkerSkill } from "@/types";

type CreateWorkerSkillParams = Omit<WorkerSkill, "id">;

type GetWorkerSkillsByWorkerIdParams = {
  workerId: number;
};

type DeleteWorkerSkillByIdParams = {
  id: number;
};

export type {
  CreateWorkerSkillParams,
  GetWorkerSkillsByWorkerIdParams,
  DeleteWorkerSkillByIdParams,
};

