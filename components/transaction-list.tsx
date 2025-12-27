"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Transaction } from "@/types/transaction"
import { Pencil, Trash2 } from "lucide-react"
import { MoneyWavy, HandCoins, PawPrint } from "@phosphor-icons/react";

interface TransactionListProps {
  transactions: Transaction[]
  onEdit: (transaction: Transaction) => void
  onDelete: (id: string) => void
}

export function TransactionList({ transactions, onEdit, onDelete }: TransactionListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all")
  const [filterCategory, setFilterCategory] = useState<string>("all")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date)
  }

  const allCategories = Array.from(new Set(transactions.map((t) => t.category).filter(Boolean)))

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (transaction.category || "").toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === "all" || transaction.type === filterType
    const matchesCategory = filterCategory === "all" || transaction.category === filterCategory
    return matchesSearch && matchesType && matchesCategory
  })

  return (
    <Card className="bg-blue-50 dark:bg-[#002855] border-blue-200 dark:border-[#002855]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary text-blue-900 dark:text-white">Riwayat Transaksi</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <div className="flex items-center justify-center mb-4">
                <PawPrint 
                  size={48} 
                  weight="duotone" 
                  color="#6499deff" 
                />
              </div>
              <p>No transactions yet. Let's start recording!</p>
            </div>
          ) : (
            transactions.map((transaction) => (
              <div
                key={transaction.id}
                className={`p-4 rounded-lg border-2 ${
                  transaction.type === "income" ? "bg-blue-50 dark:bg-[#023E7D] border-blue-200 dark:border-[#023E7D]" : "bg-rose-50 dark:bg-rose-900 border-rose-200 dark:border-rose-900"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {transaction.type === "income" ? (
                        <HandCoins
                          size={22}
                          weight="duotone"
                          color="#486fa3"
                        />
                      ) : (
                        <MoneyWavy
                          size={22}
                          weight="duotone"
                          color="#a34857ff"
                        />
                      )}

                      <p className="font-semibold text-foreground">
                        {transaction.description}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground text-gray-400 dark:text-gray-400">{formatDate(transaction.date)}</p>
                    <p
                      className={`text-lg font-bold mt-1 ${
                        transaction.type === "income" ? "text-blue-900 dark:text-white" : "text-rose-700 dark:text-white"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"} {formatCurrency(transaction.amount)}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onEdit(transaction)}
                      className="h-8 w-8 p-0 text-blue-900 dark:text-gray-300 hover:text-blue-800 hover:bg-blue-100 dark:hover:bg-blue-800"
                    >
                      <Pencil className="h-8 w-8 p-0 text-blue-900 dark:text-gray-300 hover:text-blue-800 hover:bg-blue-100 dark:hover:bg-blue-800" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this transaction?")) {
                          onDelete(transaction.id)
                        }
                      }}
                      className="h-8 w-8 p-0 text-red-600 dark:text-red-400 hover:text-red-800 hover:bg-red-100 dark:hover:bg-red-900"
                    >
                      <Trash2 className="h-8 w-8 p-0 text-red-600 dark:text-red-400 hover:text-red-800 hover:bg-red-100 dark:hover:bg-red-900" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}