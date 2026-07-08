import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type Params = { params: { id: string } };

export async function GET(_request: NextRequest, { params }: Params) {
  // URL の id を数値に変換して、対象のレシピを 1 件取得する
  const recipe = await prisma.recipe.findUnique({
    where: { id: Number(params.id) },
  });

  // 見つからなければ 404 を返す
  if (!recipe) {
    return NextResponse.json({ message: '見つかりません。' }, { status: 404 });
  }

  // 見つかったレシピをそのまま返す
  return NextResponse.json(recipe);
}

export async function PATCH(request: NextRequest, { params }: Params) {
  // 更新したい内容をリクエストボディから受け取る
  const body = await request.json();
  const name = typeof body.name === 'string' ? body.name.trim() : '';

  // 料理名が空なら更新できない
  if (!name) {
    return NextResponse.json(
      { message: '料理名を入力してください。' },
      { status: 400 },
    );
  }

  try {
    // 指定された id のレシピを更新する
    const recipe = await prisma.recipe.update({
      where: { id: Number(params.id) },
      data: {
        name,
        ingredients: body.ingredients ?? [],
        steps: Array.isArray(body.steps) ? body.steps : [],
        url: typeof body.url === 'string' ? body.url : null,
      },
    });
    return NextResponse.json(recipe);
  } catch {
    // 存在しない id だった場合は 404 を返す
    return NextResponse.json({ message: '見つかりません。' }, { status: 404 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    // 指定された id のレシピを削除する
    const recipe = await prisma.recipe.delete({
      where: { id: Number(params.id) },
    });
    return NextResponse.json(recipe);
  } catch {
    // 存在しない id だった場合は 404 を返す
    return NextResponse.json({ message: '見つかりません。' }, { status: 404 });
  }
}
