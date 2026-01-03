import type { UndertakedJob } from "@/types";

// 完了済みジョブ（過去ジョブ101〜110に紐付け、重複あり）
export const completedJob1: UndertakedJob = {
  id: 1,
  workerId: 1,
  jobId: 101, // イベント会場設営のお手伝い
  status: "completed",
  requesterEvalScore: 5,
  acceptedAt: "2025-11-01T09:00:00Z",
  completionReportedAt: "2025-11-01T16:00:00Z",
  canceledAt: null,
  finishedAt: "2025-11-01T17:00:00Z",
  completionMemo: "問題なく作業完了しました",
  completedChecklistIds: [1, 2, 3, 4],
};

export const completedJob2: UndertakedJob = {
  id: 2,
  workerId: 1,
  jobId: 102, // カフェ店舗の内装手伝い
  status: "completed",
  requesterEvalScore: 4,
  acceptedAt: "2025-11-05T09:00:00Z",
  completionReportedAt: "2025-11-05T15:00:00Z",
  canceledAt: null,
  finishedAt: "2025-11-05T16:00:00Z",
  completionMemo: null,
  completedChecklistIds: null,
};

export const completedJob3: UndertakedJob = {
  id: 3,
  workerId: 1,
  jobId: 103, // 農産物直売所のお手伝い
  status: "completed",
  requesterEvalScore: 5,
  acceptedAt: "2025-11-10T08:00:00Z",
  completionReportedAt: "2025-11-10T14:00:00Z",
  canceledAt: null,
  finishedAt: "2025-11-10T15:00:00Z",
  completionMemo: null,
  completedChecklistIds: null,
};

export const completedJob4: UndertakedJob = {
  id: 4,
  workerId: 1,
  jobId: 104, // 倉庫整理のお手伝い
  status: "completed",
  requesterEvalScore: 3,
  acceptedAt: "2025-11-15T10:00:00Z",
  completionReportedAt: "2025-11-15T17:00:00Z",
  canceledAt: null,
  finishedAt: "2025-11-15T18:00:00Z",
  completionMemo: null,
  completedChecklistIds: null,
};

export const completedJob5: UndertakedJob = {
  id: 5,
  workerId: 1,
  jobId: 105, // 写真撮影アシスタント
  status: "completed",
  requesterEvalScore: 4,
  acceptedAt: "2025-11-20T09:00:00Z",
  completionReportedAt: "2025-11-20T16:00:00Z",
  canceledAt: null,
  finishedAt: "2025-11-20T17:00:00Z",
  completionMemo: null,
  completedChecklistIds: null,
};

export const completedJob6: UndertakedJob = {
  id: 6,
  workerId: 1,
  jobId: 106, // 海岸清掃ボランティア
  status: "completed",
  requesterEvalScore: 5,
  acceptedAt: "2025-11-25T08:00:00Z",
  completionReportedAt: "2025-11-25T15:00:00Z",
  canceledAt: null,
  finishedAt: "2025-11-25T16:00:00Z",
  completionMemo: null,
  completedChecklistIds: null,
};

export const completedJob7: UndertakedJob = {
  id: 7,
  workerId: 1,
  jobId: 107, // 引越し作業のお手伝い
  status: "completed",
  requesterEvalScore: 4,
  acceptedAt: "2025-12-01T09:00:00Z",
  completionReportedAt: "2025-12-01T16:00:00Z",
  canceledAt: null,
  finishedAt: "2025-12-01T17:00:00Z",
  completionMemo: null,
  completedChecklistIds: null,
};

export const completedJob8: UndertakedJob = {
  id: 8,
  workerId: 1,
  jobId: 108, // クリスマスイベント補助
  status: "completed",
  requesterEvalScore: 4,
  acceptedAt: "2025-12-10T10:00:00Z",
  completionReportedAt: "2025-12-10T17:00:00Z",
  canceledAt: null,
  finishedAt: "2025-12-10T18:00:00Z",
  completionMemo: null,
  completedChecklistIds: null,
};

export const completedJob9: UndertakedJob = {
  id: 9,
  workerId: 1,
  jobId: 109, // 年末大掃除のお手伝い
  status: "completed",
  requesterEvalScore: 5,
  acceptedAt: "2025-06-01T09:00:00Z",
  completionReportedAt: "2025-06-01T16:00:00Z",
  canceledAt: null,
  finishedAt: "2025-06-01T17:00:00Z",
  completionMemo: null,
  completedChecklistIds: null,
};

