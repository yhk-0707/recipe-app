# JavaScriptとJSXの関係

Reactを理解する上で大切なのは、

> **JavaScriptが土台で、その中でJSXという記法を使ってUIを書く**

という考え方です。

---

## 従来のWeb開発

```
HTML
↓
画面を作る

JavaScript
↓
画面を操作する
```

例

**HTML**

```html
<h1 id="title"></h1>
```

**JavaScript**

```javascript
document.getElementById("title").textContent = "こんにちは";
```

HTMLとJavaScriptは別々の役割でした。

---

# React

Reactでは、JavaScriptとJSXを同じファイル（`.jsx`）に書きます。

```text
App.jsx
│
├── JavaScript
│
└── JSX
```

例えば

```jsx
function App() {

  // JavaScript
  const [name, setName] = useState("");

  // JSX
  return (
    <h1>{name}</h1>
  );
}
```

---

# App.jsxの中身

```text
App.jsx
│
├── JavaScript
│     ├── state
│     ├── 関数
│     ├── 計算
│     ├── useState
│     └── useEffect
│
└── JSX
      ├── <div>
      ├── <input>
      ├── <button>
      └── <RecipeCard />
```

つまり

* `return`より前 … JavaScript
* `return`の中 … JSX（UI）

という構成になります。

---

# JSXとは？

JSXは

> **JavaScriptの中で、HTMLのようにUIを書ける記法**

です。

例えば

```jsx
return (
  <h1>Hello</h1>
);
```

見た目はHTMLですが、

実際にはJavaScriptの中で

> 「この画面を返す」

と書いています。

---

# JSXの中ではJavaScriptも書ける

JSXでは `{}` の中だけJavaScriptになります。

```jsx
const name = "文";

return (
  <h1>{name}</h1>
);
```

画面

```
文
```

さらに

```jsx
<p>{2 + 3}</p>
```

↓

```
5
```

も表示できます。

---

# JSXはHTMLではない

例えば

```jsx
<input value={query} />
```

HTMLでは

```html
<input value="abc">
```

のように固定値しか書けません。

一方JSXでは

```jsx
value={query}
```

のようにJavaScriptの変数を利用できます。

さらに

```jsx
{results.map(r => (
  <li key={r.id}>{r.name}</li>
))}
```

のようにJavaScriptを実行しながらUIを作れます。

---

# Reactの全体像

```text
JavaScript
    │
    ├── stateを持つ
    ├── 計算する
    ├── イベントを処理する
    │
    └── JSXでUIを書く
             │
             ▼
        Reactが画面を表示する
```

---

# 従来との比較

| 従来                 | React                          |
| ------------------ | ------------------------------ |
| HTML               | JSX（UIを書く）                     |
| JavaScript         | JavaScript（state・処理・計算を書く）     |
| HTMLとJavaScriptは別々 | JavaScriptとJSXを同じ`.jsx`ファイルに書く |

---

# 覚え方

> **JavaScriptが土台**

↓

その中で

> **JSXという記法を使うことで、HTMLのようにUIを書ける**

つまり、

* JavaScriptが中心
* JSXは画面を書くための便利な記法
* ReactはJSXをJavaScriptに変換して画面を表示している