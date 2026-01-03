"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Button,
  Card,
  CardBody,
  Chip,
  Spinner,
  Modal,
  ModalContent,
  ModalBody,
} from "@heroui/react";
import {
  ArrowLeft,
  CheckCircle,
  Loader2,
  Star,
  User,
  Award,
  Briefcase,
  Users,
  Calendar,
  MapPin,
  X,
  UserCheck,
} from "lucide-react";
import Image from "next/image";
import { defaultWorker, defaultRequester } from "@/constants/mocks";
import {
  useJobs,
  useUndertakedJobs,
  useRequester,
} from "@/hooks/requesters";
import {
  useWorker,
  useTrustPassport,
  useTransactionHistories,
} from "@/hooks/workers";
import type { Rank, UndertakedJob, Worker } from "@/types";

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

export default function UndertakedJobEvaluationPage() {
  const params = useParams();
  const router = useRouter();
  const undertakedJobId = Number(params.undertaked_job_id);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [isHiringComplete, setIsHiringComplete] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<UndertakedJob | null>(null);
  const [isApplicantModalOpen, setIsApplicantModalOpen] = useState(false);

  // hooksからデータ取得
  const { getJobById, pending: jobsPending } = useJobs();
  const { undertakedJobs, getById, updateUndertakedJob, pending: undertakedPending } = useUndertakedJobs();
  const { worker, pending: workerPending } = useWorker();
  const { passport, updateTrustScore, addSkill, pending: passportPending } = useTrustPassport();
  const { addTransaction } = useTransactionHistories();
  const { requester } = useRequester();

  const isHydrated = !jobsPending && !undertakedPending && !workerPending && !passportPending;

  // 対象のUndertakedJob取得
  const undertakedJob = useMemo(() => {
    if (!isHydrated) return undefined;
    return getById(undertakedJobId);
  }, [isHydrated, undertakedJobId, getById]);

  // 対象のJob取得
  const job = useMemo(() => {
    if (!isHydrated || !undertakedJob) return undefined;
    return getJobById(undertakedJob.jobId);
  }, [isHydrated, undertakedJob, getJobById]);

  // 同じジョブに応募している全ての応募者一覧
  const applicants = useMemo(() => {
    if (!isHydrated || !job) return [];
    return undertakedJobs.filter(
      (uj) => uj.jobId === job.id && uj.status === "applied"
    );
  }, [isHydrated, job, undertakedJobs]);

  // Worker情報（モックまたはストア）
  const displayWorker = worker || defaultWorker;

  // TrustScore（モックまたはストア）
  const trustScore = passport?.trustScore ?? 65;
  const rank = calculateRank(trustScore);

  // Requester情報
  const displayRequester = requester || defaultRequester;

  // 応募者を採用する処理
  const handleHire = async (applicantJob: UndertakedJob) => {
    setIsProcessing(true);
    setProcessingStep("応募者を採用中...");

    try {
      await new Promise((r) => setTimeout(r, 500));
      
      // 選択した応募者をacceptedに変更
      updateUndertakedJob(applicantJob.id, {
        status: "accepted",
        acceptedAt: new Date().toISOString(),
      });

      setProcessingStep("他の応募者にお断りを送信中...");
      await new Promise((r) => setTimeout(r, 500));

      // 他の応募者をcanceledに変更
      applicants
        .filter((a) => a.id !== applicantJob.id)
        .forEach((a) => {
          updateUndertakedJob(a.id, {
            status: "canceled",
            canceledAt: new Date().toISOString(),
          });
        });

      setIsApplicantModalOpen(false);
      setIsHiringComplete(true);
    } catch (error) {
      console.error("Error during hiring:", error);
      alert("エラーが発生しました。もう一度お試しください。");
    } finally {
      setIsProcessing(false);
      setProcessingStep("");
    }
  };

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
          addSkill(tag, job.id);
        });
      }

      // Step 3: TrustPassportのtrustScore更新
      setProcessingStep("信用ポイントを更新中...");
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

      // Step 4: 報酬のJPYC振込（TransactionHistory追加で残高自動更新）
      setProcessingStep("報酬を振り込み中...");
      await new Promise((r) => setTimeout(r, 800));
      const totalReward = job.reward + job.aiInsentiveReward;

      // TransactionHistory追加（IDは自動生成）
      addTransaction({
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

  // 採用完了画面
  if (isHiringComplete) {
    return (
      <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
        <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <UserCheck size={48} className="text-indigo-600" />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">採用完了!</h2>
        <p className="text-gray-600 mb-8 max-w-xs mx-auto">
          ワーカーに採用通知が送信されました。作業開始をお待ちください。
        </p>

        <div className="bg-white w-full max-w-xs rounded-2xl p-6 shadow-lg border border-gray-200 mb-8">
          <div className="flex items-center gap-4">
            <div className="shrink-0 w-16 h-16 rounded-full overflow-hidden border-2 border-indigo-200">
              <Image
                src="/avatar4.png"
                alt={displayWorker.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-left">
              <p className="text-lg font-bold text-gray-800">
                {displayWorker.name}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-600">
                  信用ポイント: {Math.floor(trustScore)}
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
        </div>

        <Button
          color="primary"
          className="bg-indigo-500 hover:bg-indigo-600"
          onPress={() => router.push("/requester/dashboard")}
        >
          ダッシュボードへ
        </Button>
      </div>
    );
  }

  // 完了画面（評価完了時）
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
              (内訳: 報酬 {job.reward.toLocaleString()} + 助成金{" "}
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

  // 応募中（applied）の場合は応募者選定画面を表示
  if (undertakedJob.status === "applied") {
    const formatDate = (dateString: string | null) => {
      if (!dateString) return "-";
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${year}年${month}月${day}日`;
    };

    return (
      <div className="max-w-2xl mx-auto">
        {/* ヘッダー */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-800 transition-colors"
            type="button"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">応募者選定</h1>
            <p className="text-sm text-gray-500">
              応募者を確認して採用するワーカーを選んでください
            </p>
          </div>
        </div>

        {/* ジョブ情報カード */}
        <Card className="mb-6 bg-white border border-gray-200 shadow-sm rounded-xl">
          <CardBody className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                <Image
                  src={job.imageUrl || "/jobs/izakaya.jpg"}
                  alt={job.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-800 truncate">{job.title}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                  <MapPin size={14} />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar size={14} />
                  <span>{job.scheduledDate}</span>
                </div>
                <p className="text-indigo-600 font-semibold mt-1">
                  {job.reward.toLocaleString()} JPYC
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* 応募者一覧カード */}
        <Card className="mb-6 bg-white border border-gray-200 shadow-sm rounded-xl">
          <CardBody className="p-6">
            <h2 className="text-sm font-semibold text-gray-500 mb-4 flex items-center gap-2">
              <Users size={16} />
              応募者一覧（{applicants.length}名）
            </h2>

            {applicants.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                まだ応募者がいません
              </div>
            ) : (
              <div className="space-y-3">
                {applicants.map((applicantJob) => (
                  <button
                    key={applicantJob.id}
                    type="button"
                    onClick={() => {
                      setSelectedApplicant(applicantJob);
                      setIsApplicantModalOpen(true);
                    }}
                    className="w-full flex items-center gap-4 p-4 bg-gray-50 hover:bg-indigo-50 rounded-xl cursor-pointer transition-colors border border-gray-100 hover:border-indigo-200 text-left"
                  >
                    <div className="shrink-0 w-14 h-14 rounded-full overflow-hidden border-2 border-gray-200">
                      <Image
                        src="/avatar4.png"
                        alt={displayWorker.name}
                        width={56}
                        height={56}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-800">{displayWorker.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-600">
                          信用ポイント: {Math.floor(trustScore)}
                        </span>
                        <Chip
                          size="sm"
                          className={`${getRankStyle(rank)} font-semibold`}
                          startContent={<Award size={12} />}
                        >
                          {rank}
                        </Chip>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        応募日: {formatDate(applicantJob.appliedAt)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* 応募者詳細モーダル */}
        <Modal
          isOpen={isApplicantModalOpen}
          onClose={() => setIsApplicantModalOpen(false)}
          placement="center"
          size="lg"
          scrollBehavior="inside"
          backdrop="blur"
          classNames={{
            backdrop: "bg-black/50",
            base: "rounded-2xl",
          }}
        >
          <ModalContent>
            {selectedApplicant && (
              <ModalBody className="p-0 bg-white">
                {/* ヘッダー */}
                <div className="relative bg-gradient-to-r from-indigo-500 to-purple-600 p-6 pb-16">
                  <button
                    type="button"
                    onClick={() => setIsApplicantModalOpen(false)}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                  >
                    <X size={18} />
                  </button>
                  <h2 className="text-lg font-bold text-white">応募者詳細</h2>
                </div>

                {/* プロフィール */}
                <div className="relative -mt-12 px-6">
                  <div className="flex items-end gap-4">
                    <div className="shrink-0 w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                      <Image
                        src="/avatar4.png"
                        alt={displayWorker.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 pb-2">
                      <p className="text-xl font-bold text-gray-800">
                        {displayWorker.name}
                      </p>
                      <p className="text-sm text-gray-500">{displayWorker.address}</p>
                    </div>
                  </div>
                </div>

                {/* Trust Passport */}
                <div className="px-6 py-4">
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
                    <h3 className="text-sm font-semibold text-indigo-600 mb-3 flex items-center gap-2">
                      <Award size={16} />
                      Trust Passport
                    </h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-3xl font-bold text-gray-800">
                          {Math.floor(trustScore)}
                        </p>
                        <p className="text-xs text-gray-500">信用ポイント</p>
                      </div>
                      <Chip
                        size="lg"
                        className={`${getRankStyle(rank)} font-bold px-4`}
                        startContent={<Award size={16} />}
                      >
                        {rank}
                      </Chip>
                    </div>
                  </div>
                </div>

                {/* 応募情報 */}
                <div className="px-6 pb-4">
                  <h3 className="text-sm font-semibold text-gray-600 mb-3">
                    応募情報
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">応募日</span>
                      <span className="text-gray-800 font-medium">
                        {formatDate(selectedApplicant.appliedAt)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">年齢</span>
                      <span className="text-gray-800 font-medium">
                        {displayWorker.birth ? `${new Date().getFullYear() - new Date(displayWorker.birth).getFullYear()}歳` : "-"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">性別</span>
                      <span className="text-gray-800 font-medium">
                        {displayWorker.gender || "-"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 過去の実績 */}
                <div className="px-6 pb-4">
                  <h3 className="text-sm font-semibold text-gray-600 mb-3">
                    過去の実績
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                      <p className="text-2xl font-bold text-indigo-600">
                        {undertakedJobs.filter((uj) => uj.status === "completed").length}
                      </p>
                      <p className="text-xs text-gray-500">完了ジョブ</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                      <p className="text-2xl font-bold text-amber-500">
                        {(() => {
                          const completed = undertakedJobs.filter(
                            (uj) => uj.status === "completed" && uj.requesterEvalScore !== null
                          );
                          if (completed.length === 0) return "-";
                          const avg =
                            completed.reduce((sum, uj) => sum + (uj.requesterEvalScore || 0), 0) /
                            completed.length;
                          return avg.toFixed(1);
                        })()}
                      </p>
                      <p className="text-xs text-gray-500">平均評価</p>
                    </div>
                  </div>
                </div>

                {/* 採用ボタン */}
                <div className="px-6 pb-6">
                  <Button
                    fullWidth
                    size="lg"
                    color="primary"
                    className="bg-indigo-600 hover:bg-indigo-700 font-bold rounded-xl text-white"
                    startContent={<UserCheck size={20} />}
                    onPress={() => handleHire(selectedApplicant)}
                    isLoading={isProcessing}
                  >
                    この応募者を採用する
                  </Button>
                </div>
              </ModalBody>
            )}
          </ModalContent>
        </Modal>
      </div>
    );
  }

  // メイン画面（completion_reportedの場合の評価画面）
  return (
    <div className="max-w-2xl mx-auto">
      {/* ヘッダー */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-800 transition-colors"
          type="button"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-800">作業評価</h1>
          <p className="text-sm text-gray-500">完了報告の確認と評価</p>
        </div>
      </div>

      {/* 労働者情報カード */}
      <Card className="mb-6 bg-white border border-gray-200 shadow-sm rounded-xl">
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
                  信用ポイント:{" "}
                  <span className="font-semibold text-gray-800">
                    {Math.floor(trustScore)}
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
      <Card className="mb-6 bg-white border border-gray-200 shadow-sm rounded-xl">
        <CardBody className="p-6">
          <h2 className="text-sm font-semibold text-gray-500 mb-4 flex items-center gap-2">
            <Briefcase size={16} />
            ジョブ情報
          </h2>

          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-800 mb-1">{job.title}</h3>
            <p className="text-sky-600 font-semibold">
              {(job.reward)} JPYC
              {job.aiInsentiveReward > 0 && (
                <span className="text-xs text-gray-400 font-normal ml-2">
                  (報酬 {job.reward.toLocaleString()} + 助成金{" "}
                  {job.aiInsentiveReward.toLocaleString()})
                </span>
              )}
            </p>
          </div>

          {/* 完了報告内容（チェックリスト） */}
          {job.checklist && job.checklist.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-600 mb-3">
                作業チェックリスト
              </h4>
              <div className="space-y-2">
                {job.checklist.map((item, index) => {
                  // 労働者が完了したチェックリスト項目かどうか
                  const isCompleted = undertakedJob.completedChecklistIds?.includes(item.id) ?? false;
                  return (
                    <div
                      key={item.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border ${
                        isCompleted
                          ? "bg-green-50 border-green-200"
                          : "bg-gray-50 border-gray-100"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          isCompleted ? "bg-green-500" : "bg-gray-300"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle size={14} className="text-white" />
                        ) : (
                          <span className="text-white text-xs">{index + 1}</span>
                        )}
                      </div>
                      <span
                        className={`text-sm ${
                          isCompleted ? "text-gray-700" : "text-gray-400"
                        }`}
                      >
                        {item.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 労働者のメモ */}
          {undertakedJob.completionMemo && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-600 mb-3">
                労働者からのメモ
              </h4>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-gray-700 text-sm whitespace-pre-wrap">
                  {undertakedJob.completionMemo}
                </p>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {/* 星評価カード */}
      <Card className="mb-6 bg-white border border-gray-200 shadow-sm rounded-xl">
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
          className="bg-sky-500 hover:bg-sky-600 font-semibold px-8 rounded-xl"
          onPress={handleApprove}
          isDisabled={rating === 0}
          startContent={<CheckCircle size={20} />}
        >
          評価を確定する
        </Button>
      </div>
    </div>
  );
}
