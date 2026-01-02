# 概要

JPYCを活用した新しい地方創生のための新しいジョブシステムの提案です。

このシステムでは、利用者は大きく分けて２つに分類される。

自由に働きたい若者、労働者不足の地方民を繋げるサービス。

地方で困っている人（個人の依頼者）が直接仕事を発注できるシンプルなシステムとする。

サービスの形としてはジョブマッチングだが、

AIによる適切なジョブマッチングと補助金等の支援金を利用したインセンティブ設計による特定のエリアへの需要バランスの調整を行いジョブの平準化を行う。

Web3を利用することで、JPYCの高速決済と、スマートコントラクトによる透明化された信用ポイントの算出と信用ポイントのNFT化をすることで人同士の安全なマッチングを行える(以降：TrustPassportと命名)。

これらのマッチングをWeb3による信用ポイントNFT化と、StableCoin（JPYC）の素早い取引速度と低手数料性を利用して、より素早い経済圏の確立と労働者不足を解消できないか、ということです。

## 作成するもの

今回作成するのは実際の労働者が使うであろうアプリと、労働者不足に悩む個人の依頼者向けアプリ、そしてプラットフォーム管理者向けの管理画面。

労働者向けのアプリに関しては、旅行に行くような感覚で各地困っている地方のクエストの一覧を見て、日付や作業内容をみて受注し、受注したクエストをStatusチェックや報告などが行えるアプリ。

依頼者アプリは、地方で困っている個人が直接ジョブを発注できる。新規作成されたジョブは、労働者向け掲示板に可視化されるようになる。

管理者向け画面は、補助金管理や銀行連携などプラットフォーム運営に必要な機能を提供する（Phase1以降で実装予定）。

## 設計

### UI設計

ページ構成は以下の通り

- 労働者
    - 掲示板: (/worker/request-boards)
    - マップ(/worker/request-map)
    - ジョブ(/worker/jobs)
    - ウォレット(/worker/wallet)
- 発注者（個人の依頼者）
    - ダッシュボード(/requester/dashboard)
    - 発注済みジョブ詳細画面(/requester/jobs/:job_id)
    - 発注済みジョブ評価画面(requester/undertaked_jobs/:undertaked_job_id)
    - ジョブ作成画面(/requester/jobs/new)
- 管理者（将来実装予定）
    - 補助金管理
    - 銀行連携管理
    - ユーザー管理

前に似たようなシステムを作ったので@backupフォルダを参照してください。

しかし、あくまで作り直しなので引っ張られすぎないようにしてほしい。

### データテーブル構造

以下はDBのカラム名として定義している。

しかし、今回作成するのはモックのため、APIインターフェイスは用意しつつ、APIはモックデータから取得するようにしてください。

また、モックデータの連携にはLocalStorageの機能を内蔵させ、zustandで変更や追加を保持するようにしてほしい。
実際には、これは、TypescriptのType定義としてはキャメルケースとして考慮すること。

- 労働者ユーザー(workers)※現、users
    - id
    - name
    - birth
    - gender
    - address
    - created_at
    - updated_at
- 発注者ユーザー(requesters)
    - id
    - name
    - created_at
- ジョブ(jobs)※現、quests
    - id
    - requester_id
    - title
    - description
    - reward
    - ai_insentive_reward
    - location
    - image_url
    - tags
    - capacity
    - checklist
    - created_at
    - updated_at
- ジョブスキル(job_skills)
    - id
    - job_id
    - skill_id
- 募集条件(requirement_skills)
    - id
    - job_id
    - skill_id
    - skill_amount
- ジョブAIレコメンド
    - id
    - job_id
    - worker_id
    - confidence
    - reason
    - created_at
    - updated_at
- ブックマーク(bookmark_jobs)
    - id
    - job_id
    - worker_id
- 着手ジョブ(undertaked_jobs)
    - id
    - worker_id
    - job_id
    - status
    - requester_eval_score
    - accepted_at
    - canceled_at
    - finished_at
- ギルド証 (trust_passports)
    - id
    - worker_id
    - trust_score
- 労働者スキル (worker_skills)
    - id
    - worker_id
    - name
    - created_at
    - job_id
- 補助金(subsidies)
    - id
    - requester_id
    - amount
    - sended_at
