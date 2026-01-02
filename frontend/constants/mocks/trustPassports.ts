import type { TrustPassport } from "@/types";

// デフォルトの信用ポイント（undertakedJobsから算出: 完了8件 + 評価平均4.25*10 = 50.5 → 50）
export const defaultTrustPassport: TrustPassport = {
  id: "passport-1",
  workerId: "worker-1",
  trustScore: 50,
};

export const trustPassports: TrustPassport[] = [defaultTrustPassport];

