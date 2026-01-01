# Phase 2: Types & Mocks（型定義・モックデータ・ストア）

## 概要
TypeScriptの型定義、モックデータ、Zustandストアを作成する。

## 前提条件
- Phase 1が完了している
- Zustandがインストールされている

## タスク一覧

### Task 2.1: 型定義作成
- **目的**: 仕様書のデータテーブル構造に基づく型を定義
- **作業内容**:
  1. `types/index.ts`を作成
  2. 以下の型を定義（キャメルケース）:
     ```typescript
     // 労働者
     export interface Worker {
       id: string;
       name: string;
       birth: string;
       gender: string;
       address: string;
       createdAt: string;
       updatedAt: string;
     }

     // 発注者
     export interface Requester {
       id: string;
       name: string;
       createdAt: string;
     }

     // ジョブ
     export interface Job {
       id: string;
       requesterId: string;
       title: string;
       description: string;
       reward: number;
       aiInsentiveReward: number;
       location: string;
       latitude: number;
       longitude: number;
       imageUrl: string;
       tags: string[];
       capacity: number;
       checklist: ChecklistItem[];
       scheduledDate: string;
       createdAt: string;
       updatedAt: string;
     }

     // チェックリスト項目
     export interface ChecklistItem {
       id: string;
       text: string;
     }

     // ジョブスキル
     export interface JobSkill {
       id: string;
       jobId: string;
       skillId: string;
     }

     // 募集条件
     export interface RequirementSkill {
       id: string;
       jobId: string;
       skillId: string;
       skillAmount: number;
     }

     // AIレコメンド
     export interface JobAiRecommend {
       id: string;
       jobId: string;
       workerId: string;
       confidence: number;
       reason: string;
       createdAt: string;
       updatedAt: string;
     }

     // ブックマーク
     export interface BookmarkJob {
       id: string;
       jobId: string;
       workerId: string;
     }

     // 着手ジョブ
     export interface UndertakedJob {
       id: string;
       workerId: string;
       jobId: string;
       status: 'accepted' | 'in_progress' | 'completed' | 'canceled';
       requesterEvalScore: number | null;
       acceptedAt: string;
       canceledAt: string | null;
       finishedAt: string | null;
     }

     // ギルド証
     export interface TrustPassport {
       id: string;
       workerId: string;
       trustScore: number;
     }

     // 労働者スキル
     export interface WorkerSkill {
       id: string;
       workerId: string;
       name: string;
       createdAt: string;
       jobId: string;
     }

     // 補助金
     export interface Subsidy {
       id: string;
       requesterId: string;
       amount: number;
       sendedAt: string;
     }

     // スキルマスタ
     export interface Skill {
       id: string;
       name: string;
     }

     // 取引履歴
     export interface TransactionHistory {
       id: string;
       workerId: string;
       to: string;
       from: string;
       amount: number;
       description: string;
       tradedAt: string;
     }

     // ランク
     export type Rank = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
     ```
- **対象ファイル**: `frontend/types/index.ts`
- **完了条件**: すべての型が定義され、TypeScriptエラーがない

### Task 2.2: モックデータ作成
- **目的**: 3つのジョブと関連データのモックを作成
- **作業内容**:
  1. `constants/mocks/workers.ts` - デフォルト労働者（田中一郎）
  2. `constants/mocks/requesters.ts` - デフォルト発注者
  3. `constants/mocks/jobs.ts` - 3つのジョブ:
     - izakaya: 動画撮影おてつだい（山形県湯煙町）2026/1/6
     - nouka: みかん収穫のおてつだい（愛媛県みかん里町）2026/1/8
     - ryokan: 旅館の庭先掃除のお手伝い（石川県温泉郷町）2026/1/11
  4. `constants/mocks/subsidies.ts` - 補助金120万円
  5. `constants/mocks/skills.ts` - スキルマスタ
  6. `constants/mocks/index.ts` - エクスポート
- **対象ファイル**: `frontend/constants/mocks/`配下
- **完了条件**: モックデータが正しく作成され、型と整合している

### Task 2.3: Zustand Store作成
- **目的**: 状態管理とLocalStorage永続化を実装
- **作業内容**:
  1. `stores/useWorkerStore.ts` - 労働者情報（JPYC残高含む）
  2. `stores/useRequesterStore.ts` - 発注者情報
  3. `stores/useJobStore.ts` - ジョブ一覧管理
  4. `stores/useBookmarkStore.ts` - ブックマーク管理
  5. `stores/useUndertakedJobStore.ts` - 着手ジョブ管理
  6. `stores/useTrustPassportStore.ts` - ギルド証・ランク管理
  7. `stores/useWalletStore.ts` - 取引履歴
  8. `stores/index.ts` - エクスポート

  各ストアで`zustand/middleware`の`persist`を使用
- **対象ファイル**: `frontend/stores/`配下
- **完了条件**: すべてのストアが作成され、LocalStorageに永続化される

### Task 2.4: AIインセンティブロジック
- **目的**: 補助金からAIインセンティブを自動計算
- **作業内容**:
  1. `utils/calculateAiIncentive.ts`を作成
  2. ロジック:
     - 補助金の0.5%
     - MAX: 報酬の50%を超えない
  3. ジョブ作成時に呼び出し
- **対象ファイル**: `frontend/utils/calculateAiIncentive.ts`
- **完了条件**: AIインセンティブが正しく計算される

### Task 2.5: Trust Score計算ロジック
- **目的**: 仕様書に基づくTrust Score計算を実装
- **作業内容**:
  1. `utils/calculateTrustScore.ts`を作成
  2. ロジック:
     - クエスト達成数（最大50）
     - 人間評価の平均値×10
     - 合計MAX 100
  3. ランク閾値:
     - ~60: Bronze
     - ~70: Silver
     - ~80: Gold
     - ~90: Platinum
- **対象ファイル**: `frontend/utils/calculateTrustScore.ts`
- **完了条件**: Trust Scoreとランクが正しく計算される

## 完了条件
- [ ] すべての型が定義されている
- [ ] 3つのジョブのモックデータが作成されている
- [ ] すべてのZustandストアが作成されている
- [ ] LocalStorage永続化が機能している
- [ ] AIインセンティブ計算が正しく動作する
- [ ] Trust Score計算が正しく動作する
