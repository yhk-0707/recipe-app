import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateRecipeApiPayload } from "@/lib/recipe-form";
import { type ApiMessageResponse, toRecipeRecord } from "@/lib/recipe-types";

// Next.js 16 系の Route Handler では params が Promise で渡されるため、先に await して取り出す
type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  // params を await してから id を取り出す。直読みすると undefined になり、Prisma の操作に失敗する
  const { id } = await params;
  const recipe = await prisma.recipe.findFirst({
    where: {
      id: Number(id),
      deletedAt: null,
    },
  });

  // 見つからなければ 404 を返す
  if (!recipe) {
    return NextResponse.json<ApiMessageResponse>(
      { message: "見つかりません。" },
      { status: 404 },
    );
  }

  // 見つかったレシピをそのまま返す
  return NextResponse.json(toRecipeRecord(recipe));
}

export async function PATCH(request: NextRequest, { params }: Params) {
  // 更新したい内容をリクエストボディから受け取る
  const body = await request.json();
  // GET と同様に、ここでも params を await してから id を使う
  const { id } = await params;

  const { recipe: validatedRecipe, errors } = validateRecipeApiPayload(body);

  if (!validatedRecipe) {
    return NextResponse.json<ApiMessageResponse>(
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

  try {
    // 削除されていない指定 id のレシピだけ更新する
    const currentRecipe = await prisma.recipe.findFirst({
      where: {
        id: Number(id),
        deletedAt: null,
      },
    });

    if (!currentRecipe) {
      return NextResponse.json<ApiMessageResponse>(
        { message: "見つかりません。" },
        { status: 404 },
      );
    }

    const recipe = await prisma.recipe.update({
      where: { id: Number(id) },
      data: {
        name: validatedRecipe.name,
        ingredients: validatedRecipe.ingredients,
        steps: validatedRecipe.steps,
        url: validatedRecipe.url ? validatedRecipe.url : null,
      },
    });
    return NextResponse.json(toRecipeRecord(recipe));
  } catch {
    // 存在しない id だった場合は 404 を返す
    return NextResponse.json<ApiMessageResponse>(
      { message: "見つかりません。" },
      { status: 404 },
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  // DELETE でも同じく params を await してから id を参照する
  const { id } = await params;
  try {
    // 削除されていない指定 id のレシピを論理削除する
    const currentRecipe = await prisma.recipe.findFirst({
      where: {
        id: Number(id),
        deletedAt: null,
      },
    });

    if (!currentRecipe) {
      return NextResponse.json<ApiMessageResponse>(
        { message: "見つかりません。" },
        { status: 404 },
      );
    }

    const recipe = await prisma.recipe.update({
      where: { id: Number(id) },
      data: {
        deletedAt: new Date(),
      },
    });

    return NextResponse.json(toRecipeRecord(recipe));
  } catch {
    // 存在しない id だった場合は 404 を返す
    return NextResponse.json<ApiMessageResponse>(
      { message: "見つかりません。" },
      { status: 404 },
    );
  }
}
