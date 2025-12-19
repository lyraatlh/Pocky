"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Play, Pause, RotateCcw, Coffee } from "lucide-react"

export function PomodoroTimer() {
    const [minutes, setMinutes] = useState(25)
    const [seconds, setSeconds] = useState(0)
    const [isActive, setIsActive] = useState(false)
    const [isBreak, setIsBreak] = useState(false)
    const [sessions, setSessions] = useState(0)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        if (isActive) {
        intervalRef.current = setInterval(() => {
            if (seconds === 0) {
            if (minutes === 0) {
                // Timer finished
                setIsActive(false)
                if (!isBreak) {
                setSessions((prev) => prev + 1)
                // Play notification sound (optional)
                setIsBreak(true)
                setMinutes(5)
                setSeconds(0)
                } else {
                setIsBreak(false)
                setMinutes(25)
                setSeconds(0)
                }
            } else {
                setMinutes(minutes - 1)
                setSeconds(59)
            }
            } else {
            setSeconds(seconds - 1)
            }
        }, 1000)
        } else if (intervalRef.current) {
        clearInterval(intervalRef.current)
        }

        return () => {
        if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [isActive, minutes, seconds, isBreak])

    const toggleTimer = () => {
        setIsActive(!isActive)
    }

    const resetTimer = () => {
        setIsActive(false)
        setIsBreak(false)
        setMinutes(25)
        setSeconds(0)
    }

    const startBreak = () => {
        setIsActive(false)
        setIsBreak(true)
        setMinutes(5)
        setSeconds(0)
    }

    return (
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-50 border-1 border-blue-200">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-blue-900">Pomodoro Timer</h3>
            <div className="text-sm font-medium text-muted-foreground">Sessions: {sessions}</div>
        </div>

        <div className="flex flex-col items-center space-y-6">
            <div className="relative w-48 h-48 rounded-full bg-white border-8 border-blue-200 flex items-center justify-center shadow-xl">
            <div className="text-center">
                <div className="text-5xl font-bold text-blue-300">
                {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                </div>
                <div className="text-sm text-muted-foreground mt-2">{isBreak ? "Break Time" : "Focus Time"}</div>
            </div>
            </div>

            <div className="flex gap-3">
            <Button onClick={toggleTimer} size="lg" className="bg-blue-300 hover:bg-blue-200 text-white">
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
                className="border-blue-300 text-primary hover:bg-blue-300 text-blue-900/10 text-blue-300"
            >
                <RotateCcw className="mr-2 h-5 w-5" />
                Reset
            </Button>
            {!isBreak && (
                <Button
                onClick={startBreak}
                size="lg"
                variant="outline"
                className="border-blue-300 text-blue-900 hover:bg-blue-900 text-blue-900/10 text-blue-300"
                >
                <Coffee className="mr-2 h-5 w-5" />
                Break
                </Button>
            )}
            </div>

            <div className="text-center text-sm text-muted-foreground">
            <p>25 min focus • 5 min break</p>
            </div>
        </div>
        </Card>
    )
}