"use client";

import {
  Button,
  Card,
  CardBody,
  Checkbox,
  CheckboxGroup,
  Input,
  Textarea,
} from "@heroui/react";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";
import { defaultRequester } from "@/constants/mocks";
import { useJobStore, useRequesterStore } from "@/stores";
import type { Job } from "@/types";

// タグ選択肢
const TAG_OPTIONS = [
  "撮影",
  "接客",
  "軽作業",
  "農作業",
  "収穫",
  "屋外作業",
  "清掃",
  "庭仕事",
];

// バリデーションスキーマ
const jobFormSchema = z.object({
  title: z.string().min(1, "タイトルは必須です"),
  description: z.string().min(1, "説明は必須です"),
  reward: z.number().min(1, "報酬は1以上である必要があります"),
  location: z.string().min(1, "場所は必須です"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  imageUrl: z.string().optional(),
  tags: z.array(z.string()),
  capacity: z.number().min(1).default(1),
  checklist: z.array(z.object({ id: z.string(), text: z.string() })),
  scheduledDate: z.string().min(1, "予定日は必須です"),
});

type JobFormData = z.infer<typeof jobFormSchema>;

interface ChecklistItemInput {
  id: string;
  text: string;
}

// セクションヘッダーコンポーネント
function SectionHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-4">
      <h3 className="text-base font-bold text-gray-800">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      )}
    </div>
  );
}

