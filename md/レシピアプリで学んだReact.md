# App.jsxで学んだReact

このアプリでは、Reactの基本的な開発フローを一通り学習しました。
単純に画面を表示するだけではなく、「状態管理」「コンポーネント設計」「イベント処理」「副作用」など、Reactでよく使われる考え方を実践しています。

---

# 1. コンポーネント

## 学んだこと

画面を部品（コンポーネント）に分けて作る考え方。

### このアプリで実践した例

- App
- SearchBox
- RecipeCard

それぞれ役割を持たせることで、コードの見通しや再利用性が向上することを学びました。

---

# 2. Props

## 学んだこと

親コンポーネントから子コンポーネントへデータや関数を渡す仕組み。

### このアプリで実践した例

AppからSearchBoxへ

- query
- onChange

AppからRecipeCardへ

- recipe
- onDelete
- onEdit
- onSaveEdit

などをPropsとして受け渡しています。

Propsによって画面表示だけでなく、クリック時の処理も子コンポーネントへ渡せることを学びました。

---

# 3. useState

## 学んだこと

画面で変化する値（State）を管理する方法。

### このアプリで管理しているState

- query
- recipes
- newName
- newIngredients
- editingRecipeId
- editName
- editIngredients

入力内容やレシピ一覧など、画面の状態はすべてStateで管理しています。

Stateが更新されるとReactが自動で再描画する仕組みを学びました。

---

# 4. useEffect

## 学んだこと

Stateの変更をきっかけに処理を実行する方法。

### このアプリで実践した例

```jsx
useEffect(() => {
    localStorage.setItem("recipes", JSON.stringify(recipes));
}, [recipes]);
```

レシピが変更されたタイミングだけlocalStorageへ保存しています。

副作用（画面表示とは直接関係ない処理）はuseEffectで管理することを学びました。

---

# 5. 制御コンポーネント

## 学んだこと

入力欄の値をStateで管理する方法。

### このアプリで実践した例

```jsx
<input
    value={newName}
    onChange={e => setNewName(e.target.value)}
/>
```

入力値をReactが管理することで、

- 入力内容の取得
- バリデーション
- 初期化

などが簡単にできることを学びました。

---

# 6. イベント処理

## 学んだこと

ボタンや入力欄のイベント処理。

### このアプリで使用したイベント

- onClick
- onChange

イベント発生時にStateを更新する流れを学びました。

---

# 7. 条件分岐による画面切り替え

## 学んだこと

Stateによって表示内容を切り替える方法。

### このアプリで実践した例

- 編集モード
- 通常表示
- 検索結果なし

```jsx
isEditing ? (...) : (...)
```

三項演算子を使った条件レンダリングを学びました。

---

# 8. リスト表示

## 学んだこと

配列からUIを生成する方法。

### このアプリで実践した例

```jsx
results.map(recipe => (
    <RecipeCard ... />
))
```

ReactではHTMLを繰り返し書くのではなく、配列からUIを生成する考え方を学びました。

---

# 9. key属性

## 学んだこと

リスト表示時に各要素を識別するためのkey。

### このアプリで実践した例

```jsx
key={recipe.id}
```

Reactが差分更新を効率よく行うために必要であることを学びました。

---

# 10. 配列Stateの更新

## 学んだこと

Stateは直接変更せず、新しい配列を作って更新すること。

### このアプリで実践した例

追加

```jsx
setRecipes(prev => [...prev, recipe]);
```

編集

```jsx
map()
```

削除

```jsx
filter()
```

Reactではイミュータブル（不変）な更新が基本であることを学びました。

---

# 11. フォーム入力の加工

## 学んだこと

入力値を加工してからStateへ保存する方法。

### このアプリで実践した例

- trim()
- split()
- map()
- filter()

材料を

```
卵, 牛乳, チーズ
```

と入力すると

```js
[
  "卵",
  "牛乳",
  "チーズ"
]
```

という配列へ変換しています。

JavaScriptの配列操作とReactを組み合わせる方法を学びました。

---

# 12. localStorageとの連携

## 学んだこと

ブラウザへデータを保存する方法。

### 読み込み

```jsx
useState(() => {
    const saved = localStorage.getItem("recipes");
    ...
});
```

### 保存

```jsx
localStorage.setItem(...)
```

ReactのStateとブラウザ保存を連携する方法を学びました。

---

# 13. コンポーネント設計

## 学んだこと

処理を役割ごとに分ける設計。

### App

- State管理
- データ管理
- 検索
- CRUD

### SearchBox

- 検索入力

### RecipeCard

- レシピ表示
- 編集UI

UIとロジックを分ける設計を学びました。

---

# 14. Reactの考え方

このアプリを通して、Reactでは

- Stateが画面を決める
- UIはStateから自動生成される
- コンポーネント単位で設計する
- Propsでデータを渡す
- State更新によって再描画される

というReactの基本的な考え方を実践的に学びました。

---

# このApp.jsxで身に付いたReactの基礎

- JSX
- コンポーネント
- Props
- useState
- useEffect
- イベント処理
- 制御コンポーネント
- 条件レンダリング
- リスト表示（map）
- key属性
- Stateの更新方法
- localStorage連携
- CRUD（追加・編集・削除）
- コンポーネント設計