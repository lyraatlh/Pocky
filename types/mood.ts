export interface MoodEntry {
    id: string
    date: string
    mood: "great" | "good" | "okay" | "bad" | "terrible"
    note?: string
    color: string
}