- スキル(skills)
    - id
    - name (unique)
- 取引履歴(transaction_histories)
    - id
    - worker_id
    - to
    - from
    - traded_at

【ジョブ初期モックデータ】

@public/jobsの中に画像が入っています。それぞれ(izakaya.jpg, nouka.png, ryokan.png)です。この3つのジョブを用意してください。

それぞれのジョブの概要は以下です

- izakaya
    - タイトル：動画撮影おてつだい
    - 場所：山形県の仮想の地方を作って
    - 日時：2026年1月6日
    - <そのほかの情報は考えて>
- nouka
    - タイトル：みかん収穫のおてつだい
    - 場所：愛媛県の仮想の地方を作って
    - 日時：2026年1月8日
    - <そのほかの情報は考えて>
- ryokan
    - タイトル：旅館の庭先掃除のお手伝い
    - 場所：<旅館の仮想の地方を作って>
    - 日時：2026年1月11日
    - <そのほかの情報は考えて>

【AIインセンティブ(ai_insentive_reward)設計】

モックとして作成するため、workersは1人、requestersは各ジョブに対応する個人の依頼者として作成する。

UI切り替えによってデータを切り替えるようにしてください。

補助金管理は管理者機能として将来実装予定。インセンティブの割合はモックなので一律で0.5%(MAX依頼値の50%を超えない)としてください。これはジョブが新規作成されたときに、1日1回0時に補助金の情報を確認し更新させるが、モックではこのバッチ処理はさせない。

【AIリコメンド設計】

ジョブAIレコメンドデータは、ジョブが新規作成orジョブの募集要項が更新されたときに、

募集要項の中からマッチしそうな人材をクラス、住まい、年齢、スキルを検索し、ユーザー情報からジョブの情報を比較し、GEMINIによってマッチしそうかどうかをスコア化し、構造化出力でconfidenceとreasonを出力させて確度(confidence)が0.7以上である場合に推奨させる。そしてなぜその確度にしたのかをreasonで説明させるプロンプトで作成しレコードする。

【取引フローと後続処理】

現状は、**完了報告→依頼者承認→AI判定→取引確立**

となっているが、AI判定を削除し、あくまで取引は人と人の間のみで成立するフローにする。AIによる画像判定も存在していたがそれもなくしていいです。

なので、**完了報告→依頼者承認→取引確立とし、**

**依頼者承認**

では、承認時に労働者に1~5までの星評価を設定でき、承認が完了すると、

スマートコントラクトによって依頼者の信用ポイントやスキルが更新される。

スキルとは、ジョブに紐づくスキルを達成時にユーザーが獲得できるものである。

スキルは並列でジョブ達成事に取得でき、現時点では信用ポイントに含まれない。

信用ポイントとは、達成したクエスト数と人間評価によってきます。承認時にundertaked_jobsのrequester_eval_store(1, 2, 3, 4, 5いずれか)の値を集約してworkerの人間評価として平均値x10とし、クエスト達成数は最大50までとし、クエスト達成数 + 人間評価 = MAX100をtrust_scoreとするこれに応じて、Bronze、Silver、Gold、Platinumとするそれぞれの閾値は~60, ~70, ~80, ~90でいいです。これらの処理は承認時にすべて走る。

現状は、200がMAXになっていて評価軸も4つあるので、修正してください。

【フロントエンドアーキテクチャ】

本モックシステムでは、以下のアーキテクチャを採用しています。

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

**レイヤー構成**

| レイヤー | 役割 | ファイル例 |
|----------|------|------------|
| Page/Component | UI表示、ユーザーインタラクション | `app/worker/request-boards/page.tsx` |
| Hook | データ取得・操作のロジック、Storeへの反映 | `hooks/useJobs.ts` |
| API | LocalStorage(MockDB)へのCRUD操作 | `constants/api-mocks/jobApi.ts` |
| Store | クライアント側の状態管理（メモリ） | `stores/useJobStore.ts` |
| LocalStorage | モックデータベース（永続化） | ブラウザのLocalStorage |

**アーキテクチャルール**

1. **Page → Hook → API の順序を厳守**
   - Pageは直接Storeを使わない
   - Pageは必ずHookを経由してデータにアクセスする

2. **例外: useWorker / useRequester のみ**
   - 現在のユーザー情報取得のみ、直接モックデータを参照可能

