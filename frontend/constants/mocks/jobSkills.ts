import type { JobSkill } from "@/types";

// ジョブに紐づくスキル（ジョブ完了時に付与されるスキル）
export const jobSkill1: JobSkill = {
  id: 1,
  jobId: 1, // izakayaJob
  skillId: 5, // 撮影
};

export const jobSkill2: JobSkill = {
  id: 2,
  jobId: 1, // izakayaJob
  skillId: 8, // 軽作業
};

export const jobSkill3: JobSkill = {
  id: 3,
  jobId: 2, // noukaJob
  skillId: 3, // 農作業
};

export const jobSkill4: JobSkill = {
  id: 4,
  jobId: 2, // noukaJob
  skillId: 9, // 収穫
};

export const jobSkill5: JobSkill = {
  id: 5,
  jobId: 3, // ryokanJob
  skillId: 4, // 清掃
};

export const jobSkill6: JobSkill = {
  id: 6,
  jobId: 3, // ryokanJob
  skillId: 7, // 庭仕事
};

export const jobSkills: JobSkill[] = [
  jobSkill1,
  jobSkill2,
  jobSkill3,
  jobSkill4,
  jobSkill5,
  jobSkill6,
];
