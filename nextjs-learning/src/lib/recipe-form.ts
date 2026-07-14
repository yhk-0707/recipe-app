export type RecipeIngredient = {
  name: string;
  amount: string;
};

export type ParsedRecipe = {
  name: string;
  ingredients: RecipeIngredient[];
  steps: string[];
  url: string;
};

export type RecipeFormErrors = {
  name?: string;
  ingredients?: string;
  steps?: string;
};

// プレビュー用に、入力途中でも見せられる形へ緩く整える。
// 保存判定とは分けて、未入力や途中入力でも表示できるようにする。
export function buildRecipePreview(
  name: string,
  ingredientsText: string,
  stepsText: string,
  recipeUrl: string,
): ParsedRecipe {
  const ingredients = ingredientsText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name = "", ...rest] = line.split(/[:：]/);

      return {
        name: name.trim() || line,
        amount: rest.join(":").trim(),
      };
    });

  return {
    name: name.trim(),
    ingredients,
    steps: parseStepLines(stepsText),
    url: recipeUrl.trim(),
  };
}

// 保存済みの材料配列を、編集用 textarea の1行ずつの表記に戻す。
// 入力ルールは登録画面と揃えて、`材料名: 分量` に統一する。
export function formatIngredientLines(ingredients: RecipeIngredient[]) {
  return ingredients.map((item) => `${item.name}: ${item.amount}`).join("\n");
}

// 材料入力の1行ごとに、`材料名: 分量` か `材料名：分量` の形へ分解する。
// 画面側ではここを共通化して、登録画面と編集画面のルールを揃える。
export function parseIngredientLines(text: string): RecipeIngredient[] | null {
  // 空行を落としつつ、各行を材料名と分量の2要素に分ける。
  const ingredients = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name = "", amount = ""] = line.split(/[:：]/);

      return {
        name: name.trim(),
        amount: amount.trim(),
      };
    });

  // どちらか片方でも空なら、材料としては不正な入力として扱う。
  if (
    ingredients.some((ingredient) => !ingredient.name || !ingredient.amount)
  ) {
    return null;
  }

  return ingredients;
}

// 手順入力の1行ごとに、行頭の番号を取り除いて手順本文だけにする。
// 入力はゆるく受けて、保存・表示の基準をここで揃える。
export function parseStepLines(text: string) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^[0-9０-９]+[.)．、]\s*/, ""));
}

// 表示側の手順番号は半角で揃える。
// 入力はゆるく受けても、画面表示は同じ見た目に統一する。
export function formatStepLabel(index: number) {
  return `${index + 1}.`;
}

// 画面側から受け取った入力を、保存用データと欄ごとのエラーに分ける。
// 返り値を分けておくと、どの欄で失敗したかをフォームに直接出せる。
export function buildRecipePayload(
  name: string,
  ingredientsText: string,
  stepsText: string,
  recipeUrl: string,
): { recipe: ParsedRecipe | null; errors: RecipeFormErrors } {
  const errors: RecipeFormErrors = {};
  const trimmedName = name.trim();
  const ingredients = parseIngredientLines(ingredientsText);
  const steps = parseStepLines(stepsText);

  if (!trimmedName) {
    errors.name = "料理名を入力してください。";
  }

  if (!ingredients || ingredients.length === 0) {
    errors.ingredients = "材料を1行ずつ `材料名: 分量` で入力してください。";
  }

  if (steps.length === 0) {
    errors.steps = "手順を1行以上入力してください。";
  }

  if (errors.name || errors.ingredients || errors.steps) {
    return { recipe: null, errors };
  }

  return {
    recipe: {
      name: trimmedName,
      ingredients,
      steps,
      url: recipeUrl.trim(),
    },
    errors,
  };
}

function parseRecipeIngredientArray(
  ingredients: unknown,
): RecipeIngredient[] | null {
  if (!Array.isArray(ingredients)) {
    return null;
  }

  const parsedIngredients = ingredients.map((item) => {
    if (!item || typeof item !== "object") {
      return null;
    }

    const ingredient = item as Record<string, unknown>;
    const name =
      typeof ingredient.name === "string" ? ingredient.name.trim() : "";
    const amount =
      typeof ingredient.amount === "string" ? ingredient.amount.trim() : "";

    if (!name || !amount) {
      return null;
    }

    return { name, amount };
  });

  if (parsedIngredients.some((item) => item === null)) {
    return null;
  }

  return parsedIngredients;
}

function parseRecipeStepArray(steps: unknown): string[] | null {
  if (!Array.isArray(steps)) {
    return null;
  }

  const parsedSteps = steps.map((item) =>
    typeof item === "string" ? item.trim() : "",
  );

  if (parsedSteps.some((step) => step === "")) {
    return null;
  }

  return parsedSteps;
}

// API から受け取る JSON を、保存前にそのまま受け入れてよい形へ検証する。
// フォーム入力とは違って、ここでは配列として届く材料と手順をチェックする。
export function validateRecipeApiPayload(body: unknown): {
  recipe: ParsedRecipe | null;
  errors: RecipeFormErrors;
} {
  const errors: RecipeFormErrors = {};
  const payload = body && typeof body === "object" ? body : null;
  const record = payload as Record<string, unknown> | null;
  const trimmedName =
    typeof record?.name === "string" ? record.name.trim() : "";
  const ingredients = parseRecipeIngredientArray(record?.ingredients);
  const steps = parseRecipeStepArray(record?.steps);
  const url = typeof record?.url === "string" ? record.url.trim() : "";

  if (!trimmedName) {
    errors.name = "料理名を入力してください。";
  }

  if (!ingredients || ingredients.length === 0) {
    errors.ingredients = "材料を入力してください。";
  }

  if (!steps || steps.length === 0) {
    errors.steps = "手順を入力してください。";
  }

  if (errors.name || errors.ingredients || errors.steps) {
    return { recipe: null, errors };
  }

  return {
    recipe: {
      name: trimmedName,
      ingredients,
      steps,
      url,
    },
    errors,
  };
}
