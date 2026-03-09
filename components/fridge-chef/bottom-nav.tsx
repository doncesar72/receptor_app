"use client"

import { Home, Search, BookOpen, Heart } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { icon: Home, label: "Главная", id: "home" },
  { icon: Search, label: "Поиск", id: "search" },
  { icon: BookOpen, label: "Рецепты", id: "recipes" },
  { icon: Heart, label: "Избранное", id: "favorites" },
]

interface BottomNavProps {
  active?: string
  onChange?: (id: string) => void
}

export function BottomNav({ active = "home", onChange }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-xl border-t border-border/60 z-50"
      role="navigation"
      aria-label="Основная навигация"
    >
      <div className="mx-auto max-w-md flex items-center justify-around py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {navItems.map((item) => {
          const isActive = item.id === active
          return (
            <button
              key={item.id}
              className={cn(
                "relative flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all duration-200 btn-press",
                isActive
                  ? "text-accent"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-current={isActive ? "page" : undefined}
              onClick={() => onChange?.(item.id)}
            >
              <item.icon
                className={cn(
                  "size-5 transition-transform",
                  isActive && "scale-110"
                )}
              />
              <span className="text-[10px] font-medium">{item.label}</span>
              {isActive && (
                <span className="absolute -top-0 size-1 rounded-full bg-accent" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
