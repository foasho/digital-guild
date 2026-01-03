"use client";

import {
  Button,
  Card,
  CardBody,
  Chip,
  Input,
  Slider,
} from "@heroui/react";
import { ArrowLeft, Plus, Trash2, Check, GripVertical, Minus } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { defaultRequester } from "@/constants/mocks";
import { useJobs, useRequester, useSubsidiesByRequesterId } from "@/hooks/requesters";
import type { ChecklistItem } from "@/types";
import { simulateAiIncentiveCalculation } from "@/utils/mocks";

// Leafletマップはクライアントサイドのみでレンダリング
const LocationPicker = dynamic(
  () =>
    import("@/components/requester/LocationPicker").then(
      (mod) => mod.LocationPicker
    ),
  { ssr: false, loading: () => <div className="h-[200px] bg-gray-100 rounded-xl animate-pulse" /> }
);

// スキル選択肢
const SKILL_OPTIONS = [
  { id: "filming", label: "撮影", color: "primary" },
  { id: "service", label: "接客", color: "secondary" },
  { id: "light-work", label: "軽作業", color: "success" },
  { id: "farming", label: "農作業", color: "warning" },
  { id: "harvest", label: "収穫", color: "danger" },
  { id: "outdoor", label: "屋外作業", color: "primary" },
  { id: "cleaning", label: "清掃", color: "secondary" },
  { id: "gardening", label: "庭仕事", color: "success" },
  { id: "cooking", label: "調理補助", color: "warning" },
  { id: "driving", label: "運転", color: "danger" },
  { id: "carrying", label: "運搬", color: "primary" },
  { id: "event", label: "イベント", color: "secondary" },
] as const;

// バリデーションスキーマ
const jobFormSchema = z.object({
  title: z.string().min(1, "タイトルは必須です"),
  description: z.string().min(1, "説明は必須です"),
  reward: z.number().min(1, "報酬は1以上である必要があります"),
  location: z.string().min(1, "場所は必須です"),
  latitude: z.number(),
  longitude: z.number(),
  imageUrl: z.string().optional(),
  tags: z.array(z.string()),
  capacity: z.number().min(1).default(1),
  checklist: z.array(z.object({ id: z.number(), text: z.string() })),
  scheduledDate: z.string().min(1, "予定日は必須です"),
});

type JobFormData = z.infer<typeof jobFormSchema>;

interface ChecklistItemInput {
  id: number;
  text: string;
}

// セクションヘッダーコンポーネント
function SectionHeader({
  title,
  description,
  step,
}: {
  title: string;
  description?: string;
  step?: number;
}) {
  return (
    <div className="mb-5 flex items-start gap-3">
      {step && (
        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
          {step}
        </div>
      )}
      <div>
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        {description && (
          <p className="text-sm text-gray-500 mt-0.5">{description}</p>
        )}
      </div>
    </div>
  );
}

