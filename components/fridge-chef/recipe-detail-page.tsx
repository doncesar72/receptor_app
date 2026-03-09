"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Clock, Flame, Users, TrendingUp, ChefHat, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RecipeImage } from "./recipe-image"
import type { Recipe } from "@/lib/recipes"

interface RecipeDetailPageProps {
  recipe: Recipe
  onClose: () => void
}

export function RecipeDetailPage({ recipe, onClose }: RecipeDetailPageProps) {
  console.log('Recipe data:', recipe)
  const [isFavorite, setIsFavorite] = useState(false)
  const [checkedIngredients, setCheckedIngredients] = useState<string[]>([])

  const difficultyMap: {[key: string]: string} = {
    'easy': 'Легко',
    'medium': 'Средне', 
    'hard': 'Сложно',
    'легко': 'Легко',
    'средне': 'Средне',
    'сложно': 'Сложно'
  }

  // Load favorite state from localStorage
  useEffect(() => {
    const savedRecipes = JSON.parse(localStorage.getItem('favorites') || '[]')
    const isAlreadySaved = savedRecipes.find((r: any) => r.id === recipe.id)
    setIsFavorite(!!isAlreadySaved)
  }, [recipe.id])

  // Toggle favorite
  const toggleFavorite = () => {
    const savedRecipes = JSON.parse(localStorage.getItem('favorites') || '[]')
    const isAlreadySaved = savedRecipes.find((r: any) => r.id === recipe.id)
    
    if (!isAlreadySaved) {
      savedRecipes.push(recipe)
      localStorage.setItem('favorites', JSON.stringify(savedRecipes))
      setIsFavorite(true)
    } else {
      const filtered = savedRecipes.filter((r: any) => r.id !== recipe.id)
      localStorage.setItem('favorites', JSON.stringify(filtered))
      setIsFavorite(false)
    }
  }

  // Toggle ingredient checkbox
  const toggleIngredient = (ingredient: string) => {
    setCheckedIngredients(prev => 
      prev.includes(ingredient) 
        ? prev.filter(i => i !== ingredient)
        : [...prev, ingredient]
    )
  }

  // Start cooking function
  const handleStartCooking = () => {
    const stepsBlock = document.getElementById('steps-block')
    if (stepsBlock) {
      stepsBlock.scrollIntoView({ behavior: 'smooth' })
    }
    alert('Приятного аппетита! 🍳')
  }

  return (
    <div className="max-w-sm mx-auto min-h-screen relative bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="size-4" />
          Назад
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleFavorite}
          className={`flex items-center gap-2 ${isFavorite ? "text-red-500" : "text-muted-foreground"}`}
        >
          {isFavorite ? "❤️" : "🤍"} В избранное
        </Button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Main info */}
        <div className="p-6 space-y-6">
          {/* Title and description */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              {recipe?.title || recipe?.name || 'Рецепт'}
            </h1>
            <p className="text-muted-foreground">
              {recipe.description}
            </p>
          </div>

          {/* Info cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-card rounded-xl p-4 border border-border/60">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="size-4 text-accent" />
                <span className="text-muted-foreground">Время</span>
              </div>
              <p className="font-semibold text-foreground">
                {recipe.cookTime || recipe.time || recipe.duration || '?'} мин
              </p>
            </div>

            <div className="bg-card rounded-xl p-4 border border-border/60">
              <div className="flex items-center gap-2 text-sm">
                <Flame className="size-4 text-accent" />
                <span className="text-muted-foreground">Калории</span>
              </div>
              <p className="font-semibold text-foreground">
                {recipe.calories} ккал
              </p>
            </div>

            <div className="bg-card rounded-xl p-4 border border-border/60">
              <div className="flex items-center gap-2 text-sm">
                <Users className="size-4 text-accent" />
                <span className="text-muted-foreground">Порции</span>
              </div>
              <p className="font-semibold text-foreground">
                {recipe.servings || recipe.portions || '2'} порции
              </p>
            </div>

            <div className="bg-card rounded-xl p-4 border border-border/60">
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="size-4 text-accent" />
                <span className="text-muted-foreground">Сложность</span>
              </div>
              <p className="font-semibold text-foreground">
                {difficultyMap[recipe.difficulty?.toLowerCase()] || recipe.difficulty || 'Средне'}
              </p>
            </div>
          </div>

          {/* Ingredients */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">
                Ингредиенты
              </h2>
              <span className="text-sm text-muted-foreground">
                {recipe.ingredients?.length || 0} штук
              </span>
            </div>
            
            <div className="space-y-3">
              {recipe.ingredients?.map((ingredient, index) => {
                const ingredientName = typeof ingredient === 'string' ? ingredient : ingredient.name
                const ingredientText = typeof ingredient === 'string' ? ingredient : `${ingredient.name} - ${ingredient.amount}`
                
                return (
                <div
                  key={index}
                  onClick={() => toggleIngredient(ingredientName)}
                  className="flex items-center gap-3 p-3 bg-white rounded-xl 
                             border border-gray-100 cursor-pointer 
                             hover:bg-gray-50 active:bg-gray-100 
                             transition-colors w-full"
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0
                    flex items-center justify-center transition-all
                    ${checkedIngredients.includes(ingredientName) 
                      ? 'bg-green-500 border-green-500' 
                      : 'border-gray-300'}`}
                  >
                    {checkedIngredients.includes(ingredientName) && (
                      <span className="text-white text-xs">✓</span>
                    )}
                  </div>
                  <span className={`text-sm transition-all flex-1
                    ${checkedIngredients.includes(ingredientName) 
                      ? 'line-through text-gray-400' 
                      : 'text-gray-700'}`}
                  >
                    {ingredientText}
                  </span>
                </div>
              )})}
            </div>
          </div>

          {/* Steps */}
          <div id="steps-block" className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">
              Пошаговый рецепт
            </h2>
            
            <div className="space-y-4">
              {recipe.steps?.map((step, index) => (
                <div key={index} className="flex gap-4 p-4 bg-card rounded-xl border border-border/60">
                  <div className="flex items-center justify-center size-8 rounded-full bg-accent text-accent-foreground font-bold text-sm flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground leading-relaxed">
                      {step}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom button */}
      <div className="px-4 pb-8 pt-4">
        <button
          onClick={handleStartCooking}
          className="w-full bg-orange-500 hover:bg-orange-600 
                     text-white font-bold py-4 px-6 rounded-2xl
                     text-lg transition-all active:scale-95"
        >
          Начать готовить 🍳
        </button>
      </div>
    </div>
  )
}
