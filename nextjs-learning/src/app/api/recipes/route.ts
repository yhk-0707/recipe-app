import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { findRecipesByIngredientsOrName, normalizeSearchInput } from '@/lib/search';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim() ?? '';

  const recipes = await prisma.recipe.findMany({
    orderBy: { createdAt: 'desc' },
  });

  if (!q) {
    return NextResponse.json(recipes);
  }

  const searchTerms = normalizeSearchInput(q);
  return NextResponse.json(findRecipesByIngredientsOrName(recipes, searchTerms));
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const name = typeof body.name === 'string' ? body.name.trim() : '';

  if (!name) {
    return NextResponse.json(
      { message: '料理名を入力してください。' },
      { status: 400 },
    );
  }

  const recipe = await prisma.recipe.create({
    data: {
      name,
      ingredients: body.ingredients ?? [],
      steps: Array.isArray(body.steps) ? body.steps : [],
      url: typeof body.url === 'string' ? body.url : null,
    },
  });

  return NextResponse.json(recipe, { status: 201 });
}