"use client";

import { Card, CardBody, Chip, Divider } from "@heroui/react";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  Tag,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { jobs as mockJobs, workers as mockWorkers } from "@/constants/mocks";
import { useJobStore, useUndertakedJobStore, useWorkerStore } from "@/stores";
import type { Rank, UndertakedJob, Worker } from "@/types";

// ランク計算関数
const calculateRank = (score: number): Rank => {
  if (score >= 90) return "Platinum";
  if (score >= 80) return "Gold";
  if (score >= 70) return "Silver";
  return "Bronze";
};

// ランクに応じたスタイルを取得
const getRankStyle = (rank: Rank) => {
  switch (rank) {
    case "Platinum":
      return "bg-gradient-to-r from-slate-400 to-slate-200 text-slate-800";
    case "Gold":
      return "bg-gradient-to-r from-amber-400 to-amber-200 text-amber-800";
    case "Silver":
      return "bg-gradient-to-r from-gray-400 to-gray-200 text-gray-700";
    case "Bronze":
      return "bg-gradient-to-r from-orange-400 to-orange-200 text-orange-800";
  }
};

// UndertakedJobのステータスに応じたスタイルを取得
const getStatusStyle = (status: UndertakedJob["status"]) => {
  switch (status) {
    case "accepted":
      return { label: "承認済み", style: "bg-sky-100 text-sky-700" };
    case "in_progress":
      return { label: "作業中", style: "bg-amber-100 text-amber-700" };
    case "completed":
      return { label: "完了", style: "bg-green-100 text-green-700" };
    case "canceled":
      return { label: "キャンセル", style: "bg-gray-100 text-gray-500" };
  }
};

// 日付フォーマット
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
};

// モック用Trust Score (ワーカーIDに基づくシンプルなハッシュ)
const getMockTrustScore = (workerId: string): number => {
  const hash = workerId
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return 50 + (hash % 50); // 50-99の範囲
};

