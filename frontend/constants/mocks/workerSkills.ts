import type { WorkerSkill } from "@/types";

// 労働者が過去のジョブ完了で獲得したスキル
export const workerSkill1: WorkerSkill = {
  id: 1,
  workerId: 1,
  name: "接客",
  createdAt: "2025-11-01T17:00:00Z",
  jobId: 101, // 過去ジョブID
};

export const workerSkill2: WorkerSkill = {
  id: 2,
  workerId: 1,
  name: "接客",
  createdAt: "2025-11-05T16:00:00Z",
  jobId: 102,
};

export const workerSkill3: WorkerSkill = {
  id: 3,
  workerId: 1,
  name: "農作業",
  createdAt: "2025-11-10T15:00:00Z",
  jobId: 103,
};

export const workerSkill4: WorkerSkill = {
  id: 4,
  workerId: 1,
  name: "清掃",
  createdAt: "2025-11-15T18:00:00Z",
  jobId: 104,
};

export const workerSkill5: WorkerSkill = {
  id: 5,
  workerId: 1,
  name: "農作業",
  createdAt: "2025-11-20T17:00:00Z",
  jobId: 105,
};

export const workerSkill6: WorkerSkill = {
  id: 6,
  workerId: 1,
  name: "接客",
  createdAt: "2025-11-25T16:00:00Z",
  jobId: 106,
};

export const workerSkill7: WorkerSkill = {
  id: 7,
  workerId: 1,
  name: "農作業",
  createdAt: "2025-12-01T17:00:00Z",
  jobId: 107,
};

export const workerSkill8: WorkerSkill = {
  id: 8,
  workerId: 1,
  name: "接客",
  createdAt: "2025-12-10T18:00:00Z",
  jobId: 108,
};

// 全労働者スキル（初期データ）
// 接客: 4回, 農作業: 3回, 清掃: 1回
export const workerSkills: WorkerSkill[] = [
  workerSkill1,
  workerSkill2,
  workerSkill3,
  workerSkill4,
  workerSkill5,
  workerSkill6,
  workerSkill7,
  workerSkill8,
];