export const completedJob10: UndertakedJob = {
  id: 10,
  workerId: 1,
  jobId: 110, // 地域祭りの屋台補助
  status: "completed",
  requesterEvalScore: 5,
  acceptedAt: "2025-06-08T09:00:00Z",
  completionReportedAt: "2025-06-08T16:00:00Z",
  canceledAt: null,
  finishedAt: "2025-06-08T17:00:00Z",
  completionMemo: null,
  completedChecklistIds: null,
};

export const completedJob11: UndertakedJob = {
  id: 11,
  workerId: 1,
  jobId: 101,
  status: "completed",
  requesterEvalScore: 5,
  acceptedAt: "2025-06-15T09:00:00Z",
  completionReportedAt: "2025-06-15T16:00:00Z",
  canceledAt: null,
  finishedAt: "2025-06-15T17:00:00Z",
  completionMemo: null,
  completedChecklistIds: null,
};

export const completedJob12: UndertakedJob = {
  id: 12,
  workerId: 1,
  jobId: 102,
  status: "completed",
  requesterEvalScore: 5,
  acceptedAt: "2025-06-22T09:00:00Z",
  completionReportedAt: "2025-06-22T16:00:00Z",
  canceledAt: null,
  finishedAt: "2025-06-22T17:00:00Z",
  completionMemo: null,
  completedChecklistIds: null,
};

export const completedJob13: UndertakedJob = {
  id: 13,
  workerId: 1,
  jobId: 103,
  status: "completed",
  requesterEvalScore: 5,
  acceptedAt: "2025-06-29T09:00:00Z",
  completionReportedAt: "2025-06-29T16:00:00Z",
  canceledAt: null,
  finishedAt: "2025-06-29T17:00:00Z",
  completionMemo: null,
  completedChecklistIds: null,
};

export const completedJob14: UndertakedJob = {
  id: 14,
  workerId: 1,
  jobId: 104,
  status: "completed",
  requesterEvalScore: 5,
  acceptedAt: "2025-07-06T09:00:00Z",
  completionReportedAt: "2025-07-06T16:00:00Z",
  canceledAt: null,
  finishedAt: "2025-07-06T17:00:00Z",
  completionMemo: null,
  completedChecklistIds: null,
};

export const completedJob15: UndertakedJob = {
  id: 15,
  workerId: 1,
  jobId: 105,
  status: "completed",
  requesterEvalScore: 4,
  acceptedAt: "2025-07-13T09:00:00Z",
  completionReportedAt: "2025-07-13T16:00:00Z",
  canceledAt: null,
  finishedAt: "2025-07-13T17:00:00Z",
  completionMemo: null,
  completedChecklistIds: null,
};

export const completedJob16: UndertakedJob = {
  id: 16,
  workerId: 1,
  jobId: 106,
  status: "completed",
  requesterEvalScore: 4,
  acceptedAt: "2025-07-20T09:00:00Z",
  completionReportedAt: "2025-07-20T16:00:00Z",
  canceledAt: null,
  finishedAt: "2025-07-20T17:00:00Z",
  completionMemo: null,
  completedChecklistIds: null,
};

export const completedJob17: UndertakedJob = {
  id: 17,
  workerId: 1,
  jobId: 107,
  status: "completed",
  requesterEvalScore: 4,
  acceptedAt: "2025-07-27T09:00:00Z",
  completionReportedAt: "2025-07-27T16:00:00Z",
  canceledAt: null,
  finishedAt: "2025-07-27T17:00:00Z",
  completionMemo: null,
  completedChecklistIds: null,
};

export const completedJob18: UndertakedJob = {
  id: 18,
  workerId: 1,
  jobId: 108,
  status: "completed",
  requesterEvalScore: 4,
  acceptedAt: "2025-08-03T09:00:00Z",
  completionReportedAt: "2025-08-03T16:00:00Z",
  canceledAt: null,
  finishedAt: "2025-08-03T17:00:00Z",
  completionMemo: null,
  completedChecklistIds: null,
};

export const completedJob19: UndertakedJob = {
  id: 19,
  workerId: 1,
  jobId: 109,
  status: "completed",
  requesterEvalScore: 4,
  acceptedAt: "2025-08-10T09:00:00Z",
  completionReportedAt: "2025-08-10T16:00:00Z",
  canceledAt: null,
  finishedAt: "2025-08-10T17:00:00Z",
  completionMemo: null,
  completedChecklistIds: null,
};

