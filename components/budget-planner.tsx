"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, TrendingDown, AlertCircle } from "lucide-react"
import type { Budget } from "@/types/budget"
import type { Transaction } from "@/types/transaction"

const BUDGET_COLORS = ["bg-blue-400", "bg-blue-500", "bg-cyan-400", "bg-sky-400", "bg-indigo-400", "bg-blue-300"]

interface BudgetPlannerProps {
    transactions: Transaction[]
    }

    export function BudgetPlanner({ transactions }: BudgetPlannerProps) {
    const [budgets, setBudgets] = useState<Budget[]>([])
    const [newCategory, setNewCategory] = useState("")
    const [newLimit, setNewLimit] = useState("")
    const [isAdding, setIsAdding] = useState(false)

    useEffect(() => {
        const saved = localStorage.getItem("budgets")
        if (saved) {
        setBudgets(JSON.parse(saved))
        }
    }, [])

    useEffect(() => {
        localStorage.setItem("budgets", JSON.stringify(budgets))
    }, [budgets])

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
        }).format(amount)
    }

    const addBudget = () => {
        if (newCategory.trim() && newLimit && Number.parseFloat(newLimit) > 0) {
        const budget: Budget = {
            id: Date.now().toString(),
            category: newCategory,
            limit: Number.parseFloat(newLimit),
            color: BUDGET_COLORS[budgets.length % BUDGET_COLORS.length],
        }
        setBudgets([...budgets, budget])
        setNewCategory("")
        setNewLimit("")
        setIsAdding(false)
        }
    }

    const deleteBudget = (id: string) => {
        if (confirm("Delete this budget?")) {
        setBudgets(budgets.filter((b) => b.id !== id))
        }
    }

    const getSpentAmount = (category: string) => {
        return transactions
        .filter((t) => t.type === "expense" && t.category === category)
        .reduce((sum, t) => sum + t.amount, 0)
    }

    const getPercentage = (spent: number, limit: number) => {
        return Math.min((spent / limit) * 100, 100)
    }

    return (
        <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200 shadow-lg">
        <CardHeader>
            <div className="flex items-center justify-between">
            <CardTitle className="text-blue-900">Budget Planner</CardTitle>
            <Button
                onClick={() => setIsAdding(!isAdding)}
                size="sm"
                className="bg-blue-900 hover:bg-blue-800 text-white gap-1"
            >
                <Plus className="h-4 w-4" />
                Add Budget
            </Button>
            </div>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
            {isAdding && (
                <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200 space-y-3">
                <Input
                    placeholder="Category name"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="border-blue-200 focus:border-blue-300 focus:ring-blue-200"
                />
                <Input
                    placeholder="Budget limit (Rp)"
                    type="number"
                    value={newLimit}
                    onChange={(e) => setNewLimit(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addBudget()}
                    className="border-blue-200 focus:border-blue-300 focus:ring-blue-200"
                    min="0"
                    step="10000"
                />
                <div className="flex gap-2">
                    <Button onClick={addBudget} className="flex-1 bg-blue-900 hover:bg-blue-800 text-white">
                    Create Budget
                    </Button>
                    <Button
                    onClick={() => {
                        setIsAdding(false)
                        setNewCategory("")
                        setNewLimit("")
                    }}
                    variant="outline"
                    className="border-blue-200 hover:bg-blue-50"
                    >
                    Cancel
                    </Button>
                </div>
                </div>
            )}

            <div className="space-y-3 max-h-96 overflow-y-auto">
                {budgets.length === 0 ? (
                <div className="text-center py-8 text-blue-900/60">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No budgets yet. Create one to start tracking spending!</p>
                </div>
                ) : (
                budgets.map((budget) => {
                    const spent = getSpentAmount(budget.category)
                    const percentage = getPercentage(spent, budget.limit)
                    const isOverBudget = spent > budget.limit

                    return (
                    <div
                        key={budget.id}
                        className="p-4 bg-gradient-to-r from-white to-blue-50 rounded-lg border-2 border-blue-200 hover:border-blue-300 transition-all"
                    >
                        <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full ${budget.color}`} />
                            <span className="font-semibold text-blue-900">{budget.category}</span>
                        </div>
                        <Button
                            onClick={() => deleteBudget(budget.id)}
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 hover:bg-rose-100 hover:text-rose-700 p-0"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        </div>

                        <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className={isOverBudget ? "text-rose-700 font-semibold" : "text-blue-900"}>
                            {formatCurrency(spent)} / {formatCurrency(budget.limit)}
                            </span>
                            <span className={`font-semibold ${isOverBudget ? "text-rose-700" : "text-blue-900"}`}>
                            {percentage.toFixed(0)}%
                            </span>
                        </div>
                        <div className="w-full h-3 bg-blue-200 rounded-full overflow-hidden">
                            <div
                            className={`h-full transition-all ${isOverBudget ? "bg-rose-500" : budget.color}`}
                            style={{ width: `${percentage}%` }}
                            />
                        </div>
                        {isOverBudget && (
                            <div className="flex items-center gap-1 text-xs text-rose-700 font-semibold">
                            <TrendingDown className="h-3 w-3" />
                            Over by {formatCurrency(spent - budget.limit)}
                            </div>
                        )}
                        </div>
                    </div>
                    )
                })
                )}
            </div>
            </div>
        </CardContent>
        </Card>
    )
}