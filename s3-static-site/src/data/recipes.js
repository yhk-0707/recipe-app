import { loadRecipes, saveRecipes } from "./storage.js";

const defaultRecipes = [
  {
    id: 1,
    name: "オムライス",
    ingredients: [
      { name: "卵", amount: "2個" },
      { name: "ご飯", amount: "1杯" },
      { name: "ケチャップ", amount: "大さじ2" }
    ],
    steps: ["卵を溶く", "ご飯を炒める", "包む"]
  },
  {
    id: 2,
    name: "親子丼",
    ingredients: [
      { name: "鶏肉", amount: "150g" },
      { name: "卵", amount: "2個" },
      { name: "玉ねぎ", amount: "1/2個" }
    ],
    steps: ["鶏肉を切る", "玉ねぎを煮る", "卵でとじる"]
  }
];

let recipes = [];

function normalizeIngredients(ingredients) {
  if (!Array.isArray(ingredients)) {
    return [];
  }

  return ingredients.map(item => {
    if (typeof item === "string") {
      const parts = item.split("|").map(value => value.trim());
      return {
        name: parts[0] || "",
        amount: parts[1] || ""
      };
    }

    return {
      name: item?.name ? String(item.name) : "",
      amount: item?.amount ? String(item.amount) : ""
    };
  });
}

function normalizeSteps(steps) {
  if (Array.isArray(steps)) {
    return steps
      .map(step => String(step).trim())
      .filter(step => step !== "");
  }

  if (typeof steps === "string") {
    return steps
      .split("\n")
      .map(step => step.trim())
      .filter(step => step !== "");
  }

  return [];
}

function normalizeRecipe(recipe) {
  return {
    id: typeof recipe.id === "number" ? recipe.id : Number(recipe.id) || Date.now(),
    name: recipe.name ? String(recipe.name) : "",
    ingredients: normalizeIngredients(recipe.ingredients),
    steps: normalizeSteps(recipe.steps),
    url: recipe.url ? String(recipe.url) : ""
  };
}

function normalizeRecipes(savedRecipes) {
  if (!Array.isArray(savedRecipes)) {
    return [];
  }

  return savedRecipes.map(normalizeRecipe);
}

export function initializeRecipes() {
  const loadedRecipes = loadRecipes();
  recipes = normalizeRecipes(loadedRecipes || defaultRecipes);
}

export function getRecipes() {
  return recipes;
}

export function getRecipeById(id) {
  return recipes.find(recipe => recipe.id === id) || null;
}

export function addRecipe(recipe) {
  const id = recipe?.id ? recipe.id : Date.now();
  const normalizedRecipe = normalizeRecipe({ ...recipe, id });
  recipes.push(normalizedRecipe);
  saveRecipes(recipes);
}

export function updateRecipe(id, recipe) {
  const existing = getRecipeById(id);
  if (!existing) {
    return null;
  }

  const normalizedRecipe = normalizeRecipe({ ...existing, ...recipe, id });
  recipes = recipes.map(item => (item.id === id ? normalizedRecipe : item));
  saveRecipes(recipes);
  return normalizedRecipe;
}

export function deleteRecipe(id) {
  recipes = recipes.filter(recipe => recipe.id !== id);
  saveRecipes(recipes);
}
