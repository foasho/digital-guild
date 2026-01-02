"use client";

import { Button, Card, CardBody, Tab, Tabs } from "@heroui/react";
import { Briefcase, CheckCircle, Clock, Plus, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useJobs, useUndertakedJobs } from "@/hooks";
import type { Job, UndertakedJob } from "@/types";

type StatusFilter = "all" | "recruiting" | "in_progress" | "completed";

// ジョブのステータスを判定する関数
function getJobStatus(
  job: Job,
  undertakedJobs: UndertakedJob[],
): "recruiting" | "in_progress" | "completed" {
  const relatedUndertakedJobs = undertakedJobs.filter(
    (uj) => uj.jobId === job.id,
  );

  // 全て完了している場合
  const allCompleted =
    relatedUndertakedJobs.length > 0 &&
    relatedUndertakedJobs.every((uj) => uj.status === "completed");
  if (allCompleted) return "completed";

  // 進行中のものがある場合
  const hasInProgress = relatedUndertakedJobs.some(
    (uj) => uj.status === "in_progress" || uj.status === "accepted",
  );
  if (hasInProgress) return "in_progress";

  // それ以外は募集中
  return "recruiting";
}

// ステータスラベルを取得
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

// ステータスに応じたスタイルを取得
function getStatusStyle(status: "recruiting" | "in_progress" | "completed") {
  switch (status) {
    case "recruiting":
      return "bg-sky-100 text-sky-700";
    case "in_progress":
      return "bg-amber-100 text-amber-700";
    case "completed":
      return "bg-green-100 text-green-700";
  }
}

export default function RequesterDashboardPage() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<StatusFilter>("all");

  // hooksからデータ取得
  const { jobs, pending: jobsPending } = useJobs();
  const { undertakedJobs, pending: undertakedPending } = useUndertakedJobs();

  const isHydrated = !jobsPending && !undertakedPending;

  // hooksから取得したジョブを使用
  const allJobs = jobs;

  // 統計情報を計算
  const stats = useMemo(() => {
    let recruiting = 0;
    let inProgress = 0;
    let completed = 0;

    allJobs.forEach((job) => {
      const status = getJobStatus(job, undertakedJobs);
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

    return {
      total: allJobs.length,
      recruiting,
      inProgress,
      completed,
    };
  }, [allJobs, undertakedJobs]);

  // フィルタリングされたジョブ
  const filteredJobs = useMemo(() => {
    if (selectedFilter === "all") return allJobs;
    return allJobs.filter((job) => {
      const status = getJobStatus(job, undertakedJobs);
      return status === selectedFilter;
    });
  }, [allJobs, undertakedJobs, selectedFilter]);

  // 応募者数を取得
  const getApplicantCount = (jobId: number) => {
    return undertakedJobs.filter(
      (uj) => uj.jobId === jobId && uj.status !== "canceled",
    ).length;
  };

  // ジョブカードクリック時の処理
  const handleJobClick = (jobId: number) => {
    router.push(`/requester/jobs/${jobId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* 統計サマリー */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="bg-white border border-gray-200 shadow-sm rounded-xl">
            <CardBody className="p-4">
              <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                <Briefcase size={14} className="text-sky-500" />
                <span>発注数</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </CardBody>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm rounded-xl">
            <CardBody className="p-4">
              <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                <Clock size={14} className="text-sky-500" />
                <span>進行中</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {stats.inProgress}
              </p>
            </CardBody>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm rounded-xl">
            <CardBody className="p-4">
              <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                <CheckCircle size={14} className="text-sky-500" />
                <span>完了</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {stats.completed}
              </p>
            </CardBody>
          </Card>
        </div>

        {/* ステータスフィルター */}
        <div className="mb-6">
          <Tabs
            aria-label="ステータスフィルター"
            selectedKey={selectedFilter}
            onSelectionChange={(key) => setSelectedFilter(key as StatusFilter)}
            variant="underlined"
            classNames={{
              tabList:
                "gap-4 w-full relative rounded-none p-0 border-b border-gray-200",
              cursor: "w-full bg-sky-500 h-[3px]",
              tab: "max-w-fit px-4 py-3 h-12 data-[hover=true]:bg-sky-50 data-[hover=true]:text-sky-600 rounded-t-lg transition-colors",
              tabContent:
                "text-gray-500 group-data-[selected=true]:text-sky-600 group-data-[selected=true]:font-semibold",
            }}
          >
            <Tab
              key="all"
              title={`全て (${stats.total})`}
              className="data-[selected=true]:bg-sky-100"
            />
            <Tab
              key="recruiting"
              title={`募集中 (${stats.recruiting})`}
              className="data-[selected=true]:bg-sky-100"
            />
            <Tab
              key="in_progress"
              title={`進行中 (${stats.inProgress})`}
              className="data-[selected=true]:bg-sky-100"
            />
            <Tab
              key="completed"
              title={`完了 (${stats.completed})`}
              className="data-[selected=true]:bg-sky-100"
            />
          </Tabs>
        </div>

        {/* ジョブカード一覧 */}
        {filteredJobs.length > 0 ? (
          <div className="space-y-3">
            {filteredJobs.map((job) => {
              const status = getJobStatus(job, undertakedJobs);
              const applicantCount = getApplicantCount(job.id);

              return (
                <Card
                  key={job.id}
                  isPressable
                  onPress={() => handleJobClick(job.id)}
                  className="bg-white border border-gray-200 shadow-sm hover:border-gray-300 transition-colors rounded-xl"
                >
                  <CardBody className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-800">{job.title}</h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusStyle(status)}`}
                      >
                        {getStatusLabel(status)}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {job.description}
                    </p>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Users size={14} />
                          <span>応募者: {applicantCount}名</span>
                        </span>
                      </div>
                      <span className="text-sm font-bold text-sky-600">
                        {job.reward.toLocaleString()} JPYC
                      </span>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        ) : (
          /* 空の状態 */
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <Briefcase size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 mb-4">
              {selectedFilter === "all"
                ? "ジョブがまだありません"
                : `${getStatusLabel(selectedFilter as Exclude<StatusFilter, "all">)}のジョブはありません`}
            </p>
            <Link href="/requester/jobs/new">
              <Button
                color="primary"
                className="bg-sky-500 hover:bg-sky-600"
                startContent={<Plus size={18} />}
              >
                新規ジョブを作成
              </Button>
            </Link>
          </div>
        )}

        {/* 新規作成ボタン (ジョブがある場合はフローティング) */}
        {filteredJobs.length > 0 && (
          <div className="fixed bottom-24 right-4 md:bottom-8 md:right-8">
            <Link href="/requester/jobs/new">
              <Button
                color="primary"
                className="bg-sky-500 hover:bg-sky-600 shadow-lg rounded-xl"
                startContent={<Plus size={18} />}
              >
                新規ジョブを作成
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
