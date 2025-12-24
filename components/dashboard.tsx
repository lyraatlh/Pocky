"use client"

import { CalendarWidget } from "@/components/calendar-widget"
import { DigitalClock } from "@/components/digital-clock"
import { TodoList } from "@/components/todo-list"
import { QuoteCard } from "@/components/quote-card"
import { ReminderCard } from "@/components/reminder-card"
import { PomodoroTimer } from "@/components/pomodoro-timer"
import { HabitTracker } from "@/components/habit-tracker"
import { MoodTracker } from "@/components/mood-tracker"
import { DailyJournal } from "@/components/daily-journal"
import { WeatherWidget } from "@/components/weather-widget"
import { AchievementBadge } from "@/components/achievement-badge"
import { TransactionSummary } from "@/components/transaction-summary"
import type { Transaction } from "@/types/transaction"

interface DashboardProps {
  transactions: Transaction[]
}

export function Dashboard({ transactions }: DashboardProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <WeatherWidget />
        <CalendarWidget />
        <DigitalClock />
        <TransactionSummary transactions={transactions} />
        <PomodoroTimer />
        <DailyJournal />
      </div>

      <div className="space-y-6">
        <AchievementBadge />
        <TodoList />
        <QuoteCard />
        <ReminderCard />
        <HabitTracker />
        <MoodTracker />
      </div>
    </div>
  )
}