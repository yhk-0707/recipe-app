export function normalizeSearchInput(input) {
  return input
    .split(" ")
    .map(item => item.trim().toLowerCase())
    .filter(item => item !== "");
}

export function findRecipesByIngredientsOrName(recipes, searchIngredients) {
  if (searchIngredients.length === 0) {
    return [];
  }

  return recipes.filter(recipe => {
    const recipeName = recipe.name.toLowerCase();
    const ingredientNames = recipe.ingredients.map(i => i.name.toLowerCase());

    return searchIngredients.every(searchTerm => {
      return recipeName.includes(searchTerm) || ingredientNames.some(name => name.includes(searchTerm));
    });
  });
}
