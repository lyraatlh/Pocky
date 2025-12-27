"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2, Plus, Pencil, X, Check } from "lucide-react"
import { useTodos } from "@/hooks/use-todos"
import { CheckSquare } from "@phosphor-icons/react"

export function TodoList() {
  const { todos, addTodo, toggleTodo, deleteTodo, updateTodo } = useTodos()
  const [newTodo, setNewTodo] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState("")

  const handleAddTodo = () => {
    addTodo(newTodo)
    setNewTodo("")
  }

  const handleSaveEdit = (id: string) => {
    updateTodo(id, editText)
    setEditingId(null)
    setEditText("")
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditText("")
  }

  return (
    <Card className="p-6 bg-white/60 backdrop-blur-sm dark:bg-[#002855] border-1 border-blue-200 dark:border-[#002855]">
      <div className="flex items-center gap-2 mb-4">
        <CheckSquare size={25} color="#486fa3" weight="duotone" />
        <h2 className="text-xl font-bold text-blue-900 dark:text-white">To-do's list</h2>
      </div>

      <div className="flex gap-2 mb-1">
        <Input
          placeholder="Add new task"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddTodo()}
          className="pl-7 border-1 border-blue-200 dark:border-[#002855] focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 rounded-lg bg-white dark:bg-[#001845]"
        />
        <Button onClick={handleAddTodo} size="icon" className="bg-blue-300 dark:bg-[#023E7D] hover:bg-blue-200 dark:hover:bg-[#001845] text-blue-100">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-1 max-h-[300px] overflow-y-auto">
        {todos.length === 0 ? (
          <p className="text-center text-blue-900 dark:text-white text-sm py-4">No tasks yet. Add one above!</p>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-50/50 dark:hover:bg-[#001845] transition-colors group"
            >
              <Checkbox checked={todo.completed} onCheckedChange={() => toggleTodo(todo.id)} className="shrink-0 bg-blue-100 dark:bg-[#5C677D]" />

              {editingId === todo.id ? (
                <>
                  <Input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSaveEdit(todo.id)}
                    className="pl-7 rounded-lg bg-white dark:bg-[#001845]"
                    autoFocus
                  />
                  <Button size="icon" variant="ghost" onClick={() => handleSaveEdit(todo.id)} className="shrink-0">
                    <Check className="w-4 h-4 text-blue-900 dark:text-white" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={cancelEdit} className="shrink-0">
                    <X className="w-4 h-4 text-blue-900 dark:text-white" />
                  </Button>
                </>
              ) : (
                <>
                  <span className={`flex-1 ${todo.completed ? "line-through text-blue-900 dark:text-white" : "text-blue-900 dark:text-white"}`}>
                    {todo.text}
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setEditingId(todo.id)
                      setEditText(todo.text)
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  >
                    <Pencil className="w-4 h-4 text-blue-900 dark:text-white" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => deleteTodo(todo.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  >
                    <Trash2 className="w-4 h-4 text-blue-900 dark:text-white" />
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