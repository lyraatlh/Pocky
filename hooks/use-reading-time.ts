"use client"

import { useState, useEffect, useRef, useCallback } from "react"

interface ReadingSession {
    id: string
    date: string
    duration: number
    pages: number
    bookTitle: string
    completedAt: string
    pomodoroSessions: number
    }

    interface ReadingSettings {
    pomodoroLength: number // in minutes
    dailyGoal: number // pages per day
    breakDuration: number // in minutes
    theme: "blue" | "green" | "purple"
    }

    interface Achievement {
    id: string
    name: string
    description: string
    unlockedAt: string | null
    icon: string
    }

    interface ReadingTimeState {
    sessions: ReadingSession[]
    settings: ReadingSettings
    achievements: Achievement[]
    currentSession: {
    startTime: number | null
    isActive: boolean
    elapsedMinutes: number
    pomodoroCount: number
    }
    }

    const DEFAULT_STATE: ReadingTimeState = {
    sessions: [],
    settings: {
    pomodoroLength: 25,
    dailyGoal: 30,
    breakDuration: 5,
    theme: "blue",
    },
    achievements: [
    {
        id: "first_read",
        name: "First Reader",
        description: "Complete your first reading session",
        unlockedAt: null,
        icon: "📖",
    },
    { id: "streak_7", name: "Week Warrior", description: "Read for 7 consecutive days", unlockedAt: null, icon: "🔥" },
    {
        id: "pages_100",
        name: "Century Club",
        description: "Read 100+ pages in a session",
        unlockedAt: null,
        icon: "📚",
    },
    {
        id: "pomodoro_10",
        name: "Focused Reader",
        description: "Complete 10 pomodoro sessions",
        unlockedAt: null,
        icon: "🎯",
    },
    {
        id: "daily_goal",
        name: "Daily Goal Master",
        description: "Hit your daily reading goal",
        unlockedAt: null,
        icon: "⭐",
    },
    ],
    currentSession: {
    startTime: null,
    isActive: false,
    elapsedMinutes: 0,
    pomodoroCount: 0,
    },
    }

    let globalReadingState: ReadingTimeState = JSON.parse(JSON.stringify(DEFAULT_STATE))

    export function useReadingTime() {
    const [state, setState] = useState<ReadingTimeState>(JSON.parse(JSON.stringify(DEFAULT_STATE)))
    const [isLoaded, setIsLoaded] = useState(false)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
    const stored = localStorage.getItem("readingTimeState")
    if (stored) {
        try {
        const parsedState = JSON.parse(stored)
        // Ensure settings exist and have all required fields
        const mergedState = {
            ...DEFAULT_STATE,
            ...parsedState,
            settings: {
            ...DEFAULT_STATE.settings,
            ...(parsedState.settings || {}),
            },
            currentSession: {
            ...DEFAULT_STATE.currentSession,
            ...(parsedState.currentSession || {}),
            },
        }
        globalReadingState = mergedState
        setState(mergedState)
        } catch (error) {
        console.error("[v0] Failed to parse stored reading state:", error)
        setState(JSON.parse(JSON.stringify(DEFAULT_STATE)))
        }
    }
    setIsLoaded(true)
    }, [])

    useEffect(() => {
    if (isLoaded) {
        globalReadingState = state
        localStorage.setItem("readingTimeState", JSON.stringify(state))
    }
    }, [state, isLoaded])

    useEffect(() => {
    if (state.currentSession.isActive && state.currentSession.startTime) {
        intervalRef.current = setInterval(() => {
        setState((prev) => {
            const elapsed = Math.floor((Date.now() - (prev.currentSession.startTime || 0)) / 60000)
            return {
            ...prev,
            currentSession: {
                ...prev.currentSession,
                elapsedMinutes: elapsed,
                pomodoroCount: Math.floor(elapsed / (prev.settings?.pomodoroLength || 25)),
            },
            }
        })
        }, 1000)
    } else if (intervalRef.current) {
        clearInterval(intervalRef.current)
    }

    return () => {
        if (intervalRef.current) clearInterval(intervalRef.current)
    }
    }, [state.currentSession.isActive, state.currentSession.startTime])

    const startReading = useCallback(() => {
    setState((prev) => {
        const newState = {
        ...prev,
        currentSession: {
            ...prev.currentSession,
            isActive: true,
            startTime: prev.currentSession.startTime || Date.now(),
        },
        }
        globalReadingState = newState
        return newState
    })
    }, [])

    const pauseReading = useCallback(() => {
    setState((prev) => {
        const newState = {
        ...prev,
        currentSession: {
            ...prev.currentSession,
            isActive: false,
        },
        }
        globalReadingState = newState
        return newState
    })
    }, [])

    const endReadingSession = useCallback((bookTitle: string, pages: number) => {
    setState((prev) => {
        if (!prev.currentSession.startTime) return prev

        const duration = prev.currentSession.elapsedMinutes
        const newSession: ReadingSession = {
        id: Date.now().toString(),
        date: new Date().toISOString().split("T")[0],
        duration,
        pages,
        bookTitle,
        completedAt: new Date().toISOString(),
        pomodoroSessions: prev.currentSession.pomodoroCount,
        }

        const updatedAchievements = checkAchievements(prev.achievements, prev.sessions, newSession)

        const newState = {
        sessions: [...prev.sessions, newSession],
        settings: prev.settings,
        achievements: updatedAchievements,
        currentSession: {
            startTime: null,
            isActive: false,
            elapsedMinutes: 0,
            pomodoroCount: 0,
        },
        }
        globalReadingState = newState
        return newState
    })
    }, [])

    const resetSession = useCallback(() => {
    setState((prev) => {
        const newState = {
        ...prev,
        currentSession: {
            startTime: null,
            isActive: false,
            elapsedMinutes: 0,
            pomodoroCount: 0,
        },
        }
        globalReadingState = newState
        return newState
    })
    }, [])

    const deleteSession = useCallback((id: string) => {
    setState((prev) => {
        const newState = {
        ...prev,
        sessions: prev.sessions.filter((s) => s.id !== id),
        }
        globalReadingState = newState
        return newState
    })
    }, [])

    const updateSettings = useCallback((newSettings: Partial<ReadingSettings>) => {
    setState((prev) => {
        const newState = {
        ...prev,
        settings: { ...prev.settings, ...newSettings },
        }
        globalReadingState = newState
        return newState
    })
    }, [])

    const getTodaySessions = useCallback(() => {
    const today = new Date().toISOString().split("T")[0]
    return state.sessions.filter((s) => s.date === today)
    }, [state.sessions])

    const getTotalStats = useCallback(() => {
    const totalMinutes = state.sessions.reduce((sum, s) => sum + s.duration, 0)
    const totalPages = state.sessions.reduce((sum, s) => sum + s.pages, 0)
    const totalSessions = state.sessions.length
    const totalPomodoros = state.sessions.reduce((sum, s) => sum + s.pomodoroSessions, 0)

    return {
        totalMinutes,
        totalPages,
        totalSessions,
        totalPomodoros,
        averageMinutesPerSession: totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0,
        averagePagesPerSession: totalSessions > 0 ? Math.round(totalPages / totalSessions) : 0,
    }
    }, [state.sessions])

    const getReadingStreak = useCallback(() => {
    if (state.sessions.length === 0) return 0

    const sortedDates = state.sessions.map((s) => new Date(s.date).getTime()).sort((a, b) => b - a)

    let streak = 1
    for (let i = 0; i < sortedDates.length - 1; i++) {
        const dayDiff = (sortedDates[i] - sortedDates[i + 1]) / (1000 * 60 * 60 * 24)
        if (dayDiff === 1) {
        streak++
        } else {
        break
        }
    }
    return streak
    }, [state.sessions])

    const getTodayStats = useCallback(() => {
    const today = new Date().toISOString().split("T")[0]
    const todaySessions = state.sessions.filter((s) => s.date === today)
    const totalPages = todaySessions.reduce((sum, s) => sum + s.pages, 0)
    const goalMet = totalPages >= state.settings.dailyGoal
    return { totalPages, goalMet }
    }, [state.sessions, state.settings.dailyGoal])

    return {
    ...state,
    startReading,
    pauseReading,
    endReadingSession,
    resetSession,
    deleteSession,
    updateSettings,
    getTodaySessions,
    getTotalStats,
    getReadingStreak,
    getTodayStats,
    }
    }

    function checkAchievements(
    achievements: Achievement[],
    sessions: ReadingSession[],
    newSession: ReadingSession,
    ): Achievement[] {
    const updated = [...achievements]
    const stats = {
    totalSessions: sessions.length + 1,
    totalPomodoros: sessions.reduce((sum, s) => sum + s.pomodoroSessions, 0) + newSession.pomodoroSessions,
    totalPages: sessions.reduce((sum, s) => sum + s.pages, 0) + newSession.pages,
    }

    // First Read
    if (stats.totalSessions === 1) {
    const idx = updated.findIndex((a) => a.id === "first_read")
    if (idx !== -1) updated[idx].unlockedAt = new Date().toISOString()
    }

    // Pages in session
    if (newSession.pages >= 100) {
    const idx = updated.findIndex((a) => a.id === "pages_100")
    if (idx !== -1 && !updated[idx].unlockedAt) updated[idx].unlockedAt = new Date().toISOString()
    }

    // Focused reader
    if (stats.totalPomodoros >= 10) {
    const idx = updated.findIndex((a) => a.id === "pomodoro_10")
    if (idx !== -1 && !updated[idx].unlockedAt) updated[idx].unlockedAt = new Date().toISOString()
    }

    return updated
}