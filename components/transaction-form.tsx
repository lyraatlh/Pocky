"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Transaction } from "@/types/transaction"
import { Plus, X } from "lucide-react"
import { MoneyWavy, HandCoins } from "@phosphor-icons/react";

interface TransactionFormProps {
  onSubmit: (transaction: Omit<Transaction, "id">) => void
  initialData?: Transaction | null
  onCancel?: () => void
}

const EXPENSE_CATEGORIES = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Healthcare",
  "Education",
  "Travel",
  "Other",
]

const INCOME_CATEGORIES = ["Salary", "Freelance", "Investment", "Gift", "Bonus", "Other"]

export function TransactionForm({ onSubmit, initialData, onCancel }: TransactionFormProps) {
  const [type, setType] = useState<"income" | "expense">("expense")
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [category, setCategory] = useState("")

  useEffect(() => {
    if (initialData) {
      setType(initialData.type)
      setDescription(initialData.description)
      setAmount(initialData.amount.toString())
      setDate(initialData.date)
      setCategory(initialData.category || "")
    }
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!description.trim() || !amount || Number.parseFloat(amount) <= 0) {
      alert("Please fill in all fields correctly!")
      return
    }

    onSubmit({
      type,
      description: description.trim(),
      amount: Number.parseFloat(amount),
      date,
      category: category.trim() || undefined,
    })

    // Reset form if not editing
    if (!initialData) {
      setDescription("")
      setAmount("")
      setDate(new Date().toISOString().split("T")[0])
      setCategory("")
    }
  }

  const handleCancel = () => {
    setDescription("")
    setAmount("")
    setDate(new Date().toISOString().split("T")[0])
    setType("expense")
    setCategory("")
    onCancel?.()
  }

  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  return (
    <Card className="bg-blue-50 dark:bg-[#002855] border-blue-200 dark:border-[#002855] border-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary text-blue-900 dark:text-white">
          {initialData ? "Edit Transaction" : "Add New Transaction"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              data-state={type === "income" ? "active" : "inactive"}
              className="
                flex-1 gap-2
                border-blue-200 dark:border-[#023E7D] text-blue-900 dark:text-white
                hover:bg-blue-50 hover:text-blue-900 dark:hover:text-gray-300

                data-[state=active]:bg-blue-200 dark:data-[state=active]:bg-[#023E7D]
                data-[state=active]:text-blue-900
                data-[state=active]:border-blue-200
              "
              onClick={() => setType("income")}
            >
                <HandCoins
                size={24}
                weight="duotone"
                color="#1c398e"
                />
              Income
            </Button>
            <Button
              type="button"
              variant="outline"
              data-state={type === "expense" ? "active" : "inactive"}
              className="
                flex-1 gap-2
                border-blue-200 dark:border-[#023E7D] text-blue-900 dark:text-white
                hover:bg-blue-50 hover:text-blue-900 dark:hover:text-gray-300

                data-[state=active]:bg-blue-200 dark:data-[state=active]:bg-[#023E7D]
                data-[state=active]:text-blue-900
                data-[state=active]:border-blue-200
              "
              onClick={() => setType("expense")}
            >
              <MoneyWavy
                size={24}
                weight="duotone"
                color="#1c398e"
              />
              Expense
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-blue-900 dark:text-white">Description</Label>
            <Input
              id="description"
              placeholder="beli makanan pocky"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="pl-5 border-1 border-blue-200 dark:border-[#002855] focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 rounded-lg bg-white dark:bg-[#001845]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-blue-900 dark:text-white">
              Category
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full pl-5 border-1 border-blue-200 dark:border-[#002855] focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 rounded-lg bg-white dark:bg-[#001845]">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-blue-900 dark:text-white">Amount (Rp)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="1000"
              className="pl-5 border-1 border-blue-200 dark:border-[#002855] focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 rounded-lg bg-white dark:bg-[#001845]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="text-blue-900 dark:text-white">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="pl-5 border-1 border-blue-200 dark:border-[#002855] focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 rounded-lg bg-white dark:bg-[#001845]"
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1 w-full text-gray-700 dark:text-white bg-blue-200 dark:bg-[#023E7D] hover:text-gray-800 dark:hover:text-white hover:bg-blue-100 dark:hover:bg-[#002855] border-1 border-blue-200 dark:border-[#023E7D]">
              {initialData ? (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Update Transaction
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Transaction
                </>
              )}
            </Button>
            {initialData && (
              <Button type="button" variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
