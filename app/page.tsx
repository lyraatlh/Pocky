"use client"

import { useState } from "react"
import { ExpenseTracker } from "@/components/expense-tracker"
import { Dashboard } from "@/components/dashboard"
import { Navigation } from "@/components/navigation"
import { useTransactions } from "@/hooks/use-transactions"

export default function Home() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "tracker">("dashboard")
  const { transactions, addTransaction, updateTransaction, deleteTransaction, isLoaded } = useTransactions()

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-200 via-blue-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="flex items-center justify-center h-screen">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-blue-200 via-blue-50 to-white 
    dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    >
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {activeTab === "dashboard" && <Dashboard transactions={transactions} />}
        {activeTab === "tracker" && (
          <ExpenseTracker
            transactions={transactions}
            onAddTransaction={addTransaction}
            onUpdateTransaction={updateTransaction}
            onDeleteTransaction={deleteTransaction}
          />
        )}
      </div>
    </div>
  )
}