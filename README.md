# kakeibo-pwa（家計簿PWA）

Vite + React + TypeScript で作成した、シンプルな家計簿アプリの PWA 版です。
支出/収入の記録、月別の収支サマリー、カテゴリ別の支出分析に対応しています。
データはローカルストレージに保存され、ブラウザを閉じても保持されます。

## 特徴

- **家計簿の記録**: 支出/収入を切り替えて記録可能
- **テンキー入力**: 金額はテンキー UI で入力（最大 8 桁）
- **カテゴリ管理**: 支出/収入それぞれにカテゴリを用意（アイコン/色付き）
- **月別サマリー**: 月ごとの残高・収入・支出を自動集計
- **履歴一覧**: 日付順に取引を表示し、個別に削除可能（確認ダイアログあり）
- **支出分析**: カテゴリ別の合計金額と割合を可視化
- **PWA 対応**: 追加インストール可能な PWA（manifest + service worker）
- **ローカル保存**: LocalStorage に永続化（キー: `kakeibo_data`）

## 画面構成

- **ホーム** (`HomePage`)
  - 月切り替え（前月/次月）
  - 今月の残高/収入/支出
  - 取引履歴一覧
- **記録追加** (`AddTransactionPage`)
  - 支出/収入の切り替え
  - カテゴリ選択
  - 日付入力
  - メモ入力（任意）
  - テンキーによる金額入力
- **分析** (`StatsPage`)
  - 月切り替え
  - 支出合計の表示
  - カテゴリ別の金額・割合の表示

## データ仕様

### 取引データ

- `id`: タイムスタンプ
- `type`: `expense` | `income`
- `amount`: 数値（円）
- `category`: カテゴリオブジェクト
- `date`: ISO 8601 文字列
- `note`: 文字列（任意）

### カテゴリ

`src/constants/categories.ts` で定義しています。

- **支出カテゴリ**
  - 食費 / 日用品 / 交通費 / 衣服 / 交際費 / カード / 趣味 / カフェ / その他
- **収入カテゴリ**
  - 給与 / ボーナス / その他

## ローカルストレージ

- 初回起動時はデモデータが投入されます
- データをリセットしたい場合は、ブラウザの LocalStorage から
  `kakeibo_data` を削除してください

## 使用技術

- **Core**: Vite 7 / React 19 / TypeScript 5
- **Styling**: Sass / CSS Modules
- **Icons**: lucide-react
- **Routing**: React Router DOM
- **PWA**: vite-plugin-pwa
- **Linting**: ESLint（Flat Config）
- **Utilities**: Sharp（アイコン生成）

## 必要な環境

- Node.js（LTS 推奨）
- パッケージマネージャー: pnpm（推奨）または npm

## セットアップ

```bash
# pnpm を使用する場合（推奨）
pnpm install

# npm を使用する場合
npm install
```

## 開発サーバー

```bash
pnpm dev
# または
npm run dev
```

ブラウザで `http://localhost:5173/` を開きます。

## ビルド

```bash
pnpm build
# または
npm run build
```

出力は `dist/` に生成されます。

## プレビュー

```bash
pnpm preview
# または
npm run preview
```

## Lint

```bash
pnpm lint
# または
npm run lint
```

## PWA アイコン生成

`public/images/ichigo-public.png` を元にアイコンを生成します。

```bash
node generate-icons.js
```

生成されるファイル:

- `public/pwa-192x192.png`
- `public/pwa-512x512.png`
- `public/maskable-icon-512x512.png`

## プロジェクト構成

```
.
├── public/
│   ├── images/                    # 元画像など
│   ├── pwa-192x192.png             # PWA アイコン
│   ├── pwa-512x512.png             # PWA アイコン
│   └── maskable-icon-512x512.png   # PWA マスカブルアイコン
├── src/
│   ├── components/                 # UI コンポーネント（Navigation, NumPad など）
│   ├── constants/                  # 定数（カテゴリ定義）
│   ├── hooks/                      # カスタムフック
│   ├── pages/kakeibo/              # 画面コンポーネント
│   ├── styles/                     # Sass 変数/ミックスイン/グローバルスタイル
│   ├── types/                      # 型定義
│   ├── App.tsx                     # ルーティング
│   └── main.tsx                    # エントリーポイント
├── generate-icons.js               # PWA アイコン生成スクリプト
├── vite.config.ts                  # Vite/PWA/Sass 設定
└── README.md
```

## 開発メモ

- `vite.config.ts` により、全 Sass ファイルで `variables` と `mixins` が自動読み込みされます。
- `vite-plugin-pwa` の `registerType: autoUpdate` により、サービスワーカーは自動更新されます。
- `base` は `/` です。サブディレクトリ配下に配置する場合は適宜変更してください。

## コミットメッセージ例

```
docs: README を最新仕様に更新
```
