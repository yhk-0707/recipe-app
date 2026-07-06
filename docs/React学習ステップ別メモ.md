# React学習ステップ別メモ

## 目的

JavaScript版のレシピアプリをベースに、React版を一つずつ段階的に作るための学習メモです。

## ステップ1: まずは見出しを表示する

### 目標

Reactで画面に文字を表示する。

### Reactでの考え方

- `function App()` で画面の部品を作る
- `return (...)` の中に表示内容を書く

### 例

```jsx
function App() {
  return <h1>レシピ検索</h1>;
}
```

### JavaScript版との対応

- JavaScript版: HTMLに見出しを書いていた
- React版: `return` の中に見出しを返す

---

## ステップ2: 入力欄を追加する

### 目標

ユーザーが文字を入力できるようにする。

### Reactでの考え方

- `input` を JSX で書く
- `value` で表示内容を管理する

### JavaScript版との対応

- JavaScript版: `document.getElementById("ingredientInput")` で入力欄を取得していた
- React版: `input` をそのまま JSX で書く

---

## ステップ3: 入力した文字を覚える

### 目標

入力欄の値を React で管理する。

### Reactで学ぶ概念

- `useState`
- 状態を変えることで画面が更新される

### JavaScript版との対応

- JavaScript版: 変数に入力値を入れていた
- React版: `useState` で値を保持する

---

## ステップ4: ボタンを押したら動くようにする

### 目標

検索ボタンを押したときに処理を実行する。

### Reactで学ぶ概念

- `onClick`
- ボタン押下時の関数を呼ぶ

### JavaScript版との対応

- JavaScript版: `addEventListener("click", ...)`
- React版: `onClick={...}`

---

## ステップ5: 検索結果を表示する

### 目標

検索結果を画面に表示する。

### Reactで学ぶ概念

- 条件分岐
- 配列の表示
- `map()`

### JavaScript版との対応

- JavaScript版: 結果を DOM に追加していた
- React版: 配列を `map()` で表示する

---

## JavaScript版とReact版の対応表

| JavaScript版の考え方 | React版の考え方 |
|---|---|
| HTMLに要素を書く | JSXで要素を書く |
| `getElementById()` で取得 | 変数や状態で管理する |
| `addEventListener()` で処理を登録 | `onClick` や `onChange` で処理を登録 |
| DOMを直接変更 | 状態に応じてUIを再描画 |
| 画面操作を手で書く | 画面を部品として組み立てる |

## 学習の進め方

1. まずは見出しを表示する
2. 入力欄を追加する
3. 入力した文字を状態で管理する
4. ボタンを押したら処理を走らせる
5. 検索結果を表示する

これを一つずつ進めると、Reactの基本が理解しやすくなります。
