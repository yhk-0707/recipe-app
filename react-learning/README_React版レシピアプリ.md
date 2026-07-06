# React学習用レシピアプリ（App.jsx版）

このディレクトリには、React学習のために作成したレシピアプリの App.jsx 版を配置しています。

## 概要

元の HTML/CSS/JavaScript 版のレシピアプリを、React のコンポーネント構成に置き換えたものです。

## できること

- レシピの検索
- レシピの追加
- レシピの編集
- レシピの削除
- ブラウザの localStorage への保存

## 主要ファイル

- src/App.jsx: 画面表示・検索・追加・編集・削除のロジック
- src/main.jsx: React のエントリーポイント
- index.html: Vite の起動用HTML

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

## 実装のポイント

- useState で入力値やレシピ一覧を管理
- useEffect でレシピデータを localStorage に保存
- 検索条件に応じてレシピをフィルタリング
- コンポーネント分割により、検索ボックスとレシピカードを独立して管理
