import type { RequirementSkill } from "@/types";

// ジョブの募集条件スキル（このスキルを持っていると優遇）
export const reqSkill1: RequirementSkill = {
  id: 1,
  jobId: 1, // izakayaJob
  skillId: 5, // 撮影
  skillAmount: 1,
};

export const reqSkill2: RequirementSkill = {
  id: 2,
  jobId: 2, // noukaJob
  skillId: 3, // 農作業
  skillAmount: 2,
};

export const reqSkill3: RequirementSkill = {
  id: 3,
  jobId: 2, // noukaJob
  skillId: 10, // 屋外作業
  skillAmount: 1,
};

export const reqSkill4: RequirementSkill = {
  id: 4,
  jobId: 3, // ryokanJob
  skillId: 4, // 清掃
  skillAmount: 1,
};

export const requirementSkills: RequirementSkill[] = [
  reqSkill1,
  reqSkill2,
  reqSkill3,
  reqSkill4,
];
