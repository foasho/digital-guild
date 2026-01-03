import type { Job } from "@/types";

// ===== 大分幸子(id: 1000)のジョブ =====

export const oitaJob1: Job = {
  id: 1001,
  requesterId: 1000,
  title: "温泉旅館の接客補助",
  description:
    "大分県別府温泉の老舗旅館で接客のお手伝いをお願いします。お客様のお迎えやお部屋への案内、食事の配膳補助などをしていただきます。温泉入浴と郷土料理の賄い付きです。",
  reward: 9000,
  aiInsentiveReward: 0, // 別府温泉は観光地のため
  location: "大分県別府市",
  latitude: 33.2847,
  longitude: 131.4913,
  imageUrl: "/jobs/ryokan.png",
  tags: ["接客", "旅館", "おもてなし"],
  capacity: 2,
  checklist: [
    { id: 1001, text: "旅館フロントで受付" },
    { id: 1002, text: "制服着替え・挨拶研修" },
    { id: 1003, text: "お客様案内完了" },
    { id: 1004, text: "配膳補助完了" },
    { id: 1005, text: "片付け・作業報告" },
  ],
  scheduledDate: "2026-01-15",
  createdAt: "2025-12-25T00:00:00Z",
  updatedAt: "2025-12-25T00:00:00Z",
};

export const oitaJob2: Job = {
  id: 1002,
  requesterId: 1000,
  title: "地元商店街のPR動画撮影",
  description:
    "大分市中心部の商店街活性化のためのPR動画撮影をお手伝いいただきます。各店舗への取材同行やインタビューのサポート、機材の運搬などをお願いします。",
  reward: 11000,
  aiInsentiveReward: 55,
  location: "大分県大分市",
  latitude: 33.2382,
  longitude: 131.6126,
  imageUrl: "/jobs/izakaya.jpg",
  tags: ["撮影", "取材", "地域活性"],
  capacity: 3,
  checklist: [
    { id: 1006, text: "商店街入口で集合" },
    { id: 1007, text: "撮影機材準備完了" },
    { id: 1008, text: "店舗取材1〜5件完了" },
    { id: 1009, text: "店舗取材6〜10件完了" },
    { id: 1010, text: "機材片付け・作業報告" },
  ],
  scheduledDate: "2026-01-20",
  createdAt: "2025-12-28T00:00:00Z",
  updatedAt: "2025-12-28T00:00:00Z",
};

// ===== 既存の募集中ジョブ =====

export const izakayaJob: Job = {
  id: 1,
  requesterId: 1,
  title: "動画撮影おてつだい",
  description:
    "地元の居酒屋のPR動画撮影のお手伝いをお願いします。カメラの操作補助や照明のセッティング、撮影中の小道具の準備などをしていただきます。撮影経験がなくても大丈夫です。スタッフが丁寧に指導します。",
  reward: 12000,
  aiInsentiveReward: 60,
  location: "山形県湯煙町",
  latitude: 38.2404,
  longitude: 140.3633,
  imageUrl: "/jobs/izakaya.jpg",
  tags: ["撮影", "接客", "軽作業"],
  capacity: 2,
  checklist: [
    { id: 1, text: "集合場所に到着" },
    { id: 2, text: "機材のセッティング完了" },
    { id: 3, text: "撮影補助完了" },
    { id: 4, text: "片付け完了" },
  ],
  scheduledDate: "2026-01-06",
  createdAt: "2025-12-20T00:00:00Z",
  updatedAt: "2025-12-20T00:00:00Z",
};

