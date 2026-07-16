// Appコンポーネントで呼び出す子コンポーネント、「RecipeCard」の定義
function RecipeCard({
    recipe, // レシピデータのオブジェクトを受け取るprops
    onDelete, // レシピ削除の関数を受け取るprops
    onEdit, // レシピ編集の関数を受け取るprops
    isEditing, // 編集中かどうかの状態を受け取るprops
    editRecipeText, // 編集中のレシピ内容の状態を受け取るprops
    setEditRecipeText, // 編集中のレシピ内容を更新する関数を受け取るprops
    onSaveEdit, // 編集内容を保存する関数を受け取るprops
    onCancelEdit // 編集をキャンセルする関数を受け取るprops
}) {
    // レシピ1件分の表示のコンポーネント化
    // 編集状態によって表示内容を切り替える
    return (
        <li>
            {isEditing ? (
                <div>
                    <textarea
                        value={editRecipeText}
                        onChange={e => setEditRecipeText(e.target.value)}
                        placeholder={"料理名\nオムライス\n材料\n- 卵\n- ご飯\n手順\n1. 炒める\n参考URL\nhttps://example.com"}
                        rows="10"
                    />
                    <button onClick={onSaveEdit}>保存</button>
                    <button onClick={onCancelEdit}>キャンセル</button>
                </div>
            ) : (
                <div>
                    <strong>{recipe.name}</strong>（{recipe.ingredients.join("、")}）{/* レシピ名と材料を表示する。joinで配列を文字列に変換する。 */}
                    {recipe.steps && recipe.steps.length > 0 ? <div>手順: {recipe.steps.join(" / ")}</div> : null}
                    {recipe.url ? <div>URL: {recipe.url}</div> : null}
                    <div>
                        <button onClick={() => onEdit(recipe)}>編集</button>
                        <button onClick={() => onDelete(recipe.id)}>削除</button>
                    </div>
                </div>
            )}
        </li>
    );
}

export default RecipeCard;
