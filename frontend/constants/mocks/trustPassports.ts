import type { TrustPassport } from "@/types";

// デフォルトの信用ポイント（undertakedJobsから算出）
// 完了25件: 評価合計 108, 平均 = 4.32 ≈ 4.3
// 信用ポイント = min(50, 25) + round(4.32 * 10) = 25 + 43 = 68
export const defaultTrustPassport: TrustPassport = {
  id: 1,
  workerId: 1,
  trustScore: 68,
  balance: 81520,
};

export const trustPassports: TrustPassport[] = [defaultTrustPassport];
