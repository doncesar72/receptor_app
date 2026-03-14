"use client"

interface HeaderProps {
  onProfileClick?: () => void
}

export function Header({ onProfileClick }: HeaderProps) {
  return (
    <header 
      className="flex items-center justify-between px-1"
      style={{ 
        paddingTop: 'max(60px, calc(env(safe-area-inset-top, 0px) + 16px))',
        paddingBottom: '16px'
      }}
    >
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-xl bg-primary flex items-center justify-center">
          <img 
            src="/header-icon.svg" 
            alt="РЕЦЕПТОР" 
            className="w-full h-full"
          />
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
        className="size-9 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
        aria-label="Профиль"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      </button>
    </header>
  )
}
