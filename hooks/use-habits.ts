"use client"

import { useState, useEffect, useCallback } from "react"
import type { Habit } from "@/types/habit"

export function useHabits() {
    const [habits, setHabits] = useState<Habit[]>([])
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        const stored = localStorage.getItem("habits")
        if (stored) {
        setHabits(JSON.parse(stored))
        }
        setIsLoaded(true)
    }, [])

    useEffect(() => {
        if (isLoaded) {
        localStorage.setItem("habits", JSON.stringify(habits))
        }
    }, [habits, isLoaded])

    const addHabit = useCallback((habit: Omit<Habit, "id">) => {
        const newHabit: Habit = {
        ...habit,
        id: Date.now().toString(),
        }
        setHabits((prev) => [...prev, newHabit])
        return newHabit
    }, [])

    const updateHabit = useCallback((id: string, updates: Partial<Habit>) => {
        setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, ...updates } : h)))
    }, [])

    const deleteHabit = useCallback((id: string) => {
        setHabits((prev) => prev.filter((h) => h.id !== id))
    }, [])

    const toggleHabitToday = useCallback((id: string) => {
        const today = new Date().toISOString().split("T")[0]
        setHabits((prev) =>
        prev.map((habit) => {
            if (habit.id === id) {
            const completedDates = [...habit.completedDates]
            const index = completedDates.indexOf(today)

            if (index > -1) {
                completedDates.splice(index, 1)
                return {
                ...habit,
                completedDates,
                streak: Math.max(0, habit.streak - 1),
                }
            } else {
                completedDates.push(today)
                return { ...habit, completedDates, streak: habit.streak + 1 }
            }
            }
            return habit
        }),
        )
    }, [])

    return { habits, addHabit, updateHabit, deleteHabit, toggleHabitToday }
}