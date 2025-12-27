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
    <Card className="p-6 bg-blue-50 dark:bg-[#002855] border-1 border-blue-200 dark:border-[#002855]">
        <div className="flex items-center gap-2 mb-4">
        <FileSpreadsheet className="h-6 w-6 text-blue-900 dark:text-white" />
        <h6 className="text-xl font-bold text-blue-900 dark:text-white">Export Data</h6>
        </div>

        <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
            <div className="flex-1 text-center p-3 bg-white dark:bg-[#001845] rounded-lg">
            <div className="w-full flex-1 text-xs text-muted-foreground dark:text-gray-400">Transactions</div>
            <div className="w-full flex-1 text-xl font-bold text-blue-900 dark:text-white">{transactions.length}</div>
            </div>
            <div className="flex-1 text-center p-3 bg-white dark:bg-[#001845] rounded-lg">
            <div className="w-full flex-1 text-xs text-muted-foreground dark:text-gray-400">Income</div>
            <div className="w-full flex-1 text-xl font-bold text-blue-900 dark:text-white">Rp {income.toLocaleString("id-ID")}</div>
            </div>
            <div className="flex-1 text-center p-3 bg-white dark:bg-[#001845] rounded-lg">
            <div className="w-full flex-1 text-xs text-muted-foreground dark:text-gray-400">Expense</div>
            <div className="w-full flex-1 text-xl font-bold text-blue-900 dark:text-white">Rp {expense.toLocaleString("id-ID")}</div>
            </div>
        </div>

        <Button
            onClick={exportToCSV}
            className="w-full text-gray-700 dark:text-white bg-blue-200 dark:bg-[#023E7D] hover:text-gray-800 dark:hover:text-white hover:bg-blue-100 dark:hover:bg-[#002855] border-1 border-blue-200 dark:border-[#023E7D]"
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