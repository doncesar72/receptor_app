"use client"

import { useState, useCallback, useEffect } from "react"
import { ArrowLeft, Clock, Flame, Users, ChefHat, Heart, Share } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { RecipeImage } from "@/components/fridge-chef/recipe-image"
import type { Recipe } from "@/lib/recipes"

interface RecipeDetailProps {
  recipe: Recipe
  onBack: () => void
  onToggleFavorite?: (recipe: Recipe, isFavorite: boolean) => void
  isFavoriteInitial?: boolean
}

const difficultyConfig = {
  easy: { label: "Легко", color: "bg-primary/15 text-primary" },
  medium: { label: "Средне", color: "bg-accent/15 text-accent" },
  hard: { label: "Сложно", color: "bg-[#dc2626]/15 text-[#dc2626]" },
}

export function RecipeDetail({
  recipe,
  onBack,
  onToggleFavorite,
  isFavoriteInitial = false,
}: RecipeDetailProps) {
  const difficulty =
    difficultyConfig[recipe.difficulty as keyof typeof difficultyConfig] || {
      label: recipe.difficulty || "Средне",
      color: "text-gray-500",
    }
  const [isFavorite, setIsFavorite] = useState(isFavoriteInitial)
  const [isPulsing, setIsPulsing] = useState(false)

  useEffect(() => {
    setIsFavorite(isFavoriteInitial)
  }, [isFavoriteInitial])

  const handleFavorite = useCallback(() => {
    setIsFavorite((prev) => {
      const next = !prev
      if (next) {
        setIsPulsing(true)
        setTimeout(() => setIsPulsing(false), 600)
      }
      onToggleFavorite?.(recipe, next)
      return next
    })
  }, [onToggleFavorite, recipe])

  const handleShare = useCallback(async () => {
    const shareData = {
      title: recipe.title,
      text: `${recipe.emoji} ${recipe.title} — ${recipe.time} мин, ${recipe.calories} ккал`,
    }
    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(
        `${shareData.title}\n${shareData.text}`
      )
    }
  }, [recipe])

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="rounded-xl hover:bg-muted flex-shrink-0"
          aria-label="Вернуться к списку рецептов"
        >
          <ArrowLeft className="size-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-xl text-gray-900 mt-1 mb-1 line-clamp-2">
            {recipe.title}
          </h1>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleShare}
            className="rounded-xl hover:bg-muted size-9"
            aria-label="Поделиться рецептом"
          >
            <Share className="size-[18px] text-muted-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleFavorite}
            className="rounded-xl hover:bg-muted size-9"
            aria-label={isFavorite ? "Убрать из избранного" : "Добавить в избранное"}
          >
            <Heart
              className={`size-[18px] transition-all duration-200 ${
                isFavorite
                  ? "fill-[#ef4444] text-[#ef4444]"
                  : "fill-none text-muted-foreground"
              } ${isPulsing ? "animate-[heartPulse_0.6s_ease-in-out]" : ""}`}
            />
          </Button>
        </div>
      </div>

      {/* Hero section */}
      <div className="flex items-center gap-4 px-1">
        <div className="size-20 rounded-2xl overflow-hidden flex-shrink-0">
          <RecipeImage
            name={recipe.title ?? ""}
            size="large"
          />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {recipe.description}
          </p>
          <Badge
            variant="outline"
            className={`w-fit text-xs ${difficulty?.color || "text-gray-500"}`}
          >
            {difficulty.label}
          </Badge>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-2">
        {[
          {
            icon: Clock,
            label: "Время",
            value: `${recipe.time?.toString().replace("мин", "").trim()} мин`,
          },
          { icon: Flame, label: "Калории", value: `${recipe.calories}` },
          { icon: Users, label: "Порции", value: `${recipe.servings}` },
          { icon: ChefHat, label: "Совпад.", value: `${recipe.match}%` },
        ].map((stat) => (
          <Card key={stat.label} className="border-border/60 py-3 gap-0">
            <CardContent className="p-0 flex flex-col items-center gap-1.5 px-2">
              <stat.icon className="size-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">
                {stat.value}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {stat.label}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Ingredients */}
      <section>
        <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <span role="img" aria-hidden="true">🥘</span>
          Ингредиенты
        </h3>
        <Card className="border-border/60 py-0 gap-0">
          <CardContent className="p-0">
            <ul className="divide-y divide-border/50">
              {(() => {
                console.log("[RecipeDetail] ingredients:", recipe.ingredients)
                return recipe.ingredients.map((ingredient, index) => {
                  const text =
                    typeof ingredient === "string"
                      ? ingredient
                      : `${ingredient.name}${
                          ingredient.amount ? ` — ${ingredient.amount}` : ""
                        }`
                  return (
                    <li
                      key={index}
                      className="flex items-center justify-between px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="size-2 rounded-full bg-primary flex-shrink-0" />
                        <span className="text-sm text-foreground">{text}</span>
                      </div>
                    </li>
                  )
                })
              })()}
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Steps */}
      <section>
        <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <span role="img" aria-hidden="true">👨‍🍳</span>
          Приготовление
        </h3>
        <div className="flex flex-col gap-3">
          {recipe.steps.map((step, index) => (
            <Card key={index} className="border-border/60 py-0 gap-0">
              <CardContent className="p-4 flex gap-4">
                <div className="flex-shrink-0 size-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">
                    {index + 1}
                  </span>
                </div>
                <p className="text-sm text-foreground leading-relaxed flex-1 pt-1">
                  {step}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <Button
        className="w-full h-12 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-base shadow-lg shadow-accent/20"
        onClick={onBack}
      >
        <span role="img" aria-hidden="true">🍽️</span>
        Начать готовить
      </Button>
    </div>
  )
}
