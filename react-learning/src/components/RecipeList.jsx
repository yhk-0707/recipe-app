import RecipeCard from "./RecipeCard"; //

function RecipeList({
    recipes, // レシピデータの配列を受け取るprops
    editingRecipeId, // 現在編集中のレシピのIDを受け取るprops
    editRecipeText, // 編集中のレシピ内容の状態を受け取るprops
    setEditRecipeText, // 編集中のレシピ内容を更新する関数を受け取るprops
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
                    editRecipeText={editRecipeText}
                    setEditRecipeText={setEditRecipeText}
                    onSaveEdit={onSaveEdit}
                    onCancelEdit={onCancelEdit}
                />
            ))}
        </ul>
    );
}

export default RecipeList;
