"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Card, CardBody, Chip, Spinner } from "@heroui/react";
import {
  ArrowLeft,
  CheckCircle,
  Loader2,
  Star,
  User,
  Award,
  Briefcase,
} from "lucide-react";
import Image from "next/image";
import {
  useUndertakedJobStore,
  useJobStore,
  useWorkerStore,
  useTrustPassportStore,
  useWalletStore,
  useRequesterStore,
} from "@/stores";
import { jobs as mockJobs, defaultWorker, defaultRequester } from "@/constants/mocks";
import type { Rank, WorkerSkill } from "@/types";

// ランク計算
const calculateRank = (score: number): Rank => {
  if (score >= 90) return "Platinum";
  if (score >= 80) return "Gold";
  if (score >= 70) return "Silver";
  return "Bronze";
};

// ランクに応じたスタイル
const getRankStyle = (rank: Rank) => {
  switch (rank) {
    case "Platinum":
      return "bg-gradient-to-r from-gray-300 to-gray-100 text-gray-800";
    case "Gold":
      return "bg-gradient-to-r from-amber-400 to-amber-300 text-amber-900";
    case "Silver":
      return "bg-gradient-to-r from-gray-400 to-gray-300 text-gray-800";
    case "Bronze":
      return "bg-gradient-to-r from-orange-400 to-orange-300 text-orange-900";
  }
};

// ID生成
const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

