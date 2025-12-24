"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Wallet } from "lucide-react"
import type { Transaction } from "@/types/transaction"

interface TransactionSummaryProps {
    transactions: Transaction[]
    }

    export function TransactionSummary({ transactions }: TransactionSummaryProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
        }).format(amount)
    }

    const income = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
    const expense = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
    const balance = income - expense

    return (
        <div className="space-y-4">
        <Card className="bg-gradient-to-br from-blue-100 to-blue-50 border-blue-200 shadow-lg">
            <CardHeader>
            <CardTitle className="text-blue-900">Financial Summary</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-900" />
                    <span className="text-sm font-medium text-blue-900">Total Income</span>
                </div>
                <span className="font-bold text-blue-900">{formatCurrency(income)}</span>
                </div>
                <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <TrendingDown className="h-5 w-5 text-blue-900" />
                    <span className="text-sm font-medium text-blue-900">Total Expense</span>
                </div>
                <span className="font-bold text-blue-900">{formatCurrency(expense)}</span>
                </div>
                <div className="border-t-2 border-blue-200 pt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-blue-900" />
                    <span className="text-sm font-medium text-blue-900">Balance</span>
                </div>
                <span className={`font-bold ${balance >= 0 ? "text-blue-900" : "text-blue-900"}`}>
                    {formatCurrency(balance)}
                </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Total Transactions: {transactions.length}</p>
            </div>
            </CardContent>
        </Card>
        </div>
    )
}