export function parseFormattedRecipe(text) {
  const lines = text.split("\n");
  let recipeName = "";
  let ingredients = [];
  let steps = [];
  let recipeUrl = "";
  let mode = "";

  lines.forEach(line => {
    const trimmed = line.trim();

    if (trimmed.startsWith("料理名")) {
      mode = "title";
      return;
    }

    if (mode === "title" && trimmed !== "") {
      recipeName = trimmed;
      mode = "";
      return;
    }

    if (trimmed.startsWith("材料")) {
      mode = "ingredients";
      return;
    }

    if (trimmed.startsWith("手順")) {
      mode = "steps";
      return;
    }

    if (trimmed.startsWith("参考URL")) {
      const value = trimmed.replace(/.*参考URL[:：]?\s*/, "").trim();
      if (value) {
        recipeUrl = value;
      } else {
        mode = "url";
      }
      return;
    }

    if (mode === "url" && trimmed !== "") {
      recipeUrl = trimmed;
      mode = "";
      return;
    }

    if (mode === "ingredients" && trimmed.startsWith("-")) {
      const item = trimmed.replace(/^-/, "").trim();
      const parts = item.split("|");
      ingredients.push({
        name: parts[0]?.trim() || "",
        amount: parts[1]?.trim() || ""
      });
      return;
    }

    if (mode === "steps" && trimmed !== "") {
      steps.push(trimmed.replace(/^\d+\./, "").trim());
    }
  });

  return {
    name: recipeName,
    ingredients,
    steps,
    url: recipeUrl
  };
}
