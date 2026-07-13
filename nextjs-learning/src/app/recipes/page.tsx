import Link from 'next/link';

import { prisma } from '@/lib/prisma';
import { findRecipesByIngredientsOrName, normalizeSearchInput } from '@/lib/search';
import { DeleteUndoToastClient } from './delete-undo-toast-client';

type SearchParams = {
  q?: string;
};

type RecipesPageProps = {
  searchParams?: Promise<SearchParams>;
};

export default async function RecipesPage({ searchParams }: RecipesPageProps) {
  // App Router では searchParams からクエリ文字列を受け取る
  const resolvedSearchParams = await searchParams;
  const q = resolvedSearchParams?.q?.trim() ?? '';

  // 旧React版の initializeRecipes() + getRecipes() に近い役割
  // ここではDBから登録済みレシピを取得する
  const recipes = await prisma.recipe.findMany({
    orderBy: { createdAt: 'desc' },
  });

  // 旧React版の app.js の searchRecipe() 内で行っていた
  // normalizeSearchInput() + findRecipesByIngredientsOrName() の検索処理に相当する
  const visibleRecipes = q
    ? findRecipesByIngredientsOrName(recipes, normalizeSearchInput(q))
    : recipes;

  return (
    <main>
      {/* 旧React版の recipes.html / recipes-list.js に相当する一覧画面 */}
      <h1>登録済み一覧</h1>
      {/* 旧React版にはなかったが、削除後の Undo 表示を一覧側に載せる */}
      <DeleteUndoToastClient />
      <p>検索キーワード: {q || 'なし'}</p>
      <p>
        {/* 旧React版の recipes.html から index.html に戻る導線に相当する */}
        <Link href="/">検索トップへ戻る</Link>
      </p>

      {/* 登録データがないときは空状態を表示する */}
      {visibleRecipes.length === 0 ? (
        <p>レシピがありません。</p>
      ) : (
        // 旧React版の ui.js の displayRecipeList() / renderRecipeListItem() に相当する描画
        <ul>
          {visibleRecipes.map((recipe) => (
            <li key={recipe.id}>
              {/* 旧React版の detail.html?id=... へのリンクに相当する */}
              <Link href={`/recipes/${recipe.id}`}>{recipe.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
