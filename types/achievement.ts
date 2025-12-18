export interface Achievement {
    id: string
    title: string
    description: string
    icon: string
    unlocked: boolean
    unlockedAt?: string
    category: "productivity" | "finance" | "wellness"
    requirement: number
    progress: number
}