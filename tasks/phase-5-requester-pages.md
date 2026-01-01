# Phase 5: Requester Pages（発注者ページ）& AI機能

## 概要
発注者向けの4つのページとGemini連携AI機能を実装する。

## 前提条件
- Phase 1-4が完了している
- 発注者レイアウトが使用可能

## タスク一覧

### Task 5.1: ダッシュボードページ
- **目的**: 発注済みジョブ一覧を表示するダッシュボードを作成
- **作業内容**:
  1. `app/requester/dashboard/page.tsx`を作成
  2. UI:
     - ヘッダー「発注管理」
     - 統計サマリー（発注数、進行中、完了）
     - ステータスフィルター（全て/募集中/進行中/完了）
     - ジョブカード一覧
       - タイトル、報酬、ステータス、応募者数
       - カードクリックで詳細ページへ遷移
  3. Zustandストアからデータ取得
- **対象ファイル**: `frontend/app/requester/dashboard/page.tsx`
- **完了条件**: ジョブ一覧とフィルターが機能する

### Task 5.2: ジョブ詳細ページ
- **目的**: ジョブの詳細と応募者を表示するページを作成
- **作業内容**:
  1. `app/requester/jobs/[job_id]/page.tsx`を作成
  2. UI:
     - ジョブ詳細情報
     - AIレコメンド結果表示
       - 「この人にオススメ」セクション
       - confidence、reason表示
     - 応募者一覧（着手ジョブから取得）
       - 労働者名、Trust Score、ランク
       - 「承認待ち」の場合は評価ページへのリンク
  3. 動的ルーティング（[job_id]）
- **対象ファイル**: `frontend/app/requester/jobs/[job_id]/page.tsx`
- **完了条件**: ジョブ詳細とAIレコメンドが表示される

### Task 5.3: 評価画面ページ
- **目的**: 労働者の作業結果を評価するページを作成
- **作業内容**:
  1. `app/requester/undertaked_jobs/[undertaked_job_id]/page.tsx`を作成
  2. UI:
     - 労働者情報（名前、Trust Score、ランク）
     - ジョブ情報
     - 完了報告内容（チェックリスト、メモ）
     - 星評価（1-5）入力
     - 「承認する」ボタン
  3. 承認時の後続処理:
     - UndertakedJobのrequesterEvalScore更新
     - WorkerSkill追加（ジョブに紐づくスキル）
     - TrustPassportのtrustScore更新
       - クエスト達成数（最大50）+ 人間評価平均×10
       - MAX 100
     - ランク更新（Bronze/Silver/Gold/Platinum）
     - 報酬のJPYC振込（Workerの残高増加）
     - TransactionHistory追加
- **対象ファイル**: `frontend/app/requester/undertaked_jobs/[undertaked_job_id]/page.tsx`
- **完了条件**: 評価・承認が機能し、すべての後続処理が実行される

### Task 5.4: ジョブ作成ページ
- **目的**: 新規ジョブを作成するフォームページを作成
- **作業内容**:
  1. `app/requester/jobs/new/page.tsx`を作成
  2. UI:
     - フォーム入力:
       - タイトル（必須）
       - 説明（必須）
       - 報酬（必須、数値）
       - 場所（必須）
       - 緯度・経度（マップから選択）
       - 画像URL
       - タグ（複数選択）
       - 定員
       - チェックリスト（動的追加）
       - 予定日
     - AIインセンティブ自動計算表示
     - 「作成する」ボタン
  3. zodによるバリデーション
  4. 作成後:
     - ジョブをストアに追加
     - AIレコメンドAPI呼び出し
     - ダッシュボードへリダイレクト
- **対象ファイル**: `frontend/app/requester/jobs/new/page.tsx`
- **完了条件**: ジョブ作成が機能し、AIレコメンドが生成される

### Task 5.5: Gemini連携ライブラリ
- **目的**: GeminiでAIレコメンドを生成するライブラリを作成
- **作業内容**:
  1. `lib/gemini/recommend.ts`を作成
  2. 機能:
     - ジョブ情報と労働者情報を入力
     - 以下を比較:
       - 募集スキル vs 労働者スキル
       - 場所（住所の距離）
       - 年齢（birthから計算）
     - Geminiで構造化出力:
       ```typescript
       interface RecommendResult {
         confidence: number; // 0-1
         reason: string;
       }
       ```
  3. 環境変数`GEMINI_API_KEY`を使用
- **対象ファイル**: `frontend/lib/gemini/recommend.ts`
- **完了条件**: Gemini APIが呼び出され、結果が返される

### Task 5.6: AIレコメンドAPI Route
- **目的**: AIレコメンド生成のAPIエンドポイントを作成
- **作業内容**:
  1. `app/api/ai/recommend/route.ts`を作成
  2. POST:
     - リクエスト: `{ jobId: string }`
     - 処理:
       1. ジョブ情報取得
       2. 全労働者をループ
       3. 各労働者に対してGemini呼び出し
       4. confidence >= 0.7の場合、JobAiRecommendを保存
     - レスポンス: `{ recommendations: JobAiRecommend[] }`
  3. 注意: モックではストアに直接保存
- **対象ファイル**: `frontend/app/api/ai/recommend/route.ts`
- **完了条件**: APIが機能し、レコメンドが生成・保存される

### Task 5.7: レコメンド表示コンポーネント
- **目的**: AIレコメンド結果を表示するコンポーネントを作成
- **作業内容**:
  1. `components/requester/RecommendationList.tsx`を作成
  2. UI:
     - 「この人にオススメ」セクション
     - レコメンドカード:
       - 労働者名、Trust Score、ランク
       - confidence（%表示）
       - reason（折りたたみ可）
- **対象ファイル**: `frontend/components/requester/RecommendationList.tsx`
- **完了条件**: レコメンド結果が正しく表示される

### Task 5.8: 発注者用コンポーネント
- **目的**: 発注者ページで使用する共通コンポーネントを作成
- **作業内容**:
  1. `components/requester/RequesterJobCard.tsx` - ジョブカード
  2. `components/requester/StarRating.tsx` - 星評価入力
  3. `components/requester/StatsSummary.tsx` - 統計サマリー
- **対象ファイル**: `frontend/components/requester/`配下
- **完了条件**: 各コンポーネントが正しく機能する

## 完了条件
- [ ] ダッシュボードページが完成
- [ ] ジョブ詳細ページが完成
- [ ] 評価画面が機能し、後続処理が正しく実行される
- [ ] ジョブ作成ページが機能する
- [ ] Gemini連携が動作する
- [ ] AIレコメンドAPI Routeが機能する
- [ ] すべての発注者コンポーネントが完成
