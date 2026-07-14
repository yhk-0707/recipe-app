import type { Recipe } from "@prisma/client";

export function normalizeSearchInput(input: string): string[] {
  // 旧React版の src/domain/search.js の normalizeSearchInput() に相当する
  // スペース区切りで検索語を分解し、小文字に揃えて空文字を除外する
  return input
    .split(" ")
    .map((item) => item.trim().toLowerCase())
    .filter((item) => item !== "");
}

export function findRecipesByIngredientsOrName(
  recipes: Recipe[],
  searchTerms: string[],
): Recipe[] {
  // 旧React版の src/domain/search.js の findRecipesByIngredientsOrName() に相当する
  // 検索語が空なら、旧実装と同じく結果は返さない
  if (searchTerms.length === 0) {
    return recipes;
  }

  // 料理名または材料名に、すべての検索語が含まれるレシピだけを残す
  return recipes.filter((recipe) => {
    const recipeName = recipe.name.toLowerCase();
    // ingredients は Json なので、検索用に配列として扱える形へ寄せる
    const ingredients = recipe.ingredients as {
      name: string;
      amount: string;
    }[];
    const ingredientNames = ingredients.map((i) => i.name.toLowerCase());

    // 各検索語について、料理名か材料名のどちらかに一致するかを確認する
    return searchTerms.every(
      (term) =>
        recipeName.includes(term) ||
        ingredientNames.some((name) => name.includes(term)),
    );
  });
}
