# 開発者ガイド

## 概要

DIGITAL GUILD開発における環境構成、インフラ、テスト戦略についてのドキュメントです。

---

## 環境構成

### 環境一覧

| 環境 | 用途 | ブランチ | URL |
|------|------|---------|-----|
| **local** | ローカル開発 | feature/* | `http://localhost:3000` |
| **staging** | 検証・QA | develop | TBD |
| **prod** | 本番 | main | TBD |

### 環境別構成表

| 項目 | local | staging | prod |
|------|-------|---------|------|
| **Frontend** | localhost:3000 | Amplify (staging) | Amplify (prod) |
| **Backend** | localhost:8080 | ECS (staging) | ECS (prod) |
| **Database** | Docker PostgreSQL | RDS (staging) | RDS (prod) |
| **Blockchain** | Hardhat Local | Avalanche Fuji | Avalanche C-Chain |
| **JPYC** | Mock Token | Test Token | Real JPYC |

---

## ブロックチェーンネットワーク

### 使用ネットワーク

| 環境 | ネットワーク | Chain ID | Explorer |
|------|-------------|----------|----------|
| **local** | Hardhat Network | 31337 | - |
| **staging** | Avalanche Fuji | 43113 | [Snowtrace Testnet](https://testnet.snowtrace.io) |
| **prod** | Avalanche C-Chain | 43114 | [Snowtrace](https://snowtrace.io) |

### RPC エンドポイント

```bash
# Local
HARDHAT_RPC_URL=http://127.0.0.1:8545

# Staging (Fuji)
AVALANCHE_FUJI_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc

# Production (C-Chain)
AVALANCHE_RPC_URL=https://api.avax.network/ext/bc/C/rpc
```

### テストトークン取得

| ネットワーク | Faucet |
|-------------|--------|
| Avalanche Fuji | [Avalanche Faucet](https://faucet.avax.network/) |

---

## AWS インフラ構成

### アカウント構成（SwitchRole）

```
┌─────────────────────────────────────────────────────────────┐
│                    AWS Organizations                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐                                        │
│  │   Management    │  ← IAM Identity Center (SSO)          │
│  │    Account      │                                        │
│  └────────┬────────┘                                        │
│           │ SwitchRole                                      │
│    ┌──────┴──────┐                                          │
│    │             │                                          │
│    ▼             ▼                                          │
│ ┌──────────┐  ┌──────────┐                                  │
│ │ Staging  │  │   Prod   │                                  │
│ │ Account  │  │ Account  │                                  │
│ └──────────┘  └──────────┘                                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### IAM ロール

| ロール名 | 用途 | 対象 |
|---------|------|------|
| `DeveloperRole` | 開発者用（ReadOnly + 一部Write） | エンジニア |
| `AdminRole` | 管理者用（Full Access） | テックリード |
| `DeployRole` | CI/CD用（デプロイ権限） | GitHub Actions |

---

## AWS Amplify ホスティング

### 構成

| 環境 | App名 | ブランチ | ドメイン |
|------|-------|---------|---------|
| staging | `digital-guild-staging` | develop | `staging.digital-guild.com` |
| prod | `digital-guild-prod` | main | `digital-guild.com` |

### リージョン

すべて **ap-northeast-1（東京）** を使用

### Amplify 設定

```yaml
# amplify.yml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - cd frontend
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: frontend/.next
    files:
      - '**/*'
  cache:
    paths:
      - frontend/node_modules/**/*
```

### 環境変数

| 変数名 | staging | prod | 説明 |
|--------|---------|------|------|
| `NEXT_PUBLIC_ENV` | staging | production | 環境識別 |
| `NEXT_PUBLIC_API_URL` | staging-api.xxx | api.xxx | APIエンドポイント |
| `NEXT_PUBLIC_CHAIN_ID` | 43113 | 43114 | Avalanche Chain ID |
| `GEMINI_API_KEY` | (Secrets Manager) | (Secrets Manager) | Gemini API |

---

## バックエンド構成

TBD

---

## CI/CD パイプライン

### GitHub Actions ワークフロー

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Push      │ ──▶ │   Build     │ ──▶ │   Test      │
│  feature/*  │     │   & Lint    │     │   (Unit)    │
└─────────────┘     └─────────────┘     └─────────────┘
                                               │
                                               ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Deploy    │ ◀── │   Build     │ ◀── │   Merge     │
│   Staging   │     │   Docker    │     │   develop   │
└─────────────┘     └─────────────┘     └─────────────┘
       │
       ▼ (手動承認)
┌─────────────┐
│   Deploy    │
│   Prod      │
└─────────────┘
```

---

## テスト戦略

### テストレベル

| レベル | 対象 | ツール | 実行タイミング |
|--------|------|--------|---------------|
| **Unit** | 関数・コンポーネント | Vitest / Jest | Push時（CI） |
| **Integration** | API・DB連携 | Vitest / Supertest | Push時（CI） |
| **E2E** | ユーザーフロー | Playwright | develop merge時 |
| **Contract** | スマートコントラクト | Hardhat / Chai | Push時（hardhat/のみ） |

### ディレクトリ構成

