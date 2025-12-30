"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { StatsCards } from "@/components/stats-cards"
import { TransactionForm } from "@/components/transaction-form"
import { TransactionList } from "@/components/transaction-list"
import { BudgetPlanner } from "@/components/budget-planner"
import { ExpenseCharts } from "@/components/expense-charts"
import { ExportData } from "@/components/export-data"
import type { Transaction } from "@/types/transaction"

interface ExpenseTrackerProps {
  transactions: Transaction[]
  onAddTransaction: (transaction: Omit<Transaction, "id">) => void
  onUpdateTransaction: (id: string, transaction: Omit<Transaction, "id">) => void
  onDeleteTransaction: (id: string) => void
}

export function ExpenseTracker({
  transactions,
  onAddTransaction,
  onUpdateTransaction,
  onDeleteTransaction,
}: ExpenseTrackerProps) {
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)

  const startEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction)
  }

  const cancelEdit = () => {
    setEditingTransaction(null)
  }

  // Calculate totals
  const income = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const expense = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
  const balance = income - expense

  return (
    <>
      <Header />
      <StatsCards income={income} expense={expense} balance={balance} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <TransactionForm
          onSubmit={
            editingTransaction
              ? (data) => {
                  onUpdateTransaction(editingTransaction.id, data)
                  setEditingTransaction(null)
                }
              : onAddTransaction
          }
          initialData={editingTransaction}
          onCancel={cancelEdit}
        />
        <TransactionList transactions={transactions} onEdit={startEdit} onDelete={onDeleteTransaction} />

        <div className="space-y-6 col-span-1 lg:col-span-1">
          <BudgetPlanner transactions={transactions} />
          <ExportData transactions={transactions} />
        </div>

        <div className="col-span-1 lg:col-span-1">
          <ExpenseCharts transactions={transactions} />
        </div>
      </div>
    </>
  )
}