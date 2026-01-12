"use client"

import { useState } from "react"
import { useReadingTime } from "@/hooks/use-reading-time"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

interface ReadingSettingsModalProps {
    onClose: () => void
    }

    export function ReadingSettingsModal({ onClose }: ReadingSettingsModalProps) {
    const { settings, updateSettings } = useReadingTime()
    const [pomodoroLength, setPomodoroLength] = useState(settings.pomodoroLength)
    const [dailyGoal, setDailyGoal] = useState(settings.dailyGoal)
    const [breakDuration, setBreakDuration] = useState(settings.breakDuration)

    const handleSave = () => {
    updateSettings({
        pomodoroLength: Math.max(5, pomodoroLength),
        dailyGoal: Math.max(1, dailyGoal),
        breakDuration: Math.max(1, breakDuration),
    })
    onClose()
    }

    return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Reading Settings</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all">
            <X className="w-5 h-5" />
            </button>
        </div>

        <div className="space-y-6">
            <div>
            <label className="block text-sm font-semibold mb-2">Pomodoro Duration (minutes)</label>
            <Input
                type="number"
                min="5"
                max="60"
                value={pomodoroLength}
                onChange={(e) => setPomodoroLength(Number.parseInt(e.target.value))}
                className="pl-5 border-1 border-blue-200 dark:border-[#002855] focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 rounded-lg bg-white dark:bg-[#001845]"
            />
            <p className="text-xs text-muted-foreground mt-1">Customize your reading block duration</p>
            </div>

            <div>
            <label className="block text-sm font-semibold mb-2">Daily Reading Goal (pages)</label>
            <Input
                type="number"
                min="1"
                max="1000"
                value={dailyGoal}
                onChange={(e) => setDailyGoal(Number.parseInt(e.target.value))}
                className="pl-5 border-1 border-blue-200 dark:border-[#002855] focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 rounded-lg bg-white dark:bg-[#001845]"
            />
            <p className="text-xs text-muted-foreground mt-1">Set your daily reading target</p>
            </div>

            <div>
            <label className="block text-sm font-semibold mb-2">Break Duration (minutes)</label>
            <Input
                type="number"
                min="1"
                max="30"
                value={breakDuration}
                onChange={(e) => setBreakDuration(Number.parseInt(e.target.value))}
                className="pl-5 border-1 border-blue-200 dark:border-[#002855] focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 rounded-lg bg-white dark:bg-[#001845]"
            />
            <p className="text-xs text-muted-foreground mt-1">Rest time between reading sessions</p>
            </div>
        </div>

        <div className="flex gap-3 mt-8">
            <Button
            onClick={handleSave}
            className="flex-1 text-gray-700 dark:text-white bg-blue-200 dark:bg-[#023E7D] hover:text-gray-800 dark:hover:text-white hover:bg-blue-100 dark:hover:bg-[#002855] border-1 border-blue-200 dark:border-[#023E7D]"
            >
            Save Settings
            </Button>
            <Button onClick={onClose} variant="outline" className="text-gray-700 dark:text-white bg-blue-100 dark:bg-[#002855] hover:text-gray-800 dark:hover:text-white hover:bg-blue-200 dark:hover:bg-[#023E7D] border-1 border-blue-200 dark:border-[#023E7D]">
            Cancel
            </Button>
        </div>
        </div>
    </div>
    )
}