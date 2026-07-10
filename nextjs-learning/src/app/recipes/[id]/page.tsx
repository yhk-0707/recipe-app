import Link from 'next/link';

import { prisma } from '@/lib/prisma';

type DetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function RecipeDetailPage({ params }: DetailPageProps) {
  // URL の id を受け取って、DB から 1 件だけ取得する
  const { id } = await params;
  const recipe = await prisma.recipe.findUnique({
    where: { id: Number(id) },
  });

  return (
    <main>
      <h1>レシピ詳細</h1>

      {recipe ? <h2>{recipe.name}</h2> : <p>指定されたレシピが見つかりませんでした。</p>}

      <p>
        <Link href="/recipes">一覧に戻る</Link>
      </p>
    </main>
  );
}
