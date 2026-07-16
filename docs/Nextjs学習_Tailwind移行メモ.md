# Next.js学習 - Tailwind CSS移行メモ

## 目的
`nextjs-learning` の画面を Tailwind CSS に移し替えた際に、どこをどのように変更したかを整理したメモ。

## 要点
Tailwind CSS への移行で実施した作業は、次の3項目に整理できる。

1. `globals.css` を全体設定に限定した
2. 画面で再利用する表示部品を `ui.tsx` に切り出した
3. 各 `page.tsx` を Tailwind のクラスで組み直した

## 1. `globals.css` に残したもの

対象ファイル:

- [`src/app/globals.css`](../nextjs-learning/src/app/globals.css)

`globals.css` には、全ページに共通する基本設定のみを配置した。

- 背景色
- 文字色
- フォント
- 余白の初期値
- Tailwind のテーマ変数

特に `@theme inline` では、Tailwind 側に正式な色名を定義した。

- `--color-foreground`
- `--color-muted`
- `--color-accent`
- `--color-accent-foreground`
- `--color-border`
- `--color-ring`

この定義により、`text-foreground` や `text-accent` のような標準的な Tailwind クラスを使用できる。

## 2. 共通UIを `ui.tsx` に切り出した

対象ファイル:

- [`src/components/ui.tsx`](../nextjs-learning/src/components/ui.tsx)

`ui.tsx` では、ページごとに同一の構造を繰り返さないために、共通部品をまとめている。

### 作成した共通部品

- `PageShell`
  - 各ページの横幅と余白を揃える
- `Card`
  - 白いカード表示を共通化する
- `PageTitle`
  - ページの主見出し
- `SectionTitle`
  - 「材料」「手順」などの小見出し
- `MutedText`
  - 補足説明や薄い文字列
- `Field`
  - ラベル、入力欄、補足文を一体化した構成
- `TextInput`
  - text / url / search の入力欄
- `TextArea`
  - textarea の共通設定
- `Button`
  - primary / secondary / danger の3種類
- `LinkButton`
  - `next/link` をボタン風に扱うラッパー

### 補足事項

- 似た構造を毎回 JSX に直書きしない方が可読性を保ちやすい
- コンポーネント化すると、変更箇所を1か所に集約できる
- `LinkButton` は `href` を必須にすることで型安全性を確保しやすい

## 3. 各ページを Tailwind クラスで組み直した

対象ファイル:

- [`src/app/page.tsx`](../nextjs-learning/src/app/page.tsx)
- [`src/app/register/page.tsx`](../nextjs-learning/src/app/register/page.tsx)
- [`src/app/recipes/page.tsx`](../nextjs-learning/src/app/recipes/page.tsx)
- [`src/app/recipes/[id]/page.tsx`](../nextjs-learning/src/app/recipes/%5Bid%5D/page.tsx)
- [`src/app/recipes/[id]/recipe-detail-client.tsx`](../nextjs-learning/src/app/recipes/%5Bid%5D/recipe-detail-client.tsx)
- [`src/app/recipes/delete-undo-toast-client.tsx`](../nextjs-learning/src/app/recipes/delete-undo-toast-client.tsx)

### トップページ

- 検索フォームをカードで囲った
- 登録ページと一覧ページへのリンクを配置した
- `Field` と `TextInput` を用いてフォーム構造を整理した

### 登録ページ

- 整形済みレシピを貼り付ける入力画面とした
- `recipeText` と `recipeUrl` を分離して入力できるようにした
- `Button` を用いて登録操作とクリア操作の表示を統一した

### 一覧ページ

- 登録済みレシピをカード一覧として表示した
- 空状態を `Card` で表示した
- 削除後の Undo トーストを表示するようにした

### 詳細ページ

- 閲覧モードと編集モードを `RecipeDetailClient` に集約した
- `材料` と `手順` をセクションとして分離した
- 編集時の入力欄を `TextInput` と `TextArea` に統一した

### Undo トースト

- `sessionStorage` に保存した削除レシピを用いて復元する
- `rounded-md` や `text-foreground` など、標準の Tailwind クラスへ統一した

## 4. Tailwind IntelliSense の警告対応

Tailwind の IntelliSense では、以下の警告が表示された。

- `rounded-[6px]` → `rounded-md`
- `text-[var(--foreground)]` → `text-foreground`
- `hover:text-[var(--accent)]` → `hover:text-accent`

対応方針は次の通りである。

- 細かい数値指定が不要な場合は標準形へ寄せる
- 色は `globals.css` 側で正式なトークンとして定義する

## 5. まとめポイント

- Tailwind は、見た目を CSS ファイルに閉じ込めるよりも、コンポーネント内で組み立てる方が扱いやすい
- ただし、全体設定まで JSX に書き込むとコードが散在しやすい
- `globals.css` は基本設定に限定し、画面固有の表示は `ui.tsx` と各ページに分ける
- 標準の Tailwind クラスへ統一すると、警告が減り、可読性も向上する

## 6. まとめ

Tailwind CSS への移行は、単純な CSS の置き換えではなく、「どの表示をどこに配置するか」を整理する作業である。

今回の構成では、次の分担を採用した。

- 共通の基本設定は `globals.css`
- 再利用する表示部品は `ui.tsx`
- 画面固有の構成は `page.tsx`

この分担により、表示の変更が容易になっている。
