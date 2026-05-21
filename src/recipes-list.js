import { initializeRecipes, getRecipes } from "./data/recipes.js";
import { displayRecipeList } from "./ui/ui.js";

function initializeRecipesPage() {
  initializeRecipes();
  displayRecipeList(getRecipes());
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeRecipesPage);
} else {
  initializeRecipesPage();
}
