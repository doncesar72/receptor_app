"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronRight } from "lucide-react"

interface OnboardingProps {
  onComplete?: () => void
}

const slides = [
  {
    image: "/onboarding/slide1.png",
    bg: "from-teal-500/80 to-teal-700/80",
    title: "Сфотографируй продукты",
    description: "Открой холодильник и сделай фото. Мы распознаем всё что есть внутри"
  },
  {
    image: "/onboarding/slide2.png",
    bg: "from-teal-500/60 to-emerald-700/60",
    title: "AI подберёт рецепты",
    description: "За секунды находим лучшие блюда именно из твоих продуктов"
  },
  {
    image: "/onboarding/slide3.png",
    bg: "from-teal-600/70 to-teal-800/70",
    title: "Под твои цели",
    description: "Халяль, диета, набор массы — рецепты под твой образ жизни"
  }
]

export function Onboarding({ onComplete }: OnboardingProps) {
  const [current, setCurrent] = useState(0)
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
    timerRef.current = setTimeout(() => {
      nextSlide()
    }, 4000)

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [current])

  const nextSlide = () => {
    if (current < 2) {
      setCurrent(current + 1)
    } else {
      complete()
    }
  }

  const prevSlide = () => {
    if (current > 0) {
      setCurrent(current - 1)
    }
  }

  const complete = () => {
    localStorage.setItem('onboarding_complete', 'true')
    setIsDone(true)
    onComplete?.()
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

  return (
    <div className="fixed inset-0 z-50" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      {/* Фоновая картинка */}
      <img 
        src={slides[current].image}
        className="absolute inset-0 w-full h-full object-cover"
        alt="Onboarding slide"
      />
      
      {/* Тёмный градиент поверх картинки снизу */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Прогресс бары сверху */}
      <div 
        className="absolute left-4 right-4 flex gap-1.5 z-10 top-14"
        style={{ paddingTop: 'env(safe-area-inset-top, 16px)' }}
      >
        {slides.map((_, i) => (
          <div key={i} className="h-1 flex-1 rounded-full bg-white/30 overflow-hidden">
            <div 
              className={`h-full rounded-full bg-white transition-all duration-100 ${
                i < current ? 'w-full' : 
                i === current ? 'animate-progress' : 'w-0'
              }`}
              style={i === current ? {
                animation: 'progress 4s linear forwards'
              } : {}}
            />
          </div>
        ))}
      </div>

      {/* Кнопка пропустить */}
      <button 
        onClick={complete}
        className="absolute top-16 right-4 z-10 text-white/80 text-sm font-medium"
        style={{ paddingTop: 'env(safe-area-inset-top, 16px)' }}
      >
        Пропустить
      </button>

      {/* Текст снизу */}
      <div 
        className="absolute left-0 right-0 p-6 z-10"
        style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 80px)' }}
      >
        <h2 className="text-3xl font-bold text-white mb-3">
          {slides[current].title}
        </h2>
        <p className="text-white/80 text-lg mb-6 leading-relaxed">
          {slides[current].description}
        </p>
        
        {current < 2 ? (
          <button
            onClick={nextSlide}
            className="w-full py-4 bg-white text-teal-600 font-bold text-lg rounded-2xl shadow-lg"
          >
            Далее →
          </button>
        ) : (
          <button
            onClick={complete}
            className="w-full py-4 bg-white text-teal-600 font-bold text-lg rounded-2xl shadow-lg"
          >
            Начать 🚀
          </button>
        )}
      </div>

      {/* Невидимые зоны для тапа влево/вправо */}
      <div 
        className="absolute left-0 top-0 w-1/2 h-full z-20"
        onClick={() => current > 0 && setCurrent(current - 1)}
      />
      <div 
        className="absolute right-0 top-0 w-1/2 h-full z-20"
        onClick={nextSlide}
      />

      {/* Custom styles */}
      <style jsx>{`
        @keyframes progress {
          from { width: 0% }
          to { width: 100% }
        }
      `}</style>
    </div>
  )
}
