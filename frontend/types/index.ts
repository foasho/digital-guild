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
   * 1. accepted - 労働者が着手開始
   * 2. completion_reported - 労働者が作業完了報告
   * 3. completed - 発注者が確認して評価完了
   * 4. canceled - キャンセル
   */
  status: "accepted" | "completion_reported" | "completed" | "canceled";
  requesterEvalScore: number | null;
  acceptedAt: string;
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
