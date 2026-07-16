export type RecipeIngredient = {
  name: string;
  amount: string;
};

export type RecipeRecord = {
  id: number;
  name: string;
  ingredients: RecipeIngredient[];
  steps: string[];
  url: string;
};

export type ApiMessageResponse = {
  message: string;
};

type RecipeSource = {
  id: number;
  name: string;
  ingredients: unknown;
  steps: string[];
  url: string | null;
};

// Prisma の生データを、クライアントと API で共通に扱う保存用形へ寄せる。
export function toRecipeRecord(recipe: RecipeSource): RecipeRecord {
  return {
    id: recipe.id,
    name: recipe.name,
    ingredients: recipe.ingredients as RecipeIngredient[],
    steps: recipe.steps,
    url: recipe.url ?? "",
  };
}
