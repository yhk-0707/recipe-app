"use client";

import type { FormEvent } from "react";
import { useState } from "react";

import {
  Button,
  Card,
  Field,
  LinkButton,
  MutedText,
  PageShell,
  PageTitle,
  TextArea,
  TextInput,
} from "@/components/ui";

type ParsedRecipe = {
  name: string;
  ingredients: { name: string; amount: string }[];
  steps: string[];
  url: string;
};

function parseIngredientLines(text: string) {
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

  if (
    ingredients.some((ingredient) => !ingredient.name || !ingredient.amount)
  ) {
    return null;
  }

  return ingredients;
}

function parseStepLines(text: string) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^[0-9０-９]+[.)．、]\s*/, ""));
}

function buildRecipePayload(
  name: string,
  ingredientsText: string,
  stepsText: string,
  recipeUrl: string,
): ParsedRecipe | null {
  const trimmedName = name.trim();
  const ingredients = parseIngredientLines(ingredientsText);
  const steps = parseStepLines(stepsText);

  if (
    !trimmedName ||
    !ingredients ||
    ingredients.length === 0 ||
    steps.length === 0
  ) {
    return null;
  }

  return {
    name: trimmedName,
    ingredients,
    steps,
    url: recipeUrl.trim(),
  };
}

export default function RegisterPage() {
  const [recipeName, setRecipeName] = useState("");
  const [ingredientsText, setIngredientsText] = useState("");
  const [stepsText, setStepsText] = useState("");
  const [recipeUrl, setRecipeUrl] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedRecipe = buildRecipePayload(
      recipeName,
      ingredientsText,
      stepsText,
      recipeUrl,
    );

    if (!parsedRecipe) {
      alert("料理名、材料、手順はすべて入力してください。");
      return;
    }

    const response = await fetch("/api/recipes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsedRecipe),
    });

    if (!response.ok) {
      const result = (await response.json()) as { message?: string };
      alert(result.message ?? "レシピを追加できませんでした。");
      return;
    }

    alert("レシピを追加しました");
    setRecipeName("");
    setIngredientsText("");
    setStepsText("");
    setRecipeUrl("");
  }

  function handleClear() {
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

      {/* 旧React版の register.js のフォーム領域に相当する */}
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field
            htmlFor="recipeName"
            label="料理名"
            hint="料理の名前を1行で入力してください。"
          >
            <TextInput
              id="recipeName"
              value={recipeName}
              onChange={(event) => setRecipeName(event.target.value)}
              placeholder="カレー"
              required
            />
          </Field>

          <Field
            htmlFor="ingredientsText"
            label="材料"
            hint="1行につき1件。`材料名: 分量` か `材料名：分量` の形で入力してください。"
          >
            <TextArea
              id="ingredientsText"
              value={ingredientsText}
              onChange={(event) => setIngredientsText(event.target.value)}
              rows={8}
              placeholder={`玉ねぎ: 1個
にんじん：1本
豚肉: 200g`}
              required
            />
          </Field>

          <Field
            htmlFor="stepsText"
            label="手順"
            hint="1行につき1手順。番号は任意で、`1.` / `１.` / `1)` / `１)` のように区切り記号つきで入力できます。"
          >
            <TextArea
              id="stepsText"
              value={stepsText}
              onChange={(event) => setStepsText(event.target.value)}
              rows={8}
              placeholder={`1. 切る
2) 炒める
3．煮込む`}
              required
            />
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
