import type { WorkerNotification } from "@/types";

// 労働者への通知（田中一郎 workerId: 1）
export const workerNotification1: WorkerNotification = {
  id: 1,
  workerId: 1,
  confirmedAt: null, // 未読
  title: "採用されました！",
  description: "「地元商店街のPR動画撮影」に採用されました。詳細を確認してください。",
  url: "/worker/jobs", // 受注中ジョブ一覧
  createdAt: "2026-01-03T12:00:00Z",
};

export const workerNotification2: WorkerNotification = {
  id: 2,
  workerId: 1,
  confirmedAt: "2026-01-02T10:00:00Z",
  title: "報酬が振り込まれました",
  description: "「温泉旅館の接客補助」の報酬 9,000 JPYC が振り込まれました。",
  url: "/worker/wallet", // ウォレット
  createdAt: "2026-01-02T09:00:00Z",
};

export const workerNotification3: WorkerNotification = {
  id: 3,
  workerId: 1,
  confirmedAt: "2025-12-28T18:00:00Z",
  title: "評価をいただきました",
  description: "発注者から★5の評価をいただきました。信用ポイントが更新されました。",
  url: "/worker/jobs", // 完了済みジョブ一覧
  createdAt: "2025-12-28T17:00:00Z",
};

export const workerNotification4: WorkerNotification = {
  id: 4,
  workerId: 1,
  confirmedAt: "2025-12-20T14:00:00Z",
  title: "新しいおすすめジョブがあります",
  description: "あなたのスキルにマッチする「年末大掃除のお手伝い」が掲載されました。",
  url: "/worker/request-boards", // 掲示板
  createdAt: "2025-12-20T12:00:00Z",
};

// 全通知
export const workerNotifications: WorkerNotification[] = [
  workerNotification1,
  workerNotification2,
  workerNotification3,
  workerNotification4,
];