```
frontend/
├── __tests__/
│   ├── unit/           # ユニットテスト
│   │   ├── components/
│   │   ├── hooks/
│   │   └── utils/
│   ├── integration/    # 統合テスト
│   │   └── api/
│   └── e2e/            # E2Eテスト
│       └── scenarios/
│
backend/
├── internal/
│   └── *_test.go       # Go標準テスト
│
hardhat/
└── test/
    ├── TrustPassport.test.ts
    └── JobEscrow.test.ts
```

### ユニットテスト例（Frontend）

```typescript
// frontend/__tests__/unit/hooks/useJob.test.ts
import { renderHook, waitFor } from "@testing-library/react";
import { useJobs } from "@/hooks/useJobs";

describe("useJobs", () => {
  it("should fetch jobs successfully", async () => {
    const { result } = renderHook(() => useJobs());
    
    await waitFor(() => {
      expect(result.current.jobs.length).toBeGreaterThan(0);
    });
  });
});
```

### E2Eテスト例

```typescript
// frontend/__tests__/e2e/scenarios/job-application.spec.ts
import { test, expect } from "@playwright/test";

test.describe("ジョブ応募フロー", () => {
  test("Worker がジョブに応募できる", async ({ page }) => {
    // 1. 掲示板を開く
    await page.goto("/worker/request-boards");
    
    // 2. ジョブをクリック
    await page.click('[data-testid="job-card-1"]');
    
    // 3. 応募ボタンをクリック
    await page.click('[data-testid="apply-button"]');
    
    // 4. 応募完了を確認
    await expect(page.locator("text=応募完了")).toBeVisible();
  });
});
```

### スマートコントラクトテスト

```typescript
// hardhat/test/TrustPassport.test.ts
import { expect } from "chai";
import { ethers } from "hardhat";

describe("TrustPassport", () => {
  it("Should not allow transfer (SBT)", async () => {
    const [owner, worker, other] = await ethers.getSigners();
    const TrustPassport = await ethers.getContractFactory("TrustPassport");
    const passport = await TrustPassport.deploy();
    
    await passport.mint(worker.address);
    const tokenId = await passport.workerToTokenId(worker.address);
    
    await expect(
      passport.connect(worker).transferFrom(worker.address, other.address, tokenId)
    ).to.be.revertedWith("TrustPassport: transfer not allowed");
  });
});
```

### テストデータ管理

| 環境 | データ | 管理方法 |
|------|--------|---------|
| local | モックデータ | `constants/mocks/` |
| staging | シードデータ | マイグレーション + Seed |
| prod | 本番データ | - |

### テストカバレッジ目標

| 対象 | 目標 |
|------|------|
| Frontend (Unit) | 70% |
| Backend (Unit) | 80% |
| Smart Contract | 100% |

---

## ローカル開発セットアップ

### 必要ツール

| ツール | バージョン | 用途 |
|--------|-----------|------|
| Node.js | 20.x | Frontend |
| Bun | 1.x | パッケージ管理（高速） |
| Go | 1.22+ | Backend |
| Docker | 24.x | ローカルDB |
| AWS CLI | 2.x | AWS操作 |

### 起動手順

```bash
# 1. リポジトリクローン
git clone https://github.com/foasho/digital-guild.git
cd digital-guild

# 2. 環境変数設定
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
cp hardhat/.env.example hardhat/.env

# 3. 依存関係インストール
cd frontend && bun install && cd ..
cd backend && go mod download && cd ..
cd hardhat && bun install && cd ..

# 4. ローカルDB起動
docker compose up -d postgres

# 5. 各サービス起動
# Terminal 1: Frontend
cd frontend && bun run dev

# Terminal 2: Backend
cd backend && go run cmd/api/main.go

# Terminal 3: Hardhat (必要時)
cd hardhat && npx hardhat node
```

---

## Docker 開発環境

### Docker Compose 構成

```yaml
# docker-compose.yml
services:
  frontend:    # Next.js (port 3000)
  postgres:    # PostgreSQL (port 5432) Phase2
  hardhat:     # Hardhat Node (port 8545) Phase2
```

### 起動コマンド

```bash
# 全サービス起動
docker compose up -d

# フロントエンドのみ起動（DB含む）
docker compose up -d frontend

# ブロックチェーン開発時（Hardhat Nodeも起動）
docker compose --profile blockchain up -d

# ログ確認
docker compose logs -f frontend

# 停止
docker compose down

# ボリューム含めて削除
docker compose down -v
```

### Frontend Dockerfile

マルチステージビルドで開発/本番両対応：

| ステージ | 用途 |
|---------|------|
| `base` | Node.js + pnpm セットアップ |
| `deps` | 依存関係インストール |
| `dev` | 開発モード（ホットリロード対応） |
| `builder` | 本番ビルド |
| `runner` | 本番実行（軽量イメージ） |

### 環境変数

```bash
# .env（ルートディレクトリ）
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_MAP_API_KEY=your_google_map_api_key
```

### ボリュームマウント

開発時は以下がマウントされ、ホットリロードが有効：

```
./frontend:/app          # ソースコード
/app/node_modules        # コンテナ内で管理
/app/.next               # ビルド成果物
```

---

## 参考資料

- [サービスコンテキスト](./service-context-docs.md) - サービス全体像
- [開発ロードマップ](./roadmap.md) - Phase別開発計画
- [Hardhat開発ガイド](./hardhat.md) - スマートコントラクト開発
- [Phase 1 モックシステム仕様](./phase1-mock-system.md) - モック詳細

---

*最終更新: 2026年1月*

