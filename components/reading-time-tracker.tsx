"use client"

import { useState } from "react"
import { useReadingTime } from "@/hooks/use-reading-time"
import { ReadingSettingsModal } from "@/components/reading-settings-modal"
import { ReadingAnalytics } from "@/components/reading-analytics"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Play, Pause, RotateCcw, Trash2, Settings, BarChart3, BookOpen } from "lucide-react"

export function ReadingTimeTracker() {
    const {
        currentSession,
        sessions,
        settings,
        achievements,
        startReading,
        pauseReading,
        endReadingSession,
        resetSession,
        deleteSession,
        getTodaySessions,
        getTotalStats,
        getReadingStreak,
        getTodayStats,
    } = useReadingTime()

    const [bookTitle, setBookTitle] = useState("")
    const [pages, setPages] = useState("")
    const [showForm, setShowForm] = useState(false)
    const [showSettings, setShowSettings] = useState(false)
    const [showAnalytics, setShowAnalytics] = useState(false)
    const [activeTab, setActiveTab] = useState<"timer" | "history">("timer")

    const todaySessions = getTodaySessions()
    const stats = getTotalStats()
    const todayStats = getTodayStats()
    const streak = getReadingStreak()

    const handleEndSession = () => {
        if (bookTitle.trim() && pages.trim()) {
        endReadingSession(bookTitle, Number.parseInt(pages))
        setBookTitle("")
        setPages("")
        setShowForm(false)
        }
    }

    const formatTime = (minutes: number) => {
        const hrs = Math.floor(minutes / 60)
        const mins = minutes % 60
        return `${hrs}h ${mins}m`
    }

    const pomodoroVisuals = Array.from({ length: currentSession.pomodoroCount }).map((_, i) => (
        <div key={i} className="w-3 h-3 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full shadow-md" />
    ))

    return (
        <div className="space-y-4 sm:space-y-6 pb-6 px-2 sm:px-0">
        {/* Tab Navigation */}
        <div className="flex gap-2 bg-muted rounded-lg p-1">
            <button
            onClick={() => setActiveTab("timer")}
            className={`flex-1 px-3 sm:px-4 py-2 rounded-md font-medium text-sm transition-all ${
                activeTab === "timer" ? "bg-white text-blue-300" : "text-muted-foreground hover:text-foreground"
            }`}
            >
            <span className="flex items-center justify-center gap-2 data-[state=active]:bg-[#8ec5ff] dark:data-[state=active]:bg-[#002855] data-[state=active]:text-white">
                <Play className="w-4 h-4" />
                <span className="hidden sm:inline">Timer</span>
            </span>
            </button>
            <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 px-3 sm:px-4 py-2 rounded-md font-medium text-sm transition-all ${
                activeTab === "history" ? "bg-white text-blue-300" : "text-muted-foreground hover:text-foreground"
            }`}
            >
            <span className="flex items-center justify-center gap-2 data-[state=active]:bg-[#8ec5ff] dark:data-[state=active]:bg-[#002855] data-[state=active]:text-white">
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">History</span>
            </span>
            </button>
        </div>

        {activeTab === "timer" ? (
            <>
            {/* Main Timer Card */}
            <Card className="p-4 sm:p-8 bg-blue-50 dark:bg-[#002855] border-blue-200 dark:border-[#002855]">
                <h2 className="text-xl sm:text-2xl font-bold mb-6 text-blue-900 dark:text-white">Reading Session</h2>

                {/* Timer Display */}
                <div className="bg-blue-100 dark:bg-[#001845] rounded-2xl p-6 sm:p-8 text-center mb-6">
                <div className="text-5xl sm:text-7xl font-bold text-white bg-clip-text mb-2 font-mono tracking-tight">
                    {formatTime(currentSession.elapsedMinutes)}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground mb-4">
                    {currentSession.pomodoroCount} Pomodoro ({settings.pomodoroLength} min each)
                </div>

                {/* Pomodoro Progress Dots */}
                {currentSession.pomodoroCount > 0 && (
                    <div className="flex gap-2 justify-center flex-wrap">{pomodoroVisuals}</div>
                )}
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <div className="bg-blue-200 dark:bg-blue-900 rounded-lg p-3 text-center">
                    <div className="text-lg sm:text-2xl font-bold text-white">
                    {todayStats.totalPages}
                    </div>
                    <div className="text-xs text-white">Today</div>
                </div>
                <div className="bg-green-100 dark:bg-green-900 rounded-lg p-3 text-center">
                    <div className="text-lg sm:text-2xl font-bold text-green-600 dark:text-green-300">{streak}</div>
                    <div className="text-xs text-green-600 dark:text-green-400">Streak</div>
                </div>
                <div className="bg-purple-100 dark:bg-purple-900 rounded-lg p-3 text-center">
                    <div className="text-lg sm:text-2xl font-bold text-purple-600 dark:text-purple-300">
                    {stats.totalPages}
                    </div>
                    <div className="text-xs text-purple-600 dark:text-purple-400">Total</div>
                </div>
                <div className="bg-orange-100 dark:bg-orange-900 rounded-lg p-3 text-center">
                    <div className="text-lg sm:text-2xl font-bold text-orange-600 dark:text-orange-300">
                    {stats.totalSessions}
                    </div>
                    <div className="text-xs text-orange-600 dark:text-orange-400">Sessions</div>
                </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                {!currentSession.isActive ? (
                    <Button
                    onClick={startReading}
                    className="flex-1 text-gray-700 dark:text-white bg-blue-200 dark:bg-[#023E7D] hover:text-gray-800 dark:hover:text-white hover:bg-blue-100 dark:hover:bg-[#002855] border-1 border-blue-200 dark:border-[#023E7D]"
                    >
                    <Play className="w-5 h-5" />
                    Start Reading
                    </Button>
                ) : (
                    <Button
                    onClick={pauseReading}
                    className="flex-1 text-gray-700 dark:text-white bg-blue-200 dark:bg-[#023E7D] hover:text-gray-800 dark:hover:text-white hover:bg-blue-100 dark:hover:bg-[#002855] border-1 border-blue-200 dark:border-[#023E7D]"
                    >
                    <Pause className="w-5 h-5" />
                    Pause
                    </Button>
                )}

                <Button
                    onClick={resetSession}
                    variant="outline"
                    className="flex-1 sm:flex-none sm:px-6 py-3 text-gray-700 dark:text-white bg-blue-50 dark:bg-[#002855] hover:text-gray-800 dark:hover:text-white hover:bg-blue-200 dark:hover:bg-[#023E7D] border-1 border-blue-200 dark:border-[#023E7D]"
                >
                    <RotateCcw className="w-5 h-5" />
                    <span className="hidden sm:inline">Reset</span>
                </Button>

                <Button
                    onClick={() => setShowSettings(true)}
                    variant="outline"
                    className="flex-1 sm:flex-none sm:px-6 py-3 text-gray-700 dark:text-white bg-blue-50 dark:bg-[#002855] hover:text-gray-800 dark:hover:text-white hover:bg-blue-200 dark:hover:bg-[#023E7D] border-1 border-blue-200 dark:border-[#023E7D]"
                >
                    <Settings className="w-5 h-5" />
                    <span className="hidden sm:inline">Settings</span>
                </Button>
                </div>

                {/* End Session Form */}
                {currentSession.elapsedMinutes > 0 && (
                <div>
                    {!showForm ? (
                    <Button
                        onClick={() => setShowForm(true)}
                        className="w-full text-gray-700 dark:text-white bg-blue-200 dark:bg-[#023E7D] hover:text-gray-800 dark:hover:text-white hover:bg-blue-100 dark:hover:bg-[#002855] border-1 border-blue-200 dark:border-[#023E7D]"
                    >
                        End Session
                    </Button>
                    ) : (
                    <div className="space-y-3 bg-white dark:bg-[#33415C] p-4 rounded-lg border border-gray-200 dark:border-[#33415C]">
                        <Input
                        placeholder="Book Title"
                        value={bookTitle}
                        onChange={(e) => setBookTitle(e.target.value)}
                        className="pl-5 border-1 border-blue-200 dark:border-[#002855] focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 rounded-lg bg-white dark:bg-[#001845]"
                        />
                        <Input
                        type="number"
                        placeholder="Pages Read"
                        value={pages}
                        onChange={(e) => setPages(e.target.value)}
                        className="pl-5 border-1 border-blue-200 dark:border-[#002855] focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 rounded-lg bg-white dark:bg-[#001845]"
                        />
                        <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                            onClick={handleEndSession}
                            className="flex-1 text-gray-700 dark:text-white bg-blue-200 dark:bg-[#023E7D] hover:text-gray-800 dark:hover:text-white hover:bg-blue-100 dark:hover:bg-[#002855] border-1 border-blue-200 dark:border-[#023E7D]"
                        >
                            Save Session
                        </Button>
                        <Button onClick={() => setShowForm(false)} variant="outline" className="flex-1 text-gray-700 dark:text-white bg-blue-100 dark:bg-[#002855] hover:text-gray-800 dark:hover:text-white hover:bg-blue-200 dark:hover:bg-[#023E7D] border-1 border-blue-200 dark:border-[#023E7D]">
                            Cancel
                        </Button>
                        </div>
                    </div>
                    )}
                </div>
                )}
            </Card>

            {/* Today's Sessions */}
            {todaySessions.length > 0 && (
                <Card className="p-4 sm:p-8 bg-blue-50 dark:bg-[#002855] border-blue-200 dark:border-[#002855]">
                <h3 className="text-lg font-bold mb-4 text-blue-900 dark:text-white">Today's Reading</h3>
                <div className="space-y-2">
                    {todaySessions.map((session) => (
                    <div
                        key={session.id}
                        className="flex items-center justify-between bg-blue-100 dark:bg-[#33415C] p-3 sm:p-4 rounded-lg border border-blue-200 dark:border-[#33415C]"
                    >
                        <div className="flex-1 min-w-0">
                        <p className="font-semibold text-blue-900 dark:text-white">{session.bookTitle}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                            {formatTime(session.duration)} • {session.pages} pages
                        </p>
                        </div>
                        <Button
                        onClick={() => deleteSession(session.id)}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 dark:text-red-400 hover:text-red-800 hover:bg-red-100 dark:hover:bg-red-900"
                        >
                        <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                    ))}
                </div>
                </Card>
            )}
            </>
        ) : (
            <>
            {/* Analytics Button */}
            <Button
                onClick={() => setShowAnalytics(!showAnalytics)}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
            >
                <BarChart3 className="w-5 h-5" />
                View Analytics
            </Button>

            {/* Reading History */}
            <Card className="p-4 sm:p-8 bg-blue-50 dark:bg-[#002855] border-blue-200 dark:border-[#002855]">
                <h3 className="text-lg font-bold mb-4">Reading History</h3>
                {sessions.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                    {[...sessions].reverse().map((session) => (
                    <div
                        key={session.id}
                        className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                        <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{session.bookTitle}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                            {new Date(session.completedAt).toLocaleDateString()} • {formatTime(session.duration)} •{" "}
                            {session.pages} pages
                        </p>
                        </div>
                        <Button
                        onClick={() => deleteSession(session.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 ml-2 flex-shrink-0"
                        >
                        <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                    ))}
                </div>
                ) : (
                <p className="text-center text-muted-foreground py-8">No reading history yet</p>
                )}
            </Card>
            </>
        )}

        {/* Modals */}
        {showSettings && <ReadingSettingsModal onClose={() => setShowSettings(false)} />}
        {showAnalytics && <ReadingAnalytics onClose={() => setShowAnalytics(false)} />}
        </div>
    )
}