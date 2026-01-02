import type { WorkerSkill } from "@/types";

// 労働者が過去のジョブ完了で獲得したスキル
export const workerSkill1: WorkerSkill = {
  id: "ws-1",
  workerId: "worker-1",
  name: "接客",
  createdAt: "2025-11-01T17:00:00Z",
  jobId: "job-past-1",
};

export const workerSkill2: WorkerSkill = {
  id: "ws-2",
  workerId: "worker-1",
  name: "接客",
  createdAt: "2025-11-05T16:00:00Z",
  jobId: "job-past-2",
};

export const workerSkill3: WorkerSkill = {
  id: "ws-3",
  workerId: "worker-1",
  name: "農作業",
  createdAt: "2025-11-10T15:00:00Z",
  jobId: "job-past-3",
};

export const workerSkill4: WorkerSkill = {
  id: "ws-4",
  workerId: "worker-1",
  name: "清掃",
  createdAt: "2025-11-15T18:00:00Z",
  jobId: "job-past-4",
};

export const workerSkill5: WorkerSkill = {
  id: "ws-5",
  workerId: "worker-1",
  name: "農作業",
  createdAt: "2025-11-20T17:00:00Z",
  jobId: "job-past-5",
};

export const workerSkill6: WorkerSkill = {
  id: "ws-6",
  workerId: "worker-1",
  name: "接客",
  createdAt: "2025-11-25T16:00:00Z",
  jobId: "job-past-6",
};

export const workerSkill7: WorkerSkill = {
  id: "ws-7",
  workerId: "worker-1",
  name: "農作業",
  createdAt: "2025-12-01T17:00:00Z",
  jobId: "job-past-7",
};

export const workerSkill8: WorkerSkill = {
  id: "ws-8",
  workerId: "worker-1",
  name: "接客",
  createdAt: "2025-12-10T18:00:00Z",
  jobId: "job-past-8",
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

