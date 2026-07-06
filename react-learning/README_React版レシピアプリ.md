# React学習用レシピアプリ

このディレクトリには、Vite + React で作成したレシピアプリの実装が入っています。

## 概要

レシピを「検索する」「整形済みテキストから登録する」「登録済み一覧で編集・削除する」という流れを、React のコンポーネントに分けて学習できるようにしたサンプルです。

起動すると、初期データとして `src/data/defaultRecipes.js` のレシピが表示されます。以後の変更内容はブラウザの `localStorage` に保存されます。

## できること

- 料理名や材料でレシピを検索する
- 整形済みのレシピテキストを貼り付けて登録する
- 登録済みレシピを一覧で確認する
- 登録済みレシピの編集と削除を行う
- レシピデータを `localStorage` に保存して次回起動時に復元する

## 画面構成

画面上部の切り替えボタンで、次の 3 つのモードを切り替えます。

- `検索・一覧`
- `レシピ登録`
- `登録済み一覧`

## 登録フォーマット

「レシピ登録」画面では、次の形式で入力します。

```text
料理名
オムライス
材料
- 卵 2個
- ご飯 1杯
手順
1. 卵を焼く
2. ご飯を炒める
参考URL
https://example.com
```

- `料理名` の次の行にレシピ名を入力します
- `材料` は `-` で始まる行を材料として読み取ります
- `手順` は番号付きの行を手順として読み取ります
- `参考URL` は入力欄の値が優先されます

## 主要ファイル

- `src/App.jsx`: 画面全体の状態管理、検索、登録、編集、削除
- `src/components/SearchBox.jsx`: 検索入力欄
- `src/components/RegisterRecipeForm.jsx`: レシピ登録フォーム
- `src/components/RecipeList.jsx`: 登録済みレシピ一覧
- `src/components/RecipeCard.jsx`: 各レシピの表示・編集UI
- `src/data/defaultRecipes.js`: 初期表示用レシピデータ
- `src/main.jsx`: React のエントリーポイント
- `src/App.css`: 画面全体のスタイル
- `index.html`: Vite の起動用 HTML

## 起動方法

1. このディレクトリに移動します
   ```bash
   cd react-learning
   ```
2. 依存関係をインストールします
   ```bash
   npm install
   ```
3. 開発サーバーを起動します
   ```bash
   npm run dev
   ```
4. ブラウザで表示された URL を開きます

## ビルド

- 本番用にビルドする場合
  ```bash
  npm run build
  ```
- ビルド成果物をローカル確認する場合
  ```bash
  npm run preview
  ```

## 実装のポイント

- `useState` で検索キーワード、表示モード、編集中の内容を管理
- `useEffect` でレシピ一覧を `localStorage` に自動保存
- `defaultRecipes` を初期データとして使用
- 検索はレシピ名と材料名を対象に部分一致で判定
- `SearchBox`、`RegisterRecipeForm`、`RecipeList`、`RecipeCard` に分割して UI を整理
