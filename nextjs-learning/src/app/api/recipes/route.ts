import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const ingredients = Array.isArray(body.ingredients) ? body.ingredients : [];
  const steps = Array.isArray(body.steps) ? body.steps : [];
  const url = typeof body.url === "string" ? body.url.trim() : "";

  // 料理名は必須にする
  if (!name) {
    return NextResponse.json(
      { message: "料理名を入力してください。" },
      { status: 400 },
    );
  }

  // 材料は1件以上必要にする
  if (ingredients.length === 0) {
    return NextResponse.json(
      { message: "材料を入力してください。" },
      { status: 400 },
    );
  }

  // 手順も1件以上必要にする
  if (steps.length === 0) {
    return NextResponse.json(
      { message: "手順を入力してください。" },
      { status: 400 },
    );
  }

  // 入力値をそのまま保存用データに整形して登録する
  const recipe = await prisma.recipe.create({
    data: {
      name,
      ingredients,
      steps,
      url: url ? url : null,
      deletedAt: null,
    },
  });

  return NextResponse.json(recipe, { status: 201 });
}
