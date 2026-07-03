// returnの前 → JavaScriptを書く場所
// returnの中 → 画面（JSX）を書く場所→htmlの役割
// JSXの{}の中 → JavaScriptを書ける場所

// useState:コンポーネントの状態を管理するためのフック
import { useState } from "react";

// デフォルトレシピデータ recipes.jsに該当
// js版と別に変わらない
const defaultRecipes = [
    { id: 1, name: "オムライス", ingredients: ["卵", "ご飯", "ケチャップ"] },
    { id: 2, name: "親子丼", ingredients: ["鶏肉", "卵", "玉ねぎ"] },
    { id: 3, name: "カレーライス", ingredients: ["じゃがいも", "にんじん", "玉ねぎ"] },
];

function SearchBox({ query, onChange }) {
    // 検索欄のコンポーネント化
    return (
        <input // テキスト入力欄（JSXのinput要素）
            // value,checkedのpropsで現在のstateを渡す場合は、渡された値を更新するonChangeハンドラも渡す。
            value={query} // 入力欄の値をqueryにバインドする。文字列props
            onChange={e => onChange(e.target.value)} // 入力欄の値が変更されたときにqueryを更新する。
            placeholder="材料または料理名" // 入力欄のプレースホルダーを設定する （プレースホルダ―は、入力欄が空のときに表示される薄い文字のこと）
        />
    );
}

function RecipeCard({ recipe }) {
    // レシピ1件分の表示のコンポーネント化
    return (
        <li>
            <strong>{recipe.name}</strong>（{recipe.ingredients.join("、")}）{/* レシピ名と材料を表示する。joinで配列を文字列に変換する。 */}
        </li>
    );
}

// Appコンポーネントの定義
function App() {
    // 検索クエリの状態を管理するためにuseStateを使う
    const [query, setQuery] = useState("");

    // 検索処理 search.jsに該当
    const terms = query.trim().toLowerCase().split(/\s+/); // 検索クエリを小文字に変換し、空白で分割して配列にする
    const results = terms.length === 0 // つまることろif→三項演算子「termsが空の場合は…？」
        ? defaultRecipes // ifが真の場合:デフォルトレシピを返す
        : defaultRecipes.filter(recipe => // ifが偽の場合(else):検索クエリに一致するレシピをフィルタリングする
            terms.some(term => // 検索クエリの各単語がレシピ名または材料に含まれているかをチェックする
                recipe.name.toLowerCase().includes(term) || // レシピ名に検索クエリが含まれているかをチェック
                recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(term)) // 材料に検索クエリが含まれているかをチェック
            )
        );

    // returnでUIのJSXを返す(元htmlの内容)
    // 検索欄とレシピ表示をコンポーネントで切り出し
    return (
        <div>
            <h1>レシピ検索</h1>
            <SearchBox
                // value,checkedのpropsで現在のstateを渡す場合は、渡された値を更新するonChangeハンドラも渡す。
                query={query}
                onChange={setQuery}
            />
            {/* 検索結果の有無で表示内容を切り替える */}
            {results.length === 0
                ? (<p>該当するレシピがありません。</p>)// 検索結果がないとき
                : (<ul> // 順序なしリスト（ul要素）で検索結果を表示する
                    {results.map(recipe =>  // 検索結果があるとき、results配列のリスト(li要素)を作成。
                    (
                        <RecipeCard key={recipe.id} recipe={recipe} /> // keyはReactがリストの要素を識別するために必要。recipe.idを使うことで一意の値を指定する。
                    ))}
                </ul>
                )}
        </div>
    );
}

export default App;
