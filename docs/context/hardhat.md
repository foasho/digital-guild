# Hardhat & ブロックチェーン開発ガイド

## 概要

DIGITAL GUILDでは、Phase 2以降でブロックチェーン技術を導入します。このドキュメントでは、Hardhatを使ったスマートコントラクト開発について、エンジニア向けに解説します。

---

## このプロジェクトで使うブロックチェーン技術

| 技術 | 用途 | 規格 |
|------|------|------|
| **TrustPassport** | 信用スコアをNFT化して可視化 | ERC-721 / SBT |
| **JPYC** | ステーブルコインによる即時報酬支払い | ERC-20 |
| **スマートコントラクト** | 信用スコア計算、報酬分配の自動化 | Solidity |

---

## Hardhatとは

[Hardhat](https://hardhat.org/) は、Ethereum系ブロックチェーンのスマートコントラクト開発に使われる標準的な開発環境

### 主な機能

| 機能 | 説明 |
|------|------|
| **コンパイル** | Solidityコードをバイトコードに変換 |
| **テスト** | JavaScript/TypeScriptでテストを記述・実行 |
| **デプロイ** | テストネット/メインネットへのデプロイスクリプト |
| **ローカルネットワーク** | 開発用のローカルブロックチェーン |
| **デバッグ** | console.logやスタックトレースでデバッグ |

### 類似ツールとの比較

| ツール | 特徴 |
|--------|------|
| **Hardhat** | TypeScript対応、プラグインが豊富、デバッグ機能が充実 |
| Foundry | Rustベース、高速、Solidityでテストを書く |
| Remix | ブラウザベースIDE、学習用に最適 |

---

## プロジェクト構成

```
hardhat/
├── contracts/           # Solidityコントラクト
│   ├── TrustPassport.sol   # 信用スコアNFT
│   ├── JobEscrow.sol       # 報酬エスクロー
│   └── interfaces/         # インターフェース
├── scripts/             # デプロイスクリプト
│   └── deploy.ts
├── test/                # テストコード
│   ├── TrustPassport.test.ts
│   └── JobEscrow.test.ts
├── hardhat.config.ts    # Hardhat設定
└── package.json
```

---

## DIGITAL GUILDで開発するコントラクト

### 1. TrustPassport（信用スコアNFT）

#### 概要

Worker（労働者）の信用スコアをNFT化し、ブロックチェーン上で可視化・検証可能にするコントラクトです。

#### 技術仕様

| 項目 | 内容 |
|------|------|
| 規格 | ERC-721（NFT） + SBT（譲渡不可） |
| チェーン | Avalanche C-Chain（低ガス代・高速ファイナリティ） |
| 所有権 | 1 Worker = 1 TrustPassport |
| 譲渡 | 不可（Soul Bound Token） |

#### データ構造

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TrustPassport is ERC721 {
    struct Passport {
        uint256 questsCompleted;  // 完了ジョブ数
        uint256 totalRating;      // 評価合計
        uint256 ratingCount;      // 評価数
        uint256 trustScore;       // 信用スコア（0-100）
        Rank rank;                // ランク
    }

    enum Rank { BRONZE, SILVER, GOLD, PLATINUM }

    mapping(uint256 => Passport) public passports;
    mapping(address => uint256) public workerToTokenId;

    // SBT: 譲渡を禁止
    function _update(address to, uint256 tokenId, address auth)
        internal
        override
        returns (address)
    {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) {
            revert("TrustPassport: transfer not allowed");
        }
        return super._update(to, tokenId, auth);
    }
}
```

#### 信用スコア計算ロジック

```solidity
function calculateTrustScore(uint256 tokenId) public view returns (uint256) {
    Passport memory p = passports[tokenId];
    
    // クエスト達成ポイント（最大50）
    uint256 questPoints = p.questsCompleted > 50 ? 50 : p.questsCompleted;
    
    // 人間評価ポイント（平均 × 10、最大50）
    uint256 ratingPoints = 0;
    if (p.ratingCount > 0) {
        // 評価は1-5の星評価
        ratingPoints = (p.totalRating * 10) / p.ratingCount;
    }
    
    // TrustScore = クエスト達成数（最大50） + 人間評価平均 × 10（最大50）
    return questPoints + ratingPoints;
}

