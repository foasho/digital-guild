import type { Skill } from "@/types";

type CreateSkillParams = Omit<Skill, "id">;

type UpdateSkillParams = Partial<Omit<Skill, "id">>;

type GetSkillByIdParams = {
  id: number;
};

type DeleteSkillByIdParams = {
  id: number;
};

export type {
  CreateSkillParams,
  UpdateSkillParams,
  GetSkillByIdParams,
  DeleteSkillByIdParams,
};

