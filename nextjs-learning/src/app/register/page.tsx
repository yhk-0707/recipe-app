'use client';

import { useState } from 'react';

type ParsedRecipe = {
  name: string;
  ingredients: { name: string; amount: string }[];
  steps: string[];
  url: string;
};

function parseFormattedRecipe(text: string): ParsedRecipe {
  // 旧React版の src/domain/parser.js の parseFormattedRecipe() をこのページ用に移したもの
  const lines = text.split('\n');
  let recipeName = '';
  const ingredients: { name: string; amount: string }[] = [];
  const steps: string[] = [];
  let recipeUrl = '';
  let mode = '';

  lines.forEach((line) => {
    const trimmed = line.trim();

    // 「料理名」行を見つけたら、次の行をタイトルとして読む
    if (trimmed.startsWith('料理名')) {
      mode = 'title';
      return;
    }

    // 料理名モード中の最初の非空行をタイトルにする
    if (mode === 'title' && trimmed !== '') {
      recipeName = trimmed;
      mode = '';
      return;
    }

    // 「材料」行から材料モードに入る
    if (trimmed.startsWith('材料')) {
      mode = 'ingredients';
      return;
    }

    // 「手順」行から手順モードに入る
    if (trimmed.startsWith('手順')) {
      mode = 'steps';
      return;
    }

    // 「参考URL」行は、その行に値があればそのまま使い、なければ次の行を読む
    if (trimmed.startsWith('参考URL')) {
      const value = trimmed.replace(/.*参考URL[:：]?\s*/, '').trim();
      if (value) {
        recipeUrl = value;
      } else {
        mode = 'url';
      }
      return;
    }

    // URLモード中の最初の非空行を参考URLとして読む
    if (mode === 'url' && trimmed !== '') {
      recipeUrl = trimmed;
      mode = '';
      return;
    }

    // 材料モードでは「- name|amount」の形式を配列に変換する
    if (mode === 'ingredients' && trimmed.startsWith('-')) {
      const item = trimmed.replace(/^-/, '').trim();
      const parts = item.split('|');
      ingredients.push({
        name: parts[0]?.trim() || '',
        amount: parts[1]?.trim() || '',
      });
      return;
    }

    // 手順モードでは、先頭の番号を外して配列に追加する
    if (mode === 'steps' && trimmed !== '') {
      steps.push(trimmed.replace(/^\d+\./, '').trim());
    }
  });

  return {
    name: recipeName,
    ingredients,
    steps,
    url: recipeUrl,
  };
}

export default function RegisterPage() {
  const [recipeText, setRecipeText] = useState('');
  const [recipeUrl, setRecipeUrl] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    // 旧React版の setupRecipeForm() で addFormattedButton を押した時の処理に相当する
    event.preventDefault();

    // 旧React版の parseRecipeForm() + parseFormattedRecipe() に相当する
    const parsedRecipe = parseFormattedRecipe(recipeText);

    // 旧React版の parseRecipeForm() の「料理名が空ならエラー」と同じチェック
    if (!parsedRecipe.name) {
      alert(
        '料理名の形式が正しくありません。\n「料理名」の行の次にタイトルを入力してください。',
      );
      return;
    }

    // 旧React版では form-utils.js の getRecipeFormValues() で参考URLを別入力できたので、その役割を残す
    if (recipeUrl.trim()) {
      parsedRecipe.url = recipeUrl.trim();
    }

    // 旧React版の addRecipe(recipe) の代わりに、Next.js では API 経由で DB に保存する
    const response = await fetch('/api/recipes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parsedRecipe),
    });

    if (!response.ok) {
      const result = (await response.json()) as { message?: string };
      alert(result.message ?? 'レシピを追加できませんでした。');
      return;
    }

    alert('レシピを追加しました');
    setRecipeText('');
    setRecipeUrl('');
  }

  function handleClear() {
    // 旧React版の resetRecipeForm() に相当する
    setRecipeText('');
    setRecipeUrl('');
  }

  return (
    <main>
      {/* 旧React版の register.html / register.js に相当する登録ページ */}
      <h1>レシピ登録</h1>

      <form onSubmit={handleSubmit}>
        <div>
          {/* 旧React版の recipeText に相当する入力欄 */}
          <label htmlFor="recipeText">レシピ本文</label>
          <textarea
            id="recipeText"
            value={recipeText}
            onChange={(event) => setRecipeText(event.target.value)}
            rows={12}
            cols={40}
            placeholder={`料理名
カレー

材料
- 玉ねぎ | 1個
- にんじん | 1本

手順
1. 切る
2. 炒める

参考URL
https://example.com`}
          />
        </div>

        <div>
          {/* 旧React版の recipeUrl に相当する入力欄 */}
          <label htmlFor="recipeUrl">参考URL</label>
          <input
            id="recipeUrl"
            type="url"
            value={recipeUrl}
            onChange={(event) => setRecipeUrl(event.target.value)}
          />
        </div>

        {/* 旧React版の addFormattedButton に相当する登録ボタン */}
        <button type="submit">登録する</button>
        {/* 旧React版の clearFormButton に相当するクリアボタン */}
        <button type="button" onClick={handleClear}>
          クリア
        </button>
      </form>
    </main>
  );
}
