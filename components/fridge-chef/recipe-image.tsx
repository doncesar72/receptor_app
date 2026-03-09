"use client"

interface RecipeImageProps {
  name: string
  size?: "small" | "large"
}

function getRecipeCategory(name: string): { gradient: string; emoji: string } {
  if (!name || typeof name !== 'string') {
    return { 
      gradient: 'from-purple-400 to-purple-600', 
      emoji: '🍽️' 
    }
  }
  const n = name.toLowerCase()
  
  // Завтраки/омлет/яйца
  if (n.includes("омлет") || n.includes("яичниц") || n.includes("яйц") || n.includes("завтрак") || n.includes("скрэмбл")) {
    return { gradient: "from-orange-400 to-orange-600", emoji: "🍳" }
  }
  
  // Салаты/овощи
  if (n.includes("салат") || n.includes("овощ") || n.includes("гречк") || n.includes("свекл") || n.includes("морков")) {
    return { gradient: "from-green-400 to-green-600", emoji: "🥗" }
  }
  
  // Супы
  if (n.includes("суп") || n.includes("борщ") || n.includes("щи") || n.includes("окрошк") || n.includes("бульон")) {
    return { gradient: "from-yellow-400 to-yellow-600", emoji: "🍜" }
  }
  
  // Паста/крупы
  if (n.includes("паста") || n.includes("макарон") || n.includes("спагетти") || n.includes("рис") || n.includes("гречк") || n.includes("круп")) {
    return { gradient: "from-red-600 to-purple-800", emoji: "🍝" }
  }
  
  // Мясо
  if (n.includes("мясо") || n.includes("говядин") || n.includes("курниц") || n.includes("куриц") || n.includes("свин") || n.includes("барани")) {
    return { gradient: "from-red-700 to-red-900", emoji: "🥩" }
  }
  
  // Десерты/выпечка
  if (n.includes("десерт") || n.includes("торт") || n.includes("пирог") || n.includes("печень") || n.includes("блин") || n.includes("выпечк") || n.includes("конфи")) {
    return { gradient: "from-pink-300 to-pink-500", emoji: "🍰" }
  }
  
  // Напитки
  if (n.includes("напиток") || n.includes("сок") || n.includes("кофе") || n.includes("чай") || n.includes("смузи") || n.includes("молочн")) {
    return { gradient: "from-blue-400 to-blue-600", emoji: "🥤" }
  }
  
  // По умолчанию
  return { gradient: "from-purple-500 to-purple-700", emoji: "🍽️" }
}

export function RecipeImage({ name, size = "small" }: RecipeImageProps) {
  const { gradient, emoji } = getRecipeCategory(name)
  
  const commonClass =
    size === "large"
      ? "w-full h-full rounded-2xl"
      : "w-full h-full rounded-xl"

  return (
    <div
      className={`${commonClass} bg-gradient-to-br ${gradient} flex items-center justify-center ${
        size === "large" ? "text-6xl" : "text-4xl"
      }`}
    >
      <span role="img" aria-hidden="true">
        {emoji}
      </span>
    </div>
  )
}

