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
    <Card className="bg-gradient-to-br from-blue-100 to-blue-50 border-blue-200 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary text-blue-900">Riwayat Transaksi</CardTitle>
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
                  transaction.type === "income" ? "bg-blue-50 border-blue-200" : "bg-rose-50 border-rose-200"
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
                    <p className="text-sm text-muted-foreground">{formatDate(transaction.date)}</p>
                    <p
                      className={`text-lg font-bold mt-1 ${
                        transaction.type === "income" ? "text-blue-900" : "text-rose-700"
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
                      className="h-8 w-8 hover:bg-primary/10"
                    >
                      <Pencil className="h-4 w-4 text-primary" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this transaction?")) {
                          onDelete(transaction.id)
                        }
                      }}
                      className="h-8 w-8 hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
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