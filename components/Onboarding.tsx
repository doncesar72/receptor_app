"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronRight } from "lucide-react"

interface OnboardingProps {
  onComplete?: () => void
}

const slides = [
  {
    emoji: "📸",
    title: "Сфотографируй продукты",
    description: "Открой холодильник и сделай фото. Мы распознаем всё что есть внутри",
    bg: "from-teal-400 to-teal-600"
  },
  {
    emoji: "🤖",
    title: "AI подберёт рецепты",
    description: "За секунды находим лучшие блюда именно из твоих продуктов",
    bg: "from-teal-500 to-emerald-600"
  },
  {
    emoji: "🎯",
    title: "Под твои цели",
    description: "Халяль, диета, набор массы — рецепты под твой образ жизни",
    bg: "from-emerald-400 to-teal-500"
  }
]

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isDone, setIsDone] = useState(false)
  const touchStartX = useRef(0)
  const timerRef = useRef<NodeJS.Timeout>()

  // Check if onboarding already completed
  useEffect(() => {
    const completed = localStorage.getItem('onboarding_complete')
    if (completed === 'true') {
      setIsDone(true)
    }
  }, [])

  // Auto-advance timer
  useEffect(() => {
    if (currentSlide < slides.length - 1) {
      timerRef.current = setTimeout(() => {
        nextSlide()
      }, 4000)
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [currentSlide])

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    } else {
      complete()
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const complete = () => {
    localStorage.setItem('onboarding_complete', 'true')
    setIsDone(true)
    onComplete?.()
  }

  const skip = () => {
    complete()
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX
    const diff = touchStartX.current - touchEndX

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe left - next slide
        nextSlide()
      } else {
        // Swipe right - previous slide
        prevSlide()
      }
    }
  }

  if (isDone) {
    return null
  }

  const currentSlideData = slides[currentSlide]

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Background with gradient */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${currentSlideData.bg} transition-all duration-700 ease-in-out`}
      />
      
      {/* Content */}
      <div 
        className="relative h-full flex flex-col justify-between p-8"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Header with progress */}
        <div className="flex items-center justify-between pt-12">
          {/* Progress bars */}
          <div className="flex gap-2 flex-1">
            {slides.map((_, index) => (
              <div
                key={index}
                className="flex-1 h-1 bg-white rounded-full overflow-hidden"
              >
                <div
                  className={`h-full bg-white transition-all duration-400 ${
                    index < currentSlide ? 'w-full' : 
                    index === currentSlide ? 'w-full animate-[progress_4s_linear_forwards]' : 
                    'w-0'
                  }`}
                />
              </div>
            ))}
          </div>
          
          {/* Skip button */}
          <button
            onClick={skip}
            className="text-white text-sm ml-4 opacity-80 hover:opacity-100 transition-opacity"
          >
            Пропустить
          </button>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          {/* Emoji with bounce animation */}
          <div className="text-9xl animate-bounce">
            {currentSlideData.emoji}
          </div>
          
          {/* Title */}
          <h2 className="text-3xl font-bold text-white mt-8 max-w-sm">
            {currentSlideData.title}
          </h2>
          
          {/* Description */}
          <p className="text-lg text-white/80 mt-4 max-w-md px-8">
            {currentSlideData.description}
          </p>
        </div>

        {/* Bottom button */}
        <div className="pb-12">
          <button
            onClick={nextSlide}
            className="w-full mx-8 bg-white text-gray-900 font-semibold py-4 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
          >
            {currentSlide === slides.length - 1 ? (
              <>
                Начать 🚀
              </>
            ) : (
              <>
                Далее
                <ChevronRight className="size-5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Custom styles for progress animation */}
      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  )
}
