# Phase 4: Worker Pages（労働者ページ）

## 概要
労働者向けの4つのメインページを実装する。

## 前提条件
- Phase 1, 2, 3が完了している
- 共通レイアウトが使用可能

## タスク一覧

### Task 4.1: ジョブカードコンポーネント
- **目的**: 掲示板・マップで使用するジョブカードを作成
- **作業内容**:
  1. `components/worker/JobCard.tsx`を作成
  2. UI（参照: `docs/figma/board.png`）:
     - 背景: ジョブ画像 + 50%黒マスク
     - 左上: 「¥3,000 / 回」報酬額
     - 右上: 「あなたにおすすめ」バッジ（AIレコメンド時のみ）
     - 左下:
       - タイトル「動画撮影お手伝い」
       - 位置「山形県ちほう市湯煙町」
       - 日時「2026年1月7日〜 13:00」
       - 内容（1行、3点リーダーで省略）
     - 右下: ブックマークアイコン、「詳細はこちら」ボタン
  3. Props: `job: Job`, `isRecommended?: boolean`, `onDetailClick: () => void`
- **対象ファイル**: `frontend/components/worker/JobCard.tsx`
- **完了条件**: ジョブカードがFigmaデザイン通りに表示される

### Task 4.2: ジョブ詳細モーダルコンポーネント
- **目的**: ジョブの詳細情報を表示するモーダルを作成
- **作業内容**:
  1. `components/worker/JobDetailModal.tsx`を作成
  2. UI（参照: `docs/figma/detail-modal.png`）:
     - 下部からスライドアップ（画面70%）
     - 大きな背景画像
     - ジョブ情報の詳細表示
     - ブックマークボタン
     - 「受注する」ボタン
  3. HeroUIのModalを使用
- **対象ファイル**: `frontend/components/worker/JobDetailModal.tsx`
- **完了条件**: モーダルが正しく表示され、受注機能が動作する

### Task 4.3: 掲示板ページ
- **目的**: ジョブ一覧を表示する掲示板ページを作成
- **作業内容**:
  1. `app/worker/request-boards/page.tsx`を作成
  2. UI（参照: `docs/figma/board.png`）:
     - 検索バー（debounce付き、es-toolkit使用）
     - フィルターボタン（日時、報酬、スキル）
     - ジョブカード一覧（縦スクロール）
  3. 機能:
     - タイトル・内容の部分一致検索
     - debounce（300ms）
     - フィルターモーダル
     - カードクリックで詳細モーダル表示
- **対象ファイル**: `frontend/app/worker/request-boards/page.tsx`
- **完了条件**: 検索・フィルター・詳細モーダルが機能する

### Task 4.4: フィルターコンポーネント
- **目的**: 日時・報酬・スキルでフィルターするUIを作成
- **作業内容**:
  1. `components/worker/JobFilter.tsx`を作成
  2. UI:
     - 日時範囲選択
     - 報酬最小値
     - スキルタグ選択
  3. HeroUIのModal/Popoverを使用
- **対象ファイル**: `frontend/components/worker/JobFilter.tsx`
- **完了条件**: フィルターが正しく適用される

### Task 4.5: マップページ
- **目的**: Leafletマップでジョブを表示するページを作成
- **作業内容**:
  1. `app/worker/request-map/page.tsx`を作成
  2. UI（参照: `docs/figma/map.png`）:
     - Leafletマップ（フルスクリーン）
     - ジョブピン（カスタムマーカー、画像付き）
     - ブックマーク済みピンは色変更 + ブックマークアイコン
     - 右下: 検索アイコン → 横展開検索バー
  3. 機能:
     - ピンクリックで詳細モーダル表示
     - 日本地図中心（初期位置）
- **対象ファイル**: `frontend/app/worker/request-map/page.tsx`
- **完了条件**: マップにジョブピンが表示され、操作可能

### Task 4.6: カスタムマップマーカー
- **目的**: ジョブ画像付きのカスタムマーカーを作成
- **作業内容**:
  1. `components/worker/JobMapMarker.tsx`を作成
  2. UI:
     - 丸形マーカー（ジョブ画像をクリップ）
     - ブックマーク時: オレンジ枠 + ブックマークアイコン
     - 通常時: グレー枠
  3. Leaflet DivIconを使用
- **対象ファイル**: `frontend/components/worker/JobMapMarker.tsx`
- **完了条件**: マーカーがFigmaデザイン通りに表示される

### Task 4.7: ジョブページ
- **目的**: 着手中・完了済みジョブを管理するページを作成
- **作業内容**:
  1. `app/worker/jobs/page.tsx`を作成
  2. UI:
     - タブ切り替え（着手中 / 完了済み）
     - 着手中タブ:
       - ジョブカード一覧
       - ステータス表示（着手中/作業中など）
       - 「完了報告」ボタン
     - 完了済みタブ:
       - ジョブカード一覧
       - 評価結果表示（星）
  3. HeroUIのTabsを使用
- **対象ファイル**: `frontend/app/worker/jobs/page.tsx`
- **完了条件**: タブ切り替えとジョブ一覧が機能する

### Task 4.8: 完了報告モーダル
- **目的**: ジョブ完了報告を送信するモーダルを作成
- **作業内容**:
  1. `components/worker/CompletionReportModal.tsx`を作成
  2. UI:
     - チェックリスト確認
     - メモ入力（任意）
     - 「完了報告を送信」ボタン
  3. 送信時にUndertakedJobのstatusを更新
- **対象ファイル**: `frontend/components/worker/CompletionReportModal.tsx`
- **完了条件**: 完了報告が送信され、ステータスが更新される

### Task 4.9: ウォレットページ
- **目的**: JPYC残高と取引履歴を表示するページを作成
- **作業内容**:
  1. `app/worker/wallet/page.tsx`を作成
  2. UI（参照: `docs/figma/wallet.jpg`）:
     - JPYCロゴ + 「DIGITAL GUILD WALLET」タイトル
     - バーコード画像（`/logo/barcode.png`）
     - QRコード + 残高表示
     - 「スキャンして支払う」ボタン
     - 取引履歴一覧
  3. 取引履歴:
     - 日時、相手、金額（+/-）
     - モックデータを表示
- **対象ファイル**: `frontend/app/worker/wallet/page.tsx`
- **完了条件**: ウォレットがFigmaデザイン通りに表示される

## 完了条件
- [ ] ジョブカードコンポーネントが完成
- [ ] 詳細モーダルが完成
- [ ] 掲示板ページで検索・フィルター・受注が機能
- [ ] マップページでピン表示・詳細モーダルが機能
- [ ] ジョブページでタブ切り替え・完了報告が機能
- [ ] ウォレットページが完成
