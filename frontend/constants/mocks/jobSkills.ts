import type { JobSkill } from "@/types";

// ジョブに紐づくスキル（ジョブ完了時に付与されるスキル）
export const jobSkill1: JobSkill = {
  id: "jsk-1",
  jobId: "job-izakaya",
  skillId: "skill-5", // 撮影
};

export const jobSkill2: JobSkill = {
  id: "jsk-2",
  jobId: "job-izakaya",
  skillId: "skill-8", // 軽作業
};

export const jobSkill3: JobSkill = {
  id: "jsk-3",
  jobId: "job-nouka",
  skillId: "skill-3", // 農作業
};

export const jobSkill4: JobSkill = {
  id: "jsk-4",
  jobId: "job-nouka",
  skillId: "skill-9", // 収穫
};

export const jobSkill5: JobSkill = {
  id: "jsk-5",
  jobId: "job-ryokan",
  skillId: "skill-4", // 清掃
};

export const jobSkill6: JobSkill = {
  id: "jsk-6",
  jobId: "job-ryokan",
  skillId: "skill-7", // 庭仕事
};

export const jobSkills: JobSkill[] = [
  jobSkill1,
  jobSkill2,
  jobSkill3,
  jobSkill4,
  jobSkill5,
  jobSkill6,
];

