import type { RequirementSkill } from "@/types";

type CreateRequirementSkillParams = Omit<RequirementSkill, "id">;

type UpdateRequirementSkillParams = Partial<Omit<RequirementSkill, "id">>;

type GetRequirementSkillsByJobIdParams = {
  jobId: number;
};

type DeleteRequirementSkillByIdParams = {
  id: number;
};

export type {
  CreateRequirementSkillParams,
  UpdateRequirementSkillParams,
  GetRequirementSkillsByJobIdParams,
  DeleteRequirementSkillByIdParams,
};

