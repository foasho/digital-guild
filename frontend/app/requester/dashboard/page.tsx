"use client";

import { Button, Card, CardBody, Tab, Tabs } from "@heroui/react";
import {
  AlertCircle,
  Briefcase,
  CheckCircle,
  Clock,
  Plus,
  MapPin,
  Calendar,
  ChevronRight,
  ArrowRight,
  Users,
  TrendingUp,
  UserCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  useJobs,
  useRequester,
  useUndertakedJobs,
} from "@/hooks/requesters";
import type { Job, UndertakedJob } from "@/types";

type StatusFilter = "all" | "recruiting" | "applied" | "in_progress" | "pending_review" | "completed";

// ジョブのステータスを判定する関数
function getJobStatus(
  job: Job,
  undertakedJobs: UndertakedJob[]
): "recruiting" | "applied" | "in_progress" | "pending_review" | "completed" {
  const relatedUndertakedJobs = undertakedJobs.filter(
    (uj) => uj.jobId === job.id
  );

  const allCompleted =
    relatedUndertakedJobs.length > 0 &&
    relatedUndertakedJobs.every((uj) => uj.status === "completed");
  if (allCompleted) return "completed";

  // 確認待ち（completion_reported）がある場合
  const hasPendingReview = relatedUndertakedJobs.some(
    (uj) => uj.status === "completion_reported"
  );
  if (hasPendingReview) return "pending_review";

  // 進行中（accepted）がある場合
  const hasInProgress = relatedUndertakedJobs.some(
    (uj) => uj.status === "accepted"
  );
  if (hasInProgress) return "in_progress";

  // 応募中（applied）がある場合
  const hasApplied = relatedUndertakedJobs.some(
    (uj) => uj.status === "applied"
  );
  if (hasApplied) return "applied";

  return "recruiting";
}

function getStatusLabel(status: "recruiting" | "applied" | "in_progress" | "pending_review" | "completed") {
  switch (status) {
    case "recruiting":
      return "募集中";
    case "applied":
      return "応募中";
    case "in_progress":
      return "進行中";
    case "pending_review":
      return "確認待ち";
    case "completed":
      return "完了";
  }
}

function getStatusStyle(status: "recruiting" | "applied" | "in_progress" | "pending_review" | "completed") {
  switch (status) {
    case "recruiting":
      return "bg-sky-100 text-sky-700 border-sky-200";
    case "applied":
      return "bg-indigo-100 text-indigo-700 border-indigo-200";
    case "in_progress":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "pending_review":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "completed":
      return "bg-green-100 text-green-700 border-green-200";
  }
}