export default function UndertakedJobEvaluationPage() {
  const params = useParams();
  const router = useRouter();
  const undertakedJobId = params.undertaked_job_id as string;

  const [isHydrated, setIsHydrated] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);

  // ストア
  const undertakedJobs = useUndertakedJobStore((state) => state.undertakedJobs);
  const getById = useUndertakedJobStore((state) => state.getById);
  const updateUndertakedJob = useUndertakedJobStore(
    (state) => state.updateUndertakedJob
  );

  const storeJobs = useJobStore((state) => state.jobs);
  const getJobById = useJobStore((state) => state.getJobById);

  const worker = useWorkerStore((state) => state.worker);
  const updateBalance = useWorkerStore((state) => state.updateBalance);

  const passport = useTrustPassportStore((state) => state.passport);
  const updateTrustScore = useTrustPassportStore(
    (state) => state.updateTrustScore
  );
  const addSkill = useTrustPassportStore((state) => state.addSkill);

  const addTransaction = useWalletStore((state) => state.addTransaction);

  const requester = useRequesterStore((state) => state.requester);

  // Hydration
  useEffect(() => {
    useUndertakedJobStore.persist.rehydrate();
    useJobStore.persist.rehydrate();
    useWorkerStore.persist.rehydrate();
    useTrustPassportStore.persist.rehydrate();
    useWalletStore.persist.rehydrate();
    useRequesterStore.persist.rehydrate();
    setIsHydrated(true);
  }, []);

  // 対象のUndertakedJob取得
  const undertakedJob = useMemo(() => {
    if (!isHydrated) return undefined;
    return getById(undertakedJobId);
  }, [isHydrated, undertakedJobId, getById]);

  // 対象のJob取得
  const job = useMemo(() => {
    if (!isHydrated || !undertakedJob) return undefined;
    // まずストアから検索、なければモックから
    const storeJob = getJobById(undertakedJob.jobId);
    if (storeJob) return storeJob;
    return mockJobs.find((j) => j.id === undertakedJob.jobId);
  }, [isHydrated, undertakedJob, getJobById, storeJobs]);

  // Worker情報（モックまたはストア）
  const displayWorker = worker || defaultWorker;

  // TrustScore（モックまたはストア）
  const trustScore = passport?.trustScore ?? 65;
  const rank = calculateRank(trustScore);

  // Requester情報
  const displayRequester = requester || defaultRequester;

  // 承認処理
  const handleApprove = async () => {
    if (rating === 0) {
      alert("評価を選択してください");
      return;
    }

    if (!undertakedJob || !job) {
      alert("データの取得に失敗しました");
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: UndertakedJobのrequesterEvalScore更新
      setProcessingStep("評価を保存中...");
      await new Promise((r) => setTimeout(r, 500));
      updateUndertakedJob(undertakedJobId, {
        requesterEvalScore: rating,
        status: "completed",
        finishedAt: new Date().toISOString(),
      });

      // Step 2: WorkerSkill追加（ジョブのタグからスキルを追加）
      setProcessingStep("スキルを付与中...");
      await new Promise((r) => setTimeout(r, 500));
      if (job.tags && job.tags.length > 0) {
        job.tags.forEach((tag) => {
          const newSkill: WorkerSkill = {
            id: generateId(),
            workerId: displayWorker.id,
            name: tag,
            createdAt: new Date().toISOString(),
            jobId: job.id,
          };
          addSkill(newSkill);
        });
      }

      // Step 3: TrustPassportのtrustScore更新
      setProcessingStep("Trust Scoreを更新中...");
      await new Promise((r) => setTimeout(r, 500));
      // 完了したジョブを再取得（今回の完了を含む）
      const completedCount = Math.min(
        50,
        undertakedJobs.filter((j) => j.status === "completed").length + 1
      );
      // 評価の平均値計算（今回の評価を含む）
      const completedWithEval = undertakedJobs.filter(
        (j) => j.status === "completed" && j.requesterEvalScore !== null
      );
      const totalEvalScore =
        completedWithEval.reduce((sum, j) => sum + (j.requesterEvalScore || 0), 0) +
        rating;
      const evalCount = completedWithEval.length + 1;
      const avgEvalScore = totalEvalScore / evalCount;
      const newTrustScore = Math.min(100, completedCount + avgEvalScore * 10);
      updateTrustScore(newTrustScore);

      // Step 4: 報酬のJPYC振込（Workerの残高増加）
      setProcessingStep("報酬を振り込み中...");
      await new Promise((r) => setTimeout(r, 800));
      const totalReward = job.reward + job.aiInsentiveReward;
      updateBalance(totalReward);

      // Step 5: TransactionHistory追加
      setProcessingStep("取引履歴を記録中...");
      await new Promise((r) => setTimeout(r, 500));
      addTransaction({
        id: generateId(),
        workerId: displayWorker.id,
        to: displayWorker.name,
        from: displayRequester.name,
        amount: totalReward,
        description: `報酬: ${job.title}`,
        tradedAt: new Date().toISOString(),
      });

      setIsCompleted(true);
    } catch (error) {
      console.error("Error during approval:", error);
      alert("エラーが発生しました。もう一度お試しください。");
    } finally {
      setIsProcessing(false);
      setProcessingStep("");
    }
  };

  // ローディング中
  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  // データが見つからない場合
  if (!undertakedJob || !job) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500 mb-4">データが見つかりません</p>
        <Button
          variant="bordered"
          className="border-gray-300 text-gray-600"
          onPress={() => router.push("/requester/dashboard")}
          startContent={<ArrowLeft size={18} />}
        >
          ダッシュボードへ戻る
        </Button>
      </div>
    );
  }

  // 処理中オーバーレイ
  if (isProcessing) {
    return (
      <div className="fixed inset-0 bg-gray-900/95 z-50 flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-full border-4 border-sky-500/30 border-t-sky-500 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 size={32} className="text-sky-400 animate-pulse" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2">処理中...</h2>
        <p className="text-gray-300 mb-8 h-6">{processingStep}</p>
      </div>
    );
  }

  // 完了画面
  if (isCompleted) {
    const totalReward = job.reward + job.aiInsentiveReward;
    return (
      <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
        <div className="w-24 h-24 bg-sky-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <CheckCircle size={48} className="text-sky-600" />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">承認完了!</h2>
        <p className="text-gray-600 mb-8 max-w-xs mx-auto">
          作業が正常に完了し、労働者に報酬が支払われました。
        </p>

        <div className="bg-white w-full max-w-xs rounded-2xl p-6 shadow-lg border border-gray-200 mb-8">
          <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">
            支払い金額
          </p>
          <div className="flex items-center justify-center text-sky-600 font-bold text-3xl">
            {totalReward.toLocaleString()}{" "}
            <span className="text-lg ml-1">JPYC</span>
          </div>
          {job.aiInsentiveReward > 0 && (
            <p className="text-xs text-gray-400 mt-2">
              (内訳: 報酬 {job.reward.toLocaleString()} + AI補助{" "}
              {job.aiInsentiveReward.toLocaleString()} JPYC)
            </p>
          )}
        </div>

        <Button
          color="primary"
          className="bg-sky-500 hover:bg-sky-600"
          onPress={() => router.push("/requester/dashboard")}
        >
          ダッシュボードへ
        </Button>
      </div>
    );
  }

  // メイン画面
  return (
    <div className="max-w-2xl mx-auto">
      {/* ヘッダー */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-800">作業評価</h1>
          <p className="text-sm text-gray-500">完了報告の確認と評価</p>
        </div>
      </div>

      {/* 労働者情報カード */}
      <Card className="mb-6 bg-white border border-gray-200 shadow-sm">
        <CardBody className="p-6">
          <h2 className="text-sm font-semibold text-gray-500 mb-4 flex items-center gap-2">
            <User size={16} />
            労働者情報
          </h2>

          <div className="flex items-center gap-4">
            {/* アバター */}
            <div className="shrink-0 w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
              <Image
                src="/avatar4.png"
                alt={displayWorker.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>

            {/* 名前とスコア */}
            <div className="flex-1">
              <p className="text-lg font-bold text-gray-800">
                {displayWorker.name}
              </p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm text-gray-600">
                  Trust Score:{" "}
                  <span className="font-semibold text-gray-800">
                    {trustScore}
                  </span>
                </span>
                <Chip
                  size="sm"
                  className={`${getRankStyle(rank)} font-semibold`}
                  startContent={<Award size={12} />}
                >
                  {rank}
                </Chip>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* ジョブ情報カード */}
      <Card className="mb-6 bg-white border border-gray-200 shadow-sm">
        <CardBody className="p-6">
          <h2 className="text-sm font-semibold text-gray-500 mb-4 flex items-center gap-2">
            <Briefcase size={16} />
            ジョブ情報
          </h2>

          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-800 mb-1">{job.title}</h3>
            <p className="text-sky-600 font-semibold">
              {(job.reward + job.aiInsentiveReward).toLocaleString()} JPYC
              {job.aiInsentiveReward > 0 && (
                <span className="text-xs text-gray-400 font-normal ml-2">
                  (報酬 {job.reward.toLocaleString()} + AI補助{" "}
                  {job.aiInsentiveReward.toLocaleString()})
                </span>
              )}
            </p>
          </div>

          {/* 完了報告内容（チェックリスト） */}
          {job.checklist && job.checklist.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-600 mb-3">
                完了報告内容
              </h4>
              <div className="space-y-2">
                {job.checklist.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                      <CheckCircle size={14} className="text-white" />
                    </div>
                    <span className="text-gray-700 text-sm">
                      {index + 1}. {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {/* 星評価カード */}
      <Card className="mb-6 bg-white border border-gray-200 shadow-sm">
        <CardBody className="p-6">
          <h2 className="text-sm font-semibold text-gray-500 mb-4 flex items-center gap-2">
            <Star size={16} />
            作業評価
          </h2>

          <p className="text-gray-600 text-sm mb-4">
            労働者の作業を1〜5の星で評価してください
          </p>

          {/* 星評価 */}
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform hover:scale-110 focus:outline-none"
              >
                <Star
                  size={40}
                  className={`${
                    star <= (hoverRating || rating)
                      ? "text-amber-400 fill-amber-400"
                      : "text-gray-300"
                  } transition-colors`}
                />
              </button>
            ))}
          </div>

          {rating > 0 && (
            <p className="text-center text-gray-600 mt-3">
              {rating === 5 && "素晴らしい!"}
              {rating === 4 && "とても良い"}
              {rating === 3 && "普通"}
              {rating === 2 && "やや不満"}
              {rating === 1 && "不満"}
            </p>
          )}
        </CardBody>
      </Card>

      {/* 承認ボタン */}
      <div className="flex justify-end">
        <Button
          color="primary"
          size="lg"
          className="bg-sky-500 hover:bg-sky-600 font-semibold px-8"
          onPress={handleApprove}
          isDisabled={rating === 0}
          startContent={<CheckCircle size={20} />}
        >
          承認する
        </Button>
      </div>
    </div>
  );
}
