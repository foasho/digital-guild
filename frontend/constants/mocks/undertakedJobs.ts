import type { UndertakedJob } from "@/types";

// 完了済みジョブ（評価付き）- 信用ポイント算出に使用
export const completedJob1: UndertakedJob = {
  id: "undertaked-1",
  workerId: "worker-1",
  jobId: "job-past-1",
  status: "completed",
  requesterEvalScore: 5,
  acceptedAt: "2025-11-01T09:00:00Z",
  canceledAt: null,
  finishedAt: "2025-11-01T17:00:00Z",
};

export const completedJob2: UndertakedJob = {
  id: "undertaked-2",
  workerId: "worker-1",
  jobId: "job-past-2",
  status: "completed",
  requesterEvalScore: 4,
  acceptedAt: "2025-11-05T09:00:00Z",
  canceledAt: null,
  finishedAt: "2025-11-05T16:00:00Z",
};

export const completedJob3: UndertakedJob = {
  id: "undertaked-3",
  workerId: "worker-1",
  jobId: "job-past-3",
  status: "completed",
  requesterEvalScore: 5,
  acceptedAt: "2025-11-10T08:00:00Z",
  canceledAt: null,
  finishedAt: "2025-11-10T15:00:00Z",
};

export const completedJob4: UndertakedJob = {
  id: "undertaked-4",
  workerId: "worker-1",
  jobId: "job-past-4",
  status: "completed",
  requesterEvalScore: 3,
  acceptedAt: "2025-11-15T10:00:00Z",
  canceledAt: null,
  finishedAt: "2025-11-15T18:00:00Z",
};

export const completedJob5: UndertakedJob = {
  id: "undertaked-5",
  workerId: "worker-1",
  jobId: "job-past-5",
  status: "completed",
  requesterEvalScore: 4,
  acceptedAt: "2025-11-20T09:00:00Z",
  canceledAt: null,
  finishedAt: "2025-11-20T17:00:00Z",
};

export const completedJob6: UndertakedJob = {
  id: "undertaked-6",
  workerId: "worker-1",
  jobId: "job-past-6",
  status: "completed",
  requesterEvalScore: 5,
  acceptedAt: "2025-11-25T08:00:00Z",
  canceledAt: null,
  finishedAt: "2025-11-25T16:00:00Z",
};

export const completedJob7: UndertakedJob = {
  id: "undertaked-7",
  workerId: "worker-1",
  jobId: "job-past-7",
  status: "completed",
  requesterEvalScore: 4,
  acceptedAt: "2025-12-01T09:00:00Z",
  canceledAt: null,
  finishedAt: "2025-12-01T17:00:00Z",
};

export const completedJob8: UndertakedJob = {
  id: "undertaked-8",
  workerId: "worker-1",
  jobId: "job-past-8",
  status: "completed",
  requesterEvalScore: 4,
  acceptedAt: "2025-12-10T10:00:00Z",
  canceledAt: null,
  finishedAt: "2025-12-10T18:00:00Z",
};

// 進行中のジョブ
export const inProgressJob1: UndertakedJob = {
  id: "undertaked-9",
  workerId: "worker-1",
  jobId: "job-izakaya",
  status: "in_progress",
  requesterEvalScore: null,
  acceptedAt: "2026-01-05T09:00:00Z",
  canceledAt: null,
  finishedAt: null,
};

// キャンセル済みジョブ
export const canceledJob1: UndertakedJob = {
  id: "undertaked-10",
  workerId: "worker-1",
  jobId: "job-past-9",
  status: "canceled",
  requesterEvalScore: null,
  acceptedAt: "2025-10-15T09:00:00Z",
  canceledAt: "2025-10-15T12:00:00Z",
  finishedAt: null,
};

// 全undertakedJobs（初期データ）
// 完了8件: 評価合計 5+4+5+3+4+5+4+4 = 34, 平均 = 4.25
// 信用ポイント = min(50, 8) + 4.25 * 10 = 8 + 42.5 = 50.5 → 約50
export const undertakedJobs: UndertakedJob[] = [
  completedJob1,
  completedJob2,
  completedJob3,
  completedJob4,
  completedJob5,
  completedJob6,
  completedJob7,
  completedJob8,
  inProgressJob1,
  canceledJob1,
];

