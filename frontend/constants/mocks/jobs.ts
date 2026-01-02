import type { Job } from "@/types";

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

export const jobs: Job[] = [izakayaJob, noukaJob, ryokanJob];
