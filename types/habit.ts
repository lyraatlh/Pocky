export interface Habit {
    id: string
    name: string
    icon: string
    streak: number
    completedDates: string[]
    color: string
    createdAt: string
    customIconUrl?: string
    description?: string
    category?: string
    goal?: number
}