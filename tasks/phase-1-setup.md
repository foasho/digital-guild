# Phase 1: Setup（依存関係・初期設定）

## 概要
Next.js 16プロジェクトに必要なパッケージをインストールし、ディレクトリ構造と設定ファイルを整備する。

## 前提条件
- frontend/ディレクトリに基本的なNext.js 16プロジェクトが存在
- Bun が利用可能

## タスク一覧

### Task 1.1: パッケージインストール
- **目的**: 必要な依存関係をすべてインストール
- **作業内容**:
  1. frontend/ディレクトリでパッケージをインストール
  2. 以下の依存関係を追加:
     ```bash
     bun add zustand @heroui/react zod es-toolkit leaflet react-leaflet @google/genai
     bun add -D @types/leaflet
     ```
- **対象ファイル**: `frontend/package.json`
- **完了条件**: すべてのパッケージがインストールされ、`bun run build`がエラーなく完了

### Task 1.2: 環境変数設定
- **目的**: API連携用の環境変数テンプレートを用意
- **作業内容**:
  1. `.env.example`ファイルを作成
  2. 以下の変数を記載:
     ```
     GEMINI_API_KEY=your_gemini_api_key
     GOOGLE_MAP_API_KEY=your_google_map_api_key
     ```
- **対象ファイル**: `frontend/.env.example`
- **完了条件**: `.env.example`が作成されている

### Task 1.3: ディレクトリ構造作成
- **目的**: 必要なディレクトリとファイルの骨格を作成
- **作業内容**:
  1. 以下のディレクトリを作成:
     ```
     frontend/
     ├── app/
     │   ├── worker/
     │   │   ├── request-boards/
     │   │   ├── request-map/
     │   │   ├── jobs/
     │   │   └── wallet/
     │   ├── requester/
     │   │   ├── dashboard/
     │   │   ├── jobs/[job_id]/
     │   │   ├── undertaked_jobs/[undertaked_job_id]/
     │   │   └── jobs/new/
     │   └── api/ai/recommend/
     ├── components/
     │   ├── layout/
     │   ├── worker/
     │   ├── requester/
     │   └── ui/
     ├── hooks/
     ├── lib/gemini/
     ├── utils/
     ├── types/
     ├── stores/
     └── constants/mocks/
     ```
- **対象ファイル**: 各ディレクトリに必要な`page.tsx`や`index.ts`
- **完了条件**: すべてのディレクトリが作成されている

### Task 1.4: HeroUI & Tailwind設定
- **目的**: HeroUIをNext.js 16 + Tailwind CSS 4で利用可能にする
- **作業内容**:
  1. `tailwind.config.ts`がない場合は作成し、HeroUIの設定を追加
  2. `app/providers.tsx`を作成し、HeroUIProviderでラップ
  3. `app/globals.css`にWorkerテーマ用のCSS変数を追加
  4. `app/layout.tsx`でProvidersを使用
- **対象ファイル**:
  - `frontend/tailwind.config.ts`
  - `frontend/app/providers.tsx`
  - `frontend/app/globals.css`
  - `frontend/app/layout.tsx`
- **完了条件**: HeroUIコンポーネントが正常にレンダリングされる

## 完了条件
- [ ] すべてのパッケージがインストールされている
- [ ] `.env.example`が作成されている
- [ ] ディレクトリ構造が完成している
- [ ] HeroUIが使用可能な状態になっている
- [ ] `bun run build`がエラーなく完了
