"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ProductManagerProps {
  initialProducts: string[]
  onProductsChange?: (products: string[]) => void
}

const quickTags = [
  { emoji: "\u{1F9C2}", label: "\u0421\u043E\u043B\u044C" },
  { emoji: "\u{1F33E}", label: "\u041C\u0443\u043A\u0430" },
  { emoji: "\u{1F9C4}", label: "\u0427\u0435\u0441\u043D\u043E\u043A" },
  { emoji: "\u{1FAD5}", label: "\u041C\u0430\u0441\u043B\u043E" },
  { emoji: "\u{1F36C}", label: "\u0421\u0430\u0445\u0430\u0440" },
  { emoji: "\u{1F336}\uFE0F", label: "\u0421\u043F\u0435\u0446\u0438\u0438" },
]

function getProductEmoji(product: string): string {
  const p = product.toLowerCase()
  if (p.includes("перец")) return "🫑"
  if (p.includes("свекл")) return "🫚"
  if (p.includes("гриб")) return "🍄"
  if (p.includes("горох") || p.includes("фасол")) return "🫘"
  if (p.includes("кукуруз")) return "🌽"
  if (p.includes("баклажан")) return "🍆"
  if (p.includes("кабачок")) return "🥒"
  if (p.includes("тыкв")) return "🎃"
  if (p.includes("шпинат") || p.includes("сельдерей")) return "🥬"
  if (p.includes("редис")) return "🌶️"
  if (p.includes("ананас")) return "🍍"
  if (p.includes("манго")) return "🥭"
  if (p.includes("клубник")) return "🍓"
  if (p.includes("виноград")) return "🍇"
  if (p.includes("лимон")) return "🍋"
  if (p.includes("апельсин")) return "🍊"
  if (p.includes("колбас") || p.includes("сосиск")) return "🌭"
  if (p.includes("бекон")) return "🥓"
  if (p.includes("ветчин")) return "🍖"
  if (p.includes("креветк")) return "🦐"
  if (p.includes("тунец") || p.includes("лосос")) return "🐟"
  if (p.includes("мука") || p.includes("гречк") || p.includes("овсянк") || p.includes("хлопь")) return "🌾"
  if (p.includes("сахар")) return "🍬"
  if (p.includes("соль")) return "🧂"
  if (p.includes("мёд") || p.includes("мед") || p.includes("варень")) return "🍯"
  if (p.includes("шоколад")) return "🍫"
  if (p.includes("кофе")) return "☕"
  if (p.includes("чай")) return "🍵"
  if (p.includes("сок")) return "🧃"
  if (p.includes("вода")) return "💧"
  if (p.includes("пиво")) return "🍺"
  if (p.includes("вино")) return "🍷"
  if (p.includes("укроп") || p.includes("петрушк") || p.includes("базилик")) return "🌿"
  if (p.includes("орех") || p.includes("миндал")) return "🥜"
  if (p.includes("йогурт") || p.includes("кефир") || p.includes("ряженк")) return "🥛"
  if (p.includes("мороженое")) return "🍦"
  if (p.includes("майонез") || p.includes("горчиц") || p.includes("уксус")) return "🫙"
  if (p.includes("кетчуп")) return "🍅"
  if (p.includes("масло растительн") || p.includes("подсолнечн")) return "🫙"
  if (p.includes("оливков")) return "🫒"
  if (p.includes("макарон") || p.includes("спагетти") || p.includes("лапш") || p.includes("паста")) return "🍝"
  if (p.includes("батон") || p.includes("булочк")) return "🥐"
  if (p.includes("торт")) return "🎂"
  if (p.includes("печенья") || p.includes("печеньк")) return "🍪"
  if (p.includes("печень") && !p.includes("печенья") && !p.includes("печеньк")) return "🥩"
  if (p.includes("яйц")) return "🥚"
  if (p.includes("молок") || p.includes("сливк")) return "🥛"
  if (p.includes("масл")) return "🧈"
  if (p.includes("сыр")) return "🧀"
  if (p.includes("творог")) return "🫙"
  if (p.includes("сметан")) return "🍶"
  if (p.includes("морков")) return "🥕"
  if (p.includes("капуст")) return "🥬"
  if (p.includes("помидор") || p.includes("томат")) return "🍅"
  if (p.includes("огурц")) return "🥒"
  if (p.includes("лук")) return "🧅"
  if (p.includes("чеснок")) return "🧄"
  if (p.includes("курниц") || p.includes("курица")) return "🍗"
  if (p.includes("мясо") || p.includes("говядин")) return "🥩"
  if (p.includes("рыб")) return "🐟"
  if (p.includes("хлеб")) return "🍞"
  if (p.includes("рис")) return "🍚"
  if (p.includes("картофел") || p.includes("картошк")) return "🥔"
  if (p.includes("яблок")) return "🍎"
  if (p.includes("банан")) return "🍌"
  return "🥫"
}

