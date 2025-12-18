"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, TrendingDown } from "lucide-react"
import type { Budget } from "@/types/budget"
import type { Transaction } from "@/types/transaction"

const BUDGET_COLORS = ["bg-blue-500", "bg-purple-500", "bg-pink-500", "bg-green-500", "bg-yellow-500", "bg-red-500"]

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

    const addBudget = () => {
        if (newCategory.trim() && newLimit) {
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
        setBudgets(budgets.filter((b) => b.id !== id))
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
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 shadow-lg">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-primary">Budget Planner</h3>
            <Button onClick={() => setIsAdding(!isAdding)} size="sm" className="bg-primary hover:bg-primary/90 text-white">
            <Plus className="h-4 w-4" />
            </Button>
        </div>

        {isAdding && (
            <div className="mb-4 p-4 bg-white rounded-lg border-2 border-primary/20">
            <div className="flex gap-2">
                <Input
                placeholder="Category (e.g., Food)"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="flex-1 border-primary/30"
                />
                <Input
                placeholder="Limit"
                type="number"
                value={newLimit}
                onChange={(e) => setNewLimit(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addBudget()}
                className="w-32 border-primary/30"
                />
                <Button onClick={addBudget} className="bg-primary hover:bg-primary/90 text-white">
                Add
                </Button>
            </div>
            </div>
        )}

        <div className="space-y-3 max-h-96 overflow-y-auto">
            {budgets.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No budgets set. Start planning your spending!</p>
            ) : (
            budgets.map((budget) => {
                const spent = getSpentAmount(budget.category)
                const percentage = getPercentage(spent, budget.limit)
                const isOverBudget = spent > budget.limit

                return (
                <div key={budget.id} className="p-4 bg-white rounded-lg border-2 border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${budget.color}`} />
                        <span className="font-semibold text-foreground">{budget.category}</span>
                    </div>
                    <Button onClick={() => deleteBudget(budget.id)} size="sm" variant="ghost" className="text-red-500">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                    </div>

                    <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className={isOverBudget ? "text-red-600 font-semibold" : "text-muted-foreground"}>
                        Rp {spent.toLocaleString("id-ID")} / Rp {budget.limit.toLocaleString("id-ID")}
                        </span>
                        <span className={isOverBudget ? "text-red-600 font-semibold" : "text-muted-foreground"}>
                        {percentage.toFixed(0)}%
                        </span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                        className={`h-full ${isOverBudget ? "bg-red-500" : budget.color} transition-all`}
                        style={{ width: `${percentage}%` }}
                        />
                    </div>
                    {isOverBudget && (
                        <div className="flex items-center gap-1 text-xs text-red-600">
                        <TrendingDown className="h-3 w-3" />
                        Over budget by Rp {(spent - budget.limit).toLocaleString("id-ID")}
                        </div>
                    )}
                    </div>
                </div>
                )
            })
            )}
        </div>
        </Card>
    )
}