function getRank(uint256 score) public pure returns (Rank) {
    if (score >= 80) return Rank.PLATINUM;
    if (score >= 70) return Rank.GOLD;
    if (score >= 60) return Rank.SILVER;
    return Rank.BRONZE;
}
```

#### 主要な関数

| 関数 | 説明 | 呼び出し元 |
|------|------|-----------|
| `mint(address worker)` | 新規Passport発行 | KYC完了時（バックエンド） |
| `recordJobCompletion(tokenId, rating)` | ジョブ完了記録 | JobEscrowコントラクト |
| `getTrustScore(tokenId)` | スコア取得 | フロントエンド / API |
| `getPassport(tokenId)` | Passport詳細取得 | フロントエンド |

---

### 2. JobEscrow（報酬エスクロー）

#### 概要

Requester（発注者）がジョブを作成する際に報酬をデポジットし、ジョブ完了後にWorkerへ自動支払いするコントラクトです。

#### 技術仕様

| 項目 | 内容 |
|------|------|
| 支払いトークン | JPYC（ERC-20） |
| エスクロー | コントラクトが報酬を一時保管 |
| 支払いトリガー | Requesterの承認 or 期限切れ自動承認 |

#### データ構造

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract JobEscrow {
    IERC20 public jpyc;
    TrustPassport public trustPassport;

    struct Job {
        uint256 id;
        address requester;      // 発注者
        address worker;         // 労働者（未割当時はaddress(0)）
        uint256 reward;         // 報酬（JPYC）
        JobStatus status;
        uint256 createdAt;
        uint256 deadline;
    }

    enum JobStatus {
        OPEN,           // 募集中
        APPLIED,        // 応募中
        IN_PROGRESS,    // 進行中
        COMPLETED,      // 完了報告済み
        APPROVED,       // 承認済み（支払完了）
        CANCELLED       // キャンセル
    }

    mapping(uint256 => Job) public jobs;
}
```

#### ジョブフロー

```
1. createJob()     : Requester がジョブ作成 + JPYC デポジット
       ↓
2. applyJob()      : Worker が応募
       ↓
3. acceptWorker()  : Requester が Worker を採用
       ↓
4. reportComplete(): Worker が完了報告
       ↓
5. approveJob()    : Requester が承認 → JPYC 支払い + TrustScore 更新
```

#### 主要な関数

```solidity
// ジョブ作成（Requester）
// 事前に JPYC.approve(address(this), reward) が必要
function createJob(uint256 reward, uint256 deadline) external returns (uint256 jobId) {
    // JPYC をコントラクトに転送（エスクロー）
    jpyc.transferFrom(msg.sender, address(this), reward);
    
    jobs[nextJobId] = Job({
        id: nextJobId,
        requester: msg.sender,
        worker: address(0),
        reward: reward,
        status: JobStatus.OPEN,
        createdAt: block.timestamp,
        deadline: deadline
    });
    
    return nextJobId++;
}

// ジョブ承認 + 支払い（Requester）
function approveJob(uint256 jobId, uint8 rating) external {
    Job storage job = jobs[jobId];
    require(msg.sender == job.requester, "Not requester");
    require(job.status == JobStatus.COMPLETED, "Not completed");
    require(rating >= 1 && rating <= 5, "Invalid rating");
    
    // Worker に JPYC 支払い
    jpyc.transfer(job.worker, job.reward);
    
    // TrustPassport に実績を記録
    uint256 tokenId = trustPassport.workerToTokenId(job.worker);
    trustPassport.recordJobCompletion(tokenId, rating);
    
    job.status = JobStatus.APPROVED;
}
```

---

### 3. JPYC連携

#### JPYCとは

