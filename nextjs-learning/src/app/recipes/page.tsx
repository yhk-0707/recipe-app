import Link from 'next/link';

import { prisma } from '@/lib/prisma';
import { findRecipesByIngredientsOrName, normalizeSearchInput } from '@/lib/search';

type SearchParams = {
  q?: string;
};

type RecipesPageProps = {
  searchParams?: Promise<SearchParams> | SearchParams;
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

  // 検索キーワードがあれば、旧実装の検索ロジックを使って絞り込む
  const visibleRecipes = q
    ? findRecipesByIngredientsOrName(recipes, normalizeSearchInput(q))
    : recipes;

  return (
    <main>
      {/* 旧React版の recipes.html / recipes-list.js に相当する一覧画面 */}
      <h1>登録済み一覧</h1>
      <p>検索キーワード: {q || 'なし'}</p>
      <p>
        <Link href="/">検索トップへ戻る</Link>
      </p>

      {/* 登録データがないときは空状態を表示する */}
      {visibleRecipes.length === 0 ? (
        <p>レシピがありません。</p>
      ) : (
        // 旧React版の displayRecipeList() / renderRecipeListItem() に相当する描画
        <ul>
          {visibleRecipes.map((recipe) => (
            <li key={recipe.id}>
              <Link href={`/recipes/${recipe.id}`}>{recipe.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
