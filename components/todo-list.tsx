"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2, Plus, Pencil, X, Check } from "lucide-react"
import type { Todo } from "@/types/todo"
import { CheckSquare } from "@phosphor-icons/react";

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState("")

  useEffect(() => {
    const stored = localStorage.getItem("todos")
    if (stored) {
      setTodos(JSON.parse(stored))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo: Todo = {
        id: Date.now().toString(),
        text: newTodo,
        completed: false,
        createdAt: Date.now(),
      }
      setTodos([todo, ...todos])
      setNewTodo("")
    }
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id)
    setEditText(todo.text)
  }

  const saveEdit = (id: string) => {
    if (editText.trim()) {
      setTodos(todos.map((todo) => (todo.id === id ? { ...todo, text: editText } : todo)))
    }
    setEditingId(null)
    setEditText("")
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditText("")
  }

  return (
    <Card className="p-6 bg-white/60 backdrop-blur-sm border-blue-200">
      <div className="flex items-center gap-2 mb-4">
        <CheckSquare 
        size={25} 
        color="#486fa3" 
        weight="duotone" 
        />
        <h2 className="text-xl font-bold text-blue-900">To-do's list</h2>
      </div>

      <div className="flex gap-2 mb-1">
        <Input
          placeholder="Add new task"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
          className="bg-white/80 border-blue-200"
        />
        <Button onClick={addTodo} size="icon" className="shrink-0">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-1 max-h-[300px] overflow-y-auto">
        {todos.length === 0 ? (
          <p className="text-center text-blue-900 text-sm py-4">No tasks yet. Add one above!</p>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-50/50 transition-colors group"
            >
              <Checkbox checked={todo.completed} onCheckedChange={() => toggleTodo(todo.id)} className="shrink-0" />

              {editingId === todo.id ? (
                <>
                  <Input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && saveEdit(todo.id)}
                    className="bg-white/80 border-blue-00"
                    autoFocus
                  />
                  <Button size="icon" variant="ghost" onClick={() => saveEdit(todo.id)} className="shrink-0">
                    <Check className="w-4 h-4 text-blue-900" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={cancelEdit} className="shrink-0">
                    <X className="w-4 h-4 text-blue-900" />
                  </Button>
                </>
              ) : (
                <>
                  <span className={`flex-1 ${todo.completed ? "line-through text-blue-900" : "text-blue-900"}`}>
                    {todo.text}
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => startEdit(todo)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  >
                    <Pencil className="w-4 h-4 text-blue-900" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => deleteTodo(todo.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  >
                    <Trash2 className="w-4 h-4 text-blue-900" />
                  </Button>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </Card>
  )
}