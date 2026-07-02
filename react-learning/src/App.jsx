// returnの前 → JavaScriptを書く場所
// returnの中 → 画面（JSX）を書く場所
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

function App() {
    // 検索クエリの状態を管理するためにuseStateを使う
    const [query, setQuery] = useState("");

    // 検索処理 search.jsに該当
    const terms = query.trim().toLowerCase().split(/\s+/); // 検索クエリを小文字に変換し、空白で分割して配列にする
    const results = terms.length === 0 // つまることろif「termsが空の場合は…？」
        ? defaultRecipes // ifが真の場合:デフォルトレシピを返す
        : defaultRecipes.filter(recipe => // ifが偽の場合(else):検索クエリに一致するレシピをフィルタリングする
            terms.some(term => // 検索クエリの各単語がレシピ名または材料に含まれているかをチェックする
                recipe.name.toLowerCase().includes(term) || // レシピ名に検索クエリが含まれているかをチェック
                recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(term)) // 材料に検索クエリが含まれているかをチェック
            )
        );

    // returnでUIのJSXを返す
    return (
        <div>
            <h1>レシピ検索</h1>
        </div>
    );
}

export default App;
