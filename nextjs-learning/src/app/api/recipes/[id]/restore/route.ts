import { type NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { type ApiMessageResponse, toRecipeRecord } from "@/lib/recipe-types";

// Next.js 16 系の Route Handler では params が Promise で渡されるため、先に await して取り出す
type Params = { params: Promise<{ id: string }> };

export async function POST(_request: NextRequest, { params }: Params) {
  // params を await してから id を取り出す
  const { id } = await params;

  // deletedAt が入っている、つまり論理削除済みのレシピだけを復元対象にする
  const currentRecipe = await prisma.recipe.findFirst({
    where: {
      id: Number(id),
      deletedAt: { not: null },
    },
  });

  if (!currentRecipe) {
    return NextResponse.json<ApiMessageResponse>(
      { message: "見つかりません。" },
      { status: 404 },
    );
  }

  // 削除フラグだけを外して、同じレコードを復元する
  const recipe = await prisma.recipe.update({
    where: { id: Number(id) },
    data: {
      deletedAt: null,
    },
  });

  return NextResponse.json(toRecipeRecord(recipe));
}
