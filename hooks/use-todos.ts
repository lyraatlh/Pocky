"use client"

import { useState, useEffect, useCallback } from "react"
import type { Todo } from "@/types/todo"

export function useTodos() {
    const [todos, setTodos] = useState<Todo[]>([])
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        const stored = localStorage.getItem("todos")
        if (stored) {
        setTodos(JSON.parse(stored))
        }
        setIsLoaded(true)
    }, [])

    useEffect(() => {
        if (isLoaded) {
        localStorage.setItem("todos", JSON.stringify(todos))
        }
    }, [todos, isLoaded])

    const addTodo = useCallback((text: string) => {
        if (text.trim()) {
        const todo: Todo = {
            id: Date.now().toString(),
            text,
            completed: false,
            createdAt: Date.now(),
        }
        setTodos((prev) => [todo, ...prev])
        }
    }, [])

    const toggleTodo = useCallback((id: string) => {
        setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
    }, [])

    const deleteTodo = useCallback((id: string) => {
        setTodos((prev) => prev.filter((todo) => todo.id !== id))
    }, [])

    const updateTodo = useCallback((id: string, text: string) => {
        if (text.trim()) {
        setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, text } : todo)))
        }
    }, [])

    return { todos, addTodo, toggleTodo, deleteTodo, updateTodo }
}