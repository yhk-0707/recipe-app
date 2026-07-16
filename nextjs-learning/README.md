# Next.js学習用レシピアプリ

このディレクトリには、Next.js App Router + Prisma + PostgreSQL で作成したレシピアプリの実装が入っています。

## 概要

レシピを「検索する」「一覧で確認する」「詳細を開いて編集・削除する」「新規登録する」という流れを、Next.js のページルーティングと API Route に分けて学習できるようにしたサンプルです。

データは PostgreSQL に保存されます。削除は論理削除で行い、一覧画面から元に戻せます。

## できること

- 料理名や材料名でレシピを検索する
- 登録済みレシピの一覧を見る
- レシピ詳細を開いて内容を確認する
- レシピを編集する
- レシピを削除する
- 削除したレシピを一覧画面から元に戻す
- レシピデータを PostgreSQL に保存して次回起動時も復元する

## 画面構成

App Router のページは次の4つです。

- `/` : 検索トップ
- `/recipes` : 登録済み一覧
- `/recipes/[id]` : レシピ詳細
- `/register` : レシピ登録

## 検索仕様

検索トップの入力欄にキーワードを入れて送信すると、`/recipes?q=...` に遷移します。

- 検索対象は料理名と材料名です
- スペース区切りで複数語を入力できます
- 入力された語はすべて満たす必要があります
- 例: `カレー 玉ねぎ` なら、料理名または材料名に両方が含まれるレシピだけが表示されます

## 登録フォーマット

「レシピ登録」画面では、料理名・材料・手順・参考URLを入力します。

- 料理名は1行で入力します
- 材料は `材料名: 分量` または `材料名：分量` の形で、1行につき1件入力します
- 手順は1行につき1手順で入力します
- 手順の先頭番号は `1.` `1)` `1．` などをつけても構いません
- 参考URL は空欄でも登録できます

## API

このアプリでは、画面から API Route を呼び出してデータを操作します。

- `GET /api/recipes` : 一覧取得
- `GET /api/recipes?q=...` : 検索付き一覧取得
- `POST /api/recipes` : 新規登録
- `GET /api/recipes/[id]` : 1件取得
- `PATCH /api/recipes/[id]` : 更新
- `DELETE /api/recipes/[id]` : 論理削除
- `POST /api/recipes/[id]/restore` : 削除データを復元

## 主要ファイル

- `src/app/page.tsx`: 検索トップ
- `src/app/recipes/page.tsx`: 登録済み一覧
- `src/app/recipes/[id]/page.tsx`: レシピ詳細ページ
- `src/app/recipes/[id]/recipe-detail-client.tsx`: 詳細表示、編集、削除の client component
- `src/app/recipes/delete-undo-toast-client.tsx`: 削除後の Undo 表示
- `src/app/register/page.tsx`: レシピ登録ページ
- `src/app/api/recipes/route.ts`: 一覧取得と新規登録
- `src/app/api/recipes/[id]/route.ts`: 1件取得、更新、削除
- `src/app/api/recipes/[id]/restore/route.ts`: 削除レシピの復元
- `src/components/ui.tsx`: 共通 UI コンポーネント
- `src/components/recipe-preview-panel.tsx`: 入力プレビュー
- `src/lib/prisma.ts`: PrismaClient の初期化
- `src/lib/recipe-form.ts`: 入力値の整形と検証
- `src/lib/search.ts`: 検索ロジック
- `src/lib/recipe-types.ts`: レシピ型と API 変換
- `src/app/globals.css`: グローバルスタイル
- `compose.yaml`: PostgreSQL と Adminer のローカル起動定義

## 起動方法

1. このディレクトリに移動します
   ```bash
   cd nextjs-learning
   ```
2. 依存関係をインストールします
   ```bash
   npm install
   ```
3. PostgreSQL を起動します
   ```bash
   docker compose up -d
   ```
4. 開発サーバーを起動します
   ```bash
   npm run dev
   ```
5. ブラウザで表示された URL を開きます

## 環境変数

DB 接続には `DATABASE_URL` を使います。

ローカル環境では `.env` に次の設定があります。

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5454/recipe_app"
```

## ビルド

- 本番用にビルドする場合
  ```bash
  npm run build
  ```
- 本番ビルドを起動する場合
  ```bash
  npm run start
  ```
- 静的チェックを実行する場合
  ```bash
  npm run lint
  ```
- フォーマットを整える場合
  ```bash
  npm run format
  ```

## 実装のポイント

- App Router のページ分割で、検索・一覧・詳細・登録の導線を整理している
- Prisma 経由で PostgreSQL に保存している
- 検索は `normalizeSearchInput()` と `findRecipesByIngredientsOrName()` で行う
- 登録・編集の入力は `buildRecipePayload()` で検証している
- 詳細ページの編集と削除は client component 側で操作している
- 削除は `deletedAt` を使った論理削除にしている
- 削除後の Undo は `sessionStorage` と復元 API で実現している
- `src/app/api/recipes/[id]/route.ts` などの Route Handler では、Next.js 16 で `params` が Promise になる前提で扱っている
