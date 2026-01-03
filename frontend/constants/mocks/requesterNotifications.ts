import type { RequesterNotification } from "@/types";

// 発注者への通知（大分幸子 requesterId: 1000）
// undertakedJobId: 4 = 地元商店街のPR動画撮影への応募
// undertakedJobId: 3 = 温泉旅館の接客補助の完了報告
export const requesterNotification1: RequesterNotification = {
  id: 1,
  requesterId: 1000,
  confirmedAt: null, // 未読
  title: "新しい応募がありました",
  description: "「地元商店街のPR動画撮影」に田中一郎さんから応募がありました。",
  url: "/requester/undertaked_jobs/29", // 応募者確認画面
  createdAt: "2026-01-03T10:00:00Z",
};

export const requesterNotification2: RequesterNotification = {
  id: 2,
  requesterId: 1000,
  confirmedAt: null, // 未読
  title: "作業完了報告がありました",
  description: "「温泉旅館の接客補助」の作業が完了報告されました。評価をお願いします。",
  url: "/requester/undertaked_jobs/28", // 完了報告確認画面
  createdAt: "2026-01-02T18:30:00Z",
};

export const requesterNotification3: RequesterNotification = {
  id: 3,
  requesterId: 1000,
  confirmedAt: "2026-01-01T15:00:00Z",
  title: "ジョブが公開されました",
  description: "「温泉旅館の接客補助」が正常に公開されました。",
  url: "/requester/jobs/2", // ジョブ詳細
  createdAt: "2026-01-01T12:00:00Z",
};

export const requesterNotification4: RequesterNotification = {
  id: 4,
  requesterId: 1000,
  confirmedAt: "2025-12-28T10:00:00Z",
  title: "助成金が付与されました",
  description: "あなたのアカウントに 1,200,000 JPYC の助成金が付与されました。",
  url: null, // 詳細ページなし
  createdAt: "2025-12-28T09:00:00Z",
};

// 全通知
export const requesterNotifications: RequesterNotification[] = [
  requesterNotification1,
  requesterNotification2,
  requesterNotification3,
  requesterNotification4,
];
