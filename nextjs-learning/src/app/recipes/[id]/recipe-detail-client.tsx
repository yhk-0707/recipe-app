"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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

// 削除後に一覧画面へ戻ったとき、Undo 用データを受け渡すための保存先
const DELETED_RECIPE_KEY = "deleted-recipe";

// 旧React版の formatIngredientsTextarea() に相当する
function formatIngredientsTextarea(ingredients: Recipe["ingredients"]) {
  return ingredients.map((item) => `${item.name}|${item.amount}`).join("\n");
}

// 旧React版の parseIngredientsTextarea() に相当する
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

// 旧React版の parseStepsTextarea() に相当する
function parseStepsTextarea(text: string) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "");
}

export function RecipeDetailClient({ recipe }: { recipe: Recipe }) {
  const router = useRouter();
  // 編集モードの有無を持つ。旧React版の editMode の切り替えに相当する
  const [isEditing, setIsEditing] = useState(false);
  // 以降は編集フォームで扱う入力値を state に持つ
  const [name, setName] = useState(recipe.name);
  const [ingredientsText, setIngredientsText] = useState(
    formatIngredientsTextarea(recipe.ingredients),
  );
  const [stepsText, setStepsText] = useState(recipe.steps.join("\n"));
  const [url, setUrl] = useState(recipe.url);

  async function handleSave() {
    // 旧React版の saveButton を押した時の処理に相当する
    if (!name.trim()) {
      alert("料理名を入力してください。");
      return;
    }

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
    // 旧React版の cancelButton を押した時の処理に相当する
    setName(recipe.name);
    setIngredientsText(formatIngredientsTextarea(recipe.ingredients));
    setStepsText(recipe.steps.join("\n"));
    setUrl(recipe.url);
    setIsEditing(false);
  }

  async function handleDelete() {
    // レシピを論理削除して一覧へ戻る
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

    const deletedRecipe = (await response.json()) as DeletedRecipe;
    // 削除した内容を一覧ページへ渡して、Undo トーストで復元できるようにする
    window.sessionStorage.setItem(
      DELETED_RECIPE_KEY,
      JSON.stringify(deletedRecipe),
    );
    router.push("/recipes");
  }

  return (
    <section>
      {isEditing ? (
        // 編集時はフォームを表示する
        <div>
          <div>
            <label htmlFor="editName">料理名</label>
            <input
              id="editName"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div>
            <label htmlFor="editIngredients">材料</label>
            <textarea
              id="editIngredients"
              value={ingredientsText}
              onChange={(event) => setIngredientsText(event.target.value)}
              rows={6}
            />
          </div>

          <div>
            <label htmlFor="editSteps">手順</label>
            <textarea
              id="editSteps"
              value={stepsText}
              onChange={(event) => setStepsText(event.target.value)}
              rows={6}
            />
          </div>

          <div>
            <label htmlFor="editUrl">参考URL</label>
            <input
              id="editUrl"
              type="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
            />
          </div>

          <button type="button" onClick={handleSave}>
            保存
          </button>
          <button type="button" onClick={handleCancel}>
            キャンセル
          </button>
        </div>
      ) : (
        // 通常時は詳細表示を出す
        <div>
          <h2>{name}</h2>
          {url ? (
            <p>
              <a href={url} target="_blank" rel="noreferrer">
                {url}
              </a>
            </p>
          ) : null}
          <section>
            <h3>材料</h3>
            <ul>
              {/* 旧React版の材料一覧表示に相当する */}
              {recipe.ingredients.map((ingredient) => (
                <li key={`${ingredient.name}-${ingredient.amount}`}>
                  {ingredient.name} {ingredient.amount}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h3>手順</h3>
            <ol>
              {/* 旧React版の手順一覧表示に相当する */}
              {recipe.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>
          {/* 旧React版の detail.js の「編集する」ボタンに相当する */}
          <button type="button" onClick={() => setIsEditing(true)}>
            編集する
          </button>
          {/* 旧React版の detail.js の deleteRecipe() に相当する */}
          <button type="button" onClick={handleDelete}>
            削除する
          </button>
        </div>
      )}
    </section>
  );
}
