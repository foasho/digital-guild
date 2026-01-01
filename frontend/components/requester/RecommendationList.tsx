"use client";

import {
  Accordion,
  AccordionItem,
  Avatar,
  Button,
  Card,
  CardBody,
  Progress,
  Spinner,
} from "@heroui/react";
import { ChevronDown, Sparkles, Wand2 } from "lucide-react";
import { defaultWorker } from "@/constants/mocks";
import type { JobAiRecommend, Rank } from "@/types";

interface RecommendationListProps {
  recommendations: JobAiRecommend[];
  onGenerateRecommendations?: () => Promise<void>;
  isLoading?: boolean;
}

// ランク計算関数
const calculateRank = (score: number): Rank => {
  if (score >= 90) return "Platinum";
  if (score >= 80) return "Gold";
  if (score >= 70) return "Silver";
  return "Bronze";
};

// ランクに応じたグラデーションカラー
const rankColors: Record<Rank, string> = {
  Bronze: "from-amber-600 to-amber-800",
  Silver: "from-gray-400 to-gray-600",
  Gold: "from-yellow-400 to-yellow-600",
  Platinum: "from-cyan-400 to-cyan-600",
};

// confidence に応じた色を取得
const getConfidenceColor = (
  confidence: number,
): "success" | "warning" | "danger" => {
  if (confidence >= 0.7) return "success"; // 緑
  if (confidence >= 0.4) return "warning"; // 黄
  return "danger"; // 赤
};

// confidence に応じたテキストカラー
const getConfidenceTextColor = (confidence: number): string => {
  if (confidence >= 0.7) return "text-green-600";
  if (confidence >= 0.4) return "text-yellow-600";
  return "text-red-600";
};

// モック用Trust Score (ワーカーIDに基づくシンプルなハッシュ)
const getMockTrustScore = (workerId: string): number => {
  const hash = workerId
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return 50 + (hash % 50); // 50-99の範囲
};

export function RecommendationList({
  recommendations,
  onGenerateRecommendations,
  isLoading = false,
}: RecommendationListProps) {
  // レコメンドがない場合
  if (recommendations.length === 0) {
    return (
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardBody className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={20} className="text-purple-500" />
            <h3 className="font-bold text-gray-800">この人にオススメ</h3>
          </div>

          <div className="bg-purple-50 border border-purple-100 rounded-lg p-6 text-center">
            {isLoading ? (
              <div className="flex flex-col items-center gap-3">
                <Spinner color="secondary" size="lg" />
                <p className="text-gray-600 text-sm">
                  AIがレコメンドを生成中です...
                </p>
              </div>
            ) : (
              <>
                <Wand2 size={32} className="mx-auto mb-3 text-purple-400" />
                <p className="text-gray-600 text-sm mb-4">
                  AIがこのジョブに適した労働者をレコメンドします
                </p>
                {onGenerateRecommendations && (
                  <Button
                    color="secondary"
                    className="bg-purple-500 hover:bg-purple-600 text-white"
                    startContent={<Sparkles size={16} />}
                    onPress={onGenerateRecommendations}
                  >
                    AIレコメンドを生成
                  </Button>
                )}
              </>
            )}
          </div>
        </CardBody>
      </Card>
    );
  }

  // レコメンドがある場合
  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardBody className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-purple-500" />
            <h3 className="font-bold text-gray-800">この人にオススメ</h3>
          </div>
          <span className="text-sm text-gray-500">
            {recommendations.length}名
          </span>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <Spinner color="secondary" size="lg" />
            <p className="text-gray-600 text-sm">
              AIがレコメンドを生成中です...
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recommendations.map((recommendation) => {
              // モックの労働者情報を使用
              const worker = defaultWorker;
              const trustScore = getMockTrustScore(recommendation.workerId);
              const rank = calculateRank(trustScore);
              const confidencePercent = Math.round(
                recommendation.confidence * 100,
              );

              return (
                <Card
                  key={recommendation.id}
                  className="bg-gray-50 border border-gray-100"
                >
                  <CardBody className="p-4">
                    {/* 労働者情報 */}
                    <div className="flex items-center gap-3 mb-3">
                      {/* アバター */}
                      <Avatar
                        src="/avatar4.png"
                        alt={worker.name}
                        size="md"
                        className="shrink-0"
                      />

                      {/* 名前とランク */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-gray-800">
                            {worker.name}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium text-white bg-gradient-to-r ${rankColors[rank]}`}
                          >
                            {rank}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          Trust Score: {trustScore}
                        </div>
                      </div>
                    </div>

                    {/* Confidence プログレスバー */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">マッチ度</span>
                        <span
                          className={`text-sm font-bold ${getConfidenceTextColor(recommendation.confidence)}`}
                        >
                          {confidencePercent}%
                        </span>
                      </div>
                      <Progress
                        value={confidencePercent}
                        color={getConfidenceColor(recommendation.confidence)}
                        size="sm"
                        className="h-2"
                        aria-label={`マッチ度: ${confidencePercent}%`}
                      />
                    </div>

                    {/* Reason アコーディオン */}
                    <Accordion
                      isCompact
                      className="px-0"
                      itemClasses={{
                        base: "py-0",
                        title: "text-sm text-gray-600",
                        trigger: "py-2 px-0 data-[hover=true]:bg-transparent",
                        indicator: "text-gray-400",
                        content: "pt-0 pb-2 px-0",
                      }}
                    >
                      <AccordionItem
                        key="reason"
                        aria-label="レコメンド理由"
                        title="レコメンド理由を見る"
                        indicator={({ isOpen }) => (
                          <ChevronDown
                            size={16}
                            className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                          />
                        )}
                      >
                        <div className="bg-white border border-gray-100 rounded-lg p-3">
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {recommendation.reason}
                          </p>
                        </div>
                      </AccordionItem>
                    </Accordion>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}

        {/* 再生成ボタン (レコメンドがある場合) */}
        {!isLoading && onGenerateRecommendations && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Button
              variant="light"
              color="secondary"
              size="sm"
              startContent={<Sparkles size={14} />}
              onPress={onGenerateRecommendations}
              className="w-full"
            >
              レコメンドを再生成
            </Button>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
