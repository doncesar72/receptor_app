"use client"

import { Clock, Flame } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { RecipeImage } from "./recipe-image"
import type { Recipe } from "@/lib/recipes"

interface RecentRecipesProps {
  recipes: Recipe[]
  onSelect: (recipe: Recipe) => void
  onViewAll: () => void
}

const difficultyLabel: Record<string, string> = {
  easy: "Легко",
  medium: "Средне",
  hard: "Сложно",
}

const difficultyColor: Record<string, string> = {
  easy: "bg-[#2DD4BF]/15 text-[#0d9488] border-[#2DD4BF]/30",
  medium: "bg-[#F97316]/15 text-[#c2410c] border-[#F97316]/30",
  hard: "bg-[#ef4444]/15 text-[#dc2626] border-[#ef4444]/30",
}

export function RecentRecipes({ recipes, onSelect, onViewAll }: RecentRecipesProps) {
  if (recipes.length === 0) {
    return (
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-medium text-muted-foreground">
            Недавние рецепты
          </h3>
        </div>
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border/60 bg-card py-10 px-6 text-center">
          <span className="text-4xl" role="img" aria-label="Ледяной куб">
            {"🧊"}
          </span>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-[220px]">
            Сфотографируй холодильник чтобы получить первые рецепты
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-medium text-muted-foreground">
          Недавние рецепты
        </h3>
        <button
          onClick={onViewAll}
          className="text-sm font-semibold text-[#F97316] hover:text-[#ea580c] transition-colors"
        >
          {"Все \u2192"}
        </button>
      </div>

      <div className="-mx-5 px-5">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
          {recipes.map((recipe, index) => (
            <button
              key={`${recipe.id}-${index}`}
              onClick={() => onSelect(recipe)}
              className="flex-shrink-0 w-[160px] flex flex-col rounded-2xl border-2 border-[#2DD4BF]/40 bg-card overflow-hidden transition-all duration-200 hover:border-[#2DD4BF] hover:shadow-md hover:shadow-[#2DD4BF]/10 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring btn-press"
            >
              <div className="relative h-[100px] w-full overflow-hidden bg-muted">
                <RecipeImage
                  name={(recipe as any).name ?? recipe.title ?? ""}
                  size="small"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
              </div>

              <div className="flex flex-1 flex-col gap-2 p-3">
                <p className="text-sm font-semibold text-foreground leading-snug line-clamp-2">
                  {(recipe as any).name || recipe.title || "Без названия"}
                </p>

                <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" />
                    {recipe.time} мин
                  </span>
                  <span className="flex items-center gap-1">
                    <Flame className="size-3" />
                    {recipe.calories || "250"} ккал
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
