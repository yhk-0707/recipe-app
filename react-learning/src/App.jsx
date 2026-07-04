// returnの前 → JavaScriptを書く場所
// returnの中 → 画面（JSX）を書く場所→htmlの役割
// JSXの{}の中 → JavaScriptを書ける場所

// useState:コンポーネントの状態を管理するためのフック。「このstateの値を保持して、更新する関数を返す」とReactに予約しておく仕組み。
// useEffect:コンポーネントを外部システムと同期させるためのフック。「このstateが変わったら、この処理を実行して」とReactに予約しておく仕組み。
import { useState, useEffect } from "react";

// デフォルトレシピデータ recipes.jsに該当
// js版と別に変わらない
const defaultRecipes = [
    { id: 1, name: "オムライス", ingredients: ["卵", "ご飯", "ケチャップ"] },
    { id: 2, name: "親子丼", ingredients: ["鶏肉", "卵", "玉ねぎ"] },
    { id: 3, name: "カレーライス", ingredients: ["じゃがいも", "にんじん", "玉ねぎ"] },
];

function SearchBox({ query, onChange }) {
    // 検索欄のコンポーネント化
    // あとでモジュール化で切り出したい
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

    const [recipes, setRecipes] = useState(() => { // recipesの初期値をlocalStorageから復元するために、useStateの初期値として関数を渡す。
        const saved = localStorage.getItem("recipes"); // localStorageから保存されたレシピデータを取得する。
        return saved
            ? JSON.parse(saved) // localstorageに保存されている場合はそれを復元し、recipesの初期値として使う。
            : defaultRecipes; // localstorageに保存されていない場合はデフォルトレシピをrecipesの初期値として使う。
    });

    //　recipesが変わったら自動で保存するためにuseEffectを使う
    useEffect(() => { // useEffectの第1引数で処理を定義する。第2引数で対象となるstateを指定する。
        localStorage.setItem("recipes", JSON.stringify(recipes)); // 第1引数:「localStorageに保存する」
    }, [recipes]); // 第2引数:「recipesが変わったら実行する」

    // 
    const [newName, setNewName] = useState(""); // 新しいレシピ名の状態を管理するためにuseStateを使う
    const addRecipe = () => { // 新しいレシピを追加する関数
        if (newName.trim() === "") return; // 入力欄が空の場合は何もしない
        setRecipes([...recipes, // 新しいレシピを追加するために、既存のレシピ配列に新しいレシピを追加する
        { id: Date.now(), name: newName.trim(), ingredients: [] }]); // 新しいレシピのidはDate.now()で一意の値を生成する。nameは入力欄の値をtrim()で前後の空白を削除して設定する。ingredientsは空配列で初期化する。
        setNewName(""); // 入力欄をリセットする
    };

    // 検索処理 search.jsに該当
    const terms = query.trim().toLowerCase().split(/\s+/); // 検索クエリを小文字に変換し、空白で分割して配列にする
    const results = terms.length === 0 // つまることろif-else → 三項演算子 if「termsが空の場合は…？」
        ? recipes // ifが真の場合:現在のrecipesをそのまま返す（検索クエリが空の場合は全件表示する）
        : recipes.filter(recipe => // ifが偽の場合(else):検索クエリに一致するレシピをフィルタリングする
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
                : (<ul> {/*// 順序なしリスト（ul要素）で検索結果を表示する */}
                    {results.map(recipe =>  // 検索結果があるとき、results配列のリスト(li要素)を作成。
                    (
                        <RecipeCard key={recipe.id} recipe={recipe} /> // keyはReactがリストの要素を識別するために必要。recipe.idを使うことで一意の値を指定する。
                    ))}
                </ul>
                )}

            <input // 新しいレシピ名の入力欄
                value={newName} // 入力欄の値をnewNameにバインドする
                onChange={e => setNewName(e.target.value)} // 入力欄の値が変更されたときにnewNameを更新する
                placeholder="新しいレシピ名" /> {/* 入力欄のプレースホルダーを設定する */}
            <button
                onClick={addRecipe} // クリックされたときにaddRecipe関数を実行する
                disabled={newName.trim() === ""} // 入力欄が空の場合はボタンを無効化する
            >
                追加 {/* ボタンのラベル */}
            </button>

        </div>
    );
}

export default App;
