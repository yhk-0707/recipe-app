# レシピアプリで学んだReact

このアプリでは、React の基本的な開発フローを一通り学習しました。
単に画面を表示するだけでなく、「状態管理」「コンポーネント設計」「イベント処理」「副作用」「画面切り替え」など、React でよく使う考え方を実践しています。

---

# 1. コンポーネント

## 学んだこと

画面を部品（コンポーネント）に分けて作る考え方です。

### このアプリで実践した例

- `App`
- `SearchBox`
- `RegisterRecipeForm`
- `RecipeList`
- `RecipeCard`

それぞれに役割を持たせることで、コードの見通しや再利用性が上がることを学びました。

---

# 2. Props

## 学んだこと

親コンポーネントから子コンポーネントへ、データや関数を渡す仕組みです。

### このアプリで実践した例

`App` から `SearchBox` へ

- `query`
- `onChange`

`App` から `RegisterRecipeForm` へ

- `onRegister`

`App` から `RecipeList` へ

- `recipes`
- `editingRecipeId`
- `editRecipeText`
- `setEditRecipeText`
- `onEdit`
- `onDelete`
- `onSaveEdit`
- `onCancelEdit`

`RecipeList` から `RecipeCard` へ

- `recipe`
- `isEditing`
- `editRecipeText`
- `setEditRecipeText`
- `onEdit`
- `onDelete`
- `onSaveEdit`
- `onCancelEdit`

Props によって、表示だけでなくクリック時の処理や編集状態も子コンポーネントへ渡せることを学びました。

---

# 3. useState

## 学んだこと

画面で変化する値（state）を管理する方法です。

### このアプリで管理している state

- `query`
- `recipes`
- `viewMode`
- `newName`
- `newIngredients`
- `editingRecipeId`
- `editRecipeText`

入力内容、表示モード、レシピ一覧など、画面の状態は state で管理しています。

state が更新されると React が自動で再描画する仕組みを学びました。

---

# 4. useEffect

## 学んだこと

state の変更をきっかけに処理を実行する方法です。

### このアプリで実践した例

```jsx
useEffect(() => {
    localStorage.setItem("recipes", JSON.stringify(recipes));
}, [recipes]);
```

レシピが変更されたタイミングだけ `localStorage` に保存しています。

副作用のような、画面表示とは直接関係ない処理は `useEffect` で管理することを学びました。

---

# 5. 制御コンポーネント

## 学んだこと

入力欄の値を state で管理する方法です。

### このアプリで実践した例

```jsx
<input
    value={query}
    onChange={e => onChange(e.target.value)}
/>
```

```jsx
<textarea
    value={recipeText}
    onChange={e => setRecipeText(e.target.value)}
/>
```

入力値を React が管理することで、

- 入力内容の取得
- バリデーション
- 初期化

などがしやすくなることを学びました。

---

# 6. イベント処理

## 学んだこと

ボタンや入力欄のイベント処理です。

### このアプリで使用したイベント

- `onClick`
- `onChange`

イベント発生時に state を更新する流れを学びました。

---

# 7. 条件分岐による画面切り替え

## 学んだこと

state によって表示内容を切り替える方法です。

### このアプリで実践した例

- 検索画面
- レシピ登録画面
- 登録済み一覧画面
- 編集中表示
- 検索結果なし

```jsx
viewMode === "register" ? (...) : viewMode === "registered" ? (...) : (...)
```

三項演算子や条件レンダリングを使って、1つの画面内でモードを切り替える方法を学びました。

---

# 8. リスト表示

## 学んだこと

配列から UI を生成する方法です。

### このアプリで実践した例

```jsx
recipes.map(recipe => (
    <RecipeCard ... />
))
```

```jsx
results.map(recipe => (
    <li key={recipe.id}>...</li>
))
```

React では HTML を繰り返し書くのではなく、配列から UI を生成する考え方を学びました。

---

# 9. key属性

## 学んだこと

リスト表示時に各要素を識別するための `key` です。

### このアプリで実践した例

```jsx
key={recipe.id}
```

React が差分更新を効率よく行うために必要であることを学びました。

---

# 10. 配列 state の更新

## 学んだこと

