"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Trophy, Award, Target } from "lucide-react"
import type { Achievement } from "@/types/achievement"

interface AchievementStats {
    transactions: number
    habits: number
    moods: number
    journals: number
    todos: number
    pomodoros: number
    }

    export function AchievementBadge() {
    const [achievements, setAchievements] = useState<Achievement[]>([])
    const [showNotification, setShowNotification] = useState(false)
    const [newAchievement, setNewAchievement] = useState<Achievement | null>(null)

    const achievementTemplates: Achievement[] = [
        {
        id: "first-transaction",
        title: "First Step",
        description: "Add your first transaction",
        icon: "💰",
        unlocked: false,
        category: "finance",
        requirement: 1,
        progress: 0,
        },
        {
        id: "budget-master",
        title: "Budget Master",
        description: "Create 5 budget categories",
        icon: "📊",
        unlocked: false,
        category: "finance",
        requirement: 5,
        progress: 0,
        },
        {
        id: "habit-builder",
        title: "Habit Builder",
        description: "Complete 7 day streak on any habit",
        icon: "🔥",
        unlocked: false,
        category: "productivity",
        requirement: 7,
        progress: 0,
        },
        {
        id: "journal-keeper",
        title: "Journal Keeper",
        description: "Write 10 journal entries",
        icon: "📖",
        unlocked: false,
        category: "wellness",
        requirement: 10,
        progress: 0,
        },
        {
        id: "task-master",
        title: "Task Master",
        description: "Complete 20 todos",
        icon: "✅",
        unlocked: false,
        category: "productivity",
        requirement: 20,
        progress: 0,
        },
        {
        id: "focused-mind",
        title: "Focused Mind",
        description: "Complete 5 Pomodoro sessions",
        icon: "🎯",
        unlocked: false,
        category: "productivity",
        requirement: 5,
        progress: 0,
        },
        {
        id: "mood-tracker",
        title: "Mood Tracker",
        description: "Log your mood for 7 consecutive days",
        icon: "😊",
        unlocked: false,
        category: "wellness",
        requirement: 7,
        progress: 0,
        },
        {
        id: "savings-hero",
        title: "Savings Hero",
        description: "Reach positive balance of Rp 1,000,000",
        icon: "💎",
        unlocked: false,
        category: "finance",
        requirement: 1000000,
        progress: 0,
        },
    ]

    useEffect(() => {
        const saved = localStorage.getItem("achievements")
        if (saved) {
        setAchievements(JSON.parse(saved))
        } else {
        setAchievements(achievementTemplates)
        }
    }, [])

    useEffect(() => {
        const checkAchievements = () => {
        const stats = getStats()
        const updatedAchievements = [...achievements]
        let hasNewAchievement = false

        updatedAchievements.forEach((achievement) => {
            if (!achievement.unlocked) {
            let currentProgress = 0

            switch (achievement.id) {
                case "first-transaction":
                currentProgress = stats.transactions
                break
                case "budget-master":
                const budgets = JSON.parse(localStorage.getItem("budgets") || "[]")
                currentProgress = budgets.length
                break
                case "habit-builder":
                const habits = JSON.parse(localStorage.getItem("habits") || "[]")
                const maxStreak = Math.max(...habits.map((h: { streak: number }) => h.streak), 0)
                currentProgress = maxStreak
                break
                case "journal-keeper":
                currentProgress = stats.journals
                break
                case "task-master":
                const todos = JSON.parse(localStorage.getItem("todos") || "[]")
                currentProgress = todos.filter((t: { completed: boolean }) => t.completed).length
                break
                case "focused-mind":
                currentProgress = stats.pomodoros
                break
                case "mood-tracker":
                const moods = JSON.parse(localStorage.getItem("moods") || "[]")
                currentProgress = moods.length
                break
                case "savings-hero":
                const transactions = JSON.parse(localStorage.getItem("transactions") || "[]")
                const income = transactions
                    .filter((t: { type: string }) => t.type === "income")
                    .reduce((sum: number, t: { amount: number }) => sum + t.amount, 0)
                const expense = transactions
                    .filter((t: { type: string }) => t.type === "expense")
                    .reduce((sum: number, t: { amount: number }) => sum + t.amount, 0)
                currentProgress = income - expense
                break
            }

            achievement.progress = currentProgress

            if (currentProgress >= achievement.requirement) {
                achievement.unlocked = true
                achievement.unlockedAt = new Date().toISOString()
                hasNewAchievement = true
                setNewAchievement(achievement)
                setShowNotification(true)
                setTimeout(() => setShowNotification(false), 5000)
            }
            }
        })

        if (hasNewAchievement) {
            setAchievements(updatedAchievements)
            localStorage.setItem("achievements", JSON.stringify(updatedAchievements))
        }
        }

        checkAchievements()
    }, [achievements])

    const getStats = (): AchievementStats => {
        return {
        transactions: JSON.parse(localStorage.getItem("transactions") || "[]").length,
        habits: JSON.parse(localStorage.getItem("habits") || "[]").length,
        moods: JSON.parse(localStorage.getItem("moods") || "[]").length,
        journals: JSON.parse(localStorage.getItem("journal") || "[]").length,
        todos: JSON.parse(localStorage.getItem("todos") || "[]").length,
        pomodoros: 0,
        }
    }

    const unlockedCount = achievements.filter((a) => a.unlocked).length
    const progressPercentage = (unlockedCount / achievements.length) * 100

    const getCategoryColor = (category: Achievement["category"]) => {
        switch (category) {
        case "productivity":
            return "bg-blue-100 dark:bg-blue-900/50 border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-100"
        case "finance":
            return "bg-blue-200 dark:bg-blue-800/50 border-blue-400 dark:border-blue-600 text-blue-900 dark:text-blue-100"
        case "wellness":
            return "bg-blue-300 dark:bg-blue-700/50 border-blue-500 dark:border-blue-500 text-blue-900 dark:text-blue-100"
        }
    }

    return (
        <>
        {showNotification && newAchievement && (
            <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-right">
            <Card className="p-4 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800">
                <div className="flex items-center gap-3">
                <div className="text-4xl">{newAchievement.icon}</div>
                <div>
                    <div className="font-bold text-blue-900 dark:text-blue-100">Achievement Unlocked!</div>
                    <div className="text-sm text-blue-900 dark:text-blue-200">{newAchievement.title}</div>
                </div>
                <Trophy className="h-6 w-6 text-blue-900 dark:text-blue-900" />
                </div>
            </Card>
            </div>
        )}

        <Card className="p-6 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-950/30 dark:to-blue-900/40 border-2 border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-200 dark:bg-blue-900 rounded-lg">
                <Trophy className="h-6 w-6 text-blue-900 dark:text-blue-200" />
                </div>
                <div>
                <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100">Achievements</h3>
                <p className="text-sm text-blue-900 dark:text-blue-300 flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    {unlockedCount} of {achievements.length} unlocked
                </p>
                </div>
            </div>
            </div>

            <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Overall Progress</span>
                <span className="text-sm font-bold text-blue-900 dark:text-blue-100">{progressPercentage.toFixed(0)}%</span>
            </div>
            <div className="w-full h-4 bg-blue-200 dark:bg-blue-900 rounded-full overflow-hidden shadow-inner">
                <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-400 dark:to-blue-600 transition-all duration-500 shadow-lg"
                style={{ width: `${progressPercentage}%` }}
                />
            </div>
            </div>

            <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2">
            {achievements.map((achievement) => (
                <div
                key={achievement.id}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    achievement.unlocked
                    ? `${getCategoryColor(achievement.category)} shadow-lg hover:shadow-xl scale-100`
                    : "bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700 opacity-60 hover:opacity-80"
                }`}
                >
                <div className="flex items-start gap-3">
                    <div className="text-3xl flex-shrink-0">{achievement.unlocked ? achievement.icon : "🔒"}</div>
                    <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm mb-1 truncate">{achievement.title}</div>
                    <div className="text-xs text-muted-foreground line-clamp-2 mb-2">{achievement.description}</div>
                    {!achievement.unlocked && (
                        <div className="space-y-1">
                        <div className="flex items-center justify-between">
                            <div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                            <Target className="w-3 h-3" />
                            {achievement.progress} / {achievement.requirement}
                            </div>
                            <div className="text-xs font-bold text-blue-600 dark:text-blue-400">
                            {Math.min((achievement.progress / achievement.requirement) * 100, 100).toFixed(0)}%
                            </div>
                        </div>
                        <div className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-400 dark:to-blue-600 transition-all duration-300"
                            style={{
                                width: `${Math.min((achievement.progress / achievement.requirement) * 100, 100)}%`,
                            }}
                            />
                        </div>
                        </div>
                    )}
                    </div>
                </div>
                </div>
            ))}
            </div>
        </Card>
        </>
    )
}