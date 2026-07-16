import {
  Card,
  LinkButton,
  MutedText,
  PageShell,
  PageTitle,
} from "@/components/ui";
import { prisma } from "@/lib/prisma";
import type { RecipeRecord } from "@/lib/recipe-types";
import { toRecipeRecord } from "@/lib/recipe-types";
import { RecipeDetailClient } from "./recipe-detail-client";

type DetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function RecipeDetailPage({ params }: DetailPageProps) {
  // 旧React版の getRecipeIdFromQuery() に相当する params.id の受け取り
  const { id } = await params;

  // 旧React版の initializeDetailPage() 内で行っていた getRecipeById(recipeId) に相当する
  // ここではDBから、削除されていない対象レシピを1件だけ取得する
  const recipe = await prisma.recipe.findFirst({
    where: {
      id: Number(id),
      deletedAt: null,
    },
  });

  return (
    <PageShell>
      {/* 旧React版の renderRecipeDetail(recipe) の最小版に相当する詳細画面 */}
      <Card className="space-y-4">
        <PageTitle>レシピ詳細</PageTitle>
        <div className="flex flex-wrap gap-2">
          {/* 旧React版の recipes.html へ戻るリンクに相当する */}
          <LinkButton href="/recipes" variant="secondary">
            一覧に戻る
          </LinkButton>
          {/* 旧React版の index.html へ戻る導線に相当する */}
          <LinkButton href="/" variant="secondary">
            トップへ戻る
          </LinkButton>
        </div>
      </Card>

      {/* 旧React版の renderRecipeDetail() で recipe がないときの表示に相当する */}
      {!recipe ? (
        <Card>指定されたレシピが見つかりませんでした。</Card>
      ) : (
        // 表示と編集の切り替えは client component に分けている
        <div className="space-y-4">
          <MutedText>詳細を確認して、編集または削除できます。</MutedText>
          <RecipeDetailClient recipe={toRecipeRecord(recipe)} />
        </div>
      )}
    </PageShell>
  );
}
