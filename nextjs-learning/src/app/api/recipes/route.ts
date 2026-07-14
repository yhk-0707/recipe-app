import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateRecipeApiPayload } from "@/lib/recipe-form";
import {
  findRecipesByIngredientsOrName,
  normalizeSearchInput,
} from "@/lib/search";

export async function GET(request: NextRequest) {
  // クエリパラメータ q から検索語を取り出す
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  // まずは作成日時の降順で、削除されていないレシピだけを取得する
  const recipes = await prisma.recipe.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
  });

  // 検索条件がなければ、そのまま一覧を返す
  if (!q) {
    return NextResponse.json(recipes);
  }

  // 入力を検索用の語に分解して、検索ロジックへ渡す
  const searchTerms = normalizeSearchInput(q);
  return NextResponse.json(
    findRecipesByIngredientsOrName(recipes, searchTerms),
  );
}

export async function POST(request: NextRequest) {
  // リクエストボディから新規レシピの入力値を受け取る
  const body = await request.json();

  const { recipe: validatedRecipe, errors } = validateRecipeApiPayload(body);

  if (!validatedRecipe) {
    return NextResponse.json(
      {
        message:
          errors.name ??
          errors.ingredients ??
          errors.steps ??
          "入力が正しくありません。",
      },
      { status: 400 },
    );
  }

  // 入力値をそのまま保存用データに整形して登録する
  const recipe = await prisma.recipe.create({
    data: {
      name: validatedRecipe.name,
      ingredients: validatedRecipe.ingredients,
      steps: validatedRecipe.steps,
      url: validatedRecipe.url ? validatedRecipe.url : null,
      deletedAt: null,
    },
  });

  return NextResponse.json(recipe, { status: 201 });
}