export const noukaJob: Job = {
  id: 2,
  requesterId: 2,
  title: "みかん収穫のおてつだい",
  description:
    "愛媛県みかん里町の農園でみかんの収穫作業をお手伝いいただきます。脚立を使った作業がありますが、初心者でも安心して参加できます。収穫したみかんのお土産付きです。",
  reward: 8000,
  aiInsentiveReward: 40,
  location: "愛媛県みかん里町",
  latitude: 33.8416,
  longitude: 132.7656,
  imageUrl: "/jobs/nouka.png",
  tags: ["農作業", "収穫", "屋外作業"],
  capacity: 5,
  checklist: [
    { id: 5, text: "農園に到着・受付完了" },
    { id: 6, text: "収穫道具の受け取り" },
    { id: 7, text: "午前の収穫作業完了" },
    { id: 8, text: "午後の収穫作業完了" },
    { id: 9, text: "道具の返却・作業報告" },
  ],
  scheduledDate: "2026-01-08",
  createdAt: "2025-12-18T00:00:00Z",
  updatedAt: "2025-12-18T00:00:00Z",
};

export const ryokanJob: Job = {
  id: 3,
  requesterId: 3,
  title: "旅館の庭先掃除のお手伝い",
  description:
    "老舗旅館の日本庭園の掃除をお手伝いいただきます。落ち葉の掃除や石畳の清掃、植木の手入れ補助などをお願いします。作業後は温泉入浴の特典があります。",
  reward: 10000,
  aiInsentiveReward: 50,
  location: "石川県温泉郷町",
  latitude: 36.5613,
  longitude: 136.6562,
  imageUrl: "/jobs/ryokan.png",
  tags: ["清掃", "庭仕事", "軽作業"],
  capacity: 3,
  checklist: [
    { id: 10, text: "旅館フロントで受付" },
    { id: 11, text: "清掃道具の準備" },
    { id: 12, text: "庭園の落ち葉掃除完了" },
    { id: 13, text: "石畳の清掃完了" },
    { id: 14, text: "道具の片付け・作業報告" },
  ],
  scheduledDate: "2026-01-11",
  createdAt: "2025-12-15T00:00:00Z",
  updatedAt: "2025-12-15T00:00:00Z",
};

// ===== 過去ジョブ（完了済み用） =====

export const pastJob101: Job = {
  id: 101,
  requesterId: 101,
  title: "イベント会場設営のお手伝い",
  description:
    "地域のお祭りイベント会場の設営作業をお手伝いいただきます。テントの設置や椅子・テーブルの配置などをお願いします。",
  reward: 9000,
  aiInsentiveReward: 45,
  location: "北海道札幌市",
  latitude: 43.0618,
  longitude: 141.3545,
  imageUrl: "/jobs/izakaya.jpg",
  tags: ["イベント", "設営", "力仕事"],
  capacity: 5,
  checklist: [
    { id: 101, text: "会場到着・受付" },
    { id: 102, text: "テント設営完了" },
    { id: 103, text: "備品配置完了" },
  ],
  scheduledDate: "2025-11-01",
  createdAt: "2025-10-20T00:00:00Z",
  updatedAt: "2025-10-20T00:00:00Z",
};

export const pastJob102: Job = {
  id: 102,
  requesterId: 102,
  title: "カフェ店舗の内装手伝い",
  description:
    "新規オープンするカフェの内装作業をお手伝いいただきます。家具の組み立てや配置、装飾品の設置などをお願いします。",
  reward: 10000,
  aiInsentiveReward: 0, // 東京都渋谷区は人が集まりやすい
  location: "東京都渋谷区",
  latitude: 35.6580,
  longitude: 139.7016,
  imageUrl: "/jobs/nouka.png",
  tags: ["内装", "組立", "軽作業"],
  capacity: 3,
  checklist: [
    { id: 104, text: "店舗到着・打合せ" },
    { id: 105, text: "家具組立完了" },
    { id: 106, text: "装飾設置完了" },
  ],
  scheduledDate: "2025-11-05",
  createdAt: "2025-10-25T00:00:00Z",
  updatedAt: "2025-10-25T00:00:00Z",
};

