// returnの前 → JavaScriptを書く場所
// returnの中 → 画面（JSX）を書く場所→htmlの役割
// JSXの{}の中 → JavaScriptを書ける場所

// useState:コンポーネントの状態を管理するためのフック。「このstateの値を保持して、更新する関数を返す」とReactに予約しておく仕組み。
// useEffect:コンポーネントを外部システムと同期させるためのフック。「このstateが変わったら、この処理を実行して」とReactに予約しておく仕組み。
import { useState, useEffect } from "react";
import SearchBox from "./components/SearchBox";
import AddRecipeForm from "./components/AddRecipeForm";
import RecipeList from "./components/RecipeList";
import RegisterRecipeForm from "./components/RegisterRecipeForm";
import defaultRecipes from "./data/defaultRecipes";

// Appコンポーネントの定義
function App() {
    // 検索クエリの状態を管理するためにuseStateを使う
    const [query, setQuery] = useState("");

    // recipesの初期値をlocalStorageから復元するために、useStateの初期値として関数を渡す。
    const [recipes, setRecipes] = useState(() => {
        const saved = localStorage.getItem("recipes");
        return saved
            ? JSON.parse(saved)
            : defaultRecipes;
    });

    // 画面切り替え用の状態
    const [viewMode, setViewMode] = useState("search");

    // 新しいレシピ名の状態を管理するためにuseStateを使う
    const [newName, setNewName] = useState("");
    // 新しいレシピの材料入力状態を管理するためにuseStateを使う
    const [newIngredients, setNewIngredients] = useState("");
    // 編集中のレシピIDを管理するためのstate
    const [editingRecipeId, setEditingRecipeId] = useState(null);
    // 編集中のレシピ名
    const [editName, setEditName] = useState("");
    // 編集中の材料入力
    const [editIngredients, setEditIngredients] = useState("");

    // recipesが変わったら自動で保存するためにuseEffectを使う
    useEffect(() => {
        localStorage.setItem("recipes", JSON.stringify(recipes));
    }, [recipes]);

    // 新しいレシピを追加する関数
    const addRecipe = () => {
        const trimmedName = newName.trim();
        if (trimmedName === "") return;

        const ingredients = newIngredients
            .split(",")
            .map(ingredient => ingredient.trim())
            .filter(Boolean);

        setRecipes(prevRecipes => [
            ...prevRecipes,
            { id: Date.now(), name: trimmedName, ingredients }
        ]);
        setNewName("");
        setNewIngredients("");
    };

    // 登録フォームの内容をパースしてレシピオブジェクトに変換する
    const parseRecipeText = (text, url) => {
        const lines = text.split(/\r?\n/);
        let recipeName = "";
        let ingredients = [];
        let steps = [];
        let recipeUrl = "";
        let mode = "";

        lines.forEach(line => {
            const trimmed = line.trim();

            if (trimmed.startsWith("料理名")) {
                mode = "title";
                return;
            }

            if (mode === "title" && trimmed !== "") {
                recipeName = trimmed;
                mode = "";
                return;
            }

            if (trimmed.startsWith("材料")) {
                mode = "ingredients";
                return;
            }

            if (trimmed.startsWith("手順")) {
                mode = "steps";
                return;
            }

            if (trimmed.startsWith("参考URL")) {
                const value = trimmed.replace(/.*参考URL[:：]?\s*/, "").trim();
                if (value) {
                    recipeUrl = value;
                } else {
                    mode = "url";
                }
                return;
            }

            if (mode === "url" && trimmed !== "") {
                recipeUrl = trimmed;
                mode = "";
                return;
            }

            if (mode === "ingredients" && trimmed.startsWith("-")) {
                const item = trimmed.replace(/^-/, "").trim();
                const parts = item.split("|");
                ingredients.push(parts[0]?.trim() || "");
                return;
            }

            if (mode === "steps" && trimmed !== "") {
                steps.push(trimmed.replace(/^\d+\./, "").trim());
            }
        });

        if (!recipeName) {
            return null;
        }

        return {
            name: recipeName,
            ingredients: ingredients.filter(Boolean),
            steps,
            url: url || recipeUrl,
        };
    };

    const handleRegister = (recipeText, recipeUrl) => {
        const trimmedText = recipeText.trim();
        if (!trimmedText) {
            window.alert("レシピのテキストを入力してください。");
            return false;
        }

        const parsedRecipe = parseRecipeText(trimmedText, recipeUrl);
        if (!parsedRecipe) {
            window.alert("料理名の形式が正しくありません。\n「料理名」の行の次にタイトルを入力してください。");
            return false;
        }

        setRecipes(prevRecipes => [
            ...prevRecipes,
            { id: Date.now(), ...parsedRecipe }
        ]);
        setViewMode("search");
        return true;
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
        const trimmedName = editName.trim();
        if (trimmedName === "") return;

        const ingredients = editIngredients
            .split(",")
            .map(ingredient => ingredient.trim())
            .filter(Boolean);

        setRecipes(prevRecipes =>
            prevRecipes.map(recipe =>
                recipe.id === editingRecipeId
                    ? { ...recipe, name: trimmedName, ingredients }
                    : recipe
            )
        );
        cancelEdit();
    };

    // 指定したレシピを削除し、編集中のレシピが削除対象なら編集状態もリセットする
    const deleteRecipe = (id) => {
        setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.id !== id));
        if (editingRecipeId === id) {
            cancelEdit();
        }
    };

    // 検索処理 search.jsに該当
    const terms = query.trim().toLowerCase().split(/\s+/);
    const results = terms.length === 0
        ? recipes
        : recipes.filter(recipe =>
            terms.some(term =>
                recipe.name.toLowerCase().includes(term) ||
                recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(term))
            )
        );

    // returnでUIのJSXを返す(元htmlの内容)
    // 検索欄とレシピ表示をコンポーネントで切り出し
    return (
        <div className="app-shell">
            <header className="app-header">
                <h1>{viewMode === "register" ? "レシピ登録" : "レシピ検索"}</h1>
                <div className="view-switcher">
                    <button
                        type="button"
                        className={viewMode === "search" ? "active" : ""}
                        onClick={() => setViewMode("search")}
                    >
                        検索・一覧
                    </button>
                    <button
                        type="button"
                        className={viewMode === "register" ? "active" : ""}
                        onClick={() => setViewMode("register")}
                    >
                        レシピ登録
                    </button>
                </div>
            </header>

            {viewMode === "register" ? (
                <>
                    <p className="intro">
                        整形済みレシピを貼り付けると、一覧へそのまま追加できます。
                    </p>
                    <RegisterRecipeForm onRegister={handleRegister} />
                </>
            ) : (
                <>
                    <SearchBox
                        query={query}
                        onChange={setQuery}
                    />

                    {results.length === 0 ? (
                        <p>該当するレシピがありません。</p>
                    ) : (
                        <RecipeList
                            recipes={results}
                            editingRecipeId={editingRecipeId}
                            editName={editName}
                            setEditName={setEditName}
                            editIngredients={editIngredients}
                            setEditIngredients={setEditIngredients}
                            onEdit={startEdit}
                            onDelete={deleteRecipe}
                            onSaveEdit={saveEdit}
                            onCancelEdit={cancelEdit}
                        />
                    )}

                    <AddRecipeForm
                        newName={newName}
                        setNewName={setNewName}
                        newIngredients={newIngredients}
                        setNewIngredients={setNewIngredients}
                        onAdd={addRecipe}
                    />
                </>
            )}
        </div>
    );
}

export default App;
