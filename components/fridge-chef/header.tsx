"use client"

interface HeaderProps {
  onProfileClick?: () => void
}

export function Header({ onProfileClick }: HeaderProps) {
  return (
    <header 
      className="flex items-center justify-between px-1"
      style={{ 
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 16px)',
        paddingBottom: '16px'
      }}
    >
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-xl bg-primary flex items-center justify-center">
          <span className="text-lg">❄</span>
        </div>
        <div>
          <h1 className="text-base font-bold text-foreground tracking-tight font-mono">
            РЕЦЕПТОР
          </h1>
          <p className="text-[11px] text-muted-foreground -mt-0.5">
            Рецепты из того, что есть
          </p>
        </div>
      </div>
      <button
        onClick={onProfileClick}
        className="size-9 rounded-full bg-muted flex items-center justify-center text-lg hover:bg-muted/80 transition-colors"
        aria-label="Профиль"
      >
        �
      </button>
    </header>
  )
}
