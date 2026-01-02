import type { JobSkill } from "@/types";

type CreateJobSkillParams = Omit<JobSkill, "id">;

type GetJobSkillsByJobIdParams = {
  jobId: number;
};

type DeleteJobSkillByIdParams = {
  id: number;
};

export type {
  CreateJobSkillParams,
  GetJobSkillsByJobIdParams,
  DeleteJobSkillByIdParams,
};
