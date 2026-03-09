"use client"

import { useEffect, useState, useCallback } from "react"
import { Progress } from "@/components/ui/progress"
import { Check } from "lucide-react"

const statusSteps = [
  { text: "📸 Фото загружено", minProgress: 0, maxProgress: 15 },
  { text: "🧊 Холодильник найден", minProgress: 16, maxProgress: 30 },
  { text: "🔍 Сканирую содержимое...", minProgress: 31, maxProgress: 50 },
  { text: "🧠 Анализирую продукты...", minProgress: 51, maxProgress: 70 },
  { text: "✨ Подбираю рецепты...", minProgress: 71, maxProgress: 90 },
  { text: "🍳 Почти готово!", minProgress: 91, maxProgress: 100 },
]

const motivationalTexts = [
  "Нахожу лучшие рецепты для вас...",
  "Анализирую состав продуктов...",
  "Подбираю вкусные комбинации...",
]

interface LoadingScreenProps {
  isLoading: boolean
  onComplete: () => void
}

export function LoadingScreen({ isLoading, onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [motivationIndex, setMotivationIndex] = useState(0)
  const [isFadingText, setIsFadingText] = useState(false)

  // Progress bar: smoothly go 0 → 85% while isLoading, then 100% on complete
  useEffect(() => {
    if (!isLoading) return

    const expectedMs = 30000
    const tickMs = 200
    const step = 85 / (expectedMs / tickMs)

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 85) return prev
        const next = prev + step
        return next > 85 ? 85 : next
      })
    }, tickMs)

    return () => clearInterval(interval)
  }, [isLoading])

  // When loading finishes, quickly fill to 100% and call onComplete
  useEffect(() => {
    if (!isLoading) {
      setProgress((prev) => (prev < 100 ? 100 : prev))
      const timeout = setTimeout(() => {
        onComplete()
      }, 500)
      return () => clearTimeout(timeout)
    }
  }, [isLoading, onComplete])

  // Rotating motivational text every 2s
  const cycleText = useCallback(() => {
    setIsFadingText(true)
    setTimeout(() => {
      setMotivationIndex((prev) => (prev + 1) % motivationalTexts.length)
      setIsFadingText(false)
    }, 300)
  }, [])

  useEffect(() => {
    const interval = setInterval(cycleText, 2000)
    return () => clearInterval(interval)
  }, [cycleText])

  // Get step status based on current progress
  const getStepStatus = (step: typeof statusSteps[0]) => {
    const currentProgress = Math.round(progress)
    if (currentProgress >= step.maxProgress) {
      return "completed"
    } else if (currentProgress >= step.minProgress) {
      return "active"
    }
    return "pending"
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[65vh] px-6">
      <div className="w-full max-w-sm flex flex-col items-center gap-8">
        {/* Animated chef */}
        <div className="relative flex flex-col items-center gap-2">
          <div
            className="text-7xl"
            style={{ animation: "chefWobble 1.2s ease-in-out infinite" }}
            role="img"
            aria-label="Повар готовит"
          >
            {"👨‍🍳"}
          </div>
          <div className="flex gap-1.5">
            <span
              className="text-lg animate-pulse"
              style={{ animationDelay: "0s" }}
            >
              {"✨"}
            </span>
            <span
              className="text-lg animate-pulse"
              style={{ animationDelay: "0.3s" }}
            >
              {"🍳"}
            </span>
            <span
              className="text-lg animate-pulse"
              style={{ animationDelay: "0.6s" }}
            >
              {"✨"}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full flex flex-col gap-3">
          <div className="relative">
            <Progress
              value={progress}
              className="h-3 bg-muted [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-accent [&>div]:transition-all [&>div]:duration-200"
            />
            <div
              className="absolute top-0 h-3 rounded-full bg-primary/20 blur-sm transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-foreground text-center tabular-nums">
            {Math.round(progress)}%
          </span>
        </div>

        {/* Sequential status list */}
        <div className="w-full flex flex-col gap-2.5" aria-live="polite">
          {statusSteps.map((step, index) => {
            const status = getStepStatus(step)
            const isActive = status === "active"
            const isCompleted = status === "completed"

            return (
              <div
                key={step.text}
                className="flex items-center gap-3"
                style={{
                  animation: "slideUpFadeIn 0.4s ease-out both",
                }}
              >
                {/* Status indicator */}
                {isCompleted ? (
                  <span className="flex items-center justify-center size-6 rounded-full bg-green-100 flex-shrink-0">
                    <Check className="size-3.5 text-green-600" strokeWidth={3} />
                  </span>
                ) : isActive ? (
                  <span className="flex items-center justify-center size-6 flex-shrink-0">
                    <span className="size-2 rounded-full bg-accent animate-pulse" />
                  </span>
                ) : (
                  <span className="flex items-center justify-center size-6 rounded-full bg-gray-200 flex-shrink-0">
                    <span className="size-2 rounded-full bg-gray-400" />
                  </span>
                )}

                {/* Text */}
                <span
                  className={`text-sm ${
                    isCompleted
                      ? "text-green-600 font-medium"
                      : isActive
                      ? "text-foreground font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.text}
                </span>

                {/* Pulsing dots for the active item */}
                {isActive && (
                  <div className="flex gap-1 ml-auto">
                    <span className="size-1.5 rounded-full bg-accent animate-pulse" />
                    <span
                      className="size-1.5 rounded-full bg-accent animate-pulse"
                      style={{ animationDelay: "0.15s" }}
                    />
                    <span
                      className="size-1.5 rounded-full bg-accent animate-pulse"
                      style={{ animationDelay: "0.3s" }}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Rotating motivational text */}
        <p
          className={`text-sm text-muted-foreground text-center transition-all duration-300 ${
            isFadingText ? "opacity-0 translate-y-1" : "opacity-100 translate-y-0"
          }`}
        >
          {motivationalTexts[motivationIndex]}
        </p>
      </div>
    </div>
  )
}
