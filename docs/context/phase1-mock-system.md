# Phase 1 モックシステム仕様書

## 概要

Phase 1では、DIGITAL GUILDのフロントエンドモックを実装し、サービスの全体的なUX/UIフローを検証可能な状態にします。

バックエンドAPIやブロックチェーン連携は未実装であり、LocalStorageとZustandによるクライアントサイドのデータ永続化で動作を再現しています。

---

## システムアーキテクチャ

```
┌─────────────────────────────────────────────────────────────┐
│                     Phase 1 Mock System                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐         ┌─────────────────┐           │
│  │   Worker UI     │         │  Requester UI   │           │
│  │   (労働者)       │         │   (発注者)       │           │
│  └────────┬────────┘         └────────┬────────┘           │
│           │                           │                     │
│           └───────────┬───────────────┘                     │
│                       │                                     │
│           ┌───────────▼───────────┐                        │
│           │    Zustand Stores     │                        │
│           │   (状態管理)           │                        │
│           └───────────┬───────────┘                        │
│                       │                                     │
│           ┌───────────▼───────────┐                        │
│           │    Mock API Layer     │                        │
│           │  (LocalStorage連携)   │                        │
│           └───────────┬───────────┘                        │
│                       │                                     │
│           ┌───────────▼───────────┐                        │
│           │     LocalStorage      │                        │
│           │   (データ永続化)       │                        │
│           └───────────────────────┘                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## データモデル

### 主要エンティティ

#### Worker（労働者）
```typescript
interface Worker {
  id: number;
  name: string;
  birth: string;
  gender: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}
```

#### Requester（発注者）
```typescript
interface Requester {
  id: number;
  name: string;
  address: string;
  createdAt: string;
}
```

#### Job（ジョブ）
```typescript
interface Job {
  id: number;
  requesterId: number;
  title: string;
  description: string;
  reward: number;
  aiInsentiveReward: number;      // AIによる追加報酬
  location: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
  tags: string[];
  capacity: number;               // 募集人数
  checklist: ChecklistItem[];     // 作業チェックリスト
  scheduledDate: string;
  createdAt: string;
  updatedAt: string;
}
```

#### UndertakedJob（着手ジョブ）
```typescript
interface UndertakedJob {
  id: number;
  workerId: number;
  jobId: number;
  status: "applied" | "accepted" | "completion_reported" | "completed" | "canceled";
  requesterEvalScore: number | null;
  appliedAt: string | null;
  acceptedAt: string | null;
  completionReportedAt: string | null;
  canceledAt: string | null;
  finishedAt: string | null;
  completionMemo: string | null;
  completedChecklistIds: number[] | null;
}
```

#### TrustPassport（ギルド証）
```typescript
interface TrustPassport {
  id: number;
  workerId: number;
  trustScore: number;
  balance: number;               // JPYC残高
}
```

#### TransactionHistory（取引履歴）
```typescript
interface TransactionHistory {
  id: number;
  workerId: number;
  to: string;
  from: string;
  amount: number;
  description: string;
  tradedAt: string;
}
```

#### WorkerNotification / RequesterNotification（通知）
```typescript
interface WorkerNotification {
  id: number;
  workerId: number;
  confirmedAt: string | null;    // nullは未読
  title: string;
  description: string;
  url: string | null;            // 詳細リンク
  createdAt: string;
}

