# Reactの`set○○`関数とは？

Reactでは、state（状態）を**直接変更することはできません**。

代わりに、`set○○`関数を使ってReactに更新を依頼します。

---

# `useState`は2つの値を返す

```jsx
const [recipes, setRecipes] = useState([]);
```

これは次の2つを受け取っています。

| 変数           | 役割                 |
| ------------ | ------------------ |
| `recipes`    | 現在のstate（現在のレシピ一覧） |
| `setRecipes` | stateを更新するための関数    |

イメージ

```text
useState()

↓

① 現在の値
② 値を更新する関数
```

---

# JavaScriptとの違い

## JavaScript

普通の変数は直接書き換えます。

```javascript
let count = 0;

count = 1;
```

イメージ

```text
count

0

↓

1
```

---

## React

Reactでは直接変更せず、`set○○`を使います。

```jsx
const [count, setCount] = useState(0);

setCount(1);
```

イメージ

```text
count
  │
  ▼
0

↓

setCount(1)
  │
  ▼
Reactがstateを更新
  │
  ▼
countが1になる
  │
  ▼
画面を更新
```

---

# `set○○`はワンクッションある

Reactでは

```jsx
count = 1;
```

ではなく

```jsx
setCount(1);
```

と書きます。

これは

> **「新しい値をset関数に渡して、Reactにstateの更新をお願いする」**

という意味です。

---

# なぜワンクッション必要なの？

Reactは

```jsx
count = 1;
```

だけでは

> 「画面も更新しなきゃ！」

ということが分かりません。

一方

```jsx
setCount(1);
```

なら

```text
setCountが呼ばれた！

↓

stateを更新

↓

再レンダリング

↓

画面更新
```

という流れになります。

---

# Reactが管理しているイメージ

## JavaScript

```text
自分で直接書き換える

変数
  │
  ▼
新しい値
```

---

## React

```text
set関数にお願いする
      │
      ▼
React
      │
      ├── state更新
      ├── 必要なら再レンダリング
      └── 画面更新
```

Reactが「管理者」として間に入っています。

---

# `setRecipes`の場合

```jsx
setRecipes(newRecipes);
```

流れ

```text
新しいレシピ一覧
        │
        ▼
setRecipes
        │
        ▼
React
        │
        ▼
recipesを更新
        │
        ▼
画面を更新
```

---

# すべて同じ考え方

```jsx
const [query, setQuery] = useState("");
```

↓

```jsx
setQuery("カレー");
```

---

```jsx
const [count, setCount] = useState(0);
```

↓

```jsx
setCount(10);
```

---

```jsx
const [isOpen, setIsOpen] = useState(false);
```

↓

```jsx
setIsOpen(true);
```

どれも

> **「新しい値をset○○に渡して、Reactに更新を依頼する」**

という共通の仕組みです。

---

# まとめ

* `useState`は「現在のstate」と「更新用の関数」を返す。
* stateは直接変更せず、必ず`set○○`関数を使う。
* `set○○`はReactに「stateを更新してください」と依頼する関数。
* Reactは`set○○`が呼ばれると、stateを更新し、必要に応じて画面を再レンダリングする。

## 一言で覚える

> **`set○○`は、stateを直接書き換える関数ではなく、Reactにstateの更新を依頼するための関数。**
