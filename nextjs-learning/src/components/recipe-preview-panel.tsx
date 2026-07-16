"use client";

import { Button, MutedText, SectionTitle } from "@/components/ui";
import { buildRecipePreview, formatStepLabel } from "@/lib/recipe-form";

type RecipePreviewPanelProps = {
  previewId: string;
  isOpen: boolean;
  onToggle: () => void;
  title: string;
  name: string;
  ingredientsText: string;
  stepsText: string;
  recipeUrl: string;
};

export function RecipePreviewPanel({
  previewId,
  isOpen,
  onToggle,
  title,
  name,
  ingredientsText,
  stepsText,
  recipeUrl,
}: RecipePreviewPanelProps) {
  const previewRecipe = buildRecipePreview(
    name,
    ingredientsText,
    stepsText,
    recipeUrl,
  );
  const previewStepKeyCounts = new Map<string, number>();

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1">
          <SectionTitle>{title}</SectionTitle>
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={previewId}
        >
          <span>プレビュー</span>
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
          >
            <path
              d="M5 7.5L10 12.5L15 7.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
      </div>

      {isOpen ? (
        <div id={previewId} className="space-y-4 rounded-lg bg-[#f8fafc] p-4">
          <div className="space-y-2">
            <p className="text-sm text-muted">料理名</p>
            <p className="text-foreground">{previewRecipe.name || "未入力"}</p>
          </div>

          <section className="space-y-2">
            <p className="text-sm text-muted">材料</p>
            {previewRecipe.ingredients.length > 0 ? (
              <ul className="list-none space-y-1 p-0">
                {previewRecipe.ingredients.map((ingredient) => (
                  <li key={`${ingredient.name}-${ingredient.amount}`}>
                    {ingredient.amount
                      ? `${ingredient.name}: ${ingredient.amount}`
                      : ingredient.name}
                  </li>
                ))}
              </ul>
            ) : (
              <MutedText>まだ材料がありません。</MutedText>
            )}
          </section>

          <section className="space-y-2">
            <p className="text-sm text-muted">手順</p>
            {previewRecipe.steps.length > 0 ? (
              <ol className="list-none space-y-1 p-0">
                {previewRecipe.steps.map((step, index) => {
                  const occurrence = (previewStepKeyCounts.get(step) ?? 0) + 1;
                  previewStepKeyCounts.set(step, occurrence);

                  return (
                    <li key={`${step}-${occurrence}`}>
                      {formatStepLabel(index)} {step}
                    </li>
                  );
                })}
              </ol>
            ) : (
              <MutedText>まだ手順がありません。</MutedText>
            )}
          </section>

          <div className="space-y-2">
            <p className="text-sm text-muted">参考URL</p>
            {previewRecipe.url ? (
              <a
                href={previewRecipe.url}
                target="_blank"
                rel="noreferrer"
                className="break-all text-foreground hover:text-accent"
              >
                {previewRecipe.url}
              </a>
            ) : (
              <MutedText>未入力</MutedText>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