export default function NewJobPage() {
  const router = useRouter();
  const { addJob } = useJobs();
  const { requester } = useRequester();
  const subsidies = useSubsidiesByRequesterId(requester?.id || 1);
  const [isHydrated, setIsHydrated] = useState(false);

  // フォーム状態
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reward, setReward] = useState<string>("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState(35.6762);
  const [longitude, setLongitude] = useState(139.6503);
  const [imageUrl, setImageUrl] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [capacity, setCapacity] = useState<string>("1");
  const [checklist, setChecklist] = useState<ChecklistItemInput[]>([]);
  const [scheduledDate, setScheduledDate] = useState("");
  const [newChecklistItem, setNewChecklistItem] = useState("");

  // エラー状態
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 送信中状態
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 補助金残高を計算
  const subsidyBalance = useMemo(() => {
    return subsidies.reduce((acc, s) => acc + s.amount, 0);
  }, [subsidies]);

  // Hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const rewardNumber = Number(reward) || 0;

  // 必須項目のバリデーション
  const isRequiredFieldsValid = useMemo(() => {
    return (
      title.trim() !== "" &&
      description.trim() !== "" &&
      rewardNumber > 0 &&
      location.trim() !== "" &&
      scheduledDate.trim() !== ""
    );
  }, [title, description, rewardNumber, location, scheduledDate]);

  // スキル選択トグル
  const handleSkillToggle = (skillLabel: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skillLabel)
        ? prev.filter((s) => s !== skillLabel)
        : [...prev, skillLabel]
    );
  };

  // チェックリスト追加
  const handleAddChecklistItem = () => {
    if (!newChecklistItem.trim()) return;
    const maxId =
      checklist.length > 0 ? Math.max(...checklist.map((c) => c.id)) : 0;
    const newItem: ChecklistItemInput = {
      id: maxId + 1,
      text: newChecklistItem.trim(),
    };
    setChecklist([...checklist, newItem]);
    setNewChecklistItem("");
  };

  // チェックリスト削除
  const handleRemoveChecklistItem = (id: number) => {
    setChecklist(checklist.filter((item) => item.id !== id));
  };

  // フォーム送信
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 既に送信中の場合は何もしない
    if (isSubmitting) return;

    setIsSubmitting(true);

    // フォームデータを構築
    const formData: JobFormData = {
      title,
      description,
      reward: Number(reward) || 0,
      location,
      latitude,
      longitude,
      imageUrl: imageUrl || undefined,
      tags: selectedSkills,
      capacity: Number(capacity) || 1,
      checklist: checklist.filter((item) => item.text.trim() !== ""),
      scheduledDate,
    };

    // バリデーション
    const result = jobFormSchema.safeParse(formData);
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        newErrors[path] = issue.message;
      });
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    setErrors({});

    // 使用するリクエスターID
    const requesterId = requester?.id || defaultRequester.id;

    // AIインセンティブを算出してからジョブを作成
    let calculatedIncentive = 0;
    if (subsidyBalance > 0) {
      // インセンティブ計算を実行（UIには表示せずバックグラウンドで実行）
      await new Promise<void>((resolve) => {
        simulateAiIncentiveCalculation(
          () => {}, // ステップ更新はUIに反映しない
          (incentive) => {
            calculatedIncentive = incentive;
            resolve();
          },
          subsidyBalance,
          formData.reward
        );
      });
    }

    // hookでジョブを作成（awaitで完了を待つ）
    try {
      await addJob({
        requesterId,
        title: formData.title,
        description: formData.description,
        reward: formData.reward,
        aiInsentiveReward: calculatedIncentive, // 計算したAIインセンティブを使用
        location: formData.location,
        latitude: formData.latitude,
        longitude: formData.longitude,
        imageUrl: formData.imageUrl || "/jobs/izakaya.jpg",
        tags: formData.tags,
        capacity: formData.capacity,
        checklist: formData.checklist as ChecklistItem[],
        scheduledDate: formData.scheduledDate,
      });

      // ダッシュボードへリダイレクト
      router.push("/requester/dashboard");
    } catch (error) {
      console.error("ジョブ作成エラー:", error);
      setIsSubmitting(false);
    }
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-4 sticky top-[104px] lg:top-[96px] z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link
            href="/requester/dashboard"
            className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-gray-800 dark:text-white">新規ジョブ作成</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">必要な情報を入力してください</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="px-4 py-6 max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* セクション1: 基本情報 */}
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-2xl overflow-hidden">
            <CardBody className="p-6">
              <SectionHeader
                step={1}
                title="基本情報"
                description="ジョブの基本的な情報を入力してください"
              />
              <div className="space-y-5">
                {/* タイトル */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    タイトル <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={title}
                    onValueChange={setTitle}
                    placeholder="例: 動画撮影おてつだい"
                    variant="flat"
                    radius="full"
                    size="lg"
                    isInvalid={!!errors.title}
                    errorMessage={errors.title}
                    classNames={{
                      inputWrapper: "bg-gray-100 dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 data-[focus=true]:bg-white dark:data-[focus=true]:bg-gray-800 shadow-none !outline-none !ring-0",
                      input: "placeholder:text-gray-400 !outline-none pl-4",
                    }}
                  />
                </div>

                {/* 説明 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    説明 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="ジョブの詳細な説明を入力してください..."
                    rows={4}
                    className={`w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-2xl text-gray-800 dark:text-white placeholder:text-gray-400 focus:bg-white dark:focus:bg-gray-800 focus:outline-none resize-y min-h-[120px] transition-colors ${
                      errors.description ? "border-2 border-red-500" : ""
                    }`}
                  />
                  {errors.description && (
                    <p className="text-xs text-red-500 mt-1">{errors.description}</p>
                  )}
                </div>

                {/* 報酬・定員 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* 報酬 - Slider */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      報酬 (JPYC) <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-gray-800 dark:text-white">
                          ¥{(Number(reward) || 0).toLocaleString()}
                        </span>
                        <Input
                          type="number"
                          value={reward}
                          onValueChange={setReward}
                          variant="flat"
                          radius="full"
                          size="sm"
                          className="w-28"
                          classNames={{
                            inputWrapper: "bg-gray-100 dark:bg-gray-700 shadow-none !outline-none !ring-0 h-8",
                            input: "text-right text-sm !outline-none",
                          }}
                        />
                      </div>
                      <Slider
                        size="sm"
                        step={1000}
                        minValue={1000}
                        maxValue={100000}
                        value={Number(reward) || 10000}
                        onChange={(val) => setReward(String(val))}
                        className="w-full"
                        classNames={{
                          track: "bg-gray-200 dark:bg-gray-600",
                          filler: "bg-sky-500",
                          thumb: "bg-white shadow-md border-2 border-sky-500",
                        }}
                      />
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>¥1,000</span>
                        <span>¥100,000</span>
                      </div>
                    </div>
                    {errors.reward && (
                      <p className="text-xs text-red-500 mt-1">{errors.reward}</p>
                    )}
                  </div>

                  {/* 定員 - 増減ボタン */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      定員（名）
                    </label>
                    <div className="flex items-center justify-center gap-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-2xl">
                      <Button
                        isIconOnly
                        variant="flat"
                        radius="full"
                        size="lg"
                        onPress={() => setCapacity(String(Math.max(1, Number(capacity) - 1)))}
                        isDisabled={Number(capacity) <= 1}
                        className="bg-white dark:bg-gray-600 shadow-sm"
                      >
                        <Minus size={20} className="text-gray-600 dark:text-gray-300" />
                      </Button>
                      <div className="flex items-center gap-2 min-w-[80px] justify-center">
                        <span className="text-3xl font-bold text-gray-800 dark:text-white">
                          {capacity || 1}
                        </span>
                        <span className="text-gray-400 text-sm">名</span>
                      </div>
                      <Button
                        isIconOnly
                        variant="flat"
                        radius="full"
                        size="lg"
                        onPress={() => setCapacity(String(Number(capacity) + 1))}
                        className="bg-white dark:bg-gray-600 shadow-sm"
                      >
                        <Plus size={20} className="text-gray-600 dark:text-gray-300" />
                      </Button>
                    </div>
                  </div>
                </div>

              </div>
            </CardBody>
          </Card>

          {/* セクション2: 場所・日時 */}
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-2xl overflow-hidden">
            <CardBody className="p-6">
              <SectionHeader
                step={2}
                title="場所・日時"
                description="作業場所と実施日を設定してください"
              />
              <div className="space-y-5">
                {/* 場所 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    場所（住所・地名） <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={location}
                    onValueChange={setLocation}
                    placeholder="例: 山形県湯煙町"
                    variant="flat"
                    radius="full"
                    size="lg"
                    isInvalid={!!errors.location}
                    errorMessage={errors.location}
                    classNames={{
                      inputWrapper: "bg-gray-100 dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 data-[focus=true]:bg-white dark:data-[focus=true]:bg-gray-800 shadow-none !outline-none !ring-0",
                      input: "placeholder:text-gray-400 !outline-none pl-4",
                    }}
                  />
                </div>

                {/* マップで位置選択 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    マップで位置を選択
                  </label>
                  <LocationPicker
                    latitude={latitude}
                    longitude={longitude}
                    onLocationChange={(lat, lng) => {
                      setLatitude(lat);
                      setLongitude(lng);
                    }}
                  />
                </div>

                {/* 予定日・画像 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      予定日 <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="date"
                      value={scheduledDate}
                      onValueChange={setScheduledDate}
                      variant="flat"
                      radius="full"
                      size="lg"
                      isInvalid={!!errors.scheduledDate}
                      errorMessage={errors.scheduledDate}
                      classNames={{
                        inputWrapper: "bg-gray-100 dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 data-[focus=true]:bg-white dark:data-[focus=true]:bg-gray-800 shadow-none !outline-none !ring-0",
                        input: "placeholder:text-gray-400 !outline-none pl-4",
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      画像URL（オプション）
                    </label>
                    <Input
                      value={imageUrl}
                      onValueChange={setImageUrl}
                      placeholder="/jobs/izakaya.jpg"
                      variant="flat"
                      radius="full"
                      size="lg"
                      classNames={{
                        inputWrapper: "bg-gray-100 dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 data-[focus=true]:bg-white dark:data-[focus=true]:bg-gray-800 shadow-none !outline-none !ring-0",
                        input: "placeholder:text-gray-400 !outline-none pl-4",
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* セクション3: スキル・チェックリスト */}
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-2xl overflow-hidden">
            <CardBody className="p-6">
              <SectionHeader
                step={3}
                title="スキル・チェックリスト"
                description="必要なスキルと作業チェックリストを設定してください"
              />
              <div className="space-y-6">
                {/* スキル選択 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    必要なスキルを選択
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {SKILL_OPTIONS.map((skill) => {
                      const isSelected = selectedSkills.includes(skill.label);
                      return (
                        <Chip
                          key={skill.id}
                          variant={isSelected ? "solid" : "bordered"}
                          color={isSelected ? skill.color : "default"}
                          className={`cursor-pointer transition-all ${
                            isSelected
                              ? "shadow-md scale-105"
                              : "hover:border-sky-300 hover:bg-sky-50"
                          }`}
                          startContent={
                            isSelected ? (
                              <Check size={14} className="ml-1" />
                            ) : null
                          }
                          onClick={() => handleSkillToggle(skill.label)}
                        >
                          {skill.label}
                        </Chip>
                      );
                    })}
                  </div>
                  {selectedSkills.length > 0 && (
                    <p className="text-xs text-gray-500 mt-2">
                      {selectedSkills.length}件のスキルを選択中
                    </p>
                  )}
                </div>

                {/* チェックリスト */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    作業チェックリスト
                  </label>

                  {/* 既存のチェックリスト項目 */}
                  {checklist.length > 0 && (
                    <div className="space-y-2 mb-3">
                      {checklist.map((item, index) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl group"
                        >
                          <GripVertical
                            size={16}
                            className="text-gray-300 group-hover:text-gray-400"
                          />
                          <div className="flex-shrink-0 w-6 h-6 bg-sky-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-sky-600">
                              {index + 1}
                            </span>
                          </div>
                          <span className="flex-1 text-sm text-gray-700">
                            {item.text}
                          </span>
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            color="danger"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onPress={() => handleRemoveChecklistItem(item.id)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 新規追加入力 */}
                  <div className="flex gap-2">
                    <Input
                      value={newChecklistItem}
                      onValueChange={setNewChecklistItem}
                      placeholder="チェック項目を入力してEnterで追加"
                      variant="flat"
                      radius="full"
                      size="lg"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddChecklistItem();
                        }
                      }}
                      classNames={{
                        inputWrapper: "bg-gray-100 dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 data-[focus=true]:bg-white dark:data-[focus=true]:bg-gray-800 shadow-none !outline-none !ring-0",
                        input: "placeholder:text-gray-400 !outline-none pl-4",
                      }}
                    />
                    <Button
                      color="primary"
                      variant="flat"
                      radius="full"
                      size="lg"
                      isIconOnly
                      onPress={handleAddChecklistItem}
                      isDisabled={!newChecklistItem.trim()}
                    >
                      <Plus size={20} />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    作業完了の確認に使用するチェックリストを設定できます
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* 送信ボタン */}
          <div className="pt-2 pb-8">
            <Button
              type="submit"
              size="lg"
              className="w-full h-14 text-lg font-bold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.01] transition-all duration-200"
              isDisabled={!isRequiredFieldsValid || isSubmitting}
              isLoading={isSubmitting}
            >
              {isSubmitting ? "作成中..." : "ジョブを作成する"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
