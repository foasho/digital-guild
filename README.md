# DIGITAL GUILD

**JPYCを活用した地方創生ジョブマッチングプラットフォーム**

[![Demo](https://img.shields.io/badge/Demo-Worker%20UI-blue)](https://digital-guild.vercel.app/worker/request-boards)
[![Demo](https://img.shields.io/badge/Demo-Requester%20UI-green)](https://digital-guild.vercel.app/requester/dashboard)

---

## 概要

DIGITAL GUILDは、自由に働きたい若者（冒険者）と労働者不足に悩む地方（地域の人々）を繋ぐジョブマッチングサービスです。

Web3技術（JPYC、スマートコントラクト）を活用し、高速決済と透明性のある信用スコアシステムを実現します。

> 📖 詳細: [サービスコンテキスト](./docs/context/service-context-docs.md)

---

## デモ

| 対象 | URL | 説明 |
|------|-----|------|
| 🧑‍💼 労働者 | [Worker UI](https://digital-guild.vercel.app/worker/request-boards) | ジョブ検索・応募・ウォレット |
| 🏢 発注者 | [Requester UI](https://digital-guild.vercel.app/requester/dashboard) | ジョブ管理・評価・支払 |

> ⚠️ スマートフォン表示推奨（モバイルファーストUI）

---

## 開発フェーズ

| Phase | 内容 | 状態 |
|-------|------|------|
| Phase 1 | フロントエンドモック | ✅ 完了 |
| Phase 2 | バックエンド + Expo + Web3 | 📋 計画中 |
| Phase 3 | 全国展開 | 🔮 将来 |

> 📖 詳細: [開発ロードマップ](./docs/context/roadmap.md)

---

## 技術スタック

### Phase 1（現在）

| カテゴリ | 技術 |
|---------|------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI | HeroUI + Tailwind CSS |
| State | Zustand |
| Map | Leaflet |
| AI | Google Gemini API |
| Data | LocalStorage (Mock) |

### Phase 2（予定）

| カテゴリ | 技術 |
|---------|------|
| Web | Next.js (Requester UI) |
| Mobile | React Native / Expo (Worker UI) |
| Backend | Golang |
| Database | PostgreSQL / Supabase |
| Blockchain | Solidity + JPYC |

---

## Getting Started

### 必要環境

- Bun 1.x または Node.js 20.x

### セットアップ

```bash
# クローン
git clone https://github.com/foasho/digital-guild.git
cd digital-guild

# フロントエンド
cd frontend
bun install

# 環境変数
cp .env.example .env
# .env を編集

# 開発サーバー起動
bun run dev
```

### 環境変数

```bash
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_MAP_API_KEY=your_google_map_api_key
```

---

## ディレクトリ構成

```
digital-guild/
├── frontend/           # Next.js フロントエンド
│   ├── app/
│   │   ├── worker/     # 労働者向けUI
│   │   └── requester/  # 発注者向けUI
│   ├── admin/          # 管理者画面（Phase 2）
│   ├── components/     # UIコンポーネント
│   ├── stores/         # Zustand ストア
│   ├── hooks/          # カスタムフック
│   ├── constants/      # モックデータ・API
│   └── types/          # 型定義
├── expo/               # React Native アプリ（Phase 2: Worker向け）
├── backend/            # Golang バックエンド（Phase 2）
├── hardhat/            # スマートコントラクト（Phase 2）
├── infra/              # IaC（Terraform）（Phase 2）
└── docs/
    └── context/        # 仕様書・ロードマップ
```

| フォルダ | 説明 | Phase |
|---------|------|-------|
| `frontend/` | Next.js Webアプリ（Requester UI / 共通） | 1 |
| `frontend/admin/` | 管理者画面（Requester・マスタ管理） | 2 |
| `expo/` | React Native アプリ（Worker向けiOS/Android） | 2 |
| `backend/` | Golang APIサーバー | 2 |
| `hardhat/` | Solidityスマートコントラクト | 2 |
| `infra/` | IaC（Terraform / Pulumi等） | 2 |

> 📖 詳細: [Phase 1 モックシステム仕様](./docs/context/phase1-mock-system.md)

---

## 主な機能

### 労働者向け

- 📋 **掲示板**: ジョブ検索・フィルター
- 🗺️ **マップ**: 地図上でジョブ探索
- 💼 **ジョブ管理**: 応募中・進行中・完了の管理
- 💰 **ウォレット**: JPYC残高・取引履歴
- 🎖️ **ギルド証**: TrustPassport（信用スコア・ランク）
- 🔔 **通知**: リアルタイム通知

### 発注者向け

- 📊 **ダッシュボード**: ジョブ一覧管理
- 👥 **応募者選定**: AIレコメンド付き
- ⭐ **評価・支払**: 完了報告確認・報酬支払

---

## ドキュメント

| ドキュメント | 内容 |
|-------------|------|
| [サービスコンテキスト](./docs/context/service-context-docs.md) | サービス全体像 |
| [開発ロードマップ](./docs/context/roadmap.md) | Phase別開発計画 |
| [開発者ガイド](./docs/context/developer.md) | 環境構成・インフラ・テスト |
| [Phase 1 モック仕様](./docs/context/phase1-mock-system.md) | モックシステム詳細 |
| [Hardhat開発ガイド](./docs/context/hardhat.md) | ブロックチェーン開発（Phase 2） |

---

## ライセンス

TBD

---

## コントリビューション

TBD
