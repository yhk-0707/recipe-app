# Reactへの置き換え対応表（JavaScript → React）

Reactへ移行するときのリプレース用チートシートです。  
(Thank you ペンギンさん…)

| JavaScript（今のコード）                              | React（これから）                                  | 考え方                                  |
| ---------------------------------------------- | -------------------------------------------- | ------------------------------------ |
| `document.getElementById(...)`                 | JSXに直接書く（必要なら`useRef`）                       | DOMを探して操作するのではなく、Reactに画面を作ってもらう。    |
| `el.innerHTML = ...`<br>`el.textContent = ...` | JSXを返す                                       | stateが変わるとReactが画面を更新する。             |
| `addEventListener("click", fn)`                | `onClick={fn}`                               | イベントはJSXに直接書く。                       |
| `let recipes = []` などの可変変数                     | `const [recipes, setRecipes] = useState([])` | 画面に関係するデータはstateで管理する。               |
| `input.value` を読む・書く                           | 制御コンポーネント（`value` + `onChange`）              | 入力値はDOMではなくstateに持つ。                 |
| `style.display = "none"` で表示切替                 | 条件付きレンダリング（`editing ? A : B`）                | 非表示にするのではなく、表示するものを切り替える。            |
| `map(...).join("\n")` でHTML文字列を作る              | `map(r => <li key={r.id}>...</li>)`          | HTML文字列ではなくJSXを返す。                   |
| `saveRecipes()` を各所で手動呼び出し                     | `useEffect(save, [recipes])`                 | 「○○したら保存」ではなく、「recipesが変わったら保存」と考える。 |
| `detail.html?id=1` へページ遷移                      | React Router / Next.jsのルーティング                | HTMLファイルを移動するのではなく、ルーティングで画面を切り替える。  |
| `renderRecipeListItem(recipe)` 関数              | `<RecipeCard recipe={recipe} />`             | 画面を返す関数はコンポーネントとして切り出す。              |