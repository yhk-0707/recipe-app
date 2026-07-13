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

function parseFormattedRecipe(text: string): ParsedRecipe {
  const lines = text.split("\n");
  let recipeName = "";
  const ingredients: { name: string; amount: string }[] = [];
  const steps: string[] = [];
  let recipeUrl = "";
  let mode = "";

  lines.forEach((line) => {
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
        amount: parts[1]?.trim() || "",
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
    url: recipeUrl,
  };
}

export default function RegisterPage() {
  const [recipeText, setRecipeText] = useState("");
  const [recipeUrl, setRecipeUrl] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedRecipe = parseFormattedRecipe(recipeText);

    if (!parsedRecipe.name) {
      alert(
        "料理名の形式が正しくありません。\n「料理名」の行の次にタイトルを入力してください。",
      );
      return;
    }

    if (recipeUrl.trim()) {
      parsedRecipe.url = recipeUrl.trim();
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
    setRecipeText("");
    setRecipeUrl("");
  }

  function handleClear() {
    setRecipeText("");
    setRecipeUrl("");
  }

  return (
    <PageShell>
      {/* 旧React版の register.html / register.js に相当する登録ページ */}
      <Card className="space-y-4">
        <PageTitle>レシピ登録</PageTitle>
        <MutedText>整形済みレシピを貼り付けて登録する画面です。</MutedText>

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
          {/* 旧React版の recipeText に相当する入力欄 */}
          <Field
            htmlFor="recipeText"
            label="レシピ本文"
            hint="料理名 / 材料 / 手順 / 参考URL の順で貼り付けてください。"
          >
            <TextArea
              id="recipeText"
              value={recipeText}
              onChange={(event) => setRecipeText(event.target.value)}
              rows={12}
              placeholder={`料理名
カレー

材料
- 玉ねぎ | 1個
- にんじん | 1本

手順
1. 切る
2. 炒める

参考URL
https://example.com`}
            />
          </Field>

          {/* 旧React版の recipeUrl に相当する入力欄 */}
          <Field
            htmlFor="recipeUrl"
            label="参考URL"
            hint="本文のURLを上書きしたいときだけ入力。"
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
            {/* 旧React版の addFormattedButton に相当する登録ボタン */}
            <Button type="submit">登録する</Button>
            {/* 旧React版の clearFormButton に相当するクリアボタン */}
            <Button type="button" variant="secondary" onClick={handleClear}>
              クリア
            </Button>
          </div>
        </form>
      </Card>
    </PageShell>
  );
}