[JPYC](https://jpyc.jp/) は、日本円に連動したステーブルコイン（ERC-20トークン）です。1 JPYC = 1円 で安定しています。

#### コントラクトアドレス（JPYC）

| ネットワーク | アドレス |
|-------------|----------|
| Ethereum Mainnet | `0x2370f9d504c7a6E775bf6E14B3F12846b594cD53` |
| Avalanche C-Chain | `0x431D5dfF03120AFA4bDf332c61A6e1766eF37BDB` |
| Avalanche Fuji (テスト) | テストトークンを使用 |

#### 使用方法

```solidity
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

IERC20 public jpyc = IERC20(JPYC_ADDRESS);

// 残高確認
uint256 balance = jpyc.balanceOf(address);

// 送金（事前にapproveが必要）
jpyc.transferFrom(from, to, amount);

// 直接送金（コントラクトが保有している場合）
jpyc.transfer(to, amount);
```

---

## 開発環境セットアップ

### 1. インストール

```bash
cd hardhat

# パッケージインストール
bun install

# または
npm install
```

### 2. 依存パッケージ

```json
{
  "devDependencies": {
    "hardhat": "^2.19.0",
    "@nomicfoundation/hardhat-toolbox": "^4.0.0",
    "@openzeppelin/contracts": "^5.0.0",
    "dotenv": "^16.0.0"
  }
}
```

### 3. 設定ファイル

```typescript
// hardhat.config.ts
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    // ローカル開発用
    hardhat: {},
    
    // Avalanche Fuji テストネット（staging）
    fuji: {
      url: process.env.AVALANCHE_FUJI_RPC_URL || "https://api.avax-test.network/ext/bc/C/rpc",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 43113,
    },
    
    // Avalanche C-Chain Mainnet（本番）
    avalanche: {
      url: process.env.AVALANCHE_RPC_URL || "https://api.avax.network/ext/bc/C/rpc",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 43114,
    },
  },
  etherscan: {
    apiKey: process.env.SNOWTRACE_API_KEY,
  },
};

export default config;
```

### 4. 環境変数

```bash
# .env
AVALANCHE_FUJI_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
AVALANCHE_RPC_URL=https://api.avax.network/ext/bc/C/rpc
PRIVATE_KEY=your_private_key_here
SNOWTRACE_API_KEY=your_api_key
```

---

## 開発コマンド

| コマンド | 説明 |
|---------|------|
| `npx hardhat compile` | コントラクトをコンパイル |
| `npx hardhat test` | テストを実行 |
| `npx hardhat node` | ローカルノードを起動 |
| `npx hardhat run scripts/deploy.ts --network fuji` | Fujiテストネットにデプロイ |
| `npx hardhat verify --network avalanche ADDRESS` | Snowtraceでコントラクト検証 |

---

## テスト例

```typescript
// test/TrustPassport.test.ts
import { expect } from "chai";
import { ethers } from "hardhat";
import { TrustPassport } from "../typechain-types";

describe("TrustPassport", function () {
  let trustPassport: TrustPassport;
  let owner: any;
  let worker: any;

  beforeEach(async function () {
    [owner, worker] = await ethers.getSigners();
    const TrustPassport = await ethers.getContractFactory("TrustPassport");
    trustPassport = await TrustPassport.deploy();
  });

  describe("Mint", function () {
    it("Should mint a passport to a worker", async function () {
      await trustPassport.mint(worker.address);
      expect(await trustPassport.balanceOf(worker.address)).to.equal(1);
    });
  });

  describe("SBT (Soul Bound)", function () {
    it("Should not allow transfer", async function () {
      await trustPassport.mint(worker.address);
      const tokenId = await trustPassport.workerToTokenId(worker.address);
      
      await expect(
        trustPassport.connect(worker).transferFrom(worker.address, owner.address, tokenId)
      ).to.be.revertedWith("TrustPassport: transfer not allowed");
    });
  });

  describe("Trust Score", function () {
    it("Should calculate trust score correctly", async function () {
      await trustPassport.mint(worker.address);
      const tokenId = await trustPassport.workerToTokenId(worker.address);
      
      // 10ジョブ完了、平均評価4
      for (let i = 0; i < 10; i++) {
        await trustPassport.recordJobCompletion(tokenId, 4);
      }
      
      // TrustScore = 10 (quests) + 40 (4 * 10) = 50
      const score = await trustPassport.getTrustScore(tokenId);
      expect(score).to.equal(50);
    });
  });
});
```

---

## デプロイフロー

### Phase 2 デプロイ計画

```
1. テストネット（Avalanche Fuji）デプロイ
   ├── TrustPassport コントラクト
   ├── JobEscrow コントラクト
   └── 統合テスト

2. セキュリティ監査
   └── 外部監査 or 自己監査

3. メインネット（Avalanche C-Chain）デプロイ
   ├── デプロイスクリプト実行
   ├── Snowtrace 検証
   └── フロントエンド連携
```

### デプロイスクリプト

```typescript
// scripts/deploy.ts
import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  // TrustPassport デプロイ
  const TrustPassport = await ethers.getContractFactory("TrustPassport");
  const trustPassport = await TrustPassport.deploy();
  await trustPassport.waitForDeployment();
  console.log("TrustPassport:", await trustPassport.getAddress());

  // JobEscrow デプロイ
  const JPYC_ADDRESS = "0x..."; // JPYC コントラクトアドレス
  const JobEscrow = await ethers.getContractFactory("JobEscrow");
  const jobEscrow = await JobEscrow.deploy(
    JPYC_ADDRESS,
    await trustPassport.getAddress()
  );
  await jobEscrow.waitForDeployment();
  console.log("JobEscrow:", await jobEscrow.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

---

## フロントエンドとの連携

### ethers.js / wagmi

```typescript
// frontend/lib/contracts.ts
import { ethers } from "ethers";
import TrustPassportABI from "./abi/TrustPassport.json";

const TRUST_PASSPORT_ADDRESS = "0x...";

export async function getTrustScore(workerAddress: string): Promise<number> {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const contract = new ethers.Contract(
    TRUST_PASSPORT_ADDRESS,
    TrustPassportABI,
    provider
  );
  
  const tokenId = await contract.workerToTokenId(workerAddress);
  const score = await contract.getTrustScore(tokenId);
  return Number(score);
}
```

### wagmi（React向け）

```typescript
// hooks/useTrustPassport.ts
import { useReadContract } from "wagmi";
import { trustPassportAbi } from "../lib/abi";

export function useTrustScore(workerAddress: string) {
  return useReadContract({
    address: TRUST_PASSPORT_ADDRESS,
    abi: trustPassportAbi,
    functionName: "getTrustScore",
    args: [workerAddress],
  });
}
```

---

## セキュリティ考慮事項

| リスク | 対策 |
|--------|------|
| **リエントランシー攻撃** | OpenZeppelin ReentrancyGuard を使用 |
| **整数オーバーフロー** | Solidity 0.8+ は自動チェック |
| **アクセス制御** | Ownable / AccessControl を使用 |
| **フロントランニング** | commit-reveal スキーム（必要に応じて） |
| **秘密鍵漏洩** | 環境変数 + ハードウェアウォレット |

---

## 学習リソース

| リソース | 説明 |
|---------|------|
| [Hardhat公式ドキュメント](https://hardhat.org/docs) | Hardhatの使い方 |
| [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/) | 標準コントラクト集 |
| [Solidity公式](https://docs.soliditylang.org/) | Solidity言語仕様 |
| [CryptoZombies](https://cryptozombies.io/jp/) | Solidity入門（日本語） |
| [JPYC SDK](https://docs.jpyc.jp/) | JPYC連携ドキュメント |

---

## 参考資料

- [サービスコンテキスト](./service-context-docs.md) - サービス全体像
- [開発ロードマップ](./roadmap.md) - Phase別開発計画
- [Phase 1 モックシステム仕様](./phase1-mock-system.md) - モックシステム詳細

---

*最終更新: 2026年1月*

