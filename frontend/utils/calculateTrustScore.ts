import type { Rank, UndertakedJob } from "@/types";

/**
 * Trust Scoreを計算
 *
 * 計算ロジック:
 * - クエスト達成数: 1クエスト = 1ポイント、最大50ポイント
 * - 人間評価: 評価（1-5）の平均値 x 10、最大50ポイント
 * - 合計: 最大100ポイント
 *
 * @param completedJobs - 着手ジョブの配列
 * @returns Trust Score（0-100）
 */
export function calculateTrustScore(completedJobs: UndertakedJob[]): number {
  // 完了したジョブのみをフィルタリング
  const completed = completedJobs.filter((job) => job.status === "completed");

  // クエスト達成数ポイント（最大50）
  const questPoints = Math.min(completed.length, 50);

  // 人間評価の平均値を計算
  const evaluations = completed
    .map((job) => job.requesterEvalScore)
    .filter((score): score is number => score !== null);

  const avgEval =
    evaluations.length > 0
      ? evaluations.reduce((sum, score) => sum + score, 0) / evaluations.length
      : 0;

  // 人間評価ポイント（平均 x 10、最大50）
  const evalPoints = Math.min(avgEval * 10, 50);

  // 合計（最大100）
  return Math.min(Math.floor(questPoints + evalPoints), 100);
}

/**
 * Trust Scoreからランクを取得
 *
 * ランク閾値:
 * - ~60: Bronze
 * - 61~70: Silver
 * - 71~80: Gold
 * - 81~100: Platinum
 *
 * @param trustScore - Trust Score（0-100）
 * @returns ランク
 */
export function getRankFromScore(trustScore: number): Rank {
  if (trustScore > 80) return "Platinum";
  if (trustScore > 70) return "Gold";
  if (trustScore > 60) return "Silver";
  return "Bronze";
}
