import type { RequirementSkill } from "@/types";

// ジョブの募集条件スキル（このスキルを持っていると優遇）
export const reqSkill1: RequirementSkill = {
  id: "req-1",
  jobId: "job-izakaya",
  skillId: "skill-5", // 撮影
  skillAmount: 1,
};

export const reqSkill2: RequirementSkill = {
  id: "req-2",
  jobId: "job-nouka",
  skillId: "skill-3", // 農作業
  skillAmount: 2,
};

export const reqSkill3: RequirementSkill = {
  id: "req-3",
  jobId: "job-nouka",
  skillId: "skill-10", // 屋外作業
  skillAmount: 1,
};

export const reqSkill4: RequirementSkill = {
  id: "req-4",
  jobId: "job-ryokan",
  skillId: "skill-4", // 清掃
  skillAmount: 1,
};

export const requirementSkills: RequirementSkill[] = [
  reqSkill1,
  reqSkill2,
  reqSkill3,
  reqSkill4,
];

