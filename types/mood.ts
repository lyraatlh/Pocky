export interface MoodEntry {
    id: string
    date: string
    mood: string // Changed from union type to string to support custom moods
    moodLabel: string // Added label for custom moods
    note?: string
    color: string
    icon?: string // Added icon field for custom emoji/image/gif
    iconType?: "emoji" | "url" | "upload" // Added icon type tracking
}

export interface MoodPreset {
    value: string
    emoji: string
    label: string
    color: string
    bgColor: string
}