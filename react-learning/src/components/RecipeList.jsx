import RecipeCard from "./RecipeCard"; //

function RecipeList({
    recipes, // レシピデータの配列を受け取るprops
    editingRecipeId, // 現在編集中のレシピのIDを受け取るprops
    editName, // 編集中のレシピ名の状態を受け取るprops
    setEditName, // 編集中のレシピ名を更新する関数を受け取るprops
    editIngredients, // 編集中の材料入力の状態を受け取るprops
    setEditIngredients, // 編集中の材料入力を更新する関数を受け取るprops
    onEdit, // レシピ編集の関数を受け取るprops
    onDelete, // レシピ削除の関数を受け取るprops
    onSaveEdit, // 編集内容を保存する関数を受け取るprops
    onCancelEdit // 編集をキャンセルする関数を受け取るprops
}) {
    // レシピ一覧の表示のコンポーネント化
    // 検索結果に応じてカードを並べて表示する
    return (
        <ul>
            {recipes.map(recipe => (
                <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    isEditing={editingRecipeId === recipe.id}
                    editName={editName}
                    setEditName={setEditName}
                    editIngredients={editIngredients}
                    setEditIngredients={setEditIngredients}
                    onSaveEdit={onSaveEdit}
                    onCancelEdit={onCancelEdit}
                />
            ))}
        </ul>
    );
}

export default RecipeList;
