// Type definitions

// チェックリスト項目
export interface ChecklistItem {
  id: string;
  text: string;
}

// 労働者
export interface Worker {
  id: string;
  name: string;
  birth: string;
  gender: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

// 発注者
export interface Requester {
  id: string;
  name: string;
  createdAt: string;
}

// ジョブ
export interface Job {
  id: string;
  requesterId: string;
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
  id: string;
  jobId: string;
  skillId: string;
}

// 募集条件
export interface RequirementSkill {
  id: string;
  jobId: string;
  skillId: string;
  skillAmount: number;
}

// AIレコメンド
export interface JobAiRecommend {
  id: string;
  jobId: string;
  workerId: string;
  confidence: number;
  reason: string;
  createdAt: string;
  updatedAt: string;
}

// ブックマーク
export interface BookmarkJob {
  id: string;
  jobId: string;
  workerId: string;
}

// 着手ジョブ
export interface UndertakedJob {
  id: string;
  workerId: string;
  jobId: string;
  status: "accepted" | "in_progress" | "completed" | "canceled";
  requesterEvalScore: number | null;
  acceptedAt: string;
  canceledAt: string | null;
  finishedAt: string | null;
}

// ギルド証
export interface TrustPassport {
  id: string;
  workerId: string;
  trustScore: number;
}

// 労働者スキル
export interface WorkerSkill {
  id: string;
  workerId: string;
  name: string;
  createdAt: string;
  jobId: string;
}

// 補助金
export interface Subsidy {
  id: string;
  requesterId: string;
  amount: number;
  sendedAt: string;
}

// スキルマスタ
export interface Skill {
  id: string;
  name: string;
}

// 取引履歴
export interface TransactionHistory {
  id: string;
  workerId: string;
  to: string;
  from: string;
  amount: number;
  description: string;
  tradedAt: string;
}

// ランク
export type Rank = "Bronze" | "Silver" | "Gold" | "Platinum";
