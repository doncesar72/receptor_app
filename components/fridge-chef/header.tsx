"use client"

import { Refrigerator } from "lucide-react"

export function Header() {
  return (
    <header className="flex items-center justify-between py-4 px-1">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-xl bg-primary flex items-center justify-center">
          <Refrigerator className="size-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground tracking-tight font-mono">
            РЕЦЕПТОР
          </h1>
          <p className="text-[11px] text-muted-foreground -mt-0.5">
            Рецепты из того, что есть
          </p>
        </div>
      </div>
      <div className="size-9 rounded-full bg-muted flex items-center justify-center text-lg" role="img" aria-label="Аватар пользователя">
        👨‍🍳
      </div>
    </header>
  )
}
