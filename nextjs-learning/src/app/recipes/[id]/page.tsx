import Link from 'next/link';

import { prisma } from '@/lib/prisma';
import { RecipeDetailClient } from './recipe-detail-client';

type DetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function RecipeDetailPage({ params }: DetailPageProps) {
  // 旧React版の getRecipeIdFromQuery() に相当する params.id の受け取り
  const { id } = await params;

  // 旧React版の initializeDetailPage() 内で行っていた getRecipeById(recipeId) に相当する
  // ここではDBから対象のレシピを1件だけ取得する
  const recipe = await prisma.recipe.findUnique({
    where: { id: Number(id) },
  });

  return (
    <main>
      {/* 旧React版の renderRecipeDetail(recipe) の最小版に相当する詳細画面 */}
      <h1>レシピ詳細</h1>

      {/* 旧React版の renderRecipeDetail() で recipe がないときの表示に相当する */}
      {!recipe ? (
        <p>指定されたレシピが見つかりませんでした。</p>
      ) : (
        // 表示と編集の切り替えは client component に分けている
        <RecipeDetailClient
          recipe={{
            id: recipe.id,
            name: recipe.name,
            ingredients: recipe.ingredients as {
              name: string;
              amount: string;
            }[],
            steps: recipe.steps,
            url: recipe.url ?? '',
          }}
        />
      )}

      <p>
        {/* 旧React版の recipes.html へ戻るリンクに相当する */}
        <Link href="/recipes">一覧に戻る</Link>
      </p>
    </main>
  );
}
