import type { Requester } from "@/types";

// 現在募集中のジョブ用リクエスター
export const requester1: Requester = {
  id: 1,
  name: "佐藤 清治",
  createdAt: "2025-01-01T00:00:00Z",
};

export const requester2: Requester = {
  id: 2,
  name: "田中 幸子",
  createdAt: "2025-01-01T00:00:00Z",
};

export const requester3: Requester = {
  id: 3,
  name: "山本 正雄",
  createdAt: "2025-01-01T00:00:00Z",
};

// 過去ジョブ用リクエスター
export const requester101: Requester = {
  id: 101,
  name: "鈴木 勝",
  createdAt: "2025-01-01T00:00:00Z",
};

export const requester102: Requester = {
  id: 102,
  name: "高橋 美代子",
  createdAt: "2025-01-01T00:00:00Z",
};

export const requester103: Requester = {
  id: 103,
  name: "伊藤 源一郎",
  createdAt: "2025-01-01T00:00:00Z",
};

export const requester104: Requester = {
  id: 104,
  name: "渡辺 義男",
  createdAt: "2025-01-01T00:00:00Z",
};

export const requester105: Requester = {
  id: 105,
  name: "小林 節子",
  createdAt: "2025-01-01T00:00:00Z",
};

export const requester106: Requester = {
  id: 106,
  name: "加藤 茂",
  createdAt: "2025-01-01T00:00:00Z",
};

export const requester107: Requester = {
  id: 107,
  name: "吉田 富夫",
  createdAt: "2025-01-01T00:00:00Z",
};

export const requester108: Requester = {
  id: 108,
  name: "中村 昭子",
  createdAt: "2025-01-01T00:00:00Z",
};

export const requester109: Requester = {
  id: 109,
  name: "松本 誠",
  createdAt: "2025-01-01T00:00:00Z",
};

export const requester110: Requester = {
  id: 110,
  name: "井上 敏子",
  createdAt: "2025-01-01T00:00:00Z",
};

// デフォルト（モックUIで使用）
export const defaultRequester: Requester = requester1;

// 全リクエスター
export const requesters: Requester[] = [
  requester1,
  requester2,
  requester3,
  requester101,
  requester102,
  requester103,
  requester104,
  requester105,
  requester106,
  requester107,
  requester108,
  requester109,
  requester110,
];
