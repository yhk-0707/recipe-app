export default function Home() {
  return (
    <main>
      <h1>料理を検索する</h1>
      <p>料理名や材料名を入力して、登録済みレシピを探します。</p>

      <form action="/recipes" method="GET">
        <div>
          <label htmlFor="q">検索キーワード</label>
          <input id="q" name="q" type="search" placeholder="例: カレー, 玉ねぎ, 卵" />
        </div>
        <button type="submit">検索</button>
      </form>
    </main>
  );
}
