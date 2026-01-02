import type { UndertakedJob } from "@/types";

// 完了済みジョブ（評価付き）- 信用ポイント算出に使用
// 合計25件: 評価合計 108, 平均 4.32 ≈ 4.3
// 信用ポイント = min(50, 25) + 4.32 * 10 = 25 + 43 = 68

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

// 追加17件 (評価5が6件、評価4が11件 → 合計74)
// 既存8件の合計34 + 追加74 = 108 → 平均 4.32

export const completedJob9: UndertakedJob = {
  id: "undertaked-11",
  workerId: "worker-1",
  jobId: "job-past-9",
  status: "completed",
  requesterEvalScore: 5,
  acceptedAt: "2025-06-01T09:00:00Z",
  canceledAt: null,
  finishedAt: "2025-06-01T17:00:00Z",
};

export const completedJob10: UndertakedJob = {
  id: "undertaked-12",
  workerId: "worker-1",
  jobId: "job-past-10",
  status: "completed",
  requesterEvalScore: 5,
  acceptedAt: "2025-06-08T09:00:00Z",
  canceledAt: null,
  finishedAt: "2025-06-08T17:00:00Z",
};

export const completedJob11: UndertakedJob = {
  id: "undertaked-13",
  workerId: "worker-1",
  jobId: "job-past-11",
  status: "completed",
  requesterEvalScore: 5,
  acceptedAt: "2025-06-15T09:00:00Z",
  canceledAt: null,
  finishedAt: "2025-06-15T17:00:00Z",
};

export const completedJob12: UndertakedJob = {
  id: "undertaked-14",
  workerId: "worker-1",
  jobId: "job-past-12",
  status: "completed",
  requesterEvalScore: 5,
  acceptedAt: "2025-06-22T09:00:00Z",
  canceledAt: null,
  finishedAt: "2025-06-22T17:00:00Z",
};

export const completedJob13: UndertakedJob = {
  id: "undertaked-15",
  workerId: "worker-1",
  jobId: "job-past-13",
  status: "completed",
  requesterEvalScore: 5,
  acceptedAt: "2025-06-29T09:00:00Z",
  canceledAt: null,
  finishedAt: "2025-06-29T17:00:00Z",
};

export const completedJob14: UndertakedJob = {
  id: "undertaked-16",
  workerId: "worker-1",
  jobId: "job-past-14",
  status: "completed",
  requesterEvalScore: 5,
  acceptedAt: "2025-07-06T09:00:00Z",
  canceledAt: null,
  finishedAt: "2025-07-06T17:00:00Z",
};

export const completedJob15: UndertakedJob = {
  id: "undertaked-17",
  workerId: "worker-1",
  jobId: "job-past-15",
  status: "completed",
  requesterEvalScore: 4,
  acceptedAt: "2025-07-13T09:00:00Z",
  canceledAt: null,
  finishedAt: "2025-07-13T17:00:00Z",
};

export const completedJob16: UndertakedJob = {
  id: "undertaked-18",
  workerId: "worker-1",
  jobId: "job-past-16",
  status: "completed",
  requesterEvalScore: 4,
  acceptedAt: "2025-07-20T09:00:00Z",
  canceledAt: null,
  finishedAt: "2025-07-20T17:00:00Z",
};

export const completedJob17: UndertakedJob = {
  id: "undertaked-19",
  workerId: "worker-1",
  jobId: "job-past-17",
  status: "completed",
  requesterEvalScore: 4,
  acceptedAt: "2025-07-27T09:00:00Z",
  canceledAt: null,
  finishedAt: "2025-07-27T17:00:00Z",
};

export const completedJob18: UndertakedJob = {
  id: "undertaked-20",
  workerId: "worker-1",
  jobId: "job-past-18",
  status: "completed",
  requesterEvalScore: 4,
  acceptedAt: "2025-08-03T09:00:00Z",
  canceledAt: null,
  finishedAt: "2025-08-03T17:00:00Z",
};

export const completedJob19: UndertakedJob = {
  id: "undertaked-21",
  workerId: "worker-1",
  jobId: "job-past-19",
  status: "completed",
  requesterEvalScore: 4,
  acceptedAt: "2025-08-10T09:00:00Z",
  canceledAt: null,
  finishedAt: "2025-08-10T17:00:00Z",
};

export const completedJob20: UndertakedJob = {
  id: "undertaked-22",
  workerId: "worker-1",
  jobId: "job-past-20",
  status: "completed",
  requesterEvalScore: 4,
  acceptedAt: "2025-08-17T09:00:00Z",
  canceledAt: null,
  finishedAt: "2025-08-17T17:00:00Z",
};

export const completedJob21: UndertakedJob = {
  id: "undertaked-23",
  workerId: "worker-1",
  jobId: "job-past-21",
  status: "completed",
  requesterEvalScore: 4,
  acceptedAt: "2025-08-24T09:00:00Z",
  canceledAt: null,
  finishedAt: "2025-08-24T17:00:00Z",
};

export const completedJob22: UndertakedJob = {
  id: "undertaked-24",
  workerId: "worker-1",
  jobId: "job-past-22",
  status: "completed",
  requesterEvalScore: 4,
  acceptedAt: "2025-08-31T09:00:00Z",
  canceledAt: null,
  finishedAt: "2025-08-31T17:00:00Z",
};

export const completedJob23: UndertakedJob = {
  id: "undertaked-25",
  workerId: "worker-1",
  jobId: "job-past-23",
  status: "completed",
  requesterEvalScore: 4,
  acceptedAt: "2025-09-07T09:00:00Z",
  canceledAt: null,
  finishedAt: "2025-09-07T17:00:00Z",
};

export const completedJob24: UndertakedJob = {
  id: "undertaked-26",
  workerId: "worker-1",
  jobId: "job-past-24",
  status: "completed",
  requesterEvalScore: 4,
  acceptedAt: "2025-09-14T09:00:00Z",
  canceledAt: null,
  finishedAt: "2025-09-14T17:00:00Z",
};

export const completedJob25: UndertakedJob = {
  id: "undertaked-27",
  workerId: "worker-1",
  jobId: "job-past-25",
  status: "completed",
  requesterEvalScore: 4,
  acceptedAt: "2025-09-21T09:00:00Z",
  canceledAt: null,
  finishedAt: "2025-09-21T17:00:00Z",
};

// 進行中のジョブ
export const inProgressJob1: UndertakedJob = {
  id: "undertaked-28",
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
  id: "undertaked-29",
  workerId: "worker-1",
  jobId: "job-past-canceled",
  status: "canceled",
  requesterEvalScore: null,
  acceptedAt: "2025-10-15T09:00:00Z",
  canceledAt: "2025-10-15T12:00:00Z",
  finishedAt: null,
};

// 全undertakedJobs（初期データ）
// 完了25件: 評価合計 108, 平均 = 4.32 ≈ 4.3
// 信用ポイント = min(50, 25) + round(4.32 * 10) = 25 + 43 = 68
export const undertakedJobs: UndertakedJob[] = [
  completedJob1,
  completedJob2,
  completedJob3,
  completedJob4,
  completedJob5,
  completedJob6,
  completedJob7,
  completedJob8,
  completedJob9,
  completedJob10,
  completedJob11,
  completedJob12,
  completedJob13,
  completedJob14,
  completedJob15,
  completedJob16,
  completedJob17,
  completedJob18,
  completedJob19,
  completedJob20,
  completedJob21,
  completedJob22,
  completedJob23,
  completedJob24,
  completedJob25,
  inProgressJob1,
  canceledJob1,
];

