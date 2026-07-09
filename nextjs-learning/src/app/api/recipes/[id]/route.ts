import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Next.js 16 系の Route Handler では params が Promise で渡されるため、先に await して取り出す
type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  // params を await してから id を取り出す。直読みすると undefined になり、Prisma の操作に失敗する
  const { id } = await params;
  const recipe = await prisma.recipe.findUnique({
    where: { id: Number(id) },
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
  // GET と同様に、ここでも params を await してから id を使う
  const { id } = await params;

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
      where: { id: Number(id) },
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
  // DELETE でも同じく params を await してから id を参照する
  const { id } = await params;
  try {
    // 指定された id のレシピを削除する
    const recipe = await prisma.recipe.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json(recipe);
  } catch {
    // 存在しない id だった場合は 404 を返す
    return NextResponse.json({ message: '見つかりません。' }, { status: 404 });
  }
}
