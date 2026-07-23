# ECS Fargate ハンズオン トラブルシューティングまとめ

このメモは、今回のハンズオンで最初から最後までに起きた問題と、その対処を時系列でまとめたもの。

## 1. CloudShell の psql インストールで失敗した

- `sudo dnf install -y postgresql18` を実行したが、`amazonlinux` リポジトリの取得でタイムアウトした
- そのため `postgresql18` は見つからず、インストールできなかった
- 実際には CloudShell には `postgresql16` が入っていた

### 対処

- `dnf list installed 'postgresql*'` で既存バージョンを確認した
- `psql` は既に使える状態だったので、追加インストールにこだわらず接続確認へ進んだ

## 2. RDS へ psql 接続がタイムアウトした

- `psql "postgresql://..."` を実行しても接続できなかった
- `timeout expired` が出て、RDS に到達できていない状態だった

### 確認したこと

- CloudShell の VPC 環境を確認した
- `handson-vpc` を使っていることを確認した
- `app-sg` が付いていることを確認した
- ルートテーブル、NACL、Security Group の設定を見直した

### 対処

- RDS 側の `db-sg` に、`app-sg` から PostgreSQL 5432 を許可した
- その後、`psql` で接続できるようになった

## 3. Parameter Store の値を上書きできなかった

- `aws ssm put-parameter` で `/handson/db/url` を登録しようとした
- `ParameterAlreadyExists` になり、既に同名パラメータがあることが分かった

### 対処

- `aws ssm get-parameter --with-decryption` で既存値を確認した
- 不要になったタイミングで削除し、再登録し直した

## 4. ECS クラスター作成で失敗した

- CloudFormation 経由の ECS クラスター作成で `CREATE_FAILED` になった
- エラーは `Unable to assume the service linked role` だった

### 確認したこと

- IAM ロール `AWSServiceRoleForECS` の存在を確認した
- 信頼関係に `ecs.amazonaws.com` が入っていることを確認した

### 対処

- 失敗した CloudFormation スタックを片付けた
- ECS クラスターを作り直した

## 5. ECS サービス起動で SSM 取得に失敗した

- `app-svc` が `ResourceInitializationError` で起動できなかった
- 最初は `AWS Systems Manager Parameter Store` へ到達できずにタイムアウトしていた

### 確認したこと

- `app-sg` のアウトバウンドルールを確認した
- ルートテーブルでプライベートサブネットが `NAT Gateway` に向いていることを確認した

### 対処

- `app-sg` の outbound に `HTTPS 443 -> 0.0.0.0/0` を追加した
- ECS タスクが SSM に到達できるようにした

## 6. ECS 実行ロールの権限不足で失敗した

- その後のエラーは `AccessDeniedException` だった
- `handson-ecsTaskExecutionRole` に `ssm:GetParameters` の権限がなかった

### 対処

- `handson-ecsTaskExecutionRole` に `ssm:GetParameters` を許可するポリシーを追加した
- `GetParameter` ではなく `GetParameters` が必要だった

## 7. ALB までは表示できたが `/recipes` だけ落ちた

- ALB の URL では表示できた
- しかし `/recipes` に行くと `This page couldn’t load` になった

### 確認したこと

- CloudWatch Logs を確認した
- Prisma のエラーが出ていることを確認した

### 原因

- `Recipe.deletedAt` 列が DB に存在しなかった
- アプリ側は `where: { deletedAt: null }` を前提にしていた

### 対処

- `ALTER TABLE "Recipe" ADD COLUMN "deletedAt" TIMESTAMP(3);` を実行した
- `\d "Recipe"` で列が追加されたことを確認した
- `/recipes` が表示できるようになった

## 8. 最終結果

- ECS クラスターを作成した
- ECS サービスを起動した
- ALB 経由でアプリを公開した
- `/recipes` も表示できるようにした

## 9. 今回の学び

- ネットワーク、IAM、DBスキーマのどれで止まっているかを切り分ける必要がある
- エラー文をそのまま読むと、かなり正確に原因を絞れる
- 画面上では同じ「ページが落ちる」でも、原因はネットワーク、権限、DBスキーマのどれでもありうる
- 手順どおりに進めても、実環境の状態が古いと追加修正が必要になる

