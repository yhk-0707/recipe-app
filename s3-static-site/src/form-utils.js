import { parseFormattedRecipe } from "./domain/parser.js";

export function getRecipeFormElements() {
  return {
    recipeText: document.getElementById("recipeText"),
    recipeUrl: document.getElementById("recipeUrl")
  };
}

export function getRecipeFormValues() {
  const { recipeText, recipeUrl } = getRecipeFormElements();
  return {
    text: recipeText?.value.trim() || "",
    url: recipeUrl?.value.trim() || ""
  };
}

export function resetRecipeForm() {
  const { recipeText, recipeUrl } = getRecipeFormElements();
  if (recipeText) recipeText.value = "";
  if (recipeUrl) recipeUrl.value = "";
}

export function parseRecipeForm() {
  const { text, url } = getRecipeFormValues();

  if (!text) {
    return { error: "レシピのテキストを入力してください。" };
  }

  const recipe = parseFormattedRecipe(text);
  if (!recipe.name) {
    return {
      error: "料理名の形式が正しくありません。\n「料理名」の行の次にタイトルを入力してください。"
    };
  }

  if (url) {
    recipe.url = url;
  }

  return { recipe };
}

export function setupRecipeForm({ onSubmit }) {
  const addButton = document.getElementById("addFormattedButton");
  if (addButton) {
    addButton.addEventListener("click", () => {
      const result = parseRecipeForm();
      if (result.error) {
        alert(result.error);
        return;
      }
      onSubmit(result.recipe);
      resetRecipeForm();
    });
  }

  const clearButton = document.getElementById("clearFormButton");
  if (clearButton) {
    clearButton.addEventListener("click", resetRecipeForm);
  }
}
