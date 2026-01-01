import { NextRequest, NextResponse } from "next/server";
import { generateRecommendation } from "@/lib/gemini/recommend";
import { jobs } from "@/constants/mocks/jobs";
import { defaultWorker, workers } from "@/constants/mocks/workers";
import type { JobAiRecommend } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobId } = body;

    if (!jobId) {
      return NextResponse.json({ error: "jobId is required" }, { status: 400 });
    }

    // ジョブ情報取得（モックデータから）
    const job = jobs.find((j) => j.id === jobId);
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // 全労働者に対してレコメンド生成
    const recommendations: JobAiRecommend[] = [];
    const allWorkers = [
      defaultWorker,
      ...workers.filter((w) => w.id !== defaultWorker.id),
    ];

    for (const worker of allWorkers) {
      try {
        // モックでは workerSkills は空配列として扱う
        const result = await generateRecommendation({
          job,
          worker,
          workerSkills: [],
        });

        // confidence >= 0.7 の場合のみ保存
        if (result.confidence >= 0.7) {
          const recommend: JobAiRecommend = {
            id: `recommend-${Date.now()}-${worker.id}`,
            jobId: job.id,
            workerId: worker.id,
            confidence: result.confidence,
            reason: result.reason,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          recommendations.push(recommend);
        }
      } catch (error) {
        console.error(
          `Failed to generate recommendation for worker ${worker.id}:`,
          error,
        );
        // 個別のエラーはスキップして続行
      }
    }

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error("AI Recommend API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