export const completedJob20: UndertakedJob = {
  id: 20,
  workerId: 1,
  jobId: 110,
  status: "completed",
  requesterEvalScore: 4,
  acceptedAt: "2025-08-17T09:00:00Z",
  completionReportedAt: "2025-08-17T16:00:00Z",
  canceledAt: null,
  finishedAt: "2025-08-17T17:00:00Z",
  completionMemo: null,
  completedChecklistIds: null,
};

export const completedJob21: UndertakedJob = {
  id: 21,
  workerId: 1,
  jobId: 101,
  status: "completed",
  requesterEvalScore: 4,
  acceptedAt: "2025-08-24T09:00:00Z",
  completionReportedAt: "2025-08-24T16:00:00Z",
  canceledAt: null,
  finishedAt: "2025-08-24T17:00:00Z",
  completionMemo: null,
  completedChecklistIds: null,
};

export const completedJob22: UndertakedJob = {
  id: 22,
  workerId: 1,
  jobId: 102,
  status: "completed",
  requesterEvalScore: 4,
  acceptedAt: "2025-08-31T09:00:00Z",
  completionReportedAt: "2025-08-31T16:00:00Z",
  canceledAt: null,
  finishedAt: "2025-08-31T17:00:00Z",
  completionMemo: null,
  completedChecklistIds: null,
};

export const completedJob23: UndertakedJob = {
  id: 23,
  workerId: 1,
  jobId: 103,
  status: "completed",
  requesterEvalScore: 4,
  acceptedAt: "2025-09-07T09:00:00Z",
  completionReportedAt: "2025-09-07T16:00:00Z",
  canceledAt: null,
  finishedAt: "2025-09-07T17:00:00Z",
  completionMemo: null,
  completedChecklistIds: null,
};

export const completedJob24: UndertakedJob = {
  id: 24,
  workerId: 1,
  jobId: 104,
  status: "completed",
  requesterEvalScore: 4,
  acceptedAt: "2025-09-14T09:00:00Z",
  completionReportedAt: "2025-09-14T16:00:00Z",
  canceledAt: null,
  finishedAt: "2025-09-14T17:00:00Z",
  completionMemo: null,
  completedChecklistIds: null,
};

export const completedJob25: UndertakedJob = {
  id: 25,
  workerId: 1,
  jobId: 105,
  status: "completed",
  requesterEvalScore: 4,
  acceptedAt: "2025-09-21T09:00:00Z",
  completionReportedAt: "2025-09-21T16:00:00Z",
  canceledAt: null,
  finishedAt: "2025-09-21T17:00:00Z",
  completionMemo: null,
  completedChecklistIds: null,
};

// 着手中のジョブ（izakayaJob = id: 1）
export const inProgressJob1: UndertakedJob = {
  id: 26,
  workerId: 1,
  jobId: 1, // izakayaJob
  status: "accepted",
  requesterEvalScore: null,
  acceptedAt: "2026-01-05T09:00:00Z",
  completionReportedAt: null,
  canceledAt: null,
  finishedAt: null,
  completionMemo: null,
  completedChecklistIds: null,
};

// キャンセル済みジョブ
export const canceledJob1: UndertakedJob = {
  id: 27,
  workerId: 1,
  jobId: 106,
  status: "canceled",
  requesterEvalScore: null,
  acceptedAt: "2025-10-15T09:00:00Z",
  completionReportedAt: null,
  canceledAt: "2025-10-15T12:00:00Z",
  finishedAt: null,
  completionMemo: null,
  completedChecklistIds: null,
};

// ===== 大分幸子(id: 1000)のジョブに対する着手ジョブ =====

// 確認待ち（completion_reported）のジョブ - 大分幸子のジョブ1001
export const oitaPendingReviewJob: UndertakedJob = {
  id: 28,
  workerId: 1,
  jobId: 1001, // 温泉旅館の接客補助
  status: "completion_reported",
  requesterEvalScore: null,
  acceptedAt: "2026-01-02T09:00:00Z",
  completionReportedAt: "2026-01-02T18:00:00Z",
  canceledAt: null,
  finishedAt: null,
  completionMemo: "接客業務を無事に完了しました。お客様からもお褒めの言葉をいただきました。",
  completedChecklistIds: [1001, 1002, 1003, 1004, 1005],
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
  oitaPendingReviewJob,
];
