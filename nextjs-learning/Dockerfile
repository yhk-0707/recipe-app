# --- Build stage ---
# bun.lockがあるのでnpmではなくbunを使う
FROM oven/bun:1 AS build
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
# build前に必須。忘れると@prisma/clientで壊れる
RUN bunx prisma generate
RUN bun run build

# --- Runtime stage ---
# 実行時は最小構成だけ残す
FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production
# コンテナ外(ALB等)からの接続を受けるため全インターフェースで待ち受ける
ENV HOSTNAME=0.0.0.0
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
