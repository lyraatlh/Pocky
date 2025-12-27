"use client"

import { Card } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, LineChart, Line, XAxis, YAxis } from "recharts"
import type { Transaction } from "@/types/transaction"
import { TrendingUp, PieChartIcon } from "lucide-react"

interface ExpenseChartsProps {
    transactions: Transaction[]
    }

    const COLORS = ["#a6ceffff", "#a6ffacff", "#ffa6daff", "#b9a6ffff", "#ffc5a6ff", "#a6ceffff"]

    export function ExpenseCharts({ transactions }: ExpenseChartsProps) {
    // Category breakdown
    const categoryData = transactions
        .filter((t) => t.type === "expense" && t.category)
        .reduce(
        (acc, t) => {
            const category = t.category || "Other"
            acc[category] = (acc[category] || 0) + t.amount
            return acc
        },
        {} as Record<string, number>,
        )

    const pieData = Object.entries(categoryData).map(([name, value]) => ({
        name,
        value,
    }))

    // Monthly trend
    const monthlyData = transactions.reduce(
        (acc, t) => {
        const month = t.date.substring(0, 7) // YYYY-MM
        if (!acc[month]) {
            acc[month] = { income: 0, expense: 0 }
        }
        if (t.type === "income") {
            acc[month].income += t.amount
        } else {
            acc[month].expense += t.amount
        }
        return acc
        },
        {} as Record<string, { income: number; expense: number }>,
    )

    const lineData = Object.entries(monthlyData)
        .sort()
        .slice(-6)
        .map(([month, data]) => ({
        month: new Date(month + "-01").toLocaleDateString("id-ID", { month: "short" }),
        income: data.income,
        expense: data.expense,
        }))

    const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
    const totalExpense = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0

    return (
        <div className="space-y-6">
        <Card className="p-6 bg-blue-50 dark:bg-[#002855] border-1 border-blue-200 dark:border-[#002855]">
            <div className="flex items-center gap-2 mb-4">
            <PieChartIcon className="h-6 w-6 text-blue-900 dark:text-white" />
            <h3 className="text-xl font-bold text-blue-900 dark:text-white">Expense by Category</h3>
            </div>

            {pieData.length === 0 ? (
            <p className="text-center text-muted-foreground dark:text-gray-400 py-8">
                No expense data yet. Add categories to your expenses!
            </p>
            ) : (
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#a9a6ffff" dataKey="value">
                    {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip formatter={(value: number) => `Rp ${value.toLocaleString("id-ID")}`} />
                <Legend />
                </PieChart>
            </ResponsiveContainer>
            )}
        </Card>

        <Card className="p-6 bg-blue-50 dark:bg-[#002855] border-1 border-blue-200 dark:border-[#002855]">
            <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-6 w-6 text-blue-900 dark:text-white" />
            <h3 className="text-xl font-bold text-blue-900 dark:text-white">Monthly Trend</h3>
            </div>

            {lineData.length === 0 ? (
            <p className="text-center text-muted-foreground dark:text-gray-400 py-8">No data yet. Start tracking to see trends!</p>
            ) : (
            <>
                <ResponsiveContainer width="100%" height={250}>
                <LineChart data={lineData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => `Rp ${value.toLocaleString("id-ID")}`} />
                    <Legend />
                    <Line type="monotone" dataKey="income" stroke="#a6ceffff" strokeWidth={2} />
                    <Line type="monotone" dataKey="expense" stroke="#ffa6b2ff" strokeWidth={2} />
                </LineChart>
                </ResponsiveContainer>

                <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="flex-1 text-center p-3 bg-white dark:bg-[#001845] rounded-lg">
                    <div className="w-full flex-1 text-sm text-muted-foreground dark:text-gray-400">Savings Rate</div>
                    <div className="w-full flex-1 text-2xl font-bold text-blue-900 dark:text-white">{savingsRate.toFixed(1)}%</div>
                </div>
                <div className="flex-1 text-center p-3 bg-white dark:bg-[#001845] rounded-lg">
                    <div className="w-full flex-1 text-sm text-muted-foreground dark:text-gray-400">Avg Income</div>
                    <div className="w-full flex-1 text-2xl font-bold text-blue-900 dark:text-white">
                    Rp {Math.round(totalIncome / Math.max(lineData.length, 1)).toLocaleString("id-ID")}
                    </div>
                </div>
                <div className="flex-1 text-center p-3 bg-white dark:bg-[#001845] rounded-lg">
                    <div className="w-full flex-1 text-sm text-muted-foreground dark:text-gray-400">Avg Expense</div>
                    <div className="w-full flex-1 text-2xl font-bold text-blue-900 dark:text-white">
                    Rp {Math.round(totalExpense / Math.max(lineData.length, 1)).toLocaleString("id-ID")}
                    </div>
                </div>
                </div>
            </>
            )}
        </Card>
        </div>
    )
}