"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { StatsCards } from "@/components/stats-cards"
import { TransactionForm } from "@/components/transaction-form"
import { TransactionList } from "@/components/transaction-list"
import { BudgetPlanner } from "@/components/budget-planner"
import { ExpenseCharts } from "@/components/expense-charts"
import { ExportData } from "@/components/export-data"
import type { Transaction } from "@/types/transaction"

export function ExpenseTracker() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("transactions")
    if (stored) {
      setTransactions(JSON.parse(stored))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions))
  }, [transactions])

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    }
    setTransactions([newTransaction, ...transactions])
  }

  const updateTransaction = (id: string, updated: Omit<Transaction, "id">) => {
    setTransactions(transactions.map((t) => (t.id === id ? { ...updated, id } : t)))
    setEditingTransaction(null)
  }

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id))
  }

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
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <TransactionForm
          onSubmit={editingTransaction ? (data) => updateTransaction(editingTransaction.id, data) : addTransaction}
          initialData={editingTransaction}
          onCancel={cancelEdit}
        />
        <TransactionList transactions={transactions} onEdit={startEdit} onDelete={deleteTransaction} />

        <div className="space-y-6">
          <BudgetPlanner transactions={transactions} />
          <ExportData transactions={transactions} />
          <ExpenseCharts transactions={transactions} />
        </div>
      </div>
    </>
  )
}
