"use client"

import { useState, useEffect, useCallback } from "react"
import type { Reminder } from "@/types/reminder"

const DEFAULT_REMINDERS: Reminder[] = [
    { id: "1", text: "be kind.", createdAt: Date.now() },
    { id: "2", text: "be grateful.", createdAt: Date.now() },
    { id: "3", text: "be positive.", createdAt: Date.now() },
    { id: "4", text: "be yourself.", createdAt: Date.now() },
    ]

    export function useReminders() {
    const [reminders, setReminders] = useState<Reminder[]>([])
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        const stored = localStorage.getItem("reminders")
        if (stored) {
        setReminders(JSON.parse(stored))
        } else {
        setReminders(DEFAULT_REMINDERS)
        localStorage.setItem("reminders", JSON.stringify(DEFAULT_REMINDERS))
        }
        setIsLoaded(true)
    }, [])

    useEffect(() => {
        if (isLoaded) {
        localStorage.setItem("reminders", JSON.stringify(reminders))
        }
    }, [reminders, isLoaded])

    const addReminder = useCallback((text: string) => {
        if (text.trim()) {
        const reminder: Reminder = {
            id: Date.now().toString(),
            text,
            createdAt: Date.now(),
        }
        setReminders((prev) => [...prev, reminder])
        }
    }, [])

    const deleteReminder = useCallback((id: string) => {
        setReminders((prev) => prev.filter((r) => r.id !== id))
    }, [])

    const updateReminder = useCallback((id: string, text: string) => {
        if (text.trim()) {
        setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, text } : r)))
        }
    }, [])

    return { reminders, addReminder, deleteReminder, updateReminder }
}