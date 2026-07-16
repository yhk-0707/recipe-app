import Link from "next/link";

import {
  Card,
  LinkButton,
  MutedText,
  PageShell,
  PageTitle,
} from "@/components/ui";
import { prisma } from "@/lib/prisma";
import {
  findRecipesByIngredientsOrName,
  normalizeSearchInput,
} from "@/lib/search";
import { DeleteUndoToastClient } from "./delete-undo-toast-client";

type SearchParams = {
  q?: string;
};

type RecipesPageProps = {
  searchParams?: Promise<SearchParams>;
};

export default async function RecipesPage({ searchParams }: RecipesPageProps) {
  // App Router では searchParams からクエリ文字列を受け取る
  const resolvedSearchParams = await searchParams;
  const q = resolvedSearchParams?.q?.trim() ?? "";

  // 旧React版の initializeRecipes() + getRecipes() に近い役割
  // ここではDBから、削除されていない登録済みレシピを取得する
  const recipes = await prisma.recipe.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
  });

  // 旧React版の app.js の searchRecipe() 内で行っていた
  // normalizeSearchInput() + findRecipesByIngredientsOrName() の検索処理に相当する
  const visibleRecipes = q
    ? findRecipesByIngredientsOrName(recipes, normalizeSearchInput(q))
    : recipes;

  return (
    <PageShell>
      {/* 旧React版の recipes.html / recipes-list.js に相当する一覧画面 */}
      <Card className="space-y-4">
        <PageTitle>登録済み一覧</PageTitle>
        <MutedText>検索キーワード: {q || "なし"}</MutedText>
        <div className="flex flex-wrap gap-2">
          {/* 旧React版の recipes.html から index.html に戻る導線に相当する */}
          <LinkButton href="/" variant="secondary">
            検索トップへ戻る
          </LinkButton>
          {/* 旧React版の register.html への導線に相当する */}
          <LinkButton href="/register" variant="secondary">
            レシピ登録へ
          </LinkButton>
        </div>
      </Card>

      {/* 旧React版にはなかったが、削除後の Undo 表示を一覧側に載せる */}
      <DeleteUndoToastClient />

      {/* 登録データがないときは空状態を表示する */}
      {visibleRecipes.length === 0 ? (
        <Card>レシピがありません。</Card>
      ) : (
        // 旧React版の ui.js の displayRecipeList() / renderRecipeListItem() に相当する描画
        <div className="grid gap-3">
          {visibleRecipes.map((recipe) => (
            <Card key={recipe.id} className="p-0">
              {/* 旧React版の detail.html?id=... へのリンクに相当する */}
              {(() => {
                const ingredientCount = Array.isArray(recipe.ingredients)
                  ? recipe.ingredients.length
                  : 0;
                const stepCount = recipe.steps.length;

                return (
                  <Link
                    href={`/recipes/${recipe.id}`}
                    className="block px-4 py-3 text-foreground hover:text-accent"
                  >
                    <strong className="block font-medium">{recipe.name}</strong>
                    <span className="mt-2 block text-sm text-muted">
                      {ingredientCount} 材料 / {stepCount} 手順
                    </span>
                  </Link>
                );
              })()}
            </Card>
          ))}
        </div>
      )}
    </PageShell>
  );
}
