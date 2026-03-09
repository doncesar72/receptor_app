"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, ChevronLeft, ChevronRight, Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface UserProfile {
  goal: 'loss' | 'maintain' | 'gain'
  diet: 'none' | 'halal' | 'vegetarian' | 'vegan' | 'glutenfree'
  allergies: string[]
  calories: number
  portions: number
}

const defaultProfile: UserProfile = {
  goal: 'maintain',
  diet: 'none',
  allergies: [],
  calories: 2000,
  portions: 2
}

const goalOptions = [
  {
    id: 'loss' as const,
    icon: '🏃',
    title: 'Похудение',
    description: 'Рецепты с низкой калорийностью'
  },
  {
    id: 'maintain' as const,
    icon: '⚖️',
    title: 'Поддержание веса',
    description: 'Сбалансированные блюда'
  },
  {
    id: 'gain' as const,
    icon: '💪',
    title: 'Набор массы',
    description: 'Высококалорийные и белковые блюда'
  }
]

const dietOptions = [
  {
    id: 'none' as const,
    icon: '🍽️',
    title: 'Обычное',
    description: 'Без ограничений'
  },
  {
    id: 'halal' as const,
    icon: '☪️',
    title: 'Халяль',
    description: 'Без свинины и алкоголя'
  },
  {
    id: 'vegetarian' as const,
    icon: '🥗',
    title: 'Вегетарианство',
    description: 'Без мяса и рыбы'
  },
  {
    id: 'vegan' as const,
    icon: '🌱',
    title: 'Веганство',
    description: 'Без животных продуктов'
  },
  {
    id: 'glutenfree' as const,
    icon: '🌾',
    title: 'Без глютена',
    description: 'Без пшеницы и ржи'
  }
]

const allergyOptions = [
  { id: 'nuts', label: '🥜 Орехи' },
  { id: 'dairy', label: '🥛 Молочные продукты' },
  { id: 'eggs', label: '🥚 Яйца' },
  { id: 'fish', label: '🐟 Рыба' },
  { id: 'seafood', label: '🦐 Морепродукты' },
  { id: 'gluten', label: '🌾 Глютен' }
]

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile>(defaultProfile)

  useEffect(() => {
    const savedProfile = localStorage.getItem('user_profile')
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile))
      } catch (error) {
        console.error('Failed to parse saved profile:', error)
      }
    }
  }, [])

  const saveProfile = () => {
    localStorage.setItem('user_profile', JSON.stringify(profile))
    toast.success('Профиль сохранён! ✅')
    router.push('/')
  }

  const getCalorieHint = (calories: number) => {
    if (calories < 1800) return 'Для похудения'
    if (calories <= 2500) return 'Норма'
    return 'Для набора массы'
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-5" />
            <span>Назад</span>
          </button>
          <h1 className="text-lg font-semibold">Мой профиль</h1>
          <div className="w-16" />
        </div>
      </div>

      <div className="p-4 pb-24">
        {/* Goal Section */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4">Цель питания</h2>
          <div className="space-y-3">
            {goalOptions.map((option) => (
              <div
                key={option.id}
                onClick={() => setProfile(prev => ({ ...prev, goal: option.id }))}
                className={`
                  flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all
                  ${profile.goal === option.id 
                    ? 'border-accent bg-accent/5' 
                    : 'border-muted bg-card hover:border-muted-foreground/20'
                  }
                `}
              >
                <div className="text-2xl">{option.icon}</div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{option.title}</p>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
                {profile.goal === option.id && (
                  <div className="size-6 rounded-full bg-accent flex items-center justify-center">
                    <Check className="size-4 text-accent-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Diet Section */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4">Тип питания</h2>
          <div className="space-y-3">
            {dietOptions.map((option) => (
              <div
                key={option.id}
                onClick={() => setProfile(prev => ({ ...prev, diet: option.id }))}
                className={`
                  flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all
                  ${profile.diet === option.id 
                    ? 'border-accent bg-accent/5' 
                    : 'border-muted bg-card hover:border-muted-foreground/20'
                  }
                `}
              >
                <div className="text-2xl">{option.icon}</div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{option.title}</p>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
                {profile.diet === option.id && (
                  <div className="size-6 rounded-full bg-accent flex items-center justify-center">
                    <Check className="size-4 text-accent-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Allergies Section */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4">Аллергии</h2>
          <div className="flex flex-wrap gap-2">
            {allergyOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  setProfile(prev => ({
                    ...prev,
                    allergies: prev.allergies.includes(option.id)
                      ? prev.allergies.filter(a => a !== option.id)
                      : [...prev.allergies, option.id]
                  }))
                }}
                className={`
                  px-4 py-2 rounded-full border-2 transition-all
                  ${profile.allergies.includes(option.id)
                    ? 'border-accent bg-accent text-accent-foreground'
                    : 'border-muted bg-card text-foreground hover:border-muted-foreground/20'
                  }
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
        </section>

        {/* Calories Section */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4">Дневная норма калорий</h2>
          <div className="text-center mb-4">
            <p className="text-4xl font-bold text-accent">{profile.calories}</p>
            <p className="text-sm text-muted-foreground">{getCalorieHint(profile.calories)}</p>
          </div>
          <input
            type="range"
            min="1200"
            max="4000"
            step="100"
            value={profile.calories}
            onChange={(e) => setProfile(prev => ({ ...prev, calories: parseInt(e.target.value) }))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-accent"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>1200</span>
            <span>4000</span>
          </div>
        </section>

        {/* Portions Section */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4">Количество порций</h2>
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={() => setProfile(prev => ({ ...prev, portions: Math.max(1, prev.portions - 1) }))}
              className="size-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
            >
              <ChevronLeft className="size-5" />
            </button>
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">{profile.portions}</p>
              <p className="text-sm text-muted-foreground">человек</p>
            </div>
            <button
              onClick={() => setProfile(prev => ({ ...prev, portions: Math.min(10, prev.portions + 1) }))}
              className="size-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </section>
      </div>

      {/* Save Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm border-t">
        <button
          onClick={saveProfile}
          className="w-full h-12 rounded-xl bg-accent text-accent-foreground font-semibold hover:bg-accent/90 transition-colors"
        >
          Сохранить профиль
        </button>
      </div>
    </div>
  )
}