export default function RequesterJobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.job_id as string;

  const [isHydrated, setIsHydrated] = useState(false);

  // ストアからデータ取得
  const jobs = useJobStore((state) => state.jobs);
  const undertakedJobs = useUndertakedJobStore((state) => state.undertakedJobs);
  const storeWorker = useWorkerStore((state) => state.worker);

  // Hydration
  useEffect(() => {
    useJobStore.persist.rehydrate();
    useUndertakedJobStore.persist.rehydrate();
    useWorkerStore.persist.rehydrate();
    setIsHydrated(true);
  }, []);

  // ジョブを取得 (ストア優先、なければモック)
  const job = useMemo(() => {
    if (!isHydrated) {
      return mockJobs.find((j) => j.id === jobId);
    }
    const storeJob = jobs.find((j) => j.id === jobId);
    if (storeJob) return storeJob;
    return mockJobs.find((j) => j.id === jobId);
  }, [isHydrated, jobId, jobs]);

  // このジョブに対する応募者(undertakedJobs)を取得
  const applicants = useMemo(() => {
    if (!isHydrated) return [];
    return undertakedJobs.filter(
      (uj) => uj.jobId === jobId && uj.status !== "canceled",
    );
  }, [isHydrated, undertakedJobs, jobId]);

  // ワーカー情報を取得する関数
  const getWorkerInfo = (workerId: string): Worker | undefined => {
    // ストアのワーカーと一致する場合
    if (storeWorker && storeWorker.id === workerId) {
      return storeWorker;
    }
    // モックワーカーから検索
    return mockWorkers.find((w) => w.id === workerId);
  };

  if (!job) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500 mb-4">ジョブが見つかりません</p>
        <button
          type="button"
          onClick={() => router.push("/requester/dashboard")}
          className="text-sky-600 hover:text-sky-700 font-medium"
        >
          ダッシュボードに戻る
        </button>
      </div>
    );
  }

  const totalReward = job.reward + job.aiInsentiveReward;

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* ヘッダー with 戻るボタン */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="戻る"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-lg font-bold text-gray-800 truncate">
            ジョブ詳細
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* メイン画像 */}
        <div className="relative w-full h-48 md:h-64 rounded-xl overflow-hidden mb-6 bg-gray-200">
          <Image
            src={job.imageUrl}
            alt={job.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* ジョブ基本情報 */}
        <Card className="bg-white border border-gray-200 shadow-sm mb-6">
          <CardBody className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              {job.title}
            </h2>

            {/* タグ */}
            {job.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {job.tags.map((tag) => (
                  <Chip
                    key={tag}
                    size="sm"
                    variant="flat"
                    className="bg-gray-100 text-gray-600"
                    startContent={<Tag size={12} />}
                  >
                    {tag}
                  </Chip>
                ))}
              </div>
            )}

            {/* 報酬情報 */}
            <div className="bg-sky-50 border border-sky-100 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">基本報酬</span>
                <span className="font-bold text-gray-800">
                  {job.reward.toLocaleString()} JPYC
                </span>
              </div>
              {job.aiInsentiveReward > 0 && (
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-600 text-sm flex items-center gap-1">
                    <Sparkles size={14} className="text-purple-500" />
                    AIインセンティブ
                  </span>
                  <span className="font-bold text-purple-600">
                    +{job.aiInsentiveReward.toLocaleString()} JPYC
                  </span>
                </div>
              )}
              <Divider className="my-2" />
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">合計報酬</span>
                <span className="font-bold text-sky-600 text-lg">
                  {totalReward.toLocaleString()} JPYC
                </span>
              </div>
            </div>

            {/* 場所・日時・定員 */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin size={18} className="text-gray-400 shrink-0" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Calendar size={18} className="text-gray-400 shrink-0" />
                <span>{formatDate(job.scheduledDate)}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Users size={18} className="text-gray-400 shrink-0" />
                <span>定員: {job.capacity}名</span>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* 説明 */}
        <Card className="bg-white border border-gray-200 shadow-sm mb-6">
          <CardBody className="p-6">
            <h3 className="font-bold text-gray-800 mb-3">仕事内容</h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
              {job.description}
            </p>
          </CardBody>
        </Card>

        {/* チェックリスト */}
        {job.checklist.length > 0 && (
          <Card className="bg-white border border-gray-200 shadow-sm mb-6">
            <CardBody className="p-6">
              <h3 className="font-bold text-gray-800 mb-3">チェックリスト</h3>
              <ul className="space-y-2">
                {job.checklist.map((item, index) => (
                  <li
                    key={item.id}
                    className="flex items-center gap-3 text-gray-600"
                  >
                    <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs font-medium shrink-0">
                      {index + 1}
                    </span>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        )}

        {/* AIレコメンド結果 (プレースホルダー) */}
        <Card className="bg-white border border-gray-200 shadow-sm mb-6">
          <CardBody className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={20} className="text-purple-500" />
              <h3 className="font-bold text-gray-800">
                AIレコメンド - この人にオススメ
              </h3>
            </div>
            {/* プレースホルダー: Task 5.7で実装予定 */}
            <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 text-center">
              <p className="text-gray-500 text-sm">
                AIレコメンド機能は準備中です
              </p>
              <p className="text-gray-400 text-xs mt-1">(Task 5.7で実装予定)</p>
            </div>
          </CardBody>
        </Card>

        {/* 応募者一覧 */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardBody className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">応募者一覧</h3>
              <span className="text-sm text-gray-500">
                {applicants.length}名
              </span>
            </div>

            {applicants.length > 0 ? (
              <div className="space-y-3">
                {applicants.map((applicant) => {
                  const worker = getWorkerInfo(applicant.workerId);
                  const trustScore = getMockTrustScore(applicant.workerId);
                  const rank = calculateRank(trustScore);
                  const statusInfo = getStatusStyle(applicant.status);

                  // 承認待ち判定: completed かつ requesterEvalScore が null
                  const isPendingEvaluation =
                    applicant.status === "completed" &&
                    applicant.requesterEvalScore === null;

                  return (
                    <div
                      key={applicant.id}
                      className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {/* アバター */}
                          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
                            <Image
                              src="/avatar4.png"
                              alt={worker?.name || "労働者"}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* 名前とランク */}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-800">
                                {worker?.name || `労働者 ${applicant.workerId}`}
                              </span>
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full font-medium ${getRankStyle(rank)}`}
                              >
                                {rank}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <span>Trust Score: {trustScore}</span>
                            </div>
                          </div>
                        </div>

                        {/* ステータス / 評価リンク */}
                        <div className="flex items-center gap-2">
                          {isPendingEvaluation ? (
                            <Link
                              href={`/requester/undertaked_jobs/${applicant.id}`}
                              className="flex items-center gap-1 px-3 py-1.5 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors"
                            >
                              <Clock size={14} />
                              評価する
                            </Link>
                          ) : applicant.status === "completed" &&
                            applicant.requesterEvalScore !== null ? (
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-xs px-2 py-1 rounded-full font-medium ${statusInfo.style}`}
                              >
                                {statusInfo.label}
                              </span>
                              <span className="flex items-center gap-1 text-sm text-green-600">
                                <CheckCircle2 size={14} />
                                評価済み
                              </span>
                            </div>
                          ) : (
                            <span
                              className={`text-xs px-2 py-1 rounded-full font-medium ${statusInfo.style}`}
                            >
                              {statusInfo.label}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* 応募日時 */}
                      <div className="mt-2 text-xs text-gray-400">
                        応募日: {formatDate(applicant.acceptedAt)}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Users size={32} className="mx-auto mb-2 text-gray-300" />
                <p className="text-gray-500 text-sm">まだ応募者がいません</p>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