export function ProductManager({ initialProducts, onProductsChange }: ProductManagerProps) {
  const [products, setProducts] = useState<string[]>(initialProducts)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isSearchOpen])

  const removeProduct = (product: string) => {
    setProducts((prev) => {
      const next = prev.filter((p) => p !== product)
      setTimeout(() => onProductsChange?.(next), 0)
      return next
    })
  }

  const addProduct = (product: string) => {
    if (!products.includes(product)) {
      setError(null)
      setProducts((prev) => {
        const next = [...prev, product]
        setTimeout(() => onProductsChange?.(next), 0)
        return next
      })
    }
  }

  const handleSearchSubmit = () => {
    const trimmed = searchValue.trim()
    if (!trimmed) return
    if (!products.includes(trimmed)) {
      setProducts((prev) => {
        const next = [...prev, trimmed]
        setTimeout(() => onProductsChange?.(next), 0)
        return next
      })
      setError(null)
      setSearchValue("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSearchSubmit()
    }
  }

  const getTagLabel = (tag: typeof quickTags[number]) => `${tag.emoji} ${tag.label}`

  const handleTagClick = (tag: typeof quickTags[number]) => {
    const fullLabel = getTagLabel(tag)
    if (products.some((p) => p === fullLabel)) {
      removeProduct(fullLabel)
    } else {
      addProduct(fullLabel)
    }
  }

  const isTagActive = (tag: typeof quickTags[number]) => {
    const fullLabel = getTagLabel(tag)
    return products.includes(fullLabel)
  }

  return (
    <section className="flex flex-col gap-3 animate-in fade-in duration-300">
      <h3 className="text-sm font-medium text-muted-foreground px-1">
        {"\u0420\u0430\u0441\u043F\u043E\u0437\u043D\u0430\u043D\u043D\u044B\u0435 \u043F\u0440\u043E\u0434\u0443\u043A\u0442\u044B"}
      </h3>

      {/* Product tags with remove buttons */}
      <div className="flex flex-wrap gap-2">
        {products.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="group inline-flex items-center gap-1.5 bg-card border border-border/60 text-foreground text-xs font-medium pl-3 pr-1.5 py-1.5 rounded-full transition-all duration-200 hover:border-destructive/40"
            style={{
              animation: `bounceIn 0.4s ease-out ${index * 40}ms both`,
            }}
          >
            <span className="flex items-center gap-1">
              <span role="img" aria-hidden="true">
                {getProductEmoji(item)}
              </span>
              {item}
            </span>
            <button
              onClick={() => removeProduct(item)}
              className="inline-flex items-center justify-center size-5 rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
              aria-label={`\u0423\u0434\u0430\u043B\u0438\u0442\u044C ${item}`}
            >
              <span className="text-xs">✕</span>
            </button>
          </span>
        ))}
      </div>

      {error && (
        <p className="text-xs text-destructive px-1">
          {error}
        </p>
      )}

      {/* Add products button */}
      {!isSearchOpen && (
        <Button
          onClick={() => setIsSearchOpen(true)}
          className="w-full h-11 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-sm shadow-md shadow-accent/15 transition-all duration-200 animate-in fade-in duration-200 btn-press"
        >
          <span className="text-base">➕</span>
          {"\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043F\u0440\u043E\u0434\u0443\u043A\u0442\u044B"}
        </Button>
      )}

      {/* Search panel */}
      {isSearchOpen && (
        <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          {/* Search input */}
          <div className="relative">
            <Input
              ref={inputRef}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={"\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043F\u0440\u043E\u0434\u0443\u043A\u0442..."}
              className="h-11 rounded-xl border-border/60 bg-card pl-4 pr-12 text-sm placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:ring-primary/20"
            />
            <button
              onClick={handleSearchSubmit}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex items-center justify-center size-8 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              aria-label={"\u041F\u043E\u0438\u0441\u043A"}
            >
              <span className="text-base">🔍</span>
            </button>
          </div>

          {/* Quick tags */}
          <div className="flex flex-wrap gap-2">
            {quickTags.map((tag) => {
              const active = isTagActive(tag)
              return (
                <button
                  key={tag.label}
                  onClick={() => handleTagClick(tag)}
                  className={`inline-flex items-center gap-1 text-xs font-medium px-3 py-2 rounded-full transition-all duration-200 ${
                    active
                      ? "bg-primary/15 text-primary border border-primary/30"
                      : "bg-muted/60 text-foreground border border-transparent hover:bg-muted"
                  }`}
                  aria-pressed={active}
                >
                  {getTagLabel(tag)}
                </button>
              )
            })}
          </div>

          {/* Close search */}
          <button
            onClick={() => {
              setIsSearchOpen(false)
              setSearchValue("")
            }}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors self-center py-1"
          >
            {"\u0421\u043A\u0440\u044B\u0442\u044C \u043F\u043E\u0438\u0441\u043A"}
          </button>
        </div>
      )}
    </section>
  )
}