state は直接変更せず、新しい配列を作って更新することです。

### このアプリで実践した例

追加

```jsx
setRecipes(prevRecipes => [
    ...prevRecipes,
    { id: Date.now(), ...parsedRecipe }
]);
```

編集

```jsx
map()
```

削除

```jsx
filter()
```

React ではイミュータブル（不変）な更新が基本であることを学びました。

---

# 11. フォーム入力の加工

## 学んだこと

入力値を加工してから state やデータに反映する方法です。

### このアプリで実践した例

- `trim()`
- `split()`
- `map()`
- `filter()`

材料を

```text
卵, 牛乳, チーズ
```

のように入力した場合、配列へ変換して保存しています。

さらに登録画面では、次のようなテキスト形式を解析してレシピに変換しています。

```text
料理名
オムライス
材料
- 卵
- ご飯
手順
1. 炒める
参考URL
https://example.com
```

JavaScript の配列操作と React を組み合わせる方法を学びました。

---

# 12. localStorage との連携

## 学んだこと

ブラウザへデータを保存する方法です。

### 読み込み

```jsx
useState(() => {
    const saved = localStorage.getItem("recipes");
    return saved ? JSON.parse(saved) : defaultRecipes;
});
```

### 保存

```jsx
localStorage.setItem("recipes", JSON.stringify(recipes));
```

React の state とブラウザ保存を連携する方法を学びました。

---

# 13. コンポーネント設計

## 学んだこと

処理を役割ごとに分ける設計です。

### App

- state 管理
- データ管理
- 検索
- レシピ登録
- 編集
- 削除
- 画面モード切り替え

### SearchBox

- 検索入力

### RegisterRecipeForm

- 整形済みレシピの入力
- URL 入力
- 登録

### RecipeList

- レシピ一覧の表示

### RecipeCard

- レシピ表示
- 編集 UI

UI とロジックを分ける設計を学びました。

---

# 14. React の考え方

このアプリを通して、React では

- state が画面を決める
- UI は state から自動生成される
- コンポーネント単位で設計する
- props でデータや処理を渡す
- state 更新によって再描画される

という React の基本的な考え方を実践的に学びました。

---

# このアプリで身に付いたReactの基礎

- JSX
- コンポーネント
- Props
- `useState`
- `useEffect`
- イベント処理
- 制御コンポーネント
- 条件レンダリング
- リスト表示（`map`）
- `key` 属性
- state の更新方法
- `localStorage` 連携
- CRUD（追加・編集・削除）
- コンポーネント設計
- 画面モード切り替え
- テキストからのレシピ解析

---

# 15. どのファイルに対応しているか

学習内容を読み返しやすいように、実装との対応先をまとめておきます。

| 学習内容 | 対応ファイル / 構成 |
|---|---|
| アプリ全体の状態管理、検索、登録、編集、削除、画面切り替え | `src/App.jsx` |
| 起動処理、`App` の描画 | `src/main.jsx` |
| 検索入力の制御コンポーネント | `src/components/SearchBox.jsx` |
| 整形済みレシピの登録フォーム | `src/components/RegisterRecipeForm.jsx` |
| 登録済みレシピの一覧表示 | `src/components/RecipeList.jsx` |
| 1件ごとの表示、編集 UI、削除ボタン | `src/components/RecipeCard.jsx` |
| 初期データ | `src/data/defaultRecipes.js` |
| 見た目のスタイル | `src/App.css` |
| Vite の設定 | `vite.config.js` |

## 構成の対応

- `App` は親コンポーネント
- `SearchBox` / `RegisterRecipeForm` / `RecipeList` / `RecipeCard` は子コンポーネント
- `viewMode` によって `検索・一覧 / レシピ登録 / 登録済み一覧` を切り替える
- `recipes` は `localStorage` から復元し、変更時に保存する
- `defaultRecipes` は `localStorage` にデータがないときの初期値になる

## 見返すときの目安

- state の流れを見たいときは `src/App.jsx`
- コンポーネント分割を見たいときは `src/components/`
- 初期データを見たいときは `src/data/defaultRecipes.js`
- 画面の見た目を見たいときは `src/App.css`
