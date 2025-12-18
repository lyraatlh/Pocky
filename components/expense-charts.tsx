"use client"

import { Card } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, LineChart, Line, XAxis, YAxis } from "recharts"
import type { Transaction } from "@/types/transaction"
import { TrendingUp, PieChartIcon } from "lucide-react"

interface ExpenseChartsProps {
    transactions: Transaction[]
    }

    const COLORS = ["#60a5fa", "#a78bfa", "#f472b6", "#34d399", "#fbbf24", "#fb923c"]

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
        <Card className="p-6 bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-violet-200 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
            <PieChartIcon className="h-6 w-6 text-primary" />
            <h3 className="text-xl font-bold text-primary">Expense by Category</h3>
            </div>

            {pieData.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
                No expense data yet. Add categories to your expenses!
            </p>
            ) : (
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value">
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

        <Card className="p-6 bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h3 className="text-xl font-bold text-primary">Monthly Trend</h3>
            </div>

            {lineData.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No data yet. Start tracking to see trends!</p>
            ) : (
            <>
                <ResponsiveContainer width="100%" height={250}>
                <LineChart data={lineData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => `Rp ${value.toLocaleString("id-ID")}`} />
                    <Legend />
                    <Line type="monotone" dataKey="income" stroke="#34d399" strokeWidth={2} />
                    <Line type="monotone" dataKey="expense" stroke="#f472b6" strokeWidth={2} />
                </LineChart>
                </ResponsiveContainer>

                <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-white rounded-lg">
                    <div className="text-sm text-muted-foreground">Savings Rate</div>
                    <div className="text-2xl font-bold text-green-600">{savingsRate.toFixed(1)}%</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                    <div className="text-sm text-muted-foreground">Avg Income</div>
                    <div className="text-2xl font-bold text-blue-600">
                    Rp {Math.round(totalIncome / Math.max(lineData.length, 1)).toLocaleString("id-ID")}
                    </div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                    <div className="text-sm text-muted-foreground">Avg Expense</div>
                    <div className="text-2xl font-bold text-pink-600">
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