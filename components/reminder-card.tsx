"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Plus, Pencil, X, Check } from "lucide-react"
import { useReminders } from "@/hooks/use-reminders"

export function ReminderCard() {
  const { reminders, addReminder, deleteReminder, updateReminder } = useReminders()
  const [newReminder, setNewReminder] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState("")

  const handleAddReminder = () => {
    addReminder(newReminder)
    setNewReminder("")
  }

  const handleSaveEdit = (id: string) => {
    updateReminder(id, editText)
    setEditingId(null)
    setEditText("")
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditText("")
  }

  return (
    <Card className="p-6 bg-white/60 backdrop-blur-sm dark:bg-[#002855] border-1 border-blue-200 dark:border-[#002855]">
      <h3 className="text-lg font-semibold text-blue-900 dark:text-white mb-2">Reminder</h3>

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
                  onKeyDown={(e) => e.key === "Enter" && handleSaveEdit(reminder.id)}
                  className="pl-10 border-1 border-blue-200 dark:border-[#002855] focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 rounded-lg bg-white dark:bg-[#001845]"
                  autoFocus
                />
                <Button size="icon" variant="ghost" onClick={() => handleSaveEdit(reminder.id)} className="shrink-0">
                  <Check className="w-4 h-4 text-blue-900 dark:text-white" />
                </Button>
                <Button size="icon" variant="ghost" onClick={cancelEdit} className="shrink-0">
                  <X className="w-4 h-4 text-blue-900 dark:text-white" />
                </Button>
              </>
            ) : (
              <>
                <span className="flex-1 text-blue-900 dark:text-white">{reminder.text}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    setEditingId(reminder.id)
                    setEditText(reminder.text)
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                >
                  <Pencil className="w-4 h-4 text-blue-900 dark:text-white" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => deleteReminder(reminder.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                >
                  <Trash2 className="w-4 h-4 text-blue-900 dark:text-white" />
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
          onKeyDown={(e) => e.key === "Enter" && handleAddReminder()}
          className="pl-10 border-1 border-blue-200 dark:border-[#002855] focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 rounded-lg bg-white dark:bg-[#001845]"
        />
        <Button onClick={handleAddReminder} size="icon" className="bg-blue-300 dark:bg-[#001845] hover:bg-blue-200 dark:hover:bg-[#023E7D] text-blue-100">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  )
}