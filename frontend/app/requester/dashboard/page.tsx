"use client";

import { Button, Card, CardBody, Tab, Tabs } from "@heroui/react";
import {
  Briefcase,
  CheckCircle,
  Clock,
  Plus,
  Users,
  TrendingUp,
  MapPin,
  Calendar,
  ChevronRight,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { BankPartnerPanel, SubsidyPanel } from "@/components/requester";
import {
  useJobs,
  useRequester,
  useUndertakedJobs,
  useSubsidiesByRequesterId,
} from "@/hooks/requesters";
import type { Job, UndertakedJob } from "@/types";

type StatusFilter = "all" | "recruiting" | "in_progress" | "completed";

// ジョブのステータスを判定する関数
function getJobStatus(
  job: Job,
  undertakedJobs: UndertakedJob[]
): "recruiting" | "in_progress" | "completed" {
  const relatedUndertakedJobs = undertakedJobs.filter(
    (uj) => uj.jobId === job.id
  );

  const allCompleted =
    relatedUndertakedJobs.length > 0 &&
    relatedUndertakedJobs.every((uj) => uj.status === "completed");
  if (allCompleted) return "completed";

  const hasInProgress = relatedUndertakedJobs.some(
    (uj) => uj.status === "in_progress" || uj.status === "accepted"
  );
  if (hasInProgress) return "in_progress";

  return "recruiting";
}

function getStatusLabel(status: "recruiting" | "in_progress" | "completed") {
  switch (status) {
    case "recruiting":
      return "募集中";
    case "in_progress":
      return "進行中";
    case "completed":
      return "完了";
  }
}

function getStatusStyle(status: "recruiting" | "in_progress" | "completed") {
  switch (status) {
    case "recruiting":
      return "bg-sky-100 text-sky-700 border-sky-200";
    case "in_progress":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "completed":
      return "bg-green-100 text-green-700 border-green-200";
  }
}

export default function RequesterDashboardPage() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<StatusFilter>("all");

  const { requester } = useRequester();
  const { jobs, pending: jobsPending } = useJobs();
  const { undertakedJobs, pending: undertakedPending } = useUndertakedJobs();
  const subsidies = useSubsidiesByRequesterId(requester?.id || 1);

  const allJobs = useMemo(() => {
    // requesterId でフィルタリング（新規作成したジョブも表示）
    const requesterId = requester?.id || 1;
    return jobs.filter((job) => job.requesterId === requesterId);
  }, [jobs, requester?.id]);

  const stats = useMemo(() => {
    let recruiting = 0;
    let inProgress = 0;
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
        case "in_progress":
          inProgress++;
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
      inProgress,
      completed,
      totalReward,
      totalApplicants,
    };
  }, [allJobs, undertakedJobs]);

  const usedSubsidyAmount = useMemo(() => {
    return allJobs.reduce((acc, job) => acc + (job.aiInsentiveReward || 0), 0);
  }, [allJobs]);

  const filteredJobs = useMemo(() => {
    if (selectedFilter === "all") return allJobs;
    return allJobs.filter((job) => {
      const status = getJobStatus(job, undertakedJobs);
      return status === selectedFilter;
    });
  }, [allJobs, undertakedJobs, selectedFilter]);

  const getApplicantCount = (jobId: number) => {
    return undertakedJobs.filter(
      (uj) => uj.jobId === jobId && uj.status !== "canceled"
    ).length;
  };

  const handleJobClick = (jobId: number) => {
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

      {/* 統計カード - PC向けに5列表示 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4">
        <Card className="bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md transition-shadow">
          <CardBody className="p-4 lg:p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 lg:p-3 bg-sky-100 rounded-xl">
                <Briefcase className="w-5 h-5 lg:w-6 lg:h-6 text-sky-600" />
              </div>
              <div>
                <p className="text-2xl lg:text-3xl font-bold text-gray-800">
                  {stats.total}
                </p>
                <p className="text-xs lg:text-sm text-gray-500">発注数</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md transition-shadow">
          <CardBody className="p-4 lg:p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 lg:p-3 bg-amber-100 rounded-xl">
                <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl lg:text-3xl font-bold text-gray-800">
                  {stats.inProgress}
                </p>
                <p className="text-xs lg:text-sm text-gray-500">進行中</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md transition-shadow">
          <CardBody className="p-4 lg:p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 lg:p-3 bg-green-100 rounded-xl">
                <CheckCircle className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl lg:text-3xl font-bold text-gray-800">
                  {stats.completed}
                </p>
                <p className="text-xs lg:text-sm text-gray-500">完了</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md transition-shadow">
          <CardBody className="p-4 lg:p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 lg:p-3 bg-purple-100 rounded-xl">
                <Users className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl lg:text-3xl font-bold text-gray-800">
                  {stats.totalApplicants}
                </p>
                <p className="text-xs lg:text-sm text-gray-500">総応募者</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md transition-shadow col-span-2 sm:col-span-1">
          <CardBody className="p-4 lg:p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 lg:p-3 bg-indigo-100 rounded-xl">
                <Wallet className="w-5 h-5 lg:w-6 lg:h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-xl lg:text-2xl font-bold text-gray-800">
                  {(stats.totalReward / 1000).toFixed(0)}K
                </p>
                <p className="text-xs lg:text-sm text-gray-500">総報酬額</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* 補助金・銀行連携パネル - 2カラムグリッド */}
      <div className="grid lg:grid-cols-2 gap-4 lg:gap-6">
        <SubsidyPanel subsidies={subsidies} usedAmount={usedSubsidyAmount} />
        <BankPartnerPanel
          bankName="原資地方銀行"
          isConnected={true}
          kycStatus="verified"
        />
      </div>

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
                tab: "flex-1 min-w-[100px] px-4 py-4 h-14 data-[hover=true]:bg-sky-50/50 transition-colors",
                tabContent:
                  "text-gray-500 group-data-[selected=true]:text-sky-600 group-data-[selected=true]:font-semibold text-sm whitespace-nowrap",
              }}
            >
              <Tab key="all" title={`全て (${stats.total})`} />
              <Tab key="recruiting" title={`募集中 (${stats.recruiting})`} />
              <Tab key="in_progress" title={`進行中 (${stats.inProgress})`} />
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
                            <div className="flex items-center gap-1 mt-1 text-xs text-emerald-600">
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
