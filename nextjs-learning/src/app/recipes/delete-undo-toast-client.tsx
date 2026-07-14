"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui";
import type { RecipeRecord } from "@/lib/recipe-types";

// 削除データを一覧ページへまたがって持ち運ぶためのキー。
const DELETED_RECIPE_KEY = "deleted-recipe";

export function DeleteUndoToastClient() {
  const router = useRouter();
  // sessionStorage に保存されている削除レコードを読み込んで表示する。
  const [deletedRecipe, setDeletedRecipe] = useState<RecipeRecord | null>(
    null,
  );

  useEffect(() => {
    // 詳細画面で削除された直後だけ、ここにデータが入る。
    const raw = window.sessionStorage.getItem(DELETED_RECIPE_KEY);
    if (!raw) {
      return;
    }

    try {
      setDeletedRecipe(JSON.parse(raw) as RecipeRecord);
    } catch {
      window.sessionStorage.removeItem(DELETED_RECIPE_KEY);
    }
  }, []);

  async function handleUndo() {
    if (!deletedRecipe) {
      return;
    }

    // API に復元を依頼する。
    const response = await fetch(`/api/recipes/${deletedRecipe.id}/restore`, {
      method: "POST",
    });

    if (!response.ok) {
      const result = (await response.json()) as { message?: string };
      alert(result.message ?? "元に戻せませんでした。");
      return;
    }

    window.sessionStorage.removeItem(DELETED_RECIPE_KEY);
    setDeletedRecipe(null);
    router.refresh();
  }

  function handleClose() {
    // Undo しないなら保存データを捨てて閉じる。
    window.sessionStorage.removeItem(DELETED_RECIPE_KEY);
    setDeletedRecipe(null);
  }

  if (!deletedRecipe) {
    return null;
  }

  return (
    <aside className="fixed bottom-4 right-4 z-50 flex max-w-[calc(100vw-32px)] flex-col gap-3 rounded-md border border-border bg-white p-3 shadow-[0_6px_20px_rgba(2,6,23,0.15)]">
      <p className="text-sm text-foreground">
        「{deletedRecipe.name}」を削除しました。
      </p>
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={handleUndo}>
          元に戻す
        </Button>
        <Button type="button" variant="secondary" onClick={handleClose}>
          閉じる
        </Button>
      </div>
    </aside>
  );
}
