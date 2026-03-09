"use client"

import { Clock, ChefHat, Flame } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RecipeImage } from "@/components/fridge-chef/recipe-image"
import type { Recipe } from "@/lib/recipes"

interface RecipeCardProps {
  recipe: Recipe
  onSelect: (recipe: Recipe) => void
}

const difficultyConfig = {
  easy: { label: "Легко", color: "bg-primary/15 text-primary border-primary/20" },
  medium: { label: "Средне", color: "bg-accent/15 text-accent border-accent/20" },
  hard: { label: "Сложно", color: "bg-[#dc2626]/15 text-[#dc2626] border-[#dc2626]/20" },
}

function getMatchColor(match: number): string {
  if (match >= 95) return "#22c55e"
  if (match >= 80) return "#2DD4BF"
  if (match >= 70) return "#F97316"
  return "#9ca3af"
}

function getMatchBg(match: number): string {
  if (match >= 95) return "bg-[#22c55e]/10 text-[#16a34a]"
  if (match >= 80) return "bg-primary/10 text-primary"
  if (match >= 70) return "bg-accent/10 text-accent"
  return "bg-muted text-muted-foreground"
}

export function RecipeCard({ recipe, onSelect }: RecipeCardProps) {
  const difficulty =
    difficultyConfig[recipe.difficulty as keyof typeof difficultyConfig] ?? {
      label: recipe.difficulty || "Средне",
      color: "bg-muted text-muted-foreground border-border/50",
    }
  const matchValue = recipe.matchPercent || recipe.match || 85
  const matchColor = getMatchColor(matchValue)
  const matchBg = getMatchBg(matchValue)

  // Правильный маппинг времени
  const cookTime = recipe.cookTime || recipe.time || recipe.duration || ''
  const cookTimeStr = cookTime ? String(cookTime) : ''
  const timeDisplay = cookTimeStr.includes('мин') 
    ? cookTimeStr 
    : cookTimeStr 
      ? `${cookTimeStr} мин` 
      : '? мин'

  return (
    <Card
      className="group cursor-pointer overflow-hidden border-border/60 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 btn-press py-0 gap-0"
      onClick={() => onSelect(recipe)}
      role="button"
      tabIndex={0}
      aria-label={`Рецепт: ${recipe.title}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onSelect(recipe)
        }
      }}
    >
      <CardContent className="p-0">
        <div className="flex">
          {/* Gradient match bar */}
          <div
            className="w-1 flex-shrink-0 rounded-l-[inherit] transition-colors duration-300"
            style={{
              background: `linear-gradient(to bottom, ${matchColor}, ${matchColor}88)`,
            }}
          />

          <div className="flex gap-4 p-4 flex-1 min-w-0">
            {/* Image */}
            <div className="size-14 rounded-xl overflow-hidden flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
              <RecipeImage
                name={(recipe as any).name ?? recipe.title ?? ""}
                size="small"
              />
            </div>

            {/* Content */}
            <div className="flex flex-col gap-1.5 min-w-0 flex-1">
              <h3 className="font-bold text-base text-gray-900 line-clamp-2 mt-1">
                {(recipe as any).name || recipe.title || "Без названия"}
              </h3>

              <p className="text-xs text-muted-foreground line-clamp-1">
                {recipe.description}
              </p>

              {/* Meta row */}
              <div className="flex items-center gap-2.5 flex-wrap pt-0.5">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="size-3.5" />
                  <span>{timeDisplay}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Flame className="size-3.5" />
                  <span>{recipe.calories} ккал</span>
                </div>
                <Badge
                  variant="outline"
                  className={`text-[10px] px-2 py-0.5 ${difficulty.color}`}
                >
                  {recipe.difficulty || difficulty.label}
                </Badge>
              </div>
            </div>

            {/* Match badge */}
            <div className="flex-shrink-0 self-start">
              <div className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${matchBg}`}>
                <ChefHat className="size-3.5" />
                {matchValue}%
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
