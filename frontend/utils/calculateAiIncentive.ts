/**
 * AIインセンティブ報酬を計算
 *
 * ロジック:
 * - 補助金の0.5%を基準とする
 * - ただし、報酬の50%を上限とする
 *
 * @param subsidyAmount - 補助金額（円）
 * @param jobReward - ジョブの報酬（円）
 * @returns AIインセンティブ報酬（円）
 *
 * @example
 * // 補助金の0.5%が上限以下の場合
 * calculateAiIncentive(1_200_000, 20_000) // => 6,000円（補助金の0.5%）
 *
 * @example
 * // 報酬の50%が上限となる場合
 * calculateAiIncentive(1_200_000, 12_000) // => 6,000円（報酬の50%）
 */
export function calculateAiIncentive(
  subsidyAmount: number,
  jobReward: number
): number {
  // 補助金の0.5%
  const baseIncentive = subsidyAmount * 0.005;

  // 報酬の50%を上限
  const maxIncentive = jobReward * 0.5;

  // 小さい方を返す（整数に丸める）
  return Math.floor(Math.min(baseIncentive, maxIncentive));
}
