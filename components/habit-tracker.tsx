"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, Check, Flame, Target } from "lucide-react"
import type { Habit } from "@/types/habit"

const HABIT_ICONS = ["💪", "📚", "💧", "🏃", "🧘", "🎨", "🎵", "🌱"]

export function HabitTracker() {
    const [habits, setHabits] = useState<Habit[]>([])
    const [newHabit, setNewHabit] = useState("")
    const [selectedIcon, setSelectedIcon] = useState("💪")
    const [isAdding, setIsAdding] = useState(false)

    useEffect(() => {
        const saved = localStorage.getItem("habits")
        if (saved) {
        setHabits(JSON.parse(saved))
        }
    }, [])

    useEffect(() => {
        localStorage.setItem("habits", JSON.stringify(habits))
    }, [habits])

    const addHabit = () => {
        if (newHabit.trim()) {
        const habit: Habit = {
            id: Date.now().toString(),
            name: newHabit,
            icon: selectedIcon,
            streak: 0,
            completedDates: [],
            color: "bg-blue-200 border-blue-300",
            createdAt: new Date().toISOString(),
        }
        setHabits([...habits, habit])
        setNewHabit("")
        setIsAdding(false)
        }
    }

    const toggleHabitToday = (id: string) => {
        const today = new Date().toISOString().split("T")[0]
        setHabits(
        habits.map((habit) => {
            if (habit.id === id) {
            const completedDates = [...habit.completedDates]
            const index = completedDates.indexOf(today)

            if (index > -1) {
                completedDates.splice(index, 1)
                return { ...habit, completedDates, streak: Math.max(0, habit.streak - 1) }
            } else {
                completedDates.push(today)
                return { ...habit, completedDates, streak: habit.streak + 1 }
            }
            }
            return habit
        }),
        )
    }

    const deleteHabit = (id: string) => {
        setHabits(habits.filter((h) => h.id !== id))
    }

    const isCompletedToday = (habit: Habit) => {
        const today = new Date().toISOString().split("T")[0]
        return habit.completedDates.includes(today)
    }

    const totalCompleted = habits.filter(isCompletedToday).length

    return (
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/40 border-2 border-blue-300 dark:border-blue-800 shadow-xl">
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-200 dark:bg-blue-900 rounded-lg">
                <Target className="h-6 w-6 text-blue-900 dark:text-blue-200" />
            </div>
            <div>
                <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100">Habit Tracker</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                {totalCompleted} of {habits.length} completed today
                </p>
            </div>
            </div>
            <Button
            onClick={() => setIsAdding(!isAdding)}
            size="sm"
            className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white rounded-lg shadow-lg"
            >
            <Plus className="h-4 w-4" />
            </Button>
        </div>

        {isAdding && (
            <div className="mb-6 p-4 bg-white dark:bg-blue-950 rounded-xl border-2 border-blue-200 dark:border-blue-800 shadow-sm space-y-4">
            <div>
                <label className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2 block">Choose an icon</label>
                <div className="flex gap-2 flex-wrap">
                {HABIT_ICONS.map((icon) => (
                    <button
                    key={icon}
                    onClick={() => setSelectedIcon(icon)}
                    className={`text-2xl p-3 rounded-lg transition-all ${
                        selectedIcon === icon
                        ? "bg-blue-200 dark:bg-blue-800 scale-110 shadow-lg ring-2 ring-blue-500"
                        : "bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900 hover:scale-105"
                    }`}
                    >
                    {icon}
                    </button>
                ))}
                </div>
            </div>
            <div className="flex gap-2">
                <Input
                placeholder="Habit name (e.g., Morning Exercise)"
                value={newHabit}
                onChange={(e) => setNewHabit(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addHabit()}
                className="border-2 border-blue-200 dark:border-blue-800 focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 rounded-lg"
                />
                <Button
                onClick={addHabit}
                className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white rounded-lg px-6"
                >
                Add
                </Button>
            </div>
            </div>
        )}

        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {habits.length === 0 ? (
            <div className="text-center py-12 px-4">
                <Target className="w-16 h-16 text-blue-300 dark:text-blue-700 mx-auto mb-4" />
                <p className="text-blue-700 dark:text-blue-300 font-medium">No habits yet</p>
                <p className="text-sm text-blue-600 dark:text-blue-400">Start building good habits today!</p>
            </div>
            ) : (
            habits.map((habit) => (
                <div
                key={habit.id}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    isCompletedToday(habit)
                    ? "bg-blue-200 dark:bg-blue-800 border-blue-400 dark:border-blue-600 shadow-lg"
                    : "bg-white dark:bg-blue-950 border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700"
                }`}
                >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                    <span className="text-3xl">{habit.icon}</span>
                    <div className="flex-1">
                        <div className="font-semibold text-blue-900 dark:text-blue-100">{habit.name}</div>
                        <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1 text-sm text-orange-600 dark:text-orange-400">
                            <Flame className="h-4 w-4" />
                            <span className="font-bold">{habit.streak}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">day streak</span>
                        </div>
                    </div>
                    </div>
                    <div className="flex gap-2">
                    <Button
                        onClick={() => toggleHabitToday(habit.id)}
                        size="sm"
                        className={
                        isCompletedToday(habit)
                            ? "bg-green-500 hover:bg-green-600 text-white shadow-lg rounded-lg"
                            : "bg-white dark:bg-blue-900 hover:bg-blue-50 dark:hover:bg-blue-800 text-blue-900 dark:text-blue-100 border-2 border-blue-200 dark:border-blue-700 rounded-lg"
                        }
                    >
                        <Check className="h-4 w-4" />
                    </Button>
                    <Button
                        onClick={() => deleteHabit(habit.id)}
                        size="sm"
                        variant="ghost"
                        className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                    </div>
                </div>
                </div>
            ))
            )}
        </div>
        </Card>
    )
}