export const pastJob103: Job = {
  id: 103,
  requesterId: 103,
  title: "農産物直売所のお手伝い",
  description:
    "地元農産物の直売イベントでの販売補助をお願いします。商品の陳列や接客、レジ補助などをしていただきます。",
  reward: 7500,
  aiInsentiveReward: 38,
  location: "長野県松本市",
  latitude: 36.2380,
  longitude: 137.9720,
  imageUrl: "/jobs/ryokan.png",
  tags: ["販売", "接客", "イベント"],
  capacity: 4,
  checklist: [
    { id: 107, text: "会場到着・準備" },
    { id: 108, text: "商品陳列完了" },
    { id: 109, text: "販売業務完了" },
  ],
  scheduledDate: "2025-11-10",
  createdAt: "2025-11-01T00:00:00Z",
  updatedAt: "2025-11-01T00:00:00Z",
};

export const pastJob104: Job = {
  id: 104,
  requesterId: 104,
  title: "倉庫整理のお手伝い",
  description:
    "企業倉庫の在庫整理作業をお手伝いいただきます。商品の仕分けや棚への配置、在庫チェックなどをお願いします。",
  reward: 8500,
  aiInsentiveReward: 43,
  location: "大阪府堺市",
  latitude: 34.5733,
  longitude: 135.4829,
  imageUrl: "/jobs/izakaya.jpg",
  tags: ["倉庫", "整理", "軽作業"],
  capacity: 6,
  checklist: [
    { id: 110, text: "倉庫到着・説明" },
    { id: 111, text: "仕分け作業完了" },
    { id: 112, text: "棚配置完了" },
  ],
  scheduledDate: "2025-11-15",
  createdAt: "2025-11-05T00:00:00Z",
  updatedAt: "2025-11-05T00:00:00Z",
};

export const pastJob105: Job = {
  id: 105,
  requesterId: 105,
  title: "写真撮影アシスタント",
  description:
    "観光地でのプロモーション写真撮影のアシスタントをお願いします。機材運搬や照明補助などをしていただきます。",
  reward: 11000,
  aiInsentiveReward: 0, // 京都は観光地のため
  location: "京都府京都市",
  latitude: 35.0116,
  longitude: 135.7681,
  imageUrl: "/jobs/nouka.png",
  tags: ["撮影", "アシスタント", "観光"],
  capacity: 2,
  checklist: [
    { id: 113, text: "集合場所到着" },
    { id: 114, text: "機材準備完了" },
    { id: 115, text: "撮影補助完了" },
  ],
  scheduledDate: "2025-11-20",
  createdAt: "2025-11-10T00:00:00Z",
  updatedAt: "2025-11-10T00:00:00Z",
};

export const pastJob106: Job = {
  id: 106,
  requesterId: 106,
  title: "海岸清掃ボランティア",
  description:
    "地域の海岸清掃活動に参加していただきます。ゴミ拾いや分別作業をお願いします。軽食とドリンク付きです。",
  reward: 6000,
  aiInsentiveReward: 0, // 鎌倉は観光地のため
  location: "神奈川県鎌倉市",
  latitude: 35.3192,
  longitude: 139.5467,
  imageUrl: "/jobs/ryokan.png",
  tags: ["清掃", "ボランティア", "屋外"],
  capacity: 10,
  checklist: [
    { id: 116, text: "集合・説明" },
    { id: 117, text: "清掃作業完了" },
    { id: 118, text: "ゴミ分別完了" },
  ],
  scheduledDate: "2025-11-25",
  createdAt: "2025-11-15T00:00:00Z",
  updatedAt: "2025-11-15T00:00:00Z",
};

