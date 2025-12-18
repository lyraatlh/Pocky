"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download, FileSpreadsheet } from "lucide-react"
import type { Transaction } from "@/types/transaction"

interface ExportDataProps {
    transactions: Transaction[]
    }

    export function ExportData({ transactions }: ExportDataProps) {
    const exportToCSV = () => {
    if (transactions.length === 0) {
        alert("No data to export!")
        return
    }

    const headers = ["Date", "Type", "Description", "Category", "Amount"]
    const rows = transactions.map((t) => [t.date, t.type, t.description, t.category || "-", t.amount.toString()])

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)

    link.setAttribute("href", url)
    link.setAttribute("download", `cinnamoroll-expense-tracker-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    }

    const income = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
    const expense = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
    const balance = income - expense

    return (
    <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
        <FileSpreadsheet className="h-6 w-6 text-primary" />
        <h3 className="text-xl font-bold text-primary">Export Data</h3>
        </div>

        <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-white rounded-lg">
            <div className="text-xs text-muted-foreground">Transactions</div>
            <div className="text-xl font-bold text-primary">{transactions.length}</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
            <div className="text-xs text-muted-foreground">Income</div>
            <div className="text-xl font-bold text-green-600">Rp {income.toLocaleString("id-ID")}</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
            <div className="text-xs text-muted-foreground">Expense</div>
            <div className="text-xl font-bold text-red-600">Rp {expense.toLocaleString("id-ID")}</div>
            </div>
        </div>

        <Button
            onClick={exportToCSV}
            className="w-full bg-primary hover:bg-primary/90 text-white"
            disabled={transactions.length === 0}
        >
            <Download className="mr-2 h-5 w-5" />
            Export to CSV
        </Button>

        <p className="text-xs text-center text-muted-foreground">
            Download your complete transaction history in CSV format
        </p>
        </div>
    </Card>
    )
}