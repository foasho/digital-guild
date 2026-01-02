/**
 * モック用ユーティリティ関数
 */

/**
 * AIインセンティブ計算（モック）
 * - Subsidies残高の0.05%が付与される
 * - ただし、報酬額の50%を超えてはいけない
 *
 * @param subsidyBalance - 補助金残高
 * @param rewardAmount - 報酬額
 * @returns 計算されたインセンティブ額
 */
export const calculateAiIncentive = (
  subsidyBalance: number,
  rewardAmount: number
): number => {
  if (rewardAmount <= 0 || subsidyBalance <= 0) {
    return 0;
  }

  // 補助金残高の0.05%
  const baseIncentive = subsidyBalance * 0.0005;

  // 報酬額の50%が上限
  const maxIncentive = rewardAmount * 0.5;

  // 小数点以下を切り捨て
  return Math.floor(Math.min(baseIncentive, maxIncentive));
};

/**
 * AIインセンティブ計算の処理ステップ
 */
export type AiIncentiveStep =
  | "idle"
  | "analyzing"
  | "calculating"
  | "finalizing"
  | "complete";

/**
 * AIインセンティブ計算のステップメッセージ
 */
export const AI_INCENTIVE_STEP_MESSAGES: Record<AiIncentiveStep, string> = {
  idle: "",
  analyzing: "内容からインセンティブを考慮しています...",
  calculating: "割合を算出しています...",
  finalizing: "決定中...",
  complete: "決定",
};

/**
 * AIインセンティブ計算のモック処理
 * 各ステップで指定時間待機し、コールバックを呼び出す
 *
 * @param onStepChange - ステップ変更時のコールバック
 * @param onComplete - 計算完了時のコールバック
 * @param subsidyBalance - 補助金残高
 * @param rewardAmount - 報酬額
 */
export const simulateAiIncentiveCalculation = async (
  onStepChange: (step: AiIncentiveStep) => void,
  onComplete: (incentive: number) => void,
  subsidyBalance: number,
  rewardAmount: number
): Promise<void> => {
  // Step 1: 分析中 (1秒)
  onStepChange("analyzing");
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Step 2: 計算中 (1秒)
  onStepChange("calculating");
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Step 3: 決定中 (0.5秒)
  onStepChange("finalizing");
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Step 4: 完了
  const incentive = calculateAiIncentive(subsidyBalance, rewardAmount);
  onStepChange("complete");
  onComplete(incentive);
};

