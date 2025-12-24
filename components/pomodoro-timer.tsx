"use client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Play, Pause, RotateCcw, Coffee } from "lucide-react"
import { usePomodoro } from "@/hooks/use-pomodoro"

export function PomodoroTimer() {
    const { minutes, seconds, isActive, isBreak, sessions, toggleTimer, resetTimer, startBreak } = usePomodoro()

    return (
        <Card className="p-6 bg-blue-50 dark:bg-[#002855] border-1 border-blue-200 dark:border-[#002855]">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-blue-900 dark:text-white">Pomodoro Timer</h3>
            <div className="text-sm font-medium text-muted-foreground dark:text-gray-400">Sessions: {sessions}</div>
        </div>

        <div className="flex flex-col items-center space-y-6">
            <div className="relative w-48 h-48 rounded-full bg-white dark:bg-[#002855] border-8 border-blue-200 dark:border-white flex items-center justify-center shadow-xl">
            <div className="text-center">
                <div className="text-5xl font-bold text-blue-300 dark:text-white">
                {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                </div>
                <div className="text-sm text-muted-foreground dark:text-white mt-2">{isBreak ? "Break Time" : "Focus Time"}</div>
            </div>
            </div>

            <div className="flex gap-3">
            <Button onClick={toggleTimer} size="lg" className="bg-blue-300 dark:bg-[#001845] hover:bg-blue-200 dark:hover:bg-[#023E7D] text-white dark:text-white">
                {isActive ? (
                <>
                    <Pause className="mr-2 h-5 w-5" />
                    Pause
                </>
                ) : (
                <>
                    <Play className="mr-2 h-5 w-5" />
                    Start
                </>
                )}
            </Button>
            <Button
                onClick={resetTimer}
                size="lg"
                variant="outline"
                className="border-blue-300 text-primary hover:bg-blue-300 text-blue-900/10 text-blue-300 bg-transparent dark:text-white dark:hover:bg-[#023E7D]"
            >
                <RotateCcw className="mr-2 h-5 w-5" />
                Reset
            </Button>
            {!isBreak && (
                <Button
                onClick={startBreak}
                size="lg"
                variant="outline"
                className="border-blue-300 text-blue-900 hover:bg-blue-300 text-blue-900/10 text-blue-300 bg-transparent dark:text-white dark:hover:bg-[#023E7D]"
                >
                <Coffee className="mr-2 h-5 w-5" />
                Break
                </Button>
            )}
            </div>

            <div className="text-center text-sm text-muted-foreground dark:text-gray-400">
            <p>25 min focus • 5 min break</p>
            </div>
        </div>
        </Card>
    )
}