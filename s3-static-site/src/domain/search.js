export function normalizeSearchInput(input) {
  // スペース区切りで検索語を分解し、小文字に揃えて空文字を除外する
  return input
    .split(" ")
    .map(item => item.trim().toLowerCase())
    .filter(item => item !== "");
}

export function findRecipesByIngredientsOrName(recipes, searchIngredients) {
  // 検索語が空なら、そのまま結果は返さない
  if (searchIngredients.length === 0) {
    return [];
  }

  // 料理名または材料名に、すべての検索語が含まれるレシピだけを残す
  return recipes.filter(recipe => {
    const recipeName = recipe.name.toLowerCase();
    // ingredients は配列なので、検索用に材料名だけを取り出す
    const ingredientNames = recipe.ingredients.map(i => i.name.toLowerCase());

    // 各検索語について、料理名か材料名のどちらかに一致するかを確認する
    return searchIngredients.every(searchTerm => {
      return recipeName.includes(searchTerm) || ingredientNames.some(name => name.includes(searchTerm));
    });
  });
}
