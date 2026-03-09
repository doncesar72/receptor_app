"use client"

import { useState, useRef, useCallback } from "react"
import { RecipeCard } from "./recipe-card"
import type { Recipe } from "@/lib/recipes"

interface RecipeListProps {
  recipes: Recipe[]
  onSelect: (recipe: Recipe) => void
  onRefresh?: () => void
}

export function RecipeList({ recipes, onSelect, onRefresh }: RecipeListProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const touchStartRef = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const isPullingRef = useRef(false)

  const threshold = 80

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (containerRef.current && containerRef.current.scrollTop === 0) {
      touchStartRef.current = e.touches[0].clientY
      isPullingRef.current = true
    }
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isPullingRef.current) return
    const diff = e.touches[0].clientY - touchStartRef.current
    if (diff > 0) {
      setPullDistance(Math.min(diff * 0.5, 120))
    }
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (pullDistance >= threshold) {
      setIsRefreshing(true)
      onRefresh?.()
      setTimeout(() => {
        setIsRefreshing(false)
        setPullDistance(0)
      }, 1500)
    } else {
      setPullDistance(0)
    }
    isPullingRef.current = false
  }, [pullDistance, onRefresh])

  if (recipes.length === 0) {
    return (
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base font-semibold text-foreground">
            Найденные рецепты
          </h2>
        </div>
        <div className="flex flex-col items-center justify-center gap-4 py-16 px-6">
          <div className="relative">
            <span className="text-6xl block" role="img" aria-hidden="true">{"🍽️"}</span>
            <span
              className="absolute -top-1 -right-2 text-2xl block"
              role="img"
              aria-hidden="true"
              style={{ animation: "chefWobble 2s ease-in-out infinite" }}
            >{"🔍"}</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 text-center">
            <p className="text-sm font-medium text-foreground">
              Рецепты пока не найдены
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-[240px]">
              Загрузите фото продуктов, и мы подберём для вас подходящие блюда
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      ref={containerRef}
      className="flex flex-col gap-3"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull to refresh indicator */}
      <div
        className="flex flex-col items-center justify-center overflow-hidden transition-all duration-300"
        style={{
          height: isRefreshing ? 64 : pullDistance > 10 ? pullDistance : 0,
          opacity: isRefreshing ? 1 : Math.min(pullDistance / threshold, 1),
        }}
      >
        <div
          className="text-3xl"
          style={{
            animation: isRefreshing ? "chefCook 0.8s ease-in-out infinite" : "none",
            transform: !isRefreshing
              ? `rotate(${(pullDistance / threshold) * 360}deg)`
              : undefined,
            transition: !isRefreshing ? "none" : "transform 0.3s",
          }}
          role="img"
          aria-label="Обновление"
        >
          {"👨‍🍳"}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {isRefreshing
            ? "Готовлю свежие рецепты..."
            : pullDistance >= threshold
              ? "Отпустите для обновления"
              : "Потяните вниз для обновления"}
        </p>
      </div>

      <div className="flex items-center justify-between px-1">
        <h2 className="text-base font-semibold text-foreground">
          Найденные рецепты
        </h2>
        <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
          {recipes.length}{" "}
          {recipes.length === 1
            ? "рецепт"
            : recipes.length < 5
              ? "рецепта"
              : "рецептов"}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {recipes.map((recipe, index) => (
          <div
            key={`${recipe.id}-${index}`}
            style={{
              animation: `staggerUp 0.5s ease-out ${index * 100}ms both`,
            }}
          >
            <RecipeCard recipe={recipe} onSelect={onSelect} />
          </div>
        ))}
      </div>
    </section>
  )
}
