"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { createContext } from "react"

interface PomodoroState {
    minutes: number
    seconds: number
    isActive: boolean
    isBreak: boolean
    sessions: number
    }

    interface PomodoroContextType {
    state: PomodoroState
    toggleTimer: () => void
    resetTimer: () => void
    startBreak: () => void
    }

    export const PomodoroContext = createContext<PomodoroContextType | null>(null)

    let globalPomodoroState: PomodoroState = {
    minutes: 25,
    seconds: 0,
    isActive: false,
    isBreak: false,
    sessions: 0,
    }

    export function usePomodoro() {
    const [state, setState] = useState<PomodoroState>(globalPomodoroState)
    const [isLoaded, setIsLoaded] = useState(false)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        const stored = localStorage.getItem("pomodoroState")
        if (stored) {
        const parsedState = JSON.parse(stored)
        globalPomodoroState = parsedState
        setState(parsedState)
        }
        setIsLoaded(true)
    }, [])

    useEffect(() => {
        if (isLoaded) {
        globalPomodoroState = state
        localStorage.setItem("pomodoroState", JSON.stringify(state))
        }
    }, [state, isLoaded])

    useEffect(() => {
        if (state.isActive) {
        intervalRef.current = setInterval(() => {
            setState((prev) => {
            const newState = { ...prev }

            if (newState.seconds === 0) {
                if (newState.minutes === 0) {
                // Timer finished
                newState.isActive = false
                if (!newState.isBreak) {
                    newState.sessions += 1
                    newState.isBreak = true
                    newState.minutes = 5
                    newState.seconds = 0
                } else {
                    newState.isBreak = false
                    newState.minutes = 25
                    newState.seconds = 0
                }
                } else {
                newState.minutes -= 1
                newState.seconds = 59
                }
            } else {
                newState.seconds -= 1
            }

            globalPomodoroState = newState
            return newState
            })
        }, 1000)
        } else if (intervalRef.current) {
        clearInterval(intervalRef.current)
        }

        return () => {
        if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [state.isActive])

    const toggleTimer = useCallback(() => {
        setState((prev) => {
        const newState = { ...prev, isActive: !prev.isActive }
        globalPomodoroState = newState
        return newState
        })
    }, [])

    const resetTimer = useCallback(() => {
        const newState = {
        minutes: 25,
        seconds: 0,
        isActive: false,
        isBreak: false,
        sessions: state.sessions,
        }
        globalPomodoroState = newState
        setState(newState)
    }, [state.sessions])

    const startBreak = useCallback(() => {
        const newState = {
        isActive: false,
        isBreak: true,
        minutes: 5,
        seconds: 0,
        sessions: state.sessions,
        }
        globalPomodoroState = newState
        setState(newState)
    }, [state.sessions])

    return { ...state, toggleTimer, resetTimer, startBreak }
}