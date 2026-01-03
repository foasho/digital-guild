// Type definitions

// チェックリスト項目
export interface ChecklistItem {
  id: number;
  text: string;
}

// 労働者
export interface Worker {
  id: number;
  name: string;
  birth: string;
  gender: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

// 発注者
export interface Requester {
  id: number;
  name: string;
  address: string;
  createdAt: string;
}

// ジョブ
export interface Job {
  id: number;
  requesterId: number;
  title: string;
  description: string;
  reward: number;
  aiInsentiveReward: number;
  location: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
  tags: string[];
  capacity: number;
  checklist: ChecklistItem[];
  scheduledDate: string;
  createdAt: string;
  updatedAt: string;
}

// ジョブスキル
export interface JobSkill {
  id: number;
  jobId: number;
  skillId: number;
}

// 募集条件
export interface RequirementSkill {
  id: number;
  jobId: number;
  skillId: number;
  skillAmount: number;
}

// AIレコメンド
export interface JobAiRecommend {
  id: number;
  jobId: number;
  workerId: number;
  confidence: number;
  reason: string;
  createdAt: string;
  updatedAt: string;
}

// ブックマーク
export interface BookmarkJob {
  id: number;
  jobId: number;
  workerId: number;
}

// 着手ジョブ
export interface UndertakedJob {
  id: number;
  workerId: number;
  jobId: number;
  /**
   * ステータスフロー:
   * 1. applied - 労働者が応募（発注者の承認待ち）
   * 2. accepted - 発注者が採用を確定、労働者が着手開始
   * 3. completion_reported - 労働者が作業完了報告
   * 4. completed - 発注者が確認して評価完了
   * 5. canceled - キャンセル
   */
  status: "applied" | "accepted" | "completion_reported" | "completed" | "canceled";
  requesterEvalScore: number | null;
  appliedAt: string | null; // 労働者が応募した日時
  acceptedAt: string | null; // 発注者が採用を確定した日時
  completionReportedAt: string | null; // 労働者が完了報告した日時
  canceledAt: string | null;
  finishedAt: string | null;
  // 完了報告時の情報
  completionMemo: string | null; // 労働者のメモ
  completedChecklistIds: number[] | null; // 完了したチェックリストのID配列
}

// ギルド証
export interface TrustPassport {
  id: number;
  workerId: number;
  trustScore: number;
  balance: number;
}

// 労働者スキル
export interface WorkerSkill {
  id: number;
  workerId: number;
  name: string;
  createdAt: string;
  jobId: number;
}

// 補助金
export interface Subsidy {
  id: number;
  requesterId: number;
  amount: number;
  sendedAt: string;
}

// スキルマスタ
export interface Skill {
  id: number;
  name: string;
}

// 取引履歴
export interface TransactionHistory {
  id: number;
  workerId: number;
  to: string;
  from: string;
  amount: number;
  description: string;
  tradedAt: string;
}

// ランク
export type Rank = "Bronze" | "Silver" | "Gold" | "Platinum";

// 労働者通知
export interface WorkerNotification {
  id: number;
  workerId: number;
  confirmedAt: string | null; // 確認済み日時（nullは未読）
  title: string;
  description: string;
  url: string | null; // 詳細ページへのリンク（nullable）
  createdAt: string;
}

// 発注者通知
export interface RequesterNotification {
  id: number;
  requesterId: number;
  confirmedAt: string | null; // 確認済み日時（nullは未読）
  title: string;
  description: string;
  url: string | null; // 詳細ページへのリンク（nullable）
  createdAt: string;
}
