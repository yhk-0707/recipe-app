PostgreSQLのver16→18　アプデ
compose.yamlの更新
`docker compose exec db pg_dump -U postgres --clean --if-exists recipe_app > backup.sql`
→SQLのバックアップ
`--clean --if-exists`
→「データを復元するときに、すでにある同名のテーブルを一度きれいに削除してから作り直す」
→→バックアップファイル（backup.sql）の先頭に、テーブルを作る前に「もしすでに同じテーブルがあったら、一度削除する（DROP TABLE IF EXISTS）」という命令が自動で追加されます。