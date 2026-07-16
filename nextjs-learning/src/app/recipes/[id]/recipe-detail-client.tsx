"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { RecipePreviewPanel } from "@/components/recipe-preview-panel";
import {
  Button,
  Card,
  ErrorText,
  Field,
  SectionTitle,
  TextArea,
  TextInput,
} from "@/components/ui";
import {
  buildRecipePayload,
  formatIngredientLines,
  formatStepLabel,
  type RecipeFormErrors,
} from "@/lib/recipe-form";
import type { ApiMessageResponse, RecipeRecord } from "@/lib/recipe-types";

// 削除後に一覧へ戻ったとき、Undo 用データを受け渡す保存先。
const DELETED_RECIPE_KEY = "deleted-recipe";

async function readResponseMessage(response: Response, fallback: string) {
  try {
    const result = (await response.json()) as ApiMessageResponse;
    return result.message ?? fallback;
  } catch {
    return fallback;
  }
}

export function RecipeDetailClient({ recipe }: { recipe: RecipeRecord }) {
  const router = useRouter();
  // 編集モードの有無。
  const [isEditing, setIsEditing] = useState(false);
  // フォーム入力値は state に持つ。
  const [name, setName] = useState(recipe.name);
  const [ingredientsText, setIngredientsText] = useState(
    formatIngredientLines(recipe.ingredients),
  );
  const [stepsText, setStepsText] = useState(recipe.steps.join("\n"));
  const [url, setUrl] = useState(recipe.url);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [errors, setErrors] = useState<RecipeFormErrors>({});
  const stepKeyCounts = new Map<string, number>();

  async function handleSave() {
    const { recipe: nextRecipe, errors: nextErrors } = buildRecipePayload(
      name,
      ingredientsText,
      stepsText,
      url,
    );

    if (!nextRecipe) {
      setErrors(nextErrors);
      return;
    }

    try {
      // 編集後の内容を API に送る。
      const response = await fetch(`/api/recipes/${recipe.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nextRecipe),
      });

      if (!response.ok) {
        alert(
          await readResponseMessage(
            response,
            "レシピを更新できませんでした。",
          ),
        );
        return;
      }

      const updatedRecipe = (await response.json()) as RecipeRecord;
      setName(updatedRecipe.name);
      setIngredientsText(formatIngredientLines(updatedRecipe.ingredients));
      setStepsText(updatedRecipe.steps.join("\n"));
      setUrl(updatedRecipe.url);
      setErrors({});
      setIsEditing(false);
      alert("レシピを更新しました");
    } catch {
      alert("通信に失敗しました。");
    }
  }

  function handleCancel() {
    // キャンセル時は元の recipe 情報に戻す。
    setName(recipe.name);
    setIngredientsText(formatIngredientLines(recipe.ingredients));
    setStepsText(recipe.steps.join("\n"));
    setUrl(recipe.url);
    setErrors({});
    setIsEditing(false);
  }

  async function handleDelete() {
    // 本当に削除するか最終確認する。
    const confirmed = window.confirm("このレシピを削除する？");
    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`/api/recipes/${recipe.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        alert(
          await readResponseMessage(
            response,
            "レシピを削除できませんでした。",
          ),
        );
        return;
      }

      // Undo 用に sessionStorage へ保存して一覧へ戻る。
      const deletedRecipe = (await response.json()) as RecipeRecord;
      window.sessionStorage.setItem(
        DELETED_RECIPE_KEY,
        JSON.stringify(deletedRecipe),
      );
      router.push("/recipes");
    } catch {
      alert("通信に失敗しました。");
    }
  }

  return (
    <Card className="space-y-5">
      {isEditing ? (
        <div className="space-y-4">
          {/* 編集時はフォームをそのまま表示する。 */}
          <div className="space-y-1">
            <SectionTitle>編集プレビュー</SectionTitle>
          </div>

          <RecipePreviewPanel
            previewId="edit-recipe-preview-panel"
            title="編集プレビュー"
            isOpen={isPreviewOpen}
            onToggle={() => setIsPreviewOpen((current) => !current)}
            name={name}
            ingredientsText={ingredientsText}
            stepsText={stepsText}
            recipeUrl={url}
          />

          <Field htmlFor="editName" label="料理名">
            <TextInput
              id="editName"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                if (errors.name) {
                  setErrors((current) => ({ ...current, name: undefined }));
                }
              }}
            />
            {errors.name ? <ErrorText>{errors.name}</ErrorText> : null}
          </Field>

          <Field htmlFor="editIngredients" label="材料">
            <TextArea
              id="editIngredients"
              value={ingredientsText}
              onChange={(event) => {
                setIngredientsText(event.target.value);
                if (errors.ingredients) {
                  setErrors((current) => ({
                    ...current,
                    ingredients: undefined,
                  }));
                }
              }}
              rows={6}
            />
            {errors.ingredients ? (
              <ErrorText>{errors.ingredients}</ErrorText>
            ) : null}
          </Field>

          <Field htmlFor="editSteps" label="手順">
            <TextArea
              id="editSteps"
              value={stepsText}
              onChange={(event) => {
                setStepsText(event.target.value);
                if (errors.steps) {
                  setErrors((current) => ({ ...current, steps: undefined }));
                }
              }}
              rows={6}
            />
            {errors.steps ? <ErrorText>{errors.steps}</ErrorText> : null}
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
                  {ingredient.name}: {ingredient.amount}
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-3">
            {/* 手順も配列で順番に表示する。 */}
            <SectionTitle>手順</SectionTitle>
            <ol className="list-none space-y-2 p-0">
              {recipe.steps.map((step, index) => {
                // index を key に使うと並び替えや差し替え時に state がずれるので、
                // 手順文と出現回数で安定した key を作る。
                const occurrence = (stepKeyCounts.get(step) ?? 0) + 1;
                stepKeyCounts.set(step, occurrence);

                return (
                  <li key={`${step}-${occurrence}`}>
                    {formatStepLabel(index)} {step}
                  </li>
                );
              })}
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
