import type { TransactionHistory } from "@/types";

// 取引履歴（過去の報酬受け取り）
export const transaction1: TransactionHistory = {
  id: "tx-1",
  workerId: "worker-1",
  to: "田中一郎",
  from: "山形市役所",
  amount: 8000,
  description: "報酬: 居酒屋PR動画撮影補助",
  tradedAt: "2025-11-01T17:00:00Z",
};

export const transaction2: TransactionHistory = {
  id: "tx-2",
  workerId: "worker-1",
  to: "田中一郎",
  from: "みかん里町農協",
  amount: 7500,
  description: "報酬: みかん収穫作業",
  tradedAt: "2025-11-05T16:00:00Z",
};

export const transaction3: TransactionHistory = {
  id: "tx-3",
  workerId: "worker-1",
  to: "田中一郎",
  from: "温泉郷旅館組合",
  amount: 9000,
  description: "報酬: 旅館庭園清掃",
  tradedAt: "2025-11-10T15:00:00Z",
};

export const transaction4: TransactionHistory = {
  id: "tx-4",
  workerId: "worker-1",
  to: "田中一郎",
  from: "地方創生支援センター",
  amount: 6500,
  description: "報酬: 地域イベント設営補助",
  tradedAt: "2025-11-15T18:00:00Z",
};

export const transaction5: TransactionHistory = {
  id: "tx-5",
  workerId: "worker-1",
  to: "田中一郎",
  from: "みかん里町農協",
  amount: 8000,
  description: "報酬: みかん収穫作業（2回目）",
  tradedAt: "2025-11-20T17:00:00Z",
};

export const transaction6: TransactionHistory = {
  id: "tx-6",
  workerId: "worker-1",
  to: "田中一郎",
  from: "山形市商工会",
  amount: 7000,
  description: "報酬: 商店街イベント接客",
  tradedAt: "2025-11-25T16:00:00Z",
};

export const transaction7: TransactionHistory = {
  id: "tx-7",
  workerId: "worker-1",
  to: "田中一郎",
  from: "みかん里町農協",
  amount: 8500,
  description: "報酬: みかん収穫作業（3回目）",
  tradedAt: "2025-12-01T17:00:00Z",
};

export const transaction8: TransactionHistory = {
  id: "tx-8",
  workerId: "worker-1",
  to: "田中一郎",
  from: "温泉郷旅館組合",
  amount: 8520,
  description: "報酬: 年末大掃除補助",
  tradedAt: "2025-12-10T18:00:00Z",
};

// 支払い（コンビニ等での利用）
export const transaction9: TransactionHistory = {
  id: "tx-9",
  workerId: "worker-1",
  to: "セブンイレブン山形駅前店",
  from: "田中一郎",
  amount: -520,
  description: "コンビニ支払い",
  tradedAt: "2025-12-15T12:30:00Z",
};

export const transaction10: TransactionHistory = {
  id: "tx-10",
  workerId: "worker-1",
  to: "ローソン温泉郷店",
  from: "田中一郎",
  amount: -980,
  description: "コンビニ支払い",
  tradedAt: "2025-12-20T19:00:00Z",
};

// 全取引履歴（初期データ）
// 報酬合計: 8000+7500+9000+6500+8000+7000+8500+8520 = 63020
// 支払い合計: 520+980 = 1500
// 残高: 63020 - 1500 = 61520 + 初期残高20000 = 81520 JPYC
export const transactionHistories: TransactionHistory[] = [
  transaction1,
  transaction2,
  transaction3,
  transaction4,
  transaction5,
  transaction6,
  transaction7,
  transaction8,
  transaction9,
  transaction10,
];