export const pastJob107: Job = {
  id: 107,
  requesterId: 107,
  title: "引越し作業のお手伝い",
  description:
    "個人宅の引越し作業をお手伝いいただきます。荷物の梱包補助や運搬、新居での配置などをお願いします。",
  reward: 12000,
  aiInsentiveReward: 0, // 福岡は都市部のため
  location: "福岡県福岡市",
  latitude: 33.5902,
  longitude: 130.4017,
  imageUrl: "/jobs/izakaya.jpg",
  tags: ["引越し", "運搬", "力仕事"],
  capacity: 3,
  checklist: [
    { id: 119, text: "現住所到着" },
    { id: 120, text: "梱包・積込完了" },
    { id: 121, text: "新居配置完了" },
  ],
  scheduledDate: "2025-12-01",
  createdAt: "2025-11-20T00:00:00Z",
  updatedAt: "2025-11-20T00:00:00Z",
};

export const pastJob108: Job = {
  id: 108,
  requesterId: 108,
  title: "クリスマスイベント補助",
  description:
    "商業施設でのクリスマスイベントの運営補助をお願いします。来場者案内やワークショップの補助などをしていただきます。",
  reward: 9500,
  aiInsentiveReward: 0, // 名古屋は都市部のため
  location: "愛知県名古屋市",
  latitude: 35.1815,
  longitude: 136.9066,
  imageUrl: "/jobs/nouka.png",
  tags: ["イベント", "接客", "季節"],
  capacity: 8,
  checklist: [
    { id: 122, text: "会場到着・準備" },
    { id: 123, text: "来場者対応" },
    { id: 124, text: "片付け完了" },
  ],
  scheduledDate: "2025-12-10",
  createdAt: "2025-12-01T00:00:00Z",
  updatedAt: "2025-12-01T00:00:00Z",
};

export const pastJob109: Job = {
  id: 109,
  requesterId: 109,
  title: "年末大掃除のお手伝い",
  description:
    "オフィスビルの年末大掃除をお手伝いいただきます。窓拭きや床清掃、不用品の整理などをお願いします。",
  reward: 10500,
  aiInsentiveReward: 0, // 東京都心は人が集まりやすい
  location: "東京都千代田区",
  latitude: 35.6938,
  longitude: 139.7533,
  imageUrl: "/jobs/ryokan.png",
  tags: ["清掃", "オフィス", "年末"],
  capacity: 5,
  checklist: [
    { id: 125, text: "ビル到着・説明" },
    { id: 126, text: "清掃作業完了" },
    { id: 127, text: "最終チェック" },
  ],
  scheduledDate: "2025-12-20",
  createdAt: "2025-12-10T00:00:00Z",
  updatedAt: "2025-12-10T00:00:00Z",
};

export const pastJob110: Job = {
  id: 110,
  requesterId: 110,
  title: "地域祭りの屋台補助",
  description:
    "地域の夏祭りで屋台の運営補助をお願いします。調理補助や販売、お客様対応などをしていただきます。",
  reward: 8000,
  aiInsentiveReward: 0, // 広島は都市部のため
  location: "広島県広島市",
  latitude: 34.3853,
  longitude: 132.4553,
  imageUrl: "/jobs/izakaya.jpg",
  tags: ["祭り", "屋台", "接客"],
  capacity: 4,
  checklist: [
    { id: 128, text: "屋台到着・準備" },
    { id: 129, text: "販売業務完了" },
    { id: 130, text: "片付け完了" },
  ],
  scheduledDate: "2025-08-15",
  createdAt: "2025-08-01T00:00:00Z",
  updatedAt: "2025-08-01T00:00:00Z",
};

// 現在募集中のジョブ（大分幸子のジョブを含む）
export const jobs: Job[] = [oitaJob1, oitaJob2, izakayaJob, noukaJob, ryokanJob];

// 過去ジョブ（完了済み用）
export const pastJobs: Job[] = [
  pastJob101,
  pastJob102,
  pastJob103,
  pastJob104,
  pastJob105,
  pastJob106,
  pastJob107,
  pastJob108,
  pastJob109,
  pastJob110,
];

// 全ジョブ
export const allJobs: Job[] = [...jobs, ...pastJobs];
