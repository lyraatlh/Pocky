"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Transaction } from "@/types/transaction"
import { Plus, X } from "lucide-react"
import { MoneyWavy, HandCoins } from "@phosphor-icons/react";

interface TransactionFormProps {
  onSubmit: (transaction: Omit<Transaction, "id">) => void
  initialData?: Transaction | null
  onCancel?: () => void
}

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
      alert("Mohon isi semua field dengan benar!")
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

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-blue-10 border-blue-200 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary text-blue-900">
          {initialData ? "Edit Transaksi" : "Tambah Transaksi Baru"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <Button
              type="button"
              variant={type === "income" ? "default" : "outline"}
              className={`flex-1 ${type === "income" ? "bg-blue-300 hover:bg-blue-200" : ""}`}
              onClick={() => setType("income")}
            >
                <HandCoins
                size={24}
                weight="duotone"
                color="#1c398e"
                />
              Pemasukan
            </Button>
            <Button
              type="button"
              variant={type === "expense" ? "default" : "outline"}
              className={`flex-1 ${type === "expense" ? "bg-blue-300 hover:bg-blue-200" : ""}`}
              onClick={() => setType("expense")}
            >
              <MoneyWavy
                size={24}
                weight="duotone"
                color="#1c398e"
              />
              Pengeluaran
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Input
              id="description"
              placeholder="beli makanan pocky"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border-blue-200 focus:border-blue-200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Jumlah (Rp)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="0.01"
              className="border-blue-200 focus:border-blue-200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Tanggal</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border-blue-200 focus:border-blue-200"
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1 bg-blue-300 hover:bg-blue-200/90">
              {initialData ? (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Update Transaksi
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Transaksi
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
