"use client";

import type { FormEvent } from "react";
import { useState } from "react";

import {
  Button,
  Card,
  ErrorText,
  Field,
  LinkButton,
  MutedText,
  PageShell,
  PageTitle,
  SectionTitle,
  TextArea,
  TextInput,
} from "@/components/ui";
import {
  buildRecipePayload,
  buildRecipePreview,
  formatStepLabel,
  type RecipeFormErrors,
} from "@/lib/recipe-form";

export default function RegisterPage() {
  const [recipeName, setRecipeName] = useState("");
  const [ingredientsText, setIngredientsText] = useState("");
  const [stepsText, setStepsText] = useState("");
  const [recipeUrl, setRecipeUrl] = useState("");
  const [errors, setErrors] = useState<RecipeFormErrors>({});
  const previewStepKeyCounts = new Map<string, number>();
  const previewRecipe = buildRecipePreview(
    recipeName,
    ingredientsText,
    stepsText,
    recipeUrl,
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const { recipe, errors: nextErrors } = buildRecipePayload(
      recipeName,
      ingredientsText,
      stepsText,
      recipeUrl,
    );

    if (!recipe) {
      setErrors(nextErrors);
      return;
    }

    const response = await fetch("/api/recipes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recipe),
    });

    if (!response.ok) {
      const result = (await response.json()) as { message?: string };
      alert(result.message ?? "レシピを追加できませんでした。");
      return;
    }

    alert("レシピを追加しました");
    setErrors({});
    setRecipeName("");
    setIngredientsText("");
    setStepsText("");
    setRecipeUrl("");
  }

  function handleClear() {
    setErrors({});
    setRecipeName("");
    setIngredientsText("");
    setStepsText("");
    setRecipeUrl("");
  }

  return (
    <PageShell>
      {/* 旧React版の register.html / register.js に相当する登録ページ */}
      <Card className="space-y-4">
        <PageTitle>レシピ登録</PageTitle>
        <MutedText>料理名・材料・手順・参考URLを登録する画面です。</MutedText>

        <div className="flex flex-wrap gap-2">
          {/* 旧React版の recipes.html へ戻るリンクに相当する */}
          <LinkButton href="/recipes" variant="secondary">
            登録済み一覧へ
          </LinkButton>
          {/* 旧React版の index.html に戻る導線に相当する */}
          <LinkButton href="/" variant="secondary">
            トップへ戻る
          </LinkButton>
        </div>
      </Card>

      <Card className="space-y-4">
        <SectionTitle>登録プレビュー</SectionTitle>
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted">料理名</p>
            <p className="text-foreground">{previewRecipe.name || "未入力"}</p>
          </div>

          <section className="space-y-2">
            <p className="text-sm text-muted">材料</p>
            {previewRecipe.ingredients.length > 0 ? (
              <ul className="list-none space-y-1 p-0">
                {previewRecipe.ingredients.map((ingredient) => (
                  <li key={`${ingredient.name}-${ingredient.amount}`}>
                    {ingredient.amount
                      ? `${ingredient.name}: ${ingredient.amount}`
                      : ingredient.name}
                  </li>
                ))}
              </ul>
            ) : (
              <MutedText>まだ材料がありません。</MutedText>
            )}
          </section>

          <section className="space-y-2">
            <p className="text-sm text-muted">手順</p>
            {previewRecipe.steps.length > 0 ? (
              <ol className="list-none space-y-1 p-0">
                {previewRecipe.steps.map((step, index) => {
                  const occurrence = (previewStepKeyCounts.get(step) ?? 0) + 1;
                  previewStepKeyCounts.set(step, occurrence);

                  return (
                    <li key={`${step}-${occurrence}`}>
                      {formatStepLabel(index)} {step}
                    </li>
                  );
                })}
              </ol>
            ) : (
              <MutedText>まだ手順がありません。</MutedText>
            )}
          </section>

          <div className="space-y-2">
            <p className="text-sm text-muted">参考URL</p>
            {previewRecipe.url ? (
              <a
                href={previewRecipe.url}
                target="_blank"
                rel="noreferrer"
                className="break-all text-foreground hover:text-accent"
              >
                {previewRecipe.url}
              </a>
            ) : (
              <MutedText>未入力</MutedText>
            )}
          </div>
        </div>
      </Card>

      {/* 旧React版の register.js のフォーム領域に相当する */}
      <Card>
        <form noValidate onSubmit={handleSubmit} className="space-y-4">
          <Field
            htmlFor="recipeName"
            label="料理名"
            hint="料理の名前を1行で入力してください。"
          >
            <TextInput
              id="recipeName"
              aria-invalid={Boolean(errors.name)}
              value={recipeName}
              onChange={(event) => {
                setRecipeName(event.target.value);
                if (errors.name) {
                  setErrors((current) => ({ ...current, name: undefined }));
                }
              }}
              placeholder="カレー"
            />
            {errors.name ? <ErrorText>{errors.name}</ErrorText> : null}
          </Field>

          <Field
            htmlFor="ingredientsText"
            label="材料"
            hint="1行につき1件。`材料名: 分量` か `材料名：分量` の形で入力してください。"
          >
            <TextArea
              id="ingredientsText"
              aria-invalid={Boolean(errors.ingredients)}
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
              rows={8}
              placeholder={`玉ねぎ: 1個
にんじん：1本
豚肉: 200g`}
            />
            {errors.ingredients ? (
              <ErrorText>{errors.ingredients}</ErrorText>
            ) : null}
          </Field>

          <Field
            htmlFor="stepsText"
            label="手順"
            hint="1行につき1手順。番号は任意で、`1.` / `１.` / `1)` / `１)` のように区切り記号つきで入力できます。"
          >
            <TextArea
              id="stepsText"
              aria-invalid={Boolean(errors.steps)}
              value={stepsText}
              onChange={(event) => {
                setStepsText(event.target.value);
                if (errors.steps) {
                  setErrors((current) => ({ ...current, steps: undefined }));
                }
              }}
              rows={8}
              placeholder={`1. 切る
2) 炒める
3．煮込む`}
            />
            {errors.steps ? <ErrorText>{errors.steps}</ErrorText> : null}
          </Field>

          <Field
            htmlFor="recipeUrl"
            label="参考URL"
            hint="空欄で問題ありません。必要なときだけ入力してください。"
          >
            <TextInput
              id="recipeUrl"
              type="url"
              value={recipeUrl}
              onChange={(event) => setRecipeUrl(event.target.value)}
              placeholder="https://example.com"
            />
          </Field>

          <div className="flex flex-wrap gap-2">
            <Button type="submit">登録する</Button>
            <Button type="button" variant="secondary" onClick={handleClear}>
              クリア
            </Button>
          </div>
        </form>
      </Card>
    </PageShell>
  );
}
