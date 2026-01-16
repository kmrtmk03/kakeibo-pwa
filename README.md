# kakeibo-pwa（家計簿PWA）

Vite 7 + React 19 + TypeScript 5 で構築された、モダンでシンプルな家計簿プログレッシブウェブアプリ（PWA）です。
支出・収入の記録、月別サマリー、カテゴリ別分析などの基本機能を備え、データはブラウザの LocalStorage に安全に保存されます。

## 特徴

- **直感的な記録**: 支出と収入をスムーズに切り替えて記録。
- **カスタムテンキー**: 入力しやすさを追求した専用のテンキー UI。
- **詳細なカテゴリ**: アイコンと色で視覚的に分類されたカテゴリ（支出・収入それぞれに対応）。
- **インサイト分析**: 月ごとの収支サマリーと、カテゴリ別の支出割合をグラフやリストで可視化。
- **快適な操作性**: Framer Motion と GSAP を使用した滑らかなアニメーション。
- **PWA 対応**: オフラインでも利用可能で、ホーム画面に追加してネイティブアプリのように使用可能。
- **データ永続化**: すべてのデータは LocalStorage に保存されるため、会員登録不要で即座に利用可能。

## 画面構成

- **ホーム (`HomePage`)**
  - 月間収支サマリー（残高・収入・支出）
  - 取引履歴の一覧表示と削除機能
  - 月の切り替え機能
- **記録追加 (`AddTransactionPage`)**
  - 金額入力（テンキー UI）
  - カテゴリ選択
  - 日付・メモ入力
- **分析 (`StatsPage`)**
  - カテゴリ別支出内訳（金額・パーセンテージ）
  - 月別支出合計の推移確認

## 使用技術

### Core
- **Framework**: React 19
- **Build Tool**: Vite 7
- **Language**: TypeScript 5
- **Routing**: React Router 7 (DOM)

### Styling & Animation
- **Styling**: Sass (SASS syntax) / CSS Modules
- **Animation**: Framer Motion, GSAP
- **Icons**: Lucide React

### PWA & Utilities
- **PWA**: vite-plugin-pwa
- **Icon Generation**: Sharp
- **Utility**: Date-fns 代替としての自作 `TimeUtil`

## プロジェクト構成

```
.
├── .agent/                    # AI エージェント用スキル・設定
├── public/                    # 静的資産（アイコン、PWA 用画像）
├── src/
│   ├── components/            # 共通 UI コンポーネント（Navigation, NumPad 等）
│   ├── constants/             # 定数定義（カテゴリ、設定値）
│   ├── hooks/                 # カスタムフック（データ操作、スクロール制御等）
│   ├── libs/                  # ユーティリティライブラリ（TimeUtil 等）
│   ├── pages/kakeibo/         # 画面コンポーネント
│   ├── styles/                # Sass 設計（変数、ミックスイン、グローバル）
│   ├── types/                 # TypeScript 型定義
│   ├── App.tsx                # ルーティング・全体レイアウト
│   └── main.tsx               # エントリーポイント
├── generate-icons.js          # PWA アイコン自動生成スクリプト
└── vite.config.ts             # Vite / PWA / Sass 統合設定
```

## 開発ガイド

### 必要な環境
- Node.js (LTS 推奨)
- pnpm (推奨) または npm / yarn

### セットアップ
```bash
pnpm install
```

### 開発サーバーの起動
```bash
pnpm dev
```

### ビルドとプレビュー
```bash
pnpm build
pnpm preview
```

### アイコンの生成
`public/images/ichigo-public.png` をベースに、各サイズおよびマスカブルアイコンを生成します。
```bash
node generate-icons.js
```

## 技術的なポイント

- **Sass 構成**: `vite.config.ts` の `additionalData` 設定により、すべての `.sass` ファイルで変数値 (`v.$variable`) とミックスイン (`m.mixin()`) が自動的にインポートされ、効率的なスタイリングが可能です。
- **カスタムエージェント**: `.agent/skills` 配下に、コードレビューやコメント記述を補助する AI エージェント用の定義が含まれています。
- **パフォーマンス**: PWA の `autoUpdate` 設定により、バックグラウンドでサービスワーカーが常に最新の状態に保たれます。

## コミットメッセージ規約
以下のプレフィックスを推奨します。
- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメント作成・更新
- `style`: コードの意味に影響を与えない変更（ホワイトスペース、フォーマット、セミコロンの欠落など）
- `refactor`: バグ修正も機能追加も行わないコード変更
- `test`: テストの追加・修正
- `chore`: ビルドプロセスやドキュメント生成などの補助ツール、ライブラリの変更