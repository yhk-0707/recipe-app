const STORAGE_KEY = "recipes";

export function saveRecipes(recipes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
}

export function loadRecipes() {
  const savedRecipes = localStorage.getItem(STORAGE_KEY);
  if (!savedRecipes) {
    return null;
  }

  try {
    return JSON.parse(savedRecipes);
  } catch (error) {
    console.warn("localStorage の recipes データが壊れています。初期状態に戻します。", error);
    return null;
  }
}
