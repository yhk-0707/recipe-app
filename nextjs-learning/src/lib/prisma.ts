import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

// 旧React版では localStorage / data/recipes.js がデータの置き場だった
// Next.js版では PostgreSQL に接続するための Prisma アダプターをここで作る
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

// 旧React版にはなかった Next.js / Prisma 側の接続管理用メモ
// 開発中のホットリロードで接続インスタンスが増えすぎないようにする
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// アプリ全体で使い回す PrismaClient を1つだけ持つ
// 既存の接続があれば再利用し、なければ新しく作る
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

// 開発環境ではグローバルに保存して、次回以降の再読み込みで使い回す
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