3. **ID型はすべて`number`**
   - 本番環境のautoincrement IDを想定
   - 新規作成時は`maxId + 1`で生成

4. **初回起動時のデータロード**
   - `loadMockData()`がLocalStorageに初期データを投入（1回のみ）
   - 2回目以降はLocalStorageから読み込み

**Hooks一覧**

| Hook | 説明 | データソース |
|------|------|--------------|
| `useWorker` | 現在のワーカー情報 | モック直接参照（例外） |
| `useRequester` | 現在の発注者情報 | モック直接参照（例外） |
| `useJobs` | ジョブ一覧・CRUD | API → LocalStorage |
| `useUndertakedJobs` | 着手ジョブ一覧・CRUD | API → LocalStorage |
| `useBookmarks` | ブックマーク一覧・CRUD | API → LocalStorage |
| `useTrustPassport` | ギルド証・スキル管理 | API → LocalStorage |
| `useTransactionHistories` | 取引履歴・残高 | API → LocalStorage |
| `useSkills` | スキルマスタ | API → LocalStorage |
| `useJobAiRecommends` | AIレコメンド | API → LocalStorage |
| `useSubsidies` | 補助金 | API → LocalStorage |

【全体ディレクトリ構成】

今回のモックでは、ディレクトリ構成として作成しつつ、frontend直下のみを作成する。

hardhatはモック以降の話なので、とりあえず.gitkeepだけを残し今後作成する意図として用意しておく。

```markdown
digital-guild(root)
├ .claude
├ hardhat
|  └ .gitkeep
├ frontend
|  ├ admin/              # 管理者画面（将来実装予定）
|  |  └ .gitkeep
|  ├ ...
|  └ ...(別に記載)
├ docs
|  ├ works 
|  └ contexts  
└ README.md
```

【モック：frontendのディレクトリ構成】

今回のPhase1：モックとして作成するメインの内容

```markdown
frontend
├ app/                        # Next.js App Router
|  ├ worker/                  # 労働者向けページ
|  |  ├ request-boards/       # 掲示板
|  |  ├ request-map/          # マップ
|  |  ├ jobs/                 # ジョブ管理
|  |  └ wallet/               # ウォレット
|  ├ requester/               # 発注者向けページ
|  |  ├ dashboard/            # ダッシュボード
|  |  ├ jobs/                 # ジョブ詳細・作成
|  |  └ undertaked_jobs/      # 着手ジョブ評価
|  ├ api/                     # API Routes
|  └ ...(layout, page.tsx等)
├ components/                 # 共通コンポーネント
|  ├ layout/                  # レイアウト系
|  ├ worker/                  # 労働者向け
|  └ requester/               # 発注者向け
├ hooks/                      # カスタムフック
|  ├ useJobs.ts
|  ├ useUndertakedJobs.ts
|  ├ useBookmarks.ts
|  └ ...
├ stores/                     # Zustand ストア
|  ├ useJobStore.ts
|  └ ...
├ constants/
|  ├ api-mocks/               # モックAPI（LocalStorage操作）
|  |  ├ index.ts              # loadMockData, API exports
|  |  ├ jobApi.ts
|  |  └ ...
|  └ mocks/                   # 初期モックデータ
|     ├ jobs.ts
|     └ ...
├ types/                      # 型定義
|  ├ index.ts                 # エンティティ型
|  └ apis/                    # API パラメータ型
├ lib/                        # ライブラリ設定
├ utils/                      # ユーティリティ関数
└ ...(package.json, tsconfig.json等)
```

フロントエンドで利用するライブラリ: バージョン指定は必ず同じものを利用

next: 16.1.1

react: 19.2.3

react-dom: 19.2.3

zustand

HeroUI(tailwindcss)

zod

es-toolkit

leaflet

biome

### 労働者ページ

