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

type RecipeValidationInput = {
  name: string;
  ingredients: RecipeIngredient[];
  steps: string[];
  url: string;
};

type RecipeValidationMessages = {
  ingredients: string;
  steps: string;
};

// 1行分の材料入力を、保存用の `{ name, amount }` に切り出す。
// ここで「見た目の揺れ」と「保存用データの形」を分けておく。
function splitIngredientLine(line: string): RecipeIngredient {
  const [name = "", ...rest] = line.split(/[:：]/);

  return {
    name: name.trim(),
    amount: rest.join(":").trim(),
  };
}

// 空配列か、名前か分量のどちらかが欠けている材料があると失敗扱いにする。
// `parse` 側は配列化だけ担当して、妥当性チェックはここへ寄せる。
function hasInvalidIngredients(ingredients: RecipeIngredient[]) {
  return ingredients.length === 0 || ingredients.some((item) => !item.name || !item.amount);
}

// 手順は空行を落とした後でも、1件もなければ保存できない。
// 文字列の中身が空のものも同じく不正として弾く。
function hasInvalidSteps(steps: string[]) {
  return steps.length === 0 || steps.some((step) => step === "");
}

// 入力元がフォームでもAPIでも、最終的な検証ルールは同じ。
// 違うのはエラーメッセージだけなので、そこだけ引数で差し替える。
function buildRecipeValidationResult(
  input: RecipeValidationInput,
  messages: RecipeValidationMessages,
): { recipe: ParsedRecipe | null; errors: RecipeFormErrors } {
  const errors: RecipeFormErrors = {};
  const trimmedName = input.name.trim();
  const trimmedUrl = input.url.trim();

  if (!trimmedName) {
    errors.name = "料理名を入力してください。";
  }

  if (hasInvalidIngredients(input.ingredients)) {
    errors.ingredients = messages.ingredients;
  }

  if (hasInvalidSteps(input.steps)) {
    errors.steps = messages.steps;
  }

  if (errors.name || errors.ingredients || errors.steps) {
    return { recipe: null, errors };
  }

  return {
    recipe: {
      name: trimmedName,
      ingredients: input.ingredients,
      steps: input.steps,
      url: trimmedUrl,
    },
    errors,
  };
}

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
    // プレビューでは不正入力を完全には弾かない。
    // 入力途中でも見せるため、材料らしい形にだけ整える。
    .map((line) => {
      const ingredient = splitIngredientLine(line);

      return {
        name: ingredient.name || line,
        amount: ingredient.amount,
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
export function formatIngredientLines(ingredients: RecipeIngredient[]): string {
  return ingredients.map((item) => `${item.name}: ${item.amount}`).join("\n");
}

// 材料入力の1行ごとに、`材料名: 分量` か `材料名：分量` の形へ分解する。
// 画面側ではここを共通化して、登録画面と編集画面のルールを揃える。
export function parseIngredientLines(text: string): RecipeIngredient[] {
  // 空行を落としつつ、各行を材料名と分量の2要素に分ける。
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map(splitIngredientLine);
}

// 手順入力の1行ごとに、行頭の番号を取り除いて手順本文だけにする。
// 入力はゆるく受けて、保存・表示の基準をここで揃える。
export function parseStepLines(text: string): string[] {
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
  const ingredients = parseIngredientLines(ingredientsText);
  const steps = parseStepLines(stepsText);

  return buildRecipeValidationResult(
    { name, ingredients, steps, url: recipeUrl },
    {
      ingredients: "材料を1行ずつ `材料名: 分量` で入力してください。",
      steps: "手順を1行以上入力してください。",
    },
  );
}

function parseRecipeIngredientArray(
  ingredients: unknown,
): RecipeIngredient[] {
  if (!Array.isArray(ingredients)) {
    // API入力が配列でなければ、以降の処理に渡せないので空配列にする。
    return [];
  }

  // APIから来た値を、必要な文字列だけ持つ保存用の形へ整える。
  return ingredients.map((item) => {
    if (!item || typeof item !== "object") {
      return { name: "", amount: "" };
    }

    const ingredient = item as Record<string, unknown>;
    const name =
      typeof ingredient.name === "string" ? ingredient.name.trim() : "";
    const amount =
      typeof ingredient.amount === "string" ? ingredient.amount.trim() : "";

    return { name, amount };
  });
}

function parseRecipeStepArray(steps: unknown): string[] {
  if (!Array.isArray(steps)) {
    // 配列でないなら、ここでは保存用データとして扱えない。
    return [];
  }

  // 手順は文字列として受け取り、余計な空白だけ落とす。
  return steps.map((item) => (typeof item === "string" ? item.trim() : ""));
}

// API から受け取る JSON を、保存前にそのまま受け入れてよい形へ検証する。
// フォーム入力とは違って、ここでは配列として届く材料と手順をチェックする。
export function validateRecipeApiPayload(body: unknown): {
  recipe: ParsedRecipe | null;
  errors: RecipeFormErrors;
} {
  const payload = body && typeof body === "object" ? body : null;
  const record = payload as Record<string, unknown> | null;
  // APIはJSONの構造が崩れる可能性があるので、まず安全な文字列に落とす。
  const name = typeof record?.name === "string" ? record.name : "";
  const ingredients = parseRecipeIngredientArray(record?.ingredients);
  const steps = parseRecipeStepArray(record?.steps);
  const url = typeof record?.url === "string" ? record.url : "";

  return buildRecipeValidationResult(
    { name, ingredients, steps, url },
    {
      ingredients: "材料を入力してください。",
      steps: "手順を入力してください。",
    },
  );
}
