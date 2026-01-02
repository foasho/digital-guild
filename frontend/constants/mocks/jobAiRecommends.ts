import type { JobAiRecommend } from "@/types";

// AIレコメンド（confidence >= 0.7 で推奨表示）
export const aiRecommend1: JobAiRecommend = {
  id: "air-1",
  jobId: "job-izakaya",
  workerId: "worker-1",
  confidence: 0.85,
  reason:
    "田中さんは過去に接客経験があり、軽作業も得意です。撮影補助にも適性があると判断しました。",
  createdAt: "2025-12-20T00:00:00Z",
  updatedAt: "2025-12-20T00:00:00Z",
};

export const aiRecommend2: JobAiRecommend = {
  id: "air-2",
  jobId: "job-nouka",
  workerId: "worker-1",
  confidence: 0.72,
  reason:
    "農作業経験が3回あり、屋外作業にも慣れています。みかん収穫に適していると判断しました。",
  createdAt: "2025-12-18T00:00:00Z",
  updatedAt: "2025-12-18T00:00:00Z",
};

export const aiRecommend3: JobAiRecommend = {
  id: "air-3",
  jobId: "job-ryokan",
  workerId: "worker-1",
  confidence: 0.65, // 0.7未満なので推奨表示されない
  reason: "清掃経験がありますが、庭仕事の経験が不足しています。",
  createdAt: "2025-12-15T00:00:00Z",
  updatedAt: "2025-12-15T00:00:00Z",
};

export const jobAiRecommends: JobAiRecommend[] = [
  aiRecommend1,
  aiRecommend2,
  aiRecommend3,
];