interface RequesterNotification {
  id: number;
  requesterId: number;
  confirmedAt: string | null;
  title: string;
  description: string;
  url: string | null;
  createdAt: string;
}
```

---

## ジョブステータスフロー

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         ジョブステータスフロー                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  [Worker]                          [Requester]                         │
│      │                                  │                               │
│      │ 1. 応募する                       │                               │
│      ├──────────────────────────────────>│                               │
│      │     status: "applied"            │                               │
│      │     通知: 新しい応募がありました    │                               │
│      │                                  │                               │
│      │                      2. 採用確定  │                               │
│      │<──────────────────────────────────┤                               │
│      │     status: "accepted"           │                               │
│      │     通知: 採用されました！          │                               │
│      │                                  │                               │
│      │ 3. 完了報告                       │                               │
│      ├──────────────────────────────────>│                               │
│      │     status: "completion_reported"│                               │
│      │     通知: 完了報告がありました      │                               │
│      │                                  │                               │
│      │                 4. 評価 + 報酬支払 │                               │
│      │<──────────────────────────────────┤                               │
│      │     status: "completed"          │                               │
│      │     通知: 報酬が振り込まれました    │                               │
│      │     TrustPassport.balance 更新   │                               │
│      │     TransactionHistory 追加      │                               │
│      ▼                                  ▼                               │
│                                                                         │
│  ※ キャンセルの場合: status: "canceled"                                  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 画面構成

### Worker UI（労働者向け）

| 画面 | パス | 機能 |
|------|------|------|
| 掲示板 | `/worker/request-boards` | ジョブ一覧の検索・フィルター・詳細モーダル |
| マップ | `/worker/request-map` | 地図上でジョブを探す |
| ジョブ管理 | `/worker/jobs` | 応募中・進行中・完了報告待ち・完了済みジョブの確認 |
| ウォレット | `/worker/wallet` | JPYC残高・取引履歴の確認 |

#### 共通コンポーネント
- **WorkerHeader**: ロゴ、通知ベル（未読バッジ付き）、メニュー
- **GuildCard**: ギルド証（TrustPassport）表示 - 名前、残高、ランク
- **BottomNav**: 掲示板、マップ、ジョブ、ウォレットのナビゲーション
- **JobDetailModal**: ジョブ詳細と応募機能（ローディング→完了→応募済み）
- **JobFilter**: スキル、報酬範囲でのフィルタリングモーダル
- **CompletionReportModal**: 完了報告モーダル（チェックリスト、メモ）

### Requester UI（発注者向け）

| 画面 | パス | 機能 |
|------|------|------|
| ダッシュボード | `/requester/dashboard` | 発注済みジョブの管理（タブ切り替え） |
| ジョブ詳細 | `/requester/jobs/[job_id]` | 応募者一覧・AIレコメンド確認 |
| 着手ジョブ詳細 | `/requester/undertaked_jobs/[undertaked_job_id]` | 応募者選定・評価・報酬支払 |

#### ダッシュボードタブ
- **応募中**: 応募者がいるジョブ（要選定アラート表示）
- **進行中**: 作業中のジョブ
- **確認待ち**: 完了報告があり評価待ちのジョブ（アラート表示）
- **完了**: 評価・支払済みのジョブ

---

## 通知システム

### 通知トリガー

| トリガー | 送信先 | タイトル | URL |
|---------|--------|---------|-----|
| Worker応募時 | Requester | 新しい応募がありました | `/requester/undertaked_jobs/[id]` |
| Requester採用確定時 | Worker | 採用されました！ | `/worker/jobs` |
| Worker完了報告時 | Requester | 完了報告がありました | `/requester/undertaked_jobs/[id]` |
| Requester評価・支払時 | Worker | 報酬が振り込まれました | `/worker/wallet` |

### 通知UI
- 未読通知は赤いバッジで件数表示
- 通知モーダルで一覧表示
- 「すべて既読」ボタンで一括既読化
- 各通知から詳細ページへのリンク

---

## 状態管理（Zustand Stores）

### Worker Stores

| ストア | 用途 |
|--------|------|
| `useWorkerStore` | ログイン中のWorker情報 |
| `useJobStore` | ジョブ一覧 |
| `useUndertakedJobStore` | 着手ジョブ一覧 |
| `useBookmarkStore` | ブックマーク |
| `useTrustPassportStore` | ギルド証（信用スコア、残高） |
| `useWalletStore` | 取引履歴 |
| `useNotificationStore` | 通知一覧 |
| `useRequesterStore` | 発注者情報（表示用） |

### Requester Stores

| ストア | 用途 |
|--------|------|
| `useRequesterStore` | ログイン中のRequester情報 |
| `useJobStore` | 発注済みジョブ一覧 |
| `useUndertakedJobStore` | 着手ジョブ一覧 |
| `useSubsidyStore` | 補助金情報 |
| `useNotificationStore` | 通知一覧 |

---

## Mock API Layer

### LocalStorage キー

| キー | 内容 |
|------|------|
| `digital-guild-jobs` | ジョブ一覧 |
| `digital-guild-undertaked-jobs` | 着手ジョブ一覧 |
| `digital-guild-bookmarks` | ブックマーク |
| `digital-guild-trust-passports` | ギルド証 |
| `digital-guild-transaction-histories` | 取引履歴 |
| `digital-guild-worker-notifications` | Worker通知 |
| `digital-guild-requester-notifications` | Requester通知 |

### API クラス一覧

| API | 主な機能 |
|-----|---------|
| `JobApi` | ジョブのCRUD |
| `UndertakedJobApi` | 着手ジョブのCRUD、ステータス更新 |
| `BookmarkJobApi` | ブックマークの追加・削除 |
| `TrustPassportApi` | スコア・残高の取得・更新 |
| `TransactionHistoryApi` | 取引履歴の追加・取得 |
| `WorkerNotificationApi` | 通知の作成・既読化 |
| `RequesterNotificationApi` | 通知の作成・既読化 |
| `JobAiRecommendApi` | AIレコメンド取得 |

---

## 初期モックデータ

### Worker（労働者）
- **田中一郎** (ID: 1): 20歳男性、大分県在住、初期TrustScore: 25、初期残高: 81,520 JPYC

### Requester（発注者）
- **山田花子** (ID: 1000): 大分県温泉郷町

### Jobs（ジョブ）
12件のサンプルジョブ：
- みかん収穫のおてつだい（愛媛県）- AIレコメンド対象
- 旅館の庭先掃除のお手伝い（石川県）
- 地元商店街のPR動画撮影（大分県）
- その他、全国各地のジョブ

### UndertakedJobs（着手ジョブ）
様々なステータスのサンプルデータ：
- 進行中（accepted）
- 完了報告待ち（completion_reported）
- 完了済み（completed）
- 応募中（applied）

---

## UI/UXの特徴

### デザインコンセプト
- **ダークテーマ**: 宇宙/星空をイメージしたダークUI
- **ゴールドアクセント**: アンバー/ゴールドをアクセントカラーに
- **モバイルファースト**: スマートフォンでの操作を最優先

### インタラクション
- **ボトムシートモーダル**: 詳細表示は下からスライドするモーダル
- **ローディングアニメーション**: 応募時などの状態遷移をスムーズに表現
- **リアルタイム風更新**: ページ遷移時にLocalStorageから最新データを取得

### 応募フロー（Worker）
1. 「応募する」ボタン押下
2. ローディング表示（「応募中...」+ スピナー）
3. 完了表示（「応募完了しました」+ チェックマーク）
4. 応募済み状態（「応募済み」+ グレーアウト・非活性）

### 評価・支払フロー（Requester）
1. 完了報告を確認
2. チェックリストと作業メモを確認
3. 星評価（1-5）を入力
4. 「承認して報酬を支払う」ボタン押下
5. ステップ表示でプログレス表示
   - 評価を記録中...
   - ジョブを完了処理中...
   - 信用スコアを更新中...
   - 報酬を振り込み中...
   - 通知を送信中...
6. 完了

---

## 開発者向け情報

### ディレクトリ構造

```
frontend/
├── app/
│   ├── worker/              # Worker UI
│   │   ├── request-boards/  # 掲示板
│   │   ├── request-map/     # マップ
│   │   ├── jobs/            # ジョブ管理
│   │   ├── wallet/          # ウォレット
│   │   └── layout.tsx       # 共通レイアウト
│   └── requester/           # Requester UI
│       ├── dashboard/       # ダッシュボード
│       ├── jobs/            # ジョブ詳細
│       ├── undertaked_jobs/ # 着手ジョブ詳細
│       └── layout.tsx       # 共通レイアウト
├── components/
│   ├── layout/              # 共通レイアウト
│   │   ├── WorkerHeader.tsx
│   │   ├── GuildCard.tsx
│   │   └── BottomNav.tsx
│   ├── worker/              # Worker専用
│   │   ├── JobCard.tsx
│   │   ├── JobDetailModal.tsx
│   │   ├── JobFilter.tsx
│   │   └── CompletionReportModal.tsx
│   └── requester/           # Requester専用
├── stores/
│   ├── workers/             # Worker用ストア
│   └── requesters/          # Requester用ストア
├── hooks/
│   ├── workers/             # Worker用フック
│   └── requesters/          # Requester用フック
├── constants/
│   ├── mocks/               # 初期モックデータ
│   └── api-mocks/           # Mock APIクラス
├── types/                   # 型定義
└── lib/                     # ライブラリ（Gemini等）
```

### 起動方法

```bash
cd frontend
bun install
bun run dev
```

### 環境変数

```bash
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_MAP_API_KEY=your_google_map_api_key
```

---

## Phase 2以降への移行

Phase 1のモックシステムは、Phase 2以降で以下に置き換えられます：

| Phase 1 (Mock) | Phase 2+ (Production) |
|----------------|----------------------|
| LocalStorage | PostgreSQL / Supabase |
| Mock API | REST API / GraphQL |
| Zustand (クライアント) | Zustand + Server State |
| モック通知 | WebSocket / Push通知 |
| JPYC (表示のみ) | JPYC (実決済) |
| TrustScore (計算のみ) | Smart Contract (SBT/VC) |

---

## 参考資料

- [README.md](../../README.md) - プロジェクト概要
- [サービスコンテキスト](./service-context-docs.md) - サービス全体像
- [DIGITAL GUILD SERVICE.pdf](./DIGITAL%20GUILD%20SERVICE.pdf) - サービス企画書

---

*最終更新: 2026年1月*

