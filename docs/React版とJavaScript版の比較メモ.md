# JavaScript → React → Next.js 学習メモ

## 目的

JavaScriptで作成したWebアプリをReactへ置き換えながら、
React・Next.jsの考え方を理解する。

---

# 1. JavaScriptとReactの違い

## JavaScript（Vanilla JS）

```
project/
├── index.html
├── style.css
└── script.js
```

| ファイル | 役割 |
|----------|------|
| index.html | 画面の構造 |
| style.css | 見た目 |
| script.js | 動き（DOM操作） |

JavaScriptでは

- `document.getElementById()`
- `querySelector()`
- `textContent`
- `addEventListener()`

などを使って**DOMを直接操作**する。

---

## React

```
react-app/
├── src/
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── public/
└── package.json
```

| ファイル | 役割 |
|----------|------|
| App.jsx | 画面 + 動き |
| App.css | 見た目 |
| main.jsx | React起動用 |

Reactでは

- JSXで画面を書く
- Stateで状態を管理する
- ReactがDOMを更新する

---

# 2. JavaScriptとReactの画面更新の違い

## JavaScript

```
HTML
      ↑
JavaScriptがDOMを直接操作
      ↓
CSS
```

例

```javascript
const title = document.getElementById("title");

title.textContent = "こんばんは";
```

---

## React

```
State
      ↓
React
      ↓
DOM
      ↓
画面
```

例

```jsx
const [message, setMessage] = useState("こんにちは");

<h1>{message}</h1>

<button onClick={() => setMessage("こんばんは")}>
  押す
</button>
```

### 考え方

- JavaScript：DOMを書き換える
- React：Stateを書き換える
- ReactがDOMを更新する

---

# 3. HTML・CSSはどうなる？

## HTML

JavaScript

```html
<h1>こんにちは</h1>
<button>押す</button>
```

React

```jsx
function App() {
  return (
    <>
      <h1>こんにちは</h1>
      <button>押す</button>
    </>
  );
}
```

ReactではHTMLではなく、
**JSXとしてJavaScriptファイル内に書く。**

---

## CSS

CSSはほぼ共通。

```css
button {
    color: red;
}
```

Reactでも同じように利用できる。

---

# 4. ファイルの対応関係

| JavaScript | React |
|------------|--------|
| index.html | App.jsx |
| style.css | App.css |
| script.js | App.jsx内のJavaScript |

---

# 5. コンポーネントとは？

コンポーネントとは、

**画面を再利用できる部品。**

JavaScriptでは

```
index.html
├── Header
├── Main
└── Footer
```

1つのHTMLに書くことが多い。

Reactでは

```
App.jsx
│
├── Header.jsx
├── Main.jsx
└── Footer.jsx
```

部品として分ける。

---

## ページが大きくなると

```
Products.jsx
│
├── Header
├── SearchBox
├── ProductList
├── ProductCard
└── Footer
```

さらに

```
src/
├── pages/
│   └── Products.jsx
│
└── components/
    ├── Header.jsx
    ├── SearchBox.jsx
    ├── ProductList.jsx
    ├── ProductCard.jsx
    └── Footer.jsx
```

のように整理する。

---

# 6. Reactの学習手順

```
① App.jsxに全部書く
        ↓
② Header・Main・Footerへ分割
        ↓
③ Mainをさらに部品へ分割
        ↓
④ 再利用できるコンポーネントを増やす
```

---

# 7. JavaScriptからReactへ置き換える流れ

```
① HTMLで画面を作る
        ↓
② JavaScriptでDOMを操作する
        ↓
③ ReactでJSXへ置き換える
        ↓
④ Stateで管理する
        ↓
⑤ コンポーネントへ分割する
```

---

# 8. Next.jsになると

Reactでは

```
App.jsx
```

が画面だった。

Next.jsでは

```
app/
├── page.jsx
├── about/
│   └── page.jsx
├── contact/
│   └── page.jsx
```

ページごとに

```
page.jsx
│
├── Header
├── Main
└── Footer
```

を組み合わせて画面を作る。

---

# 9. 全体の流れ

```
JavaScript

index.html
│
├── Header
├── Main
└── Footer


        ↓


React

App.jsx
│
├── Header.jsx
├── Main.jsx
└── Footer.jsx


        ↓


Next.js

app/
└── page.jsx
    │
    ├── Header
    ├── Main
    └── Footer
```

---

# 学習のポイント

- JavaScriptはDOMを直接操作する
- ReactはStateを変更して画面を更新する
- JSXはHTMLではなく、JavaScript内に書く画面構文
- CSSはそのまま利用できることが多い
- 最初はページ単位、慣れたらコンポーネント単位で分割する
- Next.jsでは`page.jsx`をページとして管理する