import type { Requester } from "@/types";

// デフォルトの発注者（モックUIで使用）
export const oitaSachiko: Requester = {
  id: 1000,
  name: "大分 幸子",
  address: "大分県大分市府内町1-2-3",
  createdAt: "2025-01-01T00:00:00Z",
};

// 現在募集中のジョブ用リクエスター
export const requester1: Requester = {
  id: 1,
  name: "佐藤 清治",
  address: "山形県山形市七日町2-4-5",
  createdAt: "2025-01-01T00:00:00Z",
};

export const requester2: Requester = {
  id: 2,
  name: "田中 幸子",
  address: "愛媛県松山市道後湯之町3-1-8",
  createdAt: "2025-01-01T00:00:00Z",
};

export const requester3: Requester = {
  id: 3,
  name: "山本 正雄",
  address: "石川県加賀市山代温泉5-6-7",
  createdAt: "2025-01-01T00:00:00Z",
};

// 過去ジョブ用リクエスター
export const requester101: Requester = {
  id: 101,
  name: "鈴木 勝",
  address: "北海道札幌市中央区北1条西4-8-9",
  createdAt: "2025-01-01T00:00:00Z",
};

export const requester102: Requester = {
  id: 102,
  name: "高橋 美代子",
  address: "東京都渋谷区神南1-23-10",
  createdAt: "2025-01-01T00:00:00Z",
};

export const requester103: Requester = {
  id: 103,
  name: "伊藤 源一郎",
  address: "長野県松本市中央2-5-6",
  createdAt: "2025-01-01T00:00:00Z",
};

export const requester104: Requester = {
  id: 104,
  name: "渡辺 義男",
  address: "大阪府堺市堺区南瓦町3-1-2",
  createdAt: "2025-01-01T00:00:00Z",
};

export const requester105: Requester = {
  id: 105,
  name: "小林 節子",
  address: "京都府京都市東山区祇園町4-5-6",
  createdAt: "2025-01-01T00:00:00Z",
};

export const requester106: Requester = {
  id: 106,
  name: "加藤 茂",
  address: "神奈川県鎌倉市長谷2-7-8",
  createdAt: "2025-01-01T00:00:00Z",
};

export const requester107: Requester = {
  id: 107,
  name: "吉田 富夫",
  address: "福岡県福岡市博多区中洲3-9-10",
  createdAt: "2025-01-01T00:00:00Z",
};

export const requester108: Requester = {
  id: 108,
  name: "中村 昭子",
  address: "愛知県名古屋市中区栄4-11-12",
  createdAt: "2025-01-01T00:00:00Z",
};

export const requester109: Requester = {
  id: 109,
  name: "松本 誠",
  address: "東京都千代田区丸の内1-13-14",
  createdAt: "2025-01-01T00:00:00Z",
};

export const requester110: Requester = {
  id: 110,
  name: "井上 敏子",
  address: "広島県広島市中区本通5-15-16",
  createdAt: "2025-01-01T00:00:00Z",
};

// デフォルト（モックUIで使用）- 大分幸子を使用
export const defaultRequester: Requester = oitaSachiko;

// 全リクエスター（大分幸子を先頭に配置）
export const requesters: Requester[] = [
  oitaSachiko,
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
