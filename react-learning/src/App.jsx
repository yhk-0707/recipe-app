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
    return (
        <input // テキスト入力欄（JSXのinput要素）
            // value,checkedのpropsで現在のstateを渡す場合は、渡された値を更新するonChangeハンドラも渡す。
            value={query} // 入力欄の値をqueryにバインドする。文字列props
            onChange={e => onChange(e.target.value)} // 入力欄の値が変更されたときにqueryを更新する。
            placeholder="材料または料理名" // 入力欄のプレースホルダーを設定する （プレースホルダ―は、入力欄が空のときに表示される薄い文字のこと）
        />
    );
}

// Appコンポーネントで呼び出す子コンポーネント、「RecipeCard」の定義
function RecipeCard({
    recipe, // レシピデータのオブジェクトを受け取るprops
    onDelete, // レシピ削除の関数を受け取るprops
    onEdit, // レシピ編集の関数を受け取るprops
    isEditing, // 編集中かどうかの状態を受け取るprops
    editName, // 編集中のレシピ名の状態を受け取るprops
    setEditName, // 編集中のレシピ名を更新する関数を受け取るprops
    editIngredients, // 編集中の材料入力の状態を受け取るprops
    setEditIngredients, // 編集中の材料入力を更新する関数を受け取るprops
    onSaveEdit, // 編集内容を保存する関数を受け取るprops
    onCancelEdit // 編集をキャンセルする関数を受け取るprops
}) {
    // レシピ1件分を表示するためのコンポーネントとして、編集状態によって表示内容を切り替える
    return (
        <li>
            {isEditing ? (
                <div>
                    <input
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        placeholder="レシピ名"
                    />
                    <input
                        value={editIngredients}
                        onChange={e => setEditIngredients(e.target.value)}
                        placeholder="材料をカンマ区切りで入力"
                    />
                    <button onClick={onSaveEdit}>保存</button>
                    <button onClick={onCancelEdit}>キャンセル</button>
                </div>
            ) : (
                <div>
                    <strong>{recipe.name}</strong>（{recipe.ingredients.join("、")}）{/* レシピ名と材料を表示し、配列を区切り文字付きの文字列に変換する */}
                    <div>
                        <button onClick={() => onEdit(recipe)}>編集</button>
                        <button onClick={() => onDelete(recipe.id)}>削除</button>
                    </div>
                </div>
            )}
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
    const [newIngredients, setNewIngredients] = useState(""); // 新しいレシピの材料入力状態を管理するためにuseStateを使う
    const [editingRecipeId, setEditingRecipeId] = useState(null); // 編集中のレシピIDを管理するためのstate
    const [editName, setEditName] = useState(""); // 編集中のレシピ名
    const [editIngredients, setEditIngredients] = useState(""); // 編集中の材料入力

    const addRecipe = () => { // 新しいレシピを追加する関数
        const trimmedName = newName.trim();
        if (trimmedName === "") return; // 入力欄が空の場合は何もしない

        // 材料入力をカンマ区切りで配列に変換する
        const ingredients = newIngredients
            .split(",")
            .map(ingredient => ingredient.trim())
            .filter(Boolean);

        setRecipes(prevRecipes => [
            ...prevRecipes,
            { id: Date.now(), name: trimmedName, ingredients } // 新しいレシピのidはDate.now()で一意の値を生成する。nameは入力欄の値をtrim()で前後の空白を削除して設定する。ingredientsはカンマ区切りの入力を配列に変換する。
        ]);
        setNewName(""); // 入力欄をリセットする
        setNewIngredients(""); // 材料入力欄もリセットする
    };

    // 編集対象のレシピを選択して、編集フォームにその内容を反映する
    const startEdit = (recipe) => {
        setEditingRecipeId(recipe.id);
        setEditName(recipe.name);
        setEditIngredients(recipe.ingredients.join(", "));
    };

    // 編集状態をリセットして、入力欄を初期化する
    const cancelEdit = () => {
        setEditingRecipeId(null);
        setEditName("");
        setEditIngredients("");
    };

    // 編集内容を反映して、保存後に編集状態を終了する
    const saveEdit = () => {
        const trimmedName = editName.trim(); // 入力されたレシピ名の前後空白を取り除く
        if (trimmedName === "") return; // レシピ名が空なら保存処理を中断する

        const ingredients = editIngredients
            .split(",") // 材料入力をカンマ区切りで配列に分解する
            .map(ingredient => ingredient.trim()) // 各材料の前後空白を取り除く
            .filter(Boolean); // 空文字を除外して、実際の材料だけを残す

        setRecipes(prevRecipes =>
            prevRecipes.map(recipe =>
                // 編集対象のレシピかどうかを判定する
                recipe.id === editingRecipeId // 「編集対象のレシピか？」
                    ? { ...recipe, name: trimmedName, ingredients } // 編集対象のレシピなら、nameとingredientsを更新する
                    : recipe // 編集対象でないレシピはそのまま返す
            )
        );
        cancelEdit(); // 保存後に編集フォームの状態をリセットする
    };

    // 指定したレシピを削除し、編集中のレシピが削除対象なら編集状態もリセットする
    const deleteRecipe = (id) => {
        setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.id !== id)); //
        if (editingRecipeId === id) {
            cancelEdit();
        }
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
                        // RecipeCardコンポーネントを使って、各レシピを表示する
                        <RecipeCard
                            key={recipe.id}
                            recipe={recipe}
                            onDelete={deleteRecipe}
                            onEdit={startEdit}
                            isEditing={editingRecipeId === recipe.id}
                            editName={editName}
                            setEditName={setEditName}
                            editIngredients={editIngredients}
                            setEditIngredients={setEditIngredients}
                            onSaveEdit={saveEdit}
                            onCancelEdit={cancelEdit}
                        />
                    ))}
                </ul>
                )}

            <input // 新しいレシピ名の入力欄
                value={newName} // 入力欄の値をnewNameにバインドする
                onChange={e => setNewName(e.target.value)} // 入力欄の値が変更されたときにnewNameを更新する
                placeholder="新しいレシピ名" /> {/* 入力欄のプレースホルダーを設定する */}
            <input // 新しいレシピの材料入力欄
                value={newIngredients} // 入力欄の値をnewIngredientsにバインドする
                onChange={e => setNewIngredients(e.target.value)} // 入力欄の値が変更されたときにnewIngredientsを更新する
                placeholder="材料をカンマ区切りで入力" /> {/* 入力欄のプレースホルダーを設定する */}
            <button
                onClick={addRecipe} // クリックされたときにaddRecipe関数を実行する
                disabled={newName.trim() === ""} // レシピ名が空の場合はボタンを無効化する
            >
                追加 {/* ボタンのラベル */}
            </button>

        </div>
    );
}

export default App;