- 共通事項
    
    ```markdown
    これはスマホUI前提のためスマホサイズではない場合、
    一番親Componentで無理やりそれ以下のChildrenはスマホサイズになるようなLayoutを設計する必要がある。
    
    共通UIとしてHeaderとFooterがある。
    Headerには、【DIGITAL GUILD】という名前のタイトルと右側にハンバーガーメニューアイコンがある。
    ハンバーガーメニューアイコンは押しても何も機能は無くていい。タイトルも同様である。
    重要なのが、その下にあるギルド証の表示。
    ギルド証には、Card形式で左にアイコン(@frontend/public/avatar4.png)を〇アイコンとして、
    その右に【探索者　田中一郎】のように名前、その右側（Cardの右は時には上から順）に、所持しているJPYCの数、現在のクラス情報が必要です。
    そして今回つくるのはモックのため、最上部に薄くバーを追加し、
    そこに【※これはモックです。発注者側UIは右のボタンから。】という表示と
    右側に”切り替え”ボタンを用意し、押下すると、/requesterページに遷移するようにする。
    ここの部分はコンポネント化し、true/falseで表示可否を切り替えられるようにしておいてほしい。
    
    Footerには、掲示板アイコン、マップアイコン、ジョブアイコン、ウォレットアイコン、ギルド証アイコンがある。
    それぞれ画像は@frontend/public/iconsの中にアイコンが画像があるのでそれを利用する方にしてほしい
    
    また、このUIで重要なのが、背景が透過した画像を利用されるということです。
    画像は@frontend/public/backgrounds/の中にnight.png, morning.png, noon.pngがあるので、現在時刻に沿って切り分けて表示するようにしておいてください。
    この背景画像の上に50%の黒Maskを行いそのうえに各UIが白で配置されるような形です。
    
    この共通UIの関しては、参考として@docs/figma/base.pngがあるのでそれを利用してほしい。
    ```
    
- 掲示板
    
    ```markdown
    掲示板画面では、以下の情報のカード一覧と検索バーが表示される
    カード内に表示される情報
    - 画像: 画像をバックグラウンドとして記載
    - 報酬額: カード左上に"○○JPYC/回"と表示
    - タイトル: 左下に記載
    - 場所: 位置情報をタイトルの下に記載
    - 日時: 場所の下に配置
    - 内容: 内容は、１行ではみ出す場合は3点リーダーで表示。日時の下に記載
    - ”詳細はこちら”ボタン: 右下に配置。
    カード内のUIとして注意するべきポイントは、
    背景画像の上の50%くらいの黒いBackGroundMaskをしたうえで、
    文字はすべて白く抜いた形で行う事。
    
    検索バーでは、文字検索でタイトルや内容の中の部分一致でフィルターをしてほしい。
    入力の変更にともなってdebounceさせてください。ライブラリはes-toolkit使いましょう。
    フィルター機能では、日時や、報酬、スキルでフィルターできるようにしてほしい
    
    カードを押下すると、詳細ビューが下部モーダル式で画面7割くらいの感じで出てくる。
    そこはCardに書ききれない情報を載せる部分。
    
    詳しいUIは@docs/figma/board.pngを参照してください。
    ```
    
- マップ
    
    ```markdown
    マップ機能では、ユーザーがマップからジョブを探すことができる。
    特定の地域に旅行がてら探したいという新しい労働をしたい人向けへの機能。
    マップ上にJobがピンが立っていてピンの丸の部分は画像を表示。画像は@frontend/public/jobsを使ってください。
    マップピンを押下すると、掲示板画面と同様の詳細ビューモーダルが表示される。
    また、マップ上でのピン(ジョブ)は、ブックマークしたものとそうでないものがわかるように、
    マップピンの色を変えマップピンの右上にブックマークアイコンを小さく表示させるようにします。
    また、このマップピンビューでは、画面右下に検索アイコンを用意し、これを押下すると左に伸びて横幅いったいになり、
    掲示板と同様の検索機能を有してください。これはふぉるたーアイコンは不要です。
    
    詳しいUIは@docs/figma/map.pngを参照してください。
    
    ```
    
- ウォレット画面
    
    ```markdown
    ウォレット機能では、2次元バーコードとQRコードと所持金確認、そしてカメラで読み取って支払いを行うUIを持っている。
    モックなので、バーコードは@frontend/public/logo/barcode.pngにあり、qrコード画像は@frontend/public/logo/qr.png、JPYCのロゴ画像は@frontend/public/logo/jpyc.png
    に存在するのでそちらを使ってください。
    またこのウォレットUIの下には取引履歴を用意し、これもモックでいいです。
    
    詳細の画面は @docs/figma/wallet.pngを参照してください。
    
    ```
