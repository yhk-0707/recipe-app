import { initializeRecipes, addRecipe } from "./data/recipes.js";
import { setupRecipeForm } from "./form-utils.js";

function handleRecipeFormSubmit(recipe) {
  addRecipe(recipe);
  alert("レシピを追加しました");
}

function setupEventHandlers() {
  setupRecipeForm({ onSubmit: handleRecipeFormSubmit });
}

function initializeRegisterPage() {
  initializeRecipes();
  setupEventHandlers();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeRegisterPage);
} else {
  initializeRegisterPage();
}
