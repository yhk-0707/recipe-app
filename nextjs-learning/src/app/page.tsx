import Link from 'next/link';

export default function Home() {
  return (
    <main>
      {/* 旧React版の index.html / app.js の searchRecipe() の入口に相当する検索トップ */}
      <h1>料理を検索する</h1>
      <p>料理名や材料名を入力して、登録済みレシピを探します。</p>

      {/* 旧React版の register.html への導線に相当する */}
      <p>
        <Link href="/register">レシピ登録へ</Link>
      </p>

      {/* 旧React版では searchButton のクリックや Enter 送信で検索結果ページへ進んでいた */}
      <form action="/recipes" method="GET">
        <div>
          {/* 旧React版の ingredientInput に相当する検索入力欄 */}
          <label htmlFor="q">検索キーワード</label>
          <input id="q" name="q" type="search" placeholder="例: カレー, 玉ねぎ, 卵" />
        </div>
        {/* 旧React版の searchButton に相当する送信ボタン */}
        <button type="submit">検索</button>
      </form>
    </main>
  );
}
