# DIGITAL GUILD Frontend

JPYCを活用した地方創生ジョブマッチングシステムのフロントエンドアプリケーション。

## 概要

自由に働きたい若者と、労働者不足に悩む地方をつなぐジョブマッチングサービス。
AIによる適切なジョブマッチングと、補助金等の支援金を利用したインセンティブ設計により、特定エリアへの需要バランス調整を行います。

## Getting Started

```bash
# 依存関係のインストール
bun install

# 開発サーバーの起動
bun dev
```

[http://localhost:3000](http://localhost:3000) でアプリケーションにアクセスできます。

## 技術スタック

- **フレームワーク**: Next.js 16.1.1
- **言語**: TypeScript
- **UI**: HeroUI (TailwindCSS)
- **状態管理**: Zustand
- **バリデーション**: Zod
- **ユーティリティ**: es-toolkit
- **マップ**: Leaflet
- **Linter**: Biome

## アーキテクチャ

### データフロー

```
┌─────────────┐     ┌─────────────┐     ┌──────────────┐
│   Page      │ ──▶ │   Hook      │ ──▶ │   API        │
│ (Component) │     │ (useJobs等) │     │ (JobApi等)   │
└─────────────┘     └─────────────┘     └──────┬───────┘
                           │                    │
                           ▼                    ▼
                    ┌─────────────┐     ┌──────────────┐
                    │   Store     │     │ LocalStorage │
                    │ (Zustand)   │     │   (Mock DB)  │
                    └─────────────┘     └──────────────┘
```

### レイヤー構成

| レイヤー | 役割 | 例 |
|----------|------|-----|
| **Page/Component** | UI表示、ユーザーインタラクション | `app/worker/request-boards/page.tsx` |
| **Hook** | データ取得・操作のロジック、Storeへの反映 | `hooks/useJobs.ts` |
| **API** | LocalStorage(MockDB)へのCRUD操作 | `constants/api-mocks/jobApi.ts` |
| **Store** | クライアント側の状態管理（メモリ） | `stores/useJobStore.ts` |
| **LocalStorage** | モックデータベース（永続化） | ブラウザのLocalStorage |

### ルール

1. **Page → Hook → API の順序を厳守**
   - Pageは直接Storeを使わない
   - Pageは必ずHookを経由してデータにアクセスする

2. **例外: useWorker / useRequester**
   - 現在のユーザー情報のみ、直接モックデータを参照可能

3. **ID型はすべて`number`**
   - 本番環境のautoincrement IDを想定
   - 新規作成時は`maxId + 1`で生成

4. **初回起動時のデータロード**
   - `loadMockData()`がLocalStorageに初期データを投入
   - 2回目以降はLocalStorageから読み込み

## ディレクトリ構成

```
frontend/
├── app/                    # Next.js App Router
│   ├── worker/            # 労働者向けページ
│   │   ├── request-boards/  # 掲示板
│   │   ├── request-map/     # マップ
│   │   ├── jobs/            # ジョブ管理
│   │   └── wallet/          # ウォレット
│   ├── requester/         # 発注者向けページ
│   │   ├── dashboard/       # ダッシュボード
│   │   ├── jobs/            # ジョブ詳細・作成
│   │   └── undertaked_jobs/ # 着手ジョブ評価
│   └── api/               # API Routes
├── components/            # 共通コンポーネント
│   ├── layout/           # レイアウト系
│   ├── worker/           # 労働者向けコンポーネント
│   └── requester/        # 発注者向けコンポーネント
├── hooks/                 # カスタムフック
│   ├── useJobs.ts
│   ├── useUndertakedJobs.ts
│   ├── useBookmarks.ts
│   ├── useTrustPassport.ts
│   └── ...
├── stores/                # Zustand ストア
│   ├── useJobStore.ts
│   ├── useUndertakedJobStore.ts
│   └── ...
├── constants/
│   ├── api-mocks/        # モックAPI（LocalStorage操作）
│   │   ├── index.ts      # loadMockData, API exports
│   │   ├── jobApi.ts
│   │   └── ...
│   └── mocks/            # 初期モックデータ
│       ├── jobs.ts
│       ├── workers.ts
│       └── ...
├── types/                 # 型定義
│   ├── index.ts          # エンティティ型
│   └── apis/             # API パラメータ型
├── lib/                   # ライブラリ設定
├── utils/                 # ユーティリティ関数
└── public/               # 静的ファイル
```

## 詳細ドキュメント

システムの詳細な設計については以下を参照してください：

- [Phase1 モックシステム設計書](../docs/context/phase1-mock-system.md)
