'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type DeletedRecipe = {
  id: number;
  name: string;
  ingredients: { name: string; amount: string }[];
  steps: string[];
  url: string;
};

const DELETED_RECIPE_KEY = 'deleted-recipe';

// 旧React版の toast.js / detail.js の Undo トースト表示に相当する
export function DeleteUndoToastClient() {
  const router = useRouter();
  const [deletedRecipe, setDeletedRecipe] = useState<DeletedRecipe | null>(null);

  useEffect(() => {
    // detail ページで保存された削除データを読み込む
    const raw = window.sessionStorage.getItem(DELETED_RECIPE_KEY);
    if (!raw) {
      return;
    }

    try {
      setDeletedRecipe(JSON.parse(raw) as DeletedRecipe);
    } catch {
      window.sessionStorage.removeItem(DELETED_RECIPE_KEY);
    }
  }, []);

  async function handleUndo() {
    if (!deletedRecipe) {
      return;
    }

    // 旧React版の Undo 処理は、削除したレシピを再登録する流れに相当する
    const response = await fetch('/api/recipes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(deletedRecipe),
    });

    if (!response.ok) {
      const result = (await response.json()) as { message?: string };
      alert(result.message ?? '元に戻せませんでした。');
      return;
    }

    window.sessionStorage.removeItem(DELETED_RECIPE_KEY);
    setDeletedRecipe(null);
    router.refresh();
  }

  function handleClose() {
    // Undo しないなら保存データだけ消して、トーストを閉じる
    window.sessionStorage.removeItem(DELETED_RECIPE_KEY);
    setDeletedRecipe(null);
  }

  if (!deletedRecipe) {
    return null;
  }

  return (
    <aside
      style={{
        position: 'fixed',
        right: '16px',
        bottom: '16px',
        zIndex: 50,
        padding: '12px 16px',
        border: '1px solid #999',
        background: '#fff',
      }}
    >
      <p>「{deletedRecipe.name}」を削除しました。</p>
      <button type="button" onClick={handleUndo}>
        元に戻す
      </button>
      <button type="button" onClick={handleClose}>
        閉じる
      </button>
    </aside>
  );
}
