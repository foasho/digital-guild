import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Job, Worker, WorkerSkill } from "@/types";

/**
 * AIレコメンドの結果
 */
export interface RecommendResult {
  /** マッチ度 (0-1) */
  confidence: number;
  /** マッチ度の理由 */
  reason: string;
}

/**
 * レコメンド生成の入力
 */
export interface RecommendInput {
  /** ジョブ情報 */
  job: Job;
  /** 労働者情報 */
  worker: Worker;
  /** 労働者のスキル一覧 */
  workerSkills: WorkerSkill[];
}

/**
 * 生年月日から年齢を計算する
 */
function calculateAge(birthDateString: string): number {
  const birthDate = new Date(birthDateString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
}

/**
 * ジョブと労働者のマッチング度をGemini AIで評価する
 *
 * @param input - ジョブ情報、労働者情報、労働者のスキル
 * @returns マッチ度と理由
 * @throws GEMINI_API_KEYが設定されていない場合
 */
export async function generateRecommendation(
  input: RecommendInput,
): Promise<RecommendResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  // 年齢計算
  const age = calculateAge(input.worker.birth);

  // スキルマッチング
  const workerSkillNames = input.workerSkills.map((s) => s.name);
  const jobTags = input.job.tags;
  const matchingSkills = jobTags.filter((tag) =>
    workerSkillNames.includes(tag),
  );

  const prompt = `
あなたはジョブマッチングのAIです。以下の情報をもとに、この労働者がこのジョブに適しているかを評価してください。

【ジョブ情報】
- タイトル: ${input.job.title}
- 説明: ${input.job.description}
- 場所: ${input.job.location}
- 必要スキル/タグ: ${jobTags.join(", ")}

【労働者情報】
- 名前: ${input.worker.name}
- 年齢: ${age}歳
- 住所: ${input.worker.address}
- 保有スキル: ${workerSkillNames.length > 0 ? workerSkillNames.join(", ") : "なし"}
- マッチしているスキル: ${matchingSkills.length > 0 ? matchingSkills.join(", ") : "なし"}

以下のJSON形式で回答してください（他の文字は含めないでください）:
{
  "confidence": 0.0から1.0の数値,
  "reason": "マッチ度の理由を日本語で簡潔に"
}
`;

  const result = await model.generateContent(prompt);
  const response = result.response.text();

  // JSONをパース
  const jsonMatch = response.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return { confidence: 0.5, reason: "AI応答の解析に失敗しました" };
  }

  try {
    const parsed = JSON.parse(jsonMatch[0]) as RecommendResult;
    return {
      confidence: Math.max(0, Math.min(1, parsed.confidence)),
      reason: parsed.reason || "理由なし",
    };
  } catch {
    return { confidence: 0.5, reason: "AI応答の解析に失敗しました" };
  }
}
