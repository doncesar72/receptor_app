"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import { Sparkles, Search } from "lucide-react"
import { Header } from "@/components/fridge-chef/header"
import { UploadZone } from "@/components/fridge-chef/upload-zone"
import { LoadingScreen } from "@/components/fridge-chef/loading-screen"
import { RecipeList } from "@/components/fridge-chef/recipe-list"
import { RecipeDetail } from "@/components/fridge-chef/recipe-detail"
import { RecipeDetailPage } from "@/components/fridge-chef/recipe-detail-page"
import { ProductManager } from "@/components/fridge-chef/product-manager"
import { RecentRecipes } from "@/components/fridge-chef/recent-recipes"
import { BottomNav } from "@/components/fridge-chef/bottom-nav"
import { PhotoUploadSheet } from "@/components/fridge-chef/photo-upload-sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import type { Recipe } from "@/lib/recipes"

type AppState = "upload" | "loading" | "results" | "detail"

type TabId = "home" | "search" | "recipes" | "favorites"

interface AnalyzeResult {
  products?: string[]
  recipes?: Recipe[]
}

export default function РЕЦЕПТОРApp() {
  const [appState, setAppState] = useState<AppState>("upload")
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null)
  const [recognizedProducts, setRecognizedProducts] = useState<string[]>([])
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [activeTab, setActiveTab] = useState<TabId>("home")
  const [productsDirty, setProductsDirty] = useState(false)
  const [isUploadSheetOpen, setIsUploadSheetOpen] = useState(false)
  const [hasPhoto, setHasPhoto] = useState(false)
  const [recentRecipes, setRecentRecipes] = useState<Recipe[]>([])
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([])
  const [searchResults, setSearchResults] = useState<Recipe[]>([])
  const [isSearchLoading, setIsSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)

  // Load recent recipes from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const stored = window.localStorage.getItem("recentRecipes")
      if (stored) {
        const parsed = JSON.parse(stored) as Recipe[]
        setRecentRecipes(parsed)
      }
    } catch (error) {
      console.error("[РЕЦЕПТОРApp] Failed to load recentRecipes from localStorage:", error)
    }
  }, [])

  // Load favorite recipes from localStorage on mount and on tab change
  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const saved = JSON.parse(localStorage.getItem('favorites') || '[]')
      setFavoriteRecipes(saved)
    } catch (error) {
      console.error("[РЕЦЕПТОРApp] Failed to load favorite recipes:", error)
    }
  }, [activeTab])

  // Persist last 3 recent recipes
  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const toStore = recentRecipes.slice(0, 3)
      window.localStorage.setItem("recentRecipes", JSON.stringify(toStore))
    } catch (error) {
      console.error("[РЕЦЕПТОРApp] Failed to save recentRecipes to localStorage:", error)
    }
  }, [recentRecipes])

  const handleUpload = useCallback((dataUrl: string) => {
    console.log("[РЕЦЕПТОРApp] Image uploaded from UploadZone, data URL length:", dataUrl?.length)
    setHasPhoto(true)
    setImageDataUrl(dataUrl)
  }, [])

  const handleUploadFromSheet = useCallback((dataUrl: string) => {
    setHasPhoto(true)
    setImageDataUrl(dataUrl)
    setIsUploadSheetOpen(false)
  }, [])

  const handleCameraCapture = useCallback(() => {
    // Trigger file input with camera
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.capture = 'environment'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string
          handleUploadFromSheet(dataUrl)
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }, [handleUploadFromSheet])

  const handleGallerySelect = useCallback(() => {
    // Trigger file input for gallery only
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.multiple = false
    // Важно: не используем capture attribute для галереи
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string
          handleUploadFromSheet(dataUrl)
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }, [handleUploadFromSheet])

  const handleAnalyze = useCallback(async () => {
    if (!imageDataUrl) {
      toast.error("📸 Сначала сфотографируйте продукты")
      return
    }

    console.log("[РЕЦЕПТОРApp] Starting analysis, sending image to /api/analyze")
    setAppState("loading")
    setIsAnalyzing(true)

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        body: JSON.stringify({ image: imageDataUrl }),
        cache: 'no-store'
      })

      console.log("[РЕЦЕПТОРApp] /api/analyze response status:", response.status)

      const json = await response.json()
      console.log("[РЕЦЕПТОРApp] /api/analyze raw JSON:", json)

      let parsed: AnalyzeResult | null = null

      if (json && typeof json.result === "string") {
        try {
          parsed = JSON.parse(json.result) as AnalyzeResult
          console.log("[РЕЦЕПТОРApp] Parsed result JSON from model:", parsed)
        } catch (error) {
          console.error("[РЕЦЕПТОРApp] Failed to parse result JSON from model:", error)
        }
      } else if (json && typeof json === "object") {
        parsed = json as AnalyzeResult
      }

      if (parsed?.recipes && Array.isArray(parsed.recipes)) {
        console.log("[РЕЦЕПТОРApp] Setting new recipes, count:", parsed.recipes.length)
        setRecipes(parsed.recipes)
        setRecentRecipes((prev) => {
          const merged = [...parsed.recipes!, ...prev]
          const unique = merged.filter(
            (r, i, arr) => arr.findIndex((x) => x.id === r.id) === i
          )
          return unique.slice(0, 10)
        })
      } else {
        console.log("[РЕЦЕПТОРApp] Parsed result has no recipes array")
        setRecipes([])
      }

      if (parsed?.products && Array.isArray(parsed.products)) {
        setRecognizedProducts(parsed.products)
      } else {
        console.log("[РЕЦЕПТОРApp] Parsed result has no products array")
        setRecognizedProducts([])
      }
    } catch (error) {
      console.error("[РЕЦЕПТОРApp] Error while calling /api/analyze:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }, [imageDataUrl])

  const handleLoadingComplete = useCallback(() => {
    setAppState("results")
    setActiveTab("recipes")
  }, [])

  const handleSelectRecipe = useCallback((recipe: Recipe) => {
    setSelectedRecipe(recipe)
    setAppState("detail")
  }, [])

  const handleBack = useCallback(() => {
    if (appState === "detail") {
      setAppState("results")
      setSelectedRecipe(null)
    } else {
      setAppState("upload")
      setImageDataUrl(null)
      setRecognizedProducts([])
      setRecipes([])
      setProductsDirty(false)
    }
  }, [appState])

  const handleProductsChange = useCallback(
    (nextProducts: string[]) => {
      setRecognizedProducts(nextProducts)
      setProductsDirty(true)
    },
    [handleAnalyze],
  )

  const handleAnalyzeFromProducts = useCallback(() => {
    if (!imageDataUrl) {
      toast.error("📸 Сначала сфотографируйте продукты")
      return
    }
    if (!recognizedProducts.length) return
    setProductsDirty(false)
    void handleAnalyze()
  }, [imageDataUrl, recognizedProducts, handleAnalyze])

  const handleChangeTab = useCallback((tab: TabId) => {
    setActiveTab(tab)
    if (tab === "home") {
      setAppState("upload")
    } else if (tab === "recipes" && recipes.length > 0) {
      setAppState("results")
    }
  }, [recipes.length])

  const handleToggleFavorite = useCallback((recipe: Recipe, isFavorite: boolean) => {
    setTimeout(() => {
      setFavoriteRecipes((prev) => {
        if (isFavorite) {
          const exists = prev.find(
            (r) => r.id === recipe.id || (r as any).name === (recipe as any).name,
          )
          if (exists) return prev
          return [...prev, recipe]
        }
        return prev.filter(
          (r) => r.id !== recipe.id && (r as any).name !== (recipe as any).name,
        )
      })
    }, 0)
  }, [])

  const handleSearchSubmit = useCallback(async (options?: { query?: string; limit?: number }) => {
    const base = options?.query ?? searchQuery
    const trimmed = base.trim()
    if (!trimmed) return

    setIsSearchLoading(true)
    setSearchError(null)

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: trimmed }),
      })

      const json = await response.json()
      console.log("[РЕЦЕПТОРApp] /api/search raw JSON:", json)

      let parsed: { recipes?: Recipe[] } | null = null

      if (json && typeof json.result === "string") {
        try {
          parsed = JSON.parse(json.result) as { recipes?: Recipe[] }
        } catch (error) {
          console.error("[РЕЦЕПТОРApp] Failed to parse search JSON:", error)
          setSearchError("Не удалось разобрать ответ сервера")
        }
      } else if (json && typeof json === "object") {
        parsed = json as { recipes?: Recipe[] }
      }

      if (parsed?.recipes && Array.isArray(parsed.recipes)) {
        const limit = options?.limit ?? 3
        setSearchResults(parsed.recipes.slice(0, limit))
      } else {
        setSearchResults([])
        setSearchError("Рецепты не найдены")
      }
    } catch (error) {
      console.error("[РЕЦЕПТОРApp] Error while calling /api/search:", error)
      setSearchError("Ошибка при запросе к серверу")
    } finally {
      setIsSearchLoading(false)
    }
  }, [searchQuery])

  return (
    <div className="min-h-dvh bg-background">
      <div className="mx-auto max-w-md px-5 pb-24">
        <Header />

        <main className="flex flex-col gap-6 pt-2">
          {appState === "upload" && activeTab === "home" && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-300">
              {/* Welcome section */}
              <section className="flex flex-col gap-2 px-1">
                <h2 className="text-2xl font-bold text-foreground tracking-tight text-balance">
                  Что приготовить сегодня?
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Сфотографируйте продукты в холодильнике, а мы подберём для вас
                  лучшие рецепты
                </p>
              </section>

              {/* Upload zone */}
              <UploadZone onUpload={handleUpload} />

              {/* Analyze button */}
              {hasPhoto && (
                <Button
                  onClick={handleAnalyze}
                  className="w-full h-12 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-base shadow-lg shadow-accent/20 animate-in fade-in slide-in-from-bottom-2 duration-300 btn-press"
                >
                  <Sparkles className="size-5" />
                  Найти рецепты
                </Button>
              )}

              {!hasPhoto && (
                <Button
                  disabled
                  className="w-full h-12 rounded-xl bg-muted text-muted-foreground font-semibold text-base cursor-not-allowed opacity-50"
                >
                  <Sparkles className="size-5" />
                  Найти рецепты
                </Button>
              )}

              {/* Quick tips */}
              <section className="flex flex-col gap-3 pt-2">
                <h3 className="text-sm font-medium text-muted-foreground px-1">
                  Совет дня
                </h3>
                <div className="bg-card rounded-2xl border border-border/60 p-4 flex gap-4 items-start">
                  <div className="size-10 rounded-xl bg-secondary flex items-center justify-center text-xl flex-shrink-0">
                    <span role="img" aria-hidden="true">{"💡"}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium text-foreground">
                      Лучший ракурс для фото
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Откройте холодильник широко и сделайте фото при хорошем
                      освещении. Так мы точнее определим все продукты.
                    </p>
                  </div>
                </div>
              </section>

              {/* Recent recipes horizontal scroll */}
              <RecentRecipes
                recipes={recentRecipes}
                onSelect={handleSelectRecipe}
                onViewAll={() => {
                  setActiveTab("recipes")
                  if (recipes.length > 0) {
                    setAppState("results")
                  }
                }}
              />

              {/* Popular categories */}
              <section className="flex flex-col gap-3">
                <h3 className="text-sm font-medium text-muted-foreground px-1">
                  Популярные категории
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { emoji: "🍳", label: "Завтраки" },
                    { emoji: "🥗", label: "Салаты" },
                    { emoji: "🍲", label: "Супы" },
                    { emoji: "🍝", label: "Паста" },
                    { emoji: "🥐", label: "Выпечка" },
                    { emoji: "🥩", label: "Мясо" },
                    { emoji: "🍰", label: "Десерты" },
                    { emoji: "🥤", label: "Напитки" },
                  ].map((cat) => (
                    <button
                      key={cat.label}
                      className="flex flex-col items-center gap-2 py-3 rounded-xl bg-card border border-border/60 hover:border-primary/40 transition-colors btn-press"
                      onClick={() => {
                        setActiveTab("search")
                        setSearchQuery(cat.label)
                        void handleSearchSubmit({ query: cat.label, limit: 5 })
                      }}
                    >
                      <span className="text-2xl" role="img" aria-hidden="true">
                        {cat.emoji}
                      </span>
                      <span className="text-xs text-foreground font-medium">
                        {cat.label}
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            </div>
          )}

          {appState === "loading" && (
            <LoadingScreen isLoading={isAnalyzing} onComplete={handleLoadingComplete} />
          )}

          {appState === "results" && activeTab === "recipes" && (
            <div className="flex flex-col gap-6">
              {/* Found products with add/remove management */}
              <ProductManager
                initialProducts={recognizedProducts}
                onProductsChange={handleProductsChange}
              />

              {productsDirty && (
                <Button
                  onClick={handleAnalyzeFromProducts}
                  className="w-full h-11 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-sm shadow-md shadow-accent/15 btn-press"
                >
                  Найти рецепты 🔍
                </Button>
              )}

              {recipes.length === 0 ? (
                <section className="flex flex-col items-center justify-center gap-3 py-12 px-6">
                  <p className="text-sm font-medium text-foreground">
                    Рецепты пока не найдены
                  </p>
                  <p className="text-xs text-muted-foreground text-center max-w-[260px]">
                    Загрузите фото продуктов или добавьте их вручную, чтобы получить первые
                    предложения.
                  </p>
                </section>
              ) : (
                <RecipeList
                  recipes={recipes}
                  onSelect={handleSelectRecipe}
                  onRefresh={() => {}}
                />
              )}

              <Button
                variant="outline"
                className="w-full h-11 rounded-xl border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40 btn-press"
                onClick={() => setIsUploadSheetOpen(true)}
              >
                Загрузить другое фото
              </Button>
            </div>
          )}

          {activeTab === "search" && appState !== "loading" && appState !== "detail" && (
            <div className="flex flex-col gap-4">
              <section className="flex flex-col gap-2 px-1">
                <h2 className="text-base font-semibold text-foreground">
                  Поиск по рецептам
                </h2>
                <p className="text-xs text-muted-foreground">
                  Введите название блюда или ингредиент для поиска среди найденных рецептов.
                </p>
              </section>
              <div className="relative">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      void handleSearchSubmit()
                    }
                  }}
                  placeholder="Например: омлет, салат..."
                  className="h-11 rounded-xl border-border/60 bg-card pl-4 pr-12 text-sm placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={() => void handleSearchSubmit()}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex items-center justify-center size-8 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  aria-label="Поиск"
                >
                  <Search className="size-4" />
                </button>
              </div>

              {isSearchLoading && (
                <p className="text-xs text-muted-foreground px-1">Ищу рецепты...</p>
              )}
              {searchError && !isSearchLoading && (
                <p className="text-xs text-destructive px-1">{searchError}</p>
              )}

              <RecipeList
                recipes={searchResults}
                onSelect={handleSelectRecipe}
                onRefresh={() => {}}
              />
            </div>
          )}

          {activeTab === "favorites" && appState !== "loading" && appState !== "detail" && (
            <div className="flex flex-col gap-4">
              {favoriteRecipes.length > 0 ? (
                <>
                  <section className="flex flex-col gap-2 px-1">
                    <h2 className="text-base font-semibold text-foreground">
                      Избранные рецепты
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Здесь будут рецепты, которые вы отметили сердечком.
                    </p>
                  </section>
                  <RecipeList
                    recipes={favoriteRecipes}
                    onSelect={handleSelectRecipe}
                    onRefresh={() => {}}
                  />
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 px-4">
                  <div className="text-6xl mb-4">❤️</div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Здесь будут ваши любимые рецепты
                  </h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Нажмите на сердечко в карточке рецепта, чтобы добавить его в избранное
                  </p>
                </div>
              )}
            </div>
          )}

          {appState === "detail" && selectedRecipe && (
            <RecipeDetailPage
              recipe={selectedRecipe}
              onClose={handleBack}
            />
          )}
        </main>
      </div>

      <BottomNav active={activeTab} onChange={handleChangeTab} />

      <PhotoUploadSheet
        isOpen={isUploadSheetOpen}
        onClose={() => setIsUploadSheetOpen(false)}
        onCameraCapture={handleCameraCapture}
        onGallerySelect={handleGallerySelect}
      />
    </div>
  )
}
