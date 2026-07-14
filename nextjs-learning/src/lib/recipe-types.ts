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
