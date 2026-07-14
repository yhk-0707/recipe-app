"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  Button,
  Card,
  Field,
  SectionTitle,
  TextArea,
  TextInput,
} from "@/components/ui";

type Recipe = {
  id: number;
  name: string;
  ingredients: { name: string; amount: string }[];
  steps: string[];
  url: string;
};

type DeletedRecipe = {
  id: number;
  name: string;
  ingredients: { name: string; amount: string }[];
  steps: string[];
  url: string;
};

// 削除後に一覧へ戻ったとき、Undo 用データを受け渡す保存先。
const DELETED_RECIPE_KEY = "deleted-recipe";

// 材料の配列を textarea に戻す。
// 編集画面では「1行1材料」に直して入力させる。
function formatIngredientsTextarea(ingredients: Recipe["ingredients"]) {
  return ingredients.map((item) => `${item.name}|${item.amount}`).join("\n");
}

// textarea の各行を材料配列に戻す。
// `name|amount` の簡易フォーマットで保存している。
function parseIngredientsTextarea(text: string) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "")
    .map((line) => {
      const [name, amount] = line.split("|").map((part) => part.trim());
      return {
        name: name || "",
        amount: amount || "",
      };
    });
}

// 手順も textarea では1行1手順で扱う。
function parseStepsTextarea(text: string) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "")
    .map((line) => line.replace(/^[0-9０-９]+[.)．、]\s*/, ""));
}

export function RecipeDetailClient({ recipe }: { recipe: Recipe }) {
  const router = useRouter();
  // 編集モードの有無。
  const [isEditing, setIsEditing] = useState(false);
  // フォーム入力値は state に持つ。
  const [name, setName] = useState(recipe.name);
  const [ingredientsText, setIngredientsText] = useState(
    formatIngredientsTextarea(recipe.ingredients),
  );
  const [stepsText, setStepsText] = useState(recipe.steps.join("\n"));
  const [url, setUrl] = useState(recipe.url);

  async function handleSave() {
    // 名前だけは空欄を許さない。
    if (!name.trim()) {
      alert("料理名を入力してください。");
      return;
    }

    // 編集後の内容を API に送る。
    const response = await fetch(`/api/recipes/${recipe.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name.trim(),
        ingredients: parseIngredientsTextarea(ingredientsText),
        steps: parseStepsTextarea(stepsText),
        url: url.trim(),
      }),
    });

    if (!response.ok) {
      const result = (await response.json()) as { message?: string };
      alert(result.message ?? "レシピを更新できませんでした。");
      return;
    }

    const updatedRecipe = (await response.json()) as Recipe;
    setName(updatedRecipe.name);
    setIngredientsText(formatIngredientsTextarea(updatedRecipe.ingredients));
    setStepsText(updatedRecipe.steps.join("\n"));
    setUrl(updatedRecipe.url);
    setIsEditing(false);
    alert("レシピを更新しました");
  }

  function handleCancel() {
    // キャンセル時は元の recipe 情報に戻す。
    setName(recipe.name);
    setIngredientsText(formatIngredientsTextarea(recipe.ingredients));
    setStepsText(recipe.steps.join("\n"));
    setUrl(recipe.url);
    setIsEditing(false);
  }

  async function handleDelete() {
    // 本当に削除するか最終確認する。
    const confirmed = window.confirm("このレシピを削除する？");
    if (!confirmed) {
      return;
    }

    const response = await fetch(`/api/recipes/${recipe.id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const result = (await response.json()) as { message?: string };
      alert(result.message ?? "レシピを削除できませんでした。");
      return;
    }

    // Undo 用に sessionStorage へ保存して一覧へ戻る。
    const deletedRecipe = (await response.json()) as DeletedRecipe;
    window.sessionStorage.setItem(
      DELETED_RECIPE_KEY,
      JSON.stringify(deletedRecipe),
    );
    router.push("/recipes");
  }

  return (
    <Card className="space-y-5">
      {isEditing ? (
        <div className="space-y-4">
          {/* 編集時はフォームをそのまま表示する。 */}
          <SectionTitle>編集する</SectionTitle>

          <Field htmlFor="editName" label="料理名">
            <TextInput
              id="editName"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </Field>

          <Field htmlFor="editIngredients" label="材料">
            <TextArea
              id="editIngredients"
              value={ingredientsText}
              onChange={(event) => setIngredientsText(event.target.value)}
              rows={6}
            />
          </Field>

          <Field htmlFor="editSteps" label="手順">
            <TextArea
              id="editSteps"
              value={stepsText}
              onChange={(event) => setStepsText(event.target.value)}
              rows={6}
            />
          </Field>

          <Field htmlFor="editUrl" label="参考URL">
            <TextInput
              id="editUrl"
              type="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
            />
          </Field>

          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={handleSave}>
              保存
            </Button>
            <Button type="button" variant="secondary" onClick={handleCancel}>
              キャンセル
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {/* 通常時は閲覧モード。 */}
          <div className="space-y-3">
            <SectionTitle>{name}</SectionTitle>
            {url ? (
              <div className="space-y-1">
                <p className="text-sm text-muted">参考URL</p>
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="break-all text-foreground hover:text-accent"
                >
                  {url}
                </a>
              </div>
            ) : null}
          </div>

          <section className="space-y-3">
            {/* 材料は配列をそのまま表示する。 */}
            <SectionTitle>材料</SectionTitle>
            <ul className="list-none space-y-2 p-0">
              {recipe.ingredients.map((ingredient) => (
                <li key={`${ingredient.name}-${ingredient.amount}`}>
                  {ingredient.name} {ingredient.amount}
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-3">
            {/* 手順も配列で順番に表示する。 */}
            <SectionTitle>手順</SectionTitle>
            <ol className="list-none space-y-2 p-0">
              {recipe.steps.map((step, index) => (
                <li key={`${index}-${step}`}>
                  {index + 1}. {step}
                </li>
              ))}
            </ol>
          </section>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsEditing(true)}
            >
              編集する
            </Button>
            <Button type="button" onClick={handleDelete}>
              削除する
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
