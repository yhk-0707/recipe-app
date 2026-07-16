import { initializeRecipes, getRecipes, addRecipe } from "./data/recipes.js";
import { normalizeSearchInput, findRecipesByIngredientsOrName } from "./domain/search.js";
import { displaySearchResults, clearSearchResults } from "./ui/ui.js";
import { setupRecipeForm } from "./form-utils.js";

let currentSearchIngredients = [];

function handleRecipeFormSubmit(recipe) {
  addRecipe(recipe);
  clearSearchResults();
  currentSearchIngredients = [];
  alert("レシピを追加しました");
}

function searchRecipe() {
  const input = document.getElementById("ingredientInput").value;
  currentSearchIngredients = normalizeSearchInput(input);

  if (currentSearchIngredients.length === 0) {
    clearSearchResults();
    return;
  }

  const recipes = getRecipes();
  const results = findRecipesByIngredientsOrName(recipes, currentSearchIngredients);
  displaySearchResults(results, currentSearchIngredients);
}

function setupEventHandlers() {
  setupRecipeForm({ onSubmit: handleRecipeFormSubmit });
  const searchButton = document.getElementById("searchButton");
  if (searchButton) {
    searchButton.addEventListener("click", searchRecipe);
  }
  const ingredientInput = document.getElementById("ingredientInput");
  if (ingredientInput) {
    ingredientInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        searchRecipe();
      }
    });
  }

  const clearFormButton = document.getElementById("clearFormButton");
  if (clearFormButton) {
    clearFormButton.addEventListener("click", () => {
      const t = document.getElementById("recipeText");
      const u = document.getElementById("recipeUrl");
      if (t) t.value = "";
      if (u) u.value = "";
    });
  }
}

function initializeApp() {
  initializeRecipes();
  setupEventHandlers();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp);
} else {
  initializeApp();
}
