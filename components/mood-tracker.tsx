"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import type { MoodEntry } from "@/types/mood"
import { Calendar } from "lucide-react"

const MOODS = [
    { value: "great", emoji: "😄", label: "Amazing", color: "#a9ffc7ff", bgColor: "bg-emerald-500" },
    { value: "good", emoji: "😊", label: "Good", color: "#a7c9ffff", bgColor: "bg-blue-500" },
    { value: "okay", emoji: "😐", label: "Okay", color: "#ffdfa7ff", bgColor: "bg-orange-500" },
    { value: "bad", emoji: "😔", label: "Not Great", color: "#a7adffff", bgColor: "bg-indigo-500" },
    { value: "terrible", emoji: "😢", label: "Tough", color: "#ffa6a6ff", bgColor: "bg-red-500" },
    ] as const

    export function MoodTracker() {
    const [moods, setMoods] = useState<MoodEntry[]>([])
    const [todayMood, setTodayMood] = useState<MoodEntry | null>(null)
    const [note, setNote] = useState("")
    const [selectedMood, setSelectedMood] = useState<string | null>(null)

    useEffect(() => {
        const saved = localStorage.getItem("moods")
        if (saved) {
        const allMoods = JSON.parse(saved)
        setMoods(allMoods)

        const today = new Date().toISOString().split("T")[0]
        const todayEntry = allMoods.find((m: MoodEntry) => m.date === today)
        if (todayEntry) {
            setTodayMood(todayEntry)
            setNote(todayEntry.note || "")
            setSelectedMood(todayEntry.mood)
        }
        }
    }, [])

    const saveMood = () => {
        if (!selectedMood) return

        const today = new Date().toISOString().split("T")[0]
        const mood = MOODS.find((m) => m.value === selectedMood)

        const entry: MoodEntry = {
        id: Date.now().toString(),
        date: today,
        mood: selectedMood as MoodEntry["mood"],
        note: note,
        color: mood?.bgColor || "bg-gray-500",
        }

        const updatedMoods = moods.filter((m) => m.date !== today)
        updatedMoods.push(entry)
        setMoods(updatedMoods)
        setTodayMood(entry)
        localStorage.setItem("moods", JSON.stringify(updatedMoods))
    }

    const recentMoods = moods.slice(-30).reverse()

    const moodCounts = moods.reduce(
        (acc, entry) => {
        acc[entry.mood] = (acc[entry.mood] || 0) + 1
        return acc
        },
        {} as Record<string, number>,
    )

    const totalEntries = moods.length
    const dominantMood = totalEntries > 0 ? Object.entries(moodCounts).sort(([, a], [, b]) => b - a)[0]?.[0] : null

    return (
        <Card className="p-6 bg-gradient-to-br from-blue-100 via-indigo-100 to-indigo-50 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-pink-950/30 border-2 border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between mb-6">
            <div>
            <h3 className="text-2xl font-bold text-blue-900 mb-1">Mood Tracker</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {totalEntries} {totalEntries === 1 ? "entry" : "entries"} logged
            </p>
            </div>
            {dominantMood && totalEntries > 3 && (
            <div className="text-right">
                <p className="text-xs text-muted-foreground mb-1">Most common</p>
                <div className="flex items-center gap-2">
                <span className="text-2xl">{MOODS.find((m) => m.value === dominantMood)?.emoji}</span>
                <span className="text-sm font-medium">{MOODS.find((m) => m.value === dominantMood)?.label}</span>
                </div>
            </div>
            )}
        </div>

        <div className="space-y-4">
            <div>
            <p className="text-sm font-medium text-muted-foreground mb-4">How are you feeling today?</p>
            <div className="grid grid-cols-5 gap-3">
                {MOODS.map((mood) => (
                <button
                    key={mood.value}
                    onClick={() => setSelectedMood(mood.value)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-400 ${
                    selectedMood === mood.value
                        ? "bg-white dark:bg-blue-800 shadow-xl ring-offset-2 scale-110"
                        : "bg-white/60 dark:bg-blue-800/60 hover:bg-white dark:hover:bg-gray-800 hover:shadow-lg hover:scale-105"
                    }`}
                    style={{
                    "--ring-color": selectedMood === mood.value ? mood.color : "transparent",
                    } as React.CSSProperties}
                >
                    <span className="text-4xl">{mood.emoji}</span>
                    <span className="text-xs font-semibold text-center">{mood.label}</span>
                </button>
                ))}
            </div>
            </div>

            <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground">Add a note about your day (optional)</label>
            <Textarea
                placeholder="What made you feel this way? any thoughts to remember.."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="resize-none border-blue-200 dark:border-blue-200 bg-white dark:bg-blue-900 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-200 rounded-xl"
                rows={3}
            />
            <Button
                onClick={saveMood}
                disabled={!selectedMood}
                className="w-full bg-gradient-to-r from-indigo-200 to-blue-200 hover:from-blue-300 to-indigo-300 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {todayMood ? "Update Mood" : "Save Mood"}
            </Button>
            </div>

            {recentMoods.length > 0 && (
            <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">Mood history (last 30 days)</p>
                <div className="bg-white/50 dark:bg-gray-900/50 p-4 rounded-xl space-y-2">
                <div className="grid grid-cols-10 gap-1.5">
                    {recentMoods.map((entry, index) => {
                    const mood = MOODS.find((m) => m.value === entry.mood)
                    const isToday = entry.date === new Date().toISOString().split("T")[0]
                    return (
                        <div
                        key={entry.id}
                        className="group relative"
                        title={`${entry.date}: ${mood?.label}${entry.note ? ` - ${entry.note}` : ""}`}
                        >
                        <div
                            className={`aspect-square rounded-lg transition-all duration-200 hover:scale-125 hover:z-10 ${
                            isToday ? "ring-2 ring-primary ring-offset-2" : ""
                            }`}
                            style={{
                            backgroundColor: mood?.color,
                            }}
                        />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                            {mood?.emoji} {mood?.label}
                            <br />
                            {new Date(entry.date).toLocaleDateString()}
                        </div>
                        </div>
                    )
                    })}
                </div>

                <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                    {MOODS.map((mood) => (
                    <div key={mood.value} className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: mood.color }} />
                        <span className="text-xs text-muted-foreground">{mood.label}</span>
                    </div>
                    ))}
                </div>
                </div>
            </div>
            )}
        </div>
        </Card>
    )
}