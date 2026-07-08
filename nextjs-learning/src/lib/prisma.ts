import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

// 1. データベースの接続URLを使って、PostgreSQL用のアダプター（接続の仲介役）を作成
// process.env.DATABASE_URL は環境変数（.envやprisma.config.ts）から読み込まれます
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

// 2. グローバルオブジェクト（Node.js/Bunの実行メモリ空間）に、すでにPrismaの接続インスタンスが存在するか確認するための型定義
// Next.jsの開発環境における「ホットリロード（ファイルの自動再読み込み）」対策です
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// 3. アプリ全体で使い回す「prisma」インスタンスをエクスポート（シングルトンパターン）
// すでにグローバルに既存の接続（globalForPrisma.prisma）があればそれを使い回し、無ければ新しい接続を作ります
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

// 4. もし「本番環境（production）」ではない場合（＝ローカルの開発環境の場合）
// 新しく作った接続インスタンスをグローバル領域に保存して、次のホットリロード時に使い回せるようにロックします
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}