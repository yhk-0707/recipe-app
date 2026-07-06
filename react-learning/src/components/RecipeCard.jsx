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
    // レシピ1件分の表示のコンポーネント化
    // 編集状態によって表示内容を切り替える
    return (
        <li>
            {isEditing ? (
                <div>
                    <input
                        value={editName} // 編集中のレシピ名を表示する
                        onChange={e => setEditName(e.target.value)} // 編集中のレシピ名を更新する
                        placeholder="レシピ名" // 入力欄のプレースホルダーを設定する
                    />
                    <input
                        value={editIngredients} // 編集中の材料入力を表示する
                        onChange={e => setEditIngredients(e.target.value)} // 編集中の材料入力を更新する
                        placeholder="材料をカンマ区切りで入力" // 入力欄のプレースホルダーを設定する
                    />
                    <button onClick={onSaveEdit}>保存</button>
                    <button onClick={onCancelEdit}>キャンセル</button>
                </div>
            ) : (
                <div>
                    <strong>{recipe.name}</strong>（{recipe.ingredients.join("、")}）{/* レシピ名と材料を表示する。joinで配列を文字列に変換する。 */}
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
