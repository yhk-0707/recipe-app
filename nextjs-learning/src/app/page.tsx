import {
  Button,
  Card,
  Field,
  LinkButton,
  MutedText,
  PageShell,
  PageTitle,
  TextInput,
} from "@/components/ui";

export default function Home() {
  return (
    <PageShell className="py-0">
      {/* 旧React版の index.html / app.js の searchRecipe() の入口に相当する検索トップ */}
      <Card className="space-y-4">
        <PageTitle>料理を検索する</PageTitle>
        <MutedText>
          料理名や材料名を入力して、登録済みレシピを探します。
        </MutedText>

        <div className="flex flex-wrap gap-2">
          {/* 旧React版の recipes.html への導線に相当する */}
          <LinkButton href="/recipes" variant="secondary">
            登録済みレシピ一覧を見る
          </LinkButton>
          {/* 旧React版の register.html への導線に相当する */}
          <LinkButton href="/register" variant="secondary">
            レシピ登録ページへ
          </LinkButton>
        </div>
      </Card>

      {/* 旧React版では searchButton のクリックや Enter 送信で検索結果ページへ進んでいた */}
      <Card>
        <form action="/recipes" method="GET" className="space-y-4">
          {/* 旧React版の ingredientInput に相当する検索入力欄 */}
          <Field
            htmlFor="q"
            label="検索キーワード"
            hint="材料名か料理名、どちらでも検索できます。スペース区切りで複数語を入力してください。"
          >
            <TextInput
              id="q"
              name="q"
              type="search"
              placeholder="例: カレー, 玉ねぎ, 卵"
            />
          </Field>
          {/* 旧React版の searchButton に相当する送信ボタン */}
          <Button type="submit">検索</Button>
        </form>
      </Card>
    </PageShell>
  );
}
