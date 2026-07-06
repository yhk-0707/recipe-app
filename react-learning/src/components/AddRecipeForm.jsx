function AddRecipeForm({
    newName,
    setNewName,
    newIngredients,
    setNewIngredients,
    onAdd
}) {
    // レシピ追加フォームのコンポーネント化
    return (
        <div>
            <input // 新しいレシピ名の入力欄
                value={newName} // 入力欄の値をnewNameにバインドする
                onChange={e => setNewName(e.target.value)} // 入力欄の値が変更されたときにnewNameを更新する
                placeholder="新しいレシピ名" // 入力欄のプレースホルダーを設定する
            />
            <input // 新しいレシピの材料入力欄
                value={newIngredients} // 入力欄の値をnewIngredientsにバインドする
                onChange={e => setNewIngredients(e.target.value)} // 入力欄の値が変更されたときにnewIngredientsを更新する
                placeholder="材料をカンマ区切りで入力" // 入力欄のプレースホルダーを設定する
            />
            <button
                onClick={onAdd} // クリックされたときにaddRecipe関数を実行する
                disabled={newName.trim() === ""} // レシピ名が空の場合はボタンを無効化する
            >
                追加 {/* ボタンのラベル */}
            </button>
        </div>
    );
}

export default AddRecipeForm;
