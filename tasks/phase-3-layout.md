# Phase 3: Layout（共通レイアウト・コンポーネント）

## 概要
時間帯による背景切り替え、共通レイアウト、UIコンポーネントを作成する。

## 前提条件
- Phase 1, 2が完了している
- HeroUIが使用可能

## タスク一覧

### Task 3.1: 背景画像切り替えロジック
- **目的**: 時間帯に応じて背景画像を切り替える
- **作業内容**:
  1. `hooks/useTimeBasedBackground.ts`を作成
  2. 時間帯判定ロジック:
     - 6:00-11:59 → `/backgrounds/morning.png`
     - 12:00-17:59 → `/backgrounds/noon.png`
     - 18:00-5:59 → `/backgrounds/night.png`
  3. 現在時刻を取得し、適切な画像パスを返す
- **対象ファイル**: `frontend/hooks/useTimeBasedBackground.ts`
- **完了条件**: 時間帯に応じて正しい背景画像パスが返される

### Task 3.2: モック切り替えバーコンポーネント
- **目的**: 労働者/発注者UI切り替え用のバーを作成
- **作業内容**:
  1. `components/layout/MockSwitchBar.tsx`を作成
  2. UI:
     - 薄いバー（背景: 半透明黒）
     - 左: 「※これはモックです。発注者側UIは右のボタンから。」
     - 右: 「切り替え」ボタン → /requesterへ遷移
  3. Props: `visible: boolean`で表示/非表示を制御
- **対象ファイル**: `frontend/components/layout/MockSwitchBar.tsx`
- **完了条件**: モック切り替えバーが表示され、クリックで遷移する

### Task 3.3: ヘッダーコンポーネント
- **目的**: 労働者用ヘッダーを作成
- **作業内容**:
  1. `components/layout/WorkerHeader.tsx`を作成
  2. UI:
     - 左: 「Digital GUILD」タイトル（クリックしても何も起きない）
     - 右: ハンバーガーメニューアイコン（クリックしても何も起きない）
  3. 白文字、透明背景
- **対象ファイル**: `frontend/components/layout/WorkerHeader.tsx`
- **完了条件**: ヘッダーがFigmaデザイン通りに表示される

### Task 3.4: ギルド証カードコンポーネント
- **目的**: ユーザー情報を表示するカードを作成
- **作業内容**:
  1. `components/layout/GuildCard.tsx`を作成
  2. UI（参照: `docs/figma/base.png`）:
     - Card形式、ゴールド枠
     - 左: アバター画像（`/avatar4.png`）丸形
     - 中央上: 「探索者」ラベル
     - 中央下: 「田中　一郎」名前
     - 右上: 「81,520 JPYC」所持金
     - 右下: 「class BRONZE」クラス
  3. Zustandストアからデータを取得
- **対象ファイル**: `frontend/components/layout/GuildCard.tsx`
- **完了条件**: ギルド証カードがFigmaデザイン通りに表示される

### Task 3.5: フッターコンポーネント
- **目的**: 労働者用ボトムナビゲーションを作成
- **作業内容**:
  1. `components/layout/WorkerFooter.tsx`を作成
  2. UI:
     - 4アイコン（掲示板、マップ、ジョブ、ウォレット）
     - アイコン画像: `/icons/`配下を使用
       - board.png → 掲示板
       - map.png → マップ
       - job.png → ジョブ
       - wallet.png → ウォレット
     - 各アイコンの下にラベルテキスト
     - 現在のページをハイライト
  3. 白アイコン、透明背景
- **対象ファイル**: `frontend/components/layout/WorkerFooter.tsx`
- **完了条件**: フッターがFigmaデザイン通りに表示され、ナビゲーションが機能する

### Task 3.6: 背景画像コンポーネント
- **目的**: 時間帯背景 + 50%黒マスクを適用
- **作業内容**:
  1. `components/layout/BackgroundImage.tsx`を作成
  2. UI:
     - フルスクリーン背景画像
     - 50%不透明度の黒オーバーレイ
     - `useTimeBasedBackground`を使用
  3. childrenをオーバーレイの上に配置
- **対象ファイル**: `frontend/components/layout/BackgroundImage.tsx`
- **完了条件**: 背景画像と黒マスクが正しく表示される

### Task 3.7: 労働者用レイアウト
- **目的**: 労働者ページ共通レイアウトを作成
- **作業内容**:
  1. `app/worker/layout.tsx`を作成
  2. 構成（上から順）:
     - MockSwitchBar
     - WorkerHeader
     - GuildCard
     - children（各ページコンテンツ）
     - WorkerFooter
  3. BackgroundImageで全体をラップ
  4. スマホサイズ制限（max-width: 480pxなど）
- **対象ファイル**: `frontend/app/worker/layout.tsx`
- **完了条件**: レイアウトがFigma base.png通りに表示される

### Task 3.8: 発注者用レイアウト
- **目的**: 発注者ページ共通レイアウトを作成
- **作業内容**:
  1. `app/requester/layout.tsx`を作成
  2. 構成:
     - MockSwitchBar（切り替え先: /worker/request-boards）
     - シンプルなヘッダー
     - children
  3. ライトテーマ（白背景）
- **対象ファイル**: `frontend/app/requester/layout.tsx`
- **完了条件**: 発注者レイアウトが正しく表示される

### Task 3.9: ルートページリダイレクト
- **目的**: ルートアクセス時に労働者ページへリダイレクト
- **作業内容**:
  1. `app/page.tsx`を修正
  2. `/`アクセス時に`/worker/request-boards`へリダイレクト
- **対象ファイル**: `frontend/app/page.tsx`
- **完了条件**: ルートアクセスで労働者ページに遷移する

## 完了条件
- [ ] 時間帯による背景切り替えが機能する
- [ ] モック切り替えバーが表示される
- [ ] ヘッダー、ギルド証カード、フッターが正しく表示される
- [ ] 労働者レイアウトがFigmaデザイン通りに表示される
- [ ] 発注者レイアウトが正しく表示される
- [ ] ルートアクセスでリダイレクトが機能する