export default function NewJobPage() {
  const router = useRouter();
  const addJob = useJobStore((state) => state.addJob);
  const requester = useRequesterStore((state) => state.requester);
  const [isHydrated, setIsHydrated] = useState(false);

  // フォーム状態
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reward, setReward] = useState<string>("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [capacity, setCapacity] = useState<string>("1");
  const [checklist, setChecklist] = useState<ChecklistItemInput[]>([]);
  const [scheduledDate, setScheduledDate] = useState("");

  // エラー状態
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // AIインセンティブ計算
  const calculateAiIncentive = (rewardAmount: number): number => {
    const incentive = rewardAmount * 0.005;
    const maxIncentive = rewardAmount * 0.5;
    return Math.min(incentive, maxIncentive);
  };

  const rewardNumber = Number(reward) || 0;
  const aiIncentive = calculateAiIncentive(rewardNumber);

  // チェックリスト追加
  const handleAddChecklistItem = () => {
    const newItem: ChecklistItemInput = {
      id: `checklist-${Date.now()}`,
      text: "",
    };
    setChecklist([...checklist, newItem]);
  };

  // チェックリスト削除
  const handleRemoveChecklistItem = (id: string) => {
    setChecklist(checklist.filter((item) => item.id !== id));
  };

  // チェックリストテキスト更新
  const handleChecklistTextChange = (id: string, text: string) => {
    setChecklist(
      checklist.map((item) => (item.id === id ? { ...item, text } : item)),
    );
  };

  // フォーム送信
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // フォームデータを構築
    const formData: JobFormData = {
      title,
      description,
      reward: Number(reward) || 0,
      location,
      latitude: latitude ? Number(latitude) : undefined,
      longitude: longitude ? Number(longitude) : undefined,
      imageUrl: imageUrl || undefined,
      tags: selectedTags,
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
      return;
    }

    setErrors({});

    // 使用するリクエスターID（ストアにない場合はデフォルト使用）
    const requesterId = requester?.id || defaultRequester.id;

    // 新規ジョブを作成
    const newJob: Job = {
      id: `job-${Date.now()}`,
      requesterId,
      title: formData.title,
      description: formData.description,
      reward: formData.reward,
      aiInsentiveReward: Math.min(
        formData.reward * 0.005,
        formData.reward * 0.5,
      ),
      location: formData.location,
      latitude: formData.latitude ?? 35.6762,
      longitude: formData.longitude ?? 139.6503,
      imageUrl: formData.imageUrl || "/jobs/izakaya.jpg",
      tags: formData.tags,
      capacity: formData.capacity,
      checklist: formData.checklist,
      scheduledDate: formData.scheduledDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // ストアに追加
    addJob(newJob);

    // AIレコメンドAPI呼び出し (Task 5.6で実装予定)
    // await fetch('/api/ai/recommend', { method: 'POST', body: JSON.stringify({ jobId: newJob.id }) });

    // ダッシュボードへリダイレクト
    router.push("/requester/dashboard");
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-[57px] z-40">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link
            href="/requester/dashboard"
            className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </Link>
          <h1 className="text-lg font-bold text-gray-800">新規ジョブ作成</h1>
        </div>
      </div>

      {/* Form */}
      <div className="px-4 py-6 max-w-4xl mx-auto">
        {/* ヒント */}
        <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 mb-6">
          <h2 className="font-medium text-sky-800 mb-1">作成のヒント</h2>
          <p className="text-sm text-sky-700">
            ジョブの内容を詳しく記載することで、適切な人材からの応募が増えます。
            報酬金額は作業内容に見合った適正な金額を設定してください。
          </p>
        </div>

        <Card className="bg-white border border-gray-200 shadow-sm rounded-xl">
          <CardBody className="p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* セクション1: 基本情報 */}
              <section>
                <SectionHeader
                  title="基本情報"
                  description="ジョブの基本的な情報を入力してください"
                />
                <div className="space-y-5">
                  {/* タイトル */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      タイトル <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="例: 動画撮影おてつだい"
                      variant="bordered"
                      isInvalid={!!errors.title}
                      errorMessage={errors.title}
                      classNames={{
                        inputWrapper: "border-gray-300",
                      }}
                    />
                  </div>

                  {/* 説明 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      説明 <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="ジョブの詳細な説明を入力してください"
                      variant="bordered"
                      minRows={4}
                      isInvalid={!!errors.description}
                      errorMessage={errors.description}
                      classNames={{
                        inputWrapper: "border-gray-300",
                      }}
                    />
                  </div>

                  {/* 報酬 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      報酬 (JPYC) <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="number"
                      value={reward}
                      onChange={(e) => setReward(e.target.value)}
                      placeholder="例: 10000"
                      variant="bordered"
                      isInvalid={!!errors.reward}
                      errorMessage={errors.reward}
                      classNames={{
                        inputWrapper: "border-gray-300",
                      }}
                    />
                    {/* AIインセンティブ表示 */}
                    {rewardNumber > 0 && (
                      <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                        <p className="text-sm text-amber-800">
                          AIインセンティブ報酬:{" "}
                          <span className="font-bold">
                            {aiIncentive.toLocaleString()} JPYC
                          </span>
                          <span className="text-xs text-amber-600 ml-2">
                            (報酬の0.5%、最大50%)
                          </span>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* 定員 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      定員
                    </label>
                    <Input
                      type="number"
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value)}
                      placeholder="1"
                      min={1}
                      variant="bordered"
                      classNames={{
                        inputWrapper: "border-gray-300 max-w-[200px]",
                      }}
                    />
                  </div>
                </div>
              </section>

              {/* 区切り線 */}
              <hr className="border-gray-200" />

              {/* セクション2: 詳細設定 */}
              <section>
                <SectionHeader
                  title="詳細設定"
                  description="場所や日時などの詳細を設定してください"
                />
                <div className="space-y-5">
                  {/* 場所 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      場所 <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="例: 山形県湯煙町"
                      variant="bordered"
                      isInvalid={!!errors.location}
                      errorMessage={errors.location}
                      classNames={{
                        inputWrapper: "border-gray-300",
                      }}
                    />
                  </div>

                  {/* 緯度・経度 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        緯度 (オプション)
                      </label>
                      <Input
                        type="number"
                        step="any"
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                        placeholder="例: 35.6762"
                        variant="bordered"
                        classNames={{
                          inputWrapper: "border-gray-300",
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        経度 (オプション)
                      </label>
                      <Input
                        type="number"
                        step="any"
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                        placeholder="例: 139.6503"
                        variant="bordered"
                        classNames={{
                          inputWrapper: "border-gray-300",
                        }}
                      />
                    </div>
                  </div>

                  {/* 予定日 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      予定日 <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      variant="bordered"
                      isInvalid={!!errors.scheduledDate}
                      errorMessage={errors.scheduledDate}
                      classNames={{
                        inputWrapper: "border-gray-300 max-w-[200px]",
                      }}
                    />
                  </div>

                  {/* 画像URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      画像URL (オプション)
                    </label>
                    <Input
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="デフォルト: /jobs/izakaya.jpg"
                      variant="bordered"
                      classNames={{
                        inputWrapper: "border-gray-300",
                      }}
                    />
                  </div>
                </div>
              </section>

              {/* 区切り線 */}
              <hr className="border-gray-200" />

              {/* セクション3: タグ・チェックリスト */}
              <section>
                <SectionHeader
                  title="タグ・チェックリスト"
                  description="ジョブの分類タグと作業チェックリストを設定してください"
                />
                <div className="space-y-6">
                  {/* タグ */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      タグを選択
                    </label>
                    <CheckboxGroup
                      value={selectedTags}
                      onChange={(values) => setSelectedTags(values as string[])}
                      orientation="horizontal"
                      classNames={{
                        wrapper: "gap-3 flex-wrap",
                      }}
                    >
                      {TAG_OPTIONS.map((tag) => (
                        <Checkbox
                          key={tag}
                          value={tag}
                          classNames={{
                            base: "inline-flex items-center min-w-[120px] max-w-full cursor-pointer rounded-lg gap-3 p-3 border-2 border-gray-200 hover:border-sky-300 hover:bg-sky-50 data-[selected=true]:border-sky-500 data-[selected=true]:bg-sky-50 transition-all",
                            wrapper:
                              "w-6 h-6 before:w-6 before:h-6 after:w-3 after:h-3",
                            label: "text-sm font-medium text-gray-700",
                          }}
                        >
                          {tag}
                        </Checkbox>
                      ))}
                    </CheckboxGroup>
                  </div>

                  {/* チェックリスト */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      チェックリスト
                    </label>
                    <div className="space-y-2">
                      {checklist.map((item, index) => (
                        <div key={item.id} className="flex items-center gap-2">
                          <span className="text-sm text-gray-500 w-6">
                            {index + 1}.
                          </span>
                          <Input
                            value={item.text}
                            onChange={(e) =>
                              handleChecklistTextChange(item.id, e.target.value)
                            }
                            placeholder="チェック項目を入力"
                            variant="bordered"
                            classNames={{
                              inputWrapper: "border-gray-300",
                            }}
                          />
                          <Button
                            isIconOnly
                            variant="light"
                            color="danger"
                            onPress={() => handleRemoveChecklistItem(item.id)}
                            className="min-w-unit-8 w-8 h-8"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="bordered"
                      startContent={<Plus size={16} />}
                      onPress={handleAddChecklistItem}
                      className="mt-3 border-gray-300 text-gray-600"
                    >
                      項目を追加
                    </Button>
                  </div>
                </div>
              </section>

              {/* 区切り線 */}
              <hr className="border-gray-200" />

              {/* 送信ボタン */}
              <div className="pt-2">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-14 text-lg font-bold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
                >
                  作成する
                </Button>
                <p className="text-center text-xs text-gray-500 mt-3">
                  作成後、ダッシュボードで確認できます
                </p>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