export default function RequesterDashboardPage() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<StatusFilter>("all");

  const { requester } = useRequester();
  const { jobs, pending: jobsPending, refetch: refetchJobs } = useJobs();
  const { undertakedJobs, pending: undertakedPending, refetch: refetchUndertakedJobs } = useUndertakedJobs();

  // ページアクセス時にLocalStorageから最新データを再取得
  useEffect(() => {
    refetchJobs();
    refetchUndertakedJobs();
  }, [refetchJobs, refetchUndertakedJobs]);

  const allJobs = useMemo(() => {
    // requesterId でフィルタリング（新規作成したジョブも表示）
    const requesterId = requester?.id || 1;
    return jobs.filter((job) => job.requesterId === requesterId);
  }, [jobs, requester?.id]);

  const stats = useMemo(() => {
    let recruiting = 0;
    let applied = 0;
    let inProgress = 0;
    let pendingReview = 0;
    let completed = 0;
    let totalReward = 0;
    let totalApplicants = 0;

    allJobs.forEach((job) => {
      const status = getJobStatus(job, undertakedJobs);
      totalReward += job.reward;
      switch (status) {
        case "recruiting":
          recruiting++;
          break;
        case "applied":
          applied++;
          break;
        case "in_progress":
          inProgress++;
          break;
        case "pending_review":
          pendingReview++;
          break;
        case "completed":
          completed++;
          break;
      }
    });

    undertakedJobs.forEach((uj) => {
      if (allJobs.some((j) => j.id === uj.jobId)) {
        totalApplicants++;
      }
    });

    return {
      total: allJobs.length,
      recruiting,
      applied,
      inProgress,
      pendingReview,
      completed,
      totalReward,
      totalApplicants,
    };
  }, [allJobs, undertakedJobs]);

  const filteredJobs = useMemo(() => {
    if (selectedFilter === "all") return allJobs;
    return allJobs.filter((job) => {
      const status = getJobStatus(job, undertakedJobs);
      return status === selectedFilter;
    });
  }, [allJobs, undertakedJobs, selectedFilter]);

  // 確認待ちのUndertakedJob一覧（緊急度高）
  const pendingReviewUndertakedJobs = useMemo(() => {
    const requesterJobIds = allJobs.map((job) => job.id);
    return undertakedJobs.filter(
      (uj) =>
        uj.status === "completion_reported" &&
        requesterJobIds.includes(uj.jobId)
    );
  }, [undertakedJobs, allJobs]);

  // 応募中のUndertakedJob一覧（選定が必要）
  const appliedUndertakedJobs = useMemo(() => {
    const requesterJobIds = allJobs.map((job) => job.id);
    // ジョブごとにグループ化して、応募があるジョブのみを返す
    const jobsWithApplicants = new Map<number, typeof undertakedJobs>();
    undertakedJobs
      .filter(
        (uj) =>
          uj.status === "applied" &&
          requesterJobIds.includes(uj.jobId)
      )
      .forEach((uj) => {
        if (!jobsWithApplicants.has(uj.jobId)) {
          jobsWithApplicants.set(uj.jobId, []);
        }
        jobsWithApplicants.get(uj.jobId)?.push(uj);
      });
    return jobsWithApplicants;
  }, [undertakedJobs, allJobs]);

  // ジョブIDからジョブ情報を取得
  const getJobInfo = (jobId: number) => {
    return allJobs.find((job) => job.id === jobId);
  };

  const getApplicantCount = (jobId: number) => {
    return undertakedJobs.filter(
      (uj) => uj.jobId === jobId && uj.status !== "canceled"
    ).length;
  };

  const handleJobClick = (jobId: number) => {
    // 確認待ちのジョブの場合は評価ページへ
    const pendingUndertakedJob = undertakedJobs.find(
      (uj) => uj.jobId === jobId && uj.status === "completion_reported"
    );
    if (pendingUndertakedJob) {
      router.push(`/requester/undertaked_jobs/${pendingUndertakedJob.id}`);
      return;
    }

    // 応募中のジョブの場合は応募者選定画面へ（最初のappliedを使用）
    const appliedUndertakedJob = undertakedJobs.find(
      (uj) => uj.jobId === jobId && uj.status === "applied"
    );
    if (appliedUndertakedJob) {
      router.push(`/requester/undertaked_jobs/${appliedUndertakedJob.id}`);
      return;
    }

    router.push(`/requester/jobs/${jobId}`);
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* ヘッダーセクション */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-800">
            こんにちは、{requester?.name || "発注者"}さん
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            本日のジョブ状況を確認しましょう
          </p>
        </div>
        <Link href="/requester/jobs/new">
          <Button
            color="primary"
            size="lg"
            className="text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 shadow-lg rounded-xl w-full sm:w-auto"
            startContent={<Plus size={20} />}
          >
            新規ジョブ作成
          </Button>
        </Link>
      </div>

      {/* 確認待ちアラートセクション */}
      {pendingReviewUndertakedJobs.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-4 lg:p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-500 rounded-full animate-pulse">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-amber-800">
                確認待ちの作業報告があります
              </h3>
              <p className="text-sm text-amber-600">
                {pendingReviewUndertakedJobs.length}件の作業が完了報告されています。評価をお願いします。
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {pendingReviewUndertakedJobs.map((uj) => {
              const job = getJobInfo(uj.jobId);
              if (!job) return null;
              return (
                <button
                  key={uj.id}
                  type="button"
                  onClick={() =>
                    router.push(`/requester/undertaked_jobs/${uj.id}`)
                  }
                  className="flex items-center gap-3 p-3 bg-white rounded-xl border border-amber-200 hover:border-amber-400 hover:shadow-md transition-all group text-left"
                >
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                    <Image
                      src={job.imageUrl || "/jobs/izakaya.jpg"}
                      alt={job.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm truncate">
                      {job.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <MapPin size={12} />
                      <span className="truncate">{job.location}</span>
                    </div>
                    <p className="text-xs text-amber-600 font-medium mt-0.5">
                      {(job.reward + job.aiInsentiveReward).toLocaleString()} JPYC
                    </p>
                  </div>
                  <ArrowRight
                    size={18}
                    className="text-amber-500 group-hover:translate-x-1 transition-transform shrink-0"
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 応募者選定アラートセクション */}
      {appliedUndertakedJobs.size > 0 && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-300 rounded-2xl p-4 lg:p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-500 rounded-full">
              <UserCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-indigo-800">
                応募者の選定が必要です
              </h3>
              <p className="text-sm text-indigo-600">
                {appliedUndertakedJobs.size}件のジョブに応募があります。採用するワーカーを選んでください。
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from(appliedUndertakedJobs.entries()).map(([jobId, applicants]) => {
              const job = getJobInfo(jobId);
              if (!job) return null;
              const firstApplicant = applicants[0];
              return (
                <button
                  key={jobId}
                  type="button"
                  onClick={() =>
                    router.push(`/requester/undertaked_jobs/${firstApplicant.id}`)
                  }
                  className="flex items-center gap-3 p-3 bg-white rounded-xl border border-indigo-200 hover:border-indigo-400 hover:shadow-md transition-all group text-left"
                >
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                    <Image
                      src={job.imageUrl || "/jobs/izakaya.jpg"}
                      alt={job.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm truncate">
                      {job.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Users size={12} />
                      <span className="text-indigo-600 font-medium">
                        {applicants.length}名が応募中
                      </span>
                    </div>
                    <p className="text-xs text-indigo-600 font-medium mt-0.5">
                      {job.reward.toLocaleString()} JPYC
                    </p>
                  </div>
                  <ArrowRight
                    size={18}
                    className="text-indigo-500 group-hover:translate-x-1 transition-transform shrink-0"
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ジョブ一覧セクション */}
      <Card className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
        <CardBody className="p-0">
          {/* タブヘッダー */}
          <div className="border-b border-gray-200">
            <Tabs
              aria-label="ステータスフィルター"
              selectedKey={selectedFilter}
              onSelectionChange={(key) =>
                setSelectedFilter(key as StatusFilter)
              }
              variant="underlined"
              classNames={{
                tabList:
                  "gap-0 w-full relative rounded-none p-0 overflow-x-auto",
                cursor: "w-full bg-sky-500 h-[3px]",
                tab: "flex-1 min-w-[80px] px-3 py-4 h-14 data-[hover=true]:bg-sky-50/50 transition-colors",
                tabContent:
                  "text-gray-500 group-data-[selected=true]:text-sky-600 group-data-[selected=true]:font-semibold text-sm whitespace-nowrap",
              }}
            >
              <Tab key="all" title={`全て (${stats.total})`} />
              <Tab key="recruiting" title={`募集中 (${stats.recruiting})`} />
              <Tab key="applied" title={`応募中 (${stats.applied})`} />
              <Tab key="in_progress" title={`進行中 (${stats.inProgress})`} />
              <Tab key="pending_review" title={`確認待ち (${stats.pendingReview})`} />
              <Tab key="completed" title={`完了 (${stats.completed})`} />
            </Tabs>
          </div>

          {/* ジョブリスト */}
          <div className="p-4 lg:p-6">
            {filteredJobs.length > 0 ? (
              <>
                {/* モバイル・タブレット向けカードレイアウト */}
                <div className="lg:hidden space-y-3">
                  {filteredJobs.map((job) => {
                    const status = getJobStatus(job, undertakedJobs);
                    const applicantCount = getApplicantCount(job.id);

                    return (
                      <div
                        key={job.id}
                        onClick={() => handleJobClick(job.id)}
                        className="flex gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl cursor-pointer transition-colors border border-gray-100 hover:border-gray-200"
                      >
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={job.imageUrl || "/jobs/izakaya.jpg"}
                            alt={job.title}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-bold text-gray-800 truncate">
                              {job.title}
                            </h3>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full font-medium border flex-shrink-0 ${getStatusStyle(status)}`}
                            >
                              {getStatusLabel(status)}
                            </span>
                          </div>

                          <p className="text-gray-500 text-sm line-clamp-1 mb-2">
                            {job.description}
                          </p>

                          <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                            <span className="flex items-center gap-1">
                              <MapPin size={12} />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar size={12} />
                              {job.scheduledDate}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users size={12} />
                              {applicantCount}名
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end justify-center flex-shrink-0">
                          <p className="text-lg font-bold text-sky-600">
                            {job.reward.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">JPYC</p>
                          {job.aiInsentiveReward && job.aiInsentiveReward > 0 && (
                            <div className="flex items-center gap-1 mt-1 text-base text-emerald-600">
                              <TrendingUp size={10} />
                              <span>+{job.aiInsentiveReward}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* PC向けテーブルレイアウト */}
                <div className="hidden lg:block">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm text-gray-500 border-b border-gray-100">
                        <th className="pb-3 font-medium">ジョブ</th>
                        <th className="pb-3 font-medium">場所</th>
                        <th className="pb-3 font-medium">日時</th>
                        <th className="pb-3 font-medium text-center">応募者</th>
                        <th className="pb-3 font-medium text-center">
                          ステータス
                        </th>
                        <th className="pb-3 font-medium text-right">報酬</th>
                        <th className="pb-3 font-medium"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredJobs.map((job) => {
                        const status = getJobStatus(job, undertakedJobs);
                        const applicantCount = getApplicantCount(job.id);

                        return (
                          <tr
                            key={job.id}
                            onClick={() => handleJobClick(job.id)}
                            className="hover:bg-gray-50 cursor-pointer transition-colors"
                          >
                            <td className="py-4">
                              <div className="flex items-center gap-4">
                                <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                                  <Image
                                    src={job.imageUrl || "/jobs/izakaya.jpg"}
                                    alt={job.title}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <h3 className="font-semibold text-gray-800 truncate">
                                    {job.title}
                                  </h3>
                                  <p className="text-sm text-gray-500 truncate max-w-xs">
                                    {job.description}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4">
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <MapPin size={14} className="text-gray-400" />
                                {job.location}
                              </div>
                            </td>
                            <td className="py-4">
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <Calendar size={14} className="text-gray-400" />
                                {job.scheduledDate}
                              </div>
                            </td>
                            <td className="py-4 text-center">
                              <div className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm">
                                <Users size={14} className="text-gray-500" />
                                <span className="font-medium">
                                  {applicantCount}名
                                </span>
                              </div>
                            </td>
                            <td className="py-4 text-center">
                              <span
                                className={`inline-block text-xs px-3 py-1.5 rounded-full font-medium border ${getStatusStyle(status)}`}
                              >
                                {getStatusLabel(status)}
                              </span>
                            </td>
                            <td className="py-4 text-right">
                              <div>
                                <p className="text-lg font-bold text-sky-600">
                                  {job.reward.toLocaleString()}
                                  <span className="text-sm font-normal text-gray-500 ml-1">
                                    JPYC
                                  </span>
                                </p>
                                {job.aiInsentiveReward &&
                                  job.aiInsentiveReward > 0 && (
                                    <div className="flex items-center justify-end gap-1 text-xs text-emerald-600">
                                      <TrendingUp size={10} />
                                      <span>+{job.aiInsentiveReward}</span>
                                    </div>
                                  )}
                              </div>
                            </td>
                            <td className="py-4 pl-4">
                              <ChevronRight
                                size={20}
                                className="text-gray-400"
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <Briefcase size={56} className="mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 mb-6 text-lg">
                  {selectedFilter === "all"
                    ? "ジョブがまだありません"
                    : `${getStatusLabel(selectedFilter as Exclude<StatusFilter, "all">)}のジョブはありません`}
                </p>
                <Link href="/requester/jobs/new">
                  <Button
                    color="primary"
                    size="lg"
                    className="bg-sky-500 hover:bg-sky-600"
                    startContent={<Plus size={20} />}
                  >
                    新規ジョブを作成
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
