# Phase 6: UI調整（スマホ強制 & Rounded強化）

**ステータス**: 完了
**作成日**: 2026-01-01

## 概要
Phase 5完了後のUI調整として、以下の3点を実装：
1. **Worker UI**: スマホサイズ（sm未満）以外でQRコード強制表示（白背景）
2. **Requester UI**: 全体的にroundedを増やし、角丸を強調
3. **詳細モーダル**: 黒背景75%化と文字視認性向上

---

## 完了タスク

### Task 6.1: Worker UIスマホ強制コンポーネント ✅

**目的**: sm以上のブレークポイントでQRコード表示オーバーレイを強制表示

**作業内容**:
- `frontend/components/layout/MobileOnlyOverlay.tsx`を新規作成
- sm(640px)以上の画面サイズで全画面オーバーレイを表示
- 白背景でシンプルなデザイン
- QR画像（`/links/worker.png`）を中央に表示
- 「こちらをスマホで読み取りアプリを開いてください。」メッセージ表示
- TailwindCSSの`hidden sm:flex`を活用

**変更ファイル**:
- `frontend/components/layout/MobileOnlyOverlay.tsx`（新規）
- `frontend/components/layout/index.ts`（エクスポート追加）
- `frontend/app/worker/layout.tsx`（コンポーネント追加）

---

### Task 6.2: Requester Layout rounded強化 ✅

**変更ファイル**:
- `frontend/app/requester/layout.tsx`
  - ヘッダーのborder-bを削除

---

### Task 6.3: Requester Dashboard rounded強化 ✅

**変更箇所**:
- 統計カード: `rounded-xl`追加
- タブリスト: `rounded-xl`に変更
- ジョブカード: `rounded-xl`追加
- フローティングボタン: `rounded-xl`追加

**変更ファイル**:
- `frontend/app/requester/dashboard/page.tsx`

---

### Task 6.4: Requester ジョブ詳細ページ rounded強化 ✅

**変更箇所**:
- 各Cardセクション: `rounded-xl`追加
- 報酬情報ボックス: `rounded-xl`追加
- 応募者カード: `rounded-xl`追加
- 空の状態表示: `rounded-xl`追加
- 評価リンクボタン: `rounded-xl`追加

**変更ファイル**:
- `frontend/app/requester/jobs/[job_id]/page.tsx`

---

### Task 6.5: Requester ジョブ作成ページ rounded強化 ✅

**変更箇所**:
- メインフォームカード: `rounded-xl`追加
- AIインセンティブ表示: `rounded-xl`追加
- 送信ボタン: `rounded-xl`追加

**変更ファイル**:
- `frontend/app/requester/jobs/new/page.tsx`

---

### Task 6.6: Requester 評価画面ページ rounded強化 ✅

**変更箇所**:
- 各Cardセクション: `rounded-xl`追加
- 完了報告チェックリスト: `rounded-xl`追加
- 承認ボタン: `rounded-xl`追加

**変更ファイル**:
- `frontend/app/requester/undertaked_jobs/[undertaked_job_id]/page.tsx`

---

### Task 6.7: Requester コンポーネント群 rounded強化 ✅

**RequesterJobCard.tsx**:
- Card: `rounded-xl`追加
- 画像: `rounded-xl`に変更

**StatsSummary.tsx**:
- Card: `rounded-xl`追加

**RecommendationList.tsx**:
- 外側Card: `rounded-xl`追加
- 内側Card: `rounded-xl`追加
- AIレコメンドボックス: `rounded-xl`に変更
- 理由表示ボックス: `rounded-xl`追加
- ボタン: `rounded-xl`追加

**変更ファイル**:
- `frontend/components/requester/RequesterJobCard.tsx`
- `frontend/components/requester/StatsSummary.tsx`
- `frontend/components/requester/RecommendationList.tsx`

---

### Task 6.8: PlaywrightMCPによる動作確認 ✅

**確認項目**:
- [x] Worker UIでsm以上のサイズでQRオーバーレイが表示される
- [x] Worker UIでスマホサイズで通常UIが表示される
- [x] Requester ダッシュボードのroundedが適用されている
- [x] Requester ジョブ作成のroundedが適用されている
- [x] Requester 評価画面が正常に動作する

---

### 追加タスク: 詳細モーダル視認性向上 ✅

**目的**: Worker UIの詳細モーダルの視認性を向上

**変更内容**:
- バックドロップを`bg-black/75`に変更（75%黒背景）
- `backdrop="blur"`でぼかし効果を追加
- モーダル本体を`bg-gray-900/95`に変更

**変更ファイル**:
- `frontend/components/worker/JobDetailModal.tsx`

---

## 変更対象ファイル一覧

### 新規作成
- `frontend/components/layout/MobileOnlyOverlay.tsx`

### 修正
- `frontend/components/layout/index.ts`
- `frontend/app/worker/layout.tsx`
- `frontend/app/requester/layout.tsx`
- `frontend/app/requester/dashboard/page.tsx`
- `frontend/app/requester/jobs/new/page.tsx`
- `frontend/app/requester/jobs/[job_id]/page.tsx`
- `frontend/app/requester/undertaked_jobs/[undertaked_job_id]/page.tsx`
- `frontend/components/requester/RequesterJobCard.tsx`
- `frontend/components/requester/StatsSummary.tsx`
- `frontend/components/requester/RecommendationList.tsx`
- `frontend/components/worker/JobDetailModal.tsx`

---

## 完了条件チェックリスト

- [x] Worker UIがsm以上でQRコードオーバーレイを表示
- [x] Worker UIがスマホサイズで通常表示
- [x] Requester ダッシュボードのroundedが強化
- [x] Requester ジョブ詳細のroundedが強化
- [x] Requester ジョブ作成のroundedが強化
- [x] Requester 評価画面のroundedが強化
- [x] Requester 共通コンポーネントのroundedが強化
- [x] 詳細モーダルの視認性が向上
- [x] PlaywrightMCPでの動作確認完了
