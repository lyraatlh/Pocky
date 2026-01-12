"use client"

import { useReadingTime } from "@/hooks/use-reading-time"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, TrendingUp } from "lucide-react"

interface ReadingAnalyticsProps {
    onClose: () => void
    }

    export function ReadingAnalytics({ onClose }: ReadingAnalyticsProps) {
    const { sessions, achievements, getTotalStats, getReadingStreak } = useReadingTime()
    const stats = getTotalStats()
    const streak = getReadingStreak()

    const getWeeklyStats = () => {
    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const weekSessions = sessions.filter((s) => new Date(s.completedAt) >= sevenDaysAgo)
    return {
        count: weekSessions.length,
        pages: weekSessions.reduce((sum, s) => sum + s.pages, 0),
    }
    }

    const getMonthlyStats = () => {
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const monthSessions = sessions.filter((s) => new Date(s.completedAt) >= thirtyDaysAgo)
    return {
        count: monthSessions.length,
        pages: monthSessions.reduce((sum, s) => sum + s.pages, 0),
    }
    }

    const unlockedAchievements = achievements.filter((a) => a.unlockedAt)
    const weekStats = getWeeklyStats()
    const monthStats = getMonthlyStats()

    const formatTime = (minutes: number) => {
    const hrs = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hrs}h ${mins}m`
    }

    return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-2xl p-6 my-8">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            Reading Analytics
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all">
            <X className="w-5 h-5" />
            </button>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-8">
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-blue-200 dark:border-blue-800">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{formatTime(stats.totalMinutes)}</div>
            <div className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 font-medium">Total Time</div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border-green-200 dark:border-green-800">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.totalPages}</div>
            <div className="text-xs sm:text-sm text-green-600 dark:text-green-400 font-medium">Pages</div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 border-purple-200 dark:border-purple-800">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.totalPomodoros}</div>
            <div className="text-xs sm:text-sm text-purple-600 dark:text-purple-400 font-medium">Pomodoros</div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 border-orange-200 dark:border-orange-800">
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{stats.totalSessions}</div>
            <div className="text-xs sm:text-sm text-orange-600 dark:text-orange-400 font-medium">Sessions</div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 border-red-200 dark:border-red-800">
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">{streak}</div>
            <div className="text-xs sm:text-sm text-red-600 dark:text-red-400 font-medium">Streak</div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/30 dark:to-pink-800/30 border-pink-200 dark:border-pink-800">
            <div className="text-3xl font-bold text-pink-600 dark:text-pink-400">{stats.averagePagesPerSession}</div>
            <div className="text-xs sm:text-sm text-pink-600 dark:text-pink-400 font-medium">Avg Pages</div>
            </Card>
        </div>

        {/* Time Period Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
            <Card className="p-4 border-l-4 border-l-yellow-500">
            <h3 className="font-semibold text-sm mb-2">This Week</h3>
            <div className="space-y-1">
                <p className="text-2xl font-bold text-foreground">{weekStats.count}</p>
                <p className="text-xs text-muted-foreground">{weekStats.pages} pages</p>
            </div>
            </Card>
            <Card className="p-4 border-l-4 border-l-cyan-500">
            <h3 className="font-semibold text-sm mb-2">This Month</h3>
            <div className="space-y-1">
                <p className="text-2xl font-bold text-foreground">{monthStats.count}</p>
                <p className="text-xs text-muted-foreground">{monthStats.pages} pages</p>
            </div>
            </Card>
        </div>

        {/* Achievements */}
        {achievements.length > 0 && (
            <div className="mb-6">
            <h3 className="font-bold text-lg mb-4">
                Achievements ({unlockedAchievements.length}/{achievements.length})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {achievements.map((achievement) => (
                <Card
                    key={achievement.id}
                    className={`p-4 text-center transition-all ${
                    achievement.unlockedAt
                        ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
                        : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-50"
                    }`}
                >
                    <div className="text-3xl mb-2">{achievement.icon}</div>
                    <p className="font-semibold text-sm">{achievement.name}</p>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                </Card>
                ))}
            </div>
            </div>
        )}

        <Button
            onClick={onClose}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg"
        >
            Close
        </Button>
        </div>
    </div>
    )
}