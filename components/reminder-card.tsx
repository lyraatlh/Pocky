"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Plus, Pencil, X, Check } from "lucide-react"
import type { Reminder } from "@/types/reminder"

export function ReminderCard() {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [newReminder, setNewReminder] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState("")

  useEffect(() => {
    const stored = localStorage.getItem("reminders")
    if (stored) {
      setReminders(JSON.parse(stored))
    } else {
      // Default reminders
      const defaultReminders: Reminder[] = [
        { id: "1", text: "be kind.", createdAt: Date.now() },
        { id: "2", text: "be grateful.", createdAt: Date.now() },
        { id: "3", text: "be positive.", createdAt: Date.now() },
        { id: "4", text: "be yourself.", createdAt: Date.now() },
      ]
      setReminders(defaultReminders)
      localStorage.setItem("reminders", JSON.stringify(defaultReminders))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("reminders", JSON.stringify(reminders))
  }, [reminders])

  const addReminder = () => {
    if (newReminder.trim()) {
      const reminder: Reminder = {
        id: Date.now().toString(),
        text: newReminder,
        createdAt: Date.now(),
      }
      setReminders([...reminders, reminder])
      setNewReminder("")
    }
  }

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter((r) => r.id !== id))
  }

  const startEdit = (reminder: Reminder) => {
    setEditingId(reminder.id)
    setEditText(reminder.text)
  }

  const saveEdit = (id: string) => {
    if (editText.trim()) {
      setReminders(reminders.map((r) => (r.id === id ? { ...r, text: editText } : r)))
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
      <h3 className="text-lg font-semibold text-blue-900 mb-2">Reminder</h3>

      <div className="space-y-3 mb-4">
        {reminders.map((reminder) => (
          <div key={reminder.id} className="flex items-center gap-3 group">
            <div className="w-5 h-5 rounded-full bg-blue-200 flex items-center justify-center shrink-0">
              <div className="w-2 h-2 rounded-full bg-blue-300" />
            </div>

            {editingId === reminder.id ? (
              <>
                <Input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && saveEdit(reminder.id)}
                  className="bg-white/80 border-blue-200"
                  autoFocus
                />
                <Button size="icon" variant="ghost" onClick={() => saveEdit(reminder.id)} className="shrink-0">
                  <Check className="w-4 h-4 text-blue-900" />
                </Button>
                <Button size="icon" variant="ghost" onClick={cancelEdit} className="shrink-0">
                  <X className="w-4 h-4 text-blue-900" />
                </Button>
              </>
            ) : (
              <>
                <span className="flex-1 text-blue-900">{reminder.text}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => startEdit(reminder)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                >
                  <Pencil className="w-4 h-4 text-blue-900" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => deleteReminder(reminder.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                >
                  <Trash2 className="w-4 h-4 text-blue-900" />
                </Button>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Add new reminder"
          value={newReminder}
          onChange={(e) => setNewReminder(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addReminder()}
          className="bg-white/80 border-blue-200"
        />
        <Button onClick={addReminder} size="icon" className="shrink-0">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  )
}
