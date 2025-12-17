"use client"

import { CalendarWidget } from "@/components/calendar-widget"
import { DigitalClock } from "@/components/digital-clock"
import { TodoList } from "@/components/todo-list"
import { QuoteCard } from "@/components/quote-card"
import { ReminderCard } from "@/components/reminder-card"

export function Dashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <CalendarWidget />
        <DigitalClock />
      </div>

      <div className="space-y-6">
        <TodoList />
        <QuoteCard />
        <ReminderCard />
      </div>
    </div>
  )
}
