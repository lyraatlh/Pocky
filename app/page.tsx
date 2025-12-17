"use client"

import { useState } from "react"
import { ExpenseTracker } from "@/components/expense-tracker"
import { Dashboard } from "@/components/dashboard"
import { Navigation } from "@/components/navigation"

export default function Home() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "tracker">("dashboard")

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 via-blue-50 to-white">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {activeTab === "dashboard" && <Dashboard />}
        {activeTab === "tracker" && <ExpenseTracker />}
      </div>
    </div>
  )
}
