export interface Recipe {
  id: string
  title: string
  emoji: string
  description: string
  time: number
  calories?: number
  nutrition?: {
    protein: number
    fat: number
    carbs: number
  }
  servings: number
  difficulty: "easy" | "medium" | "hard"
  match: number
  ingredients: { name: string; amount: string }[]
  steps: string[]
}
