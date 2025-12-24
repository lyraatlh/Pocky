import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Wallet } from "lucide-react"

interface StatsCardsProps {
  income: number
  expense: number
  balance: number
}

export function StatsCards({ income, expense, balance }: StatsCardsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount)
  }

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <Card className="bg-gradient-to-br from-blue-100 to-blue-50 border-blue-200 shadow-lg">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-900">Total Income</p>
              <p className="text-xl font-bold text-blue-900">{formatCurrency(income)}</p>
            </div>
            <div className="bg-blue-200 p-3 rounded-full">
              <TrendingUp className="h-4 w-4 text-blue-900" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-rose-100 to-rose-50 border-rose-200 shadow-lg">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-rose-900">Total Expense</p>
              <p className="text-xl font-bold text-rose-900">{formatCurrency(expense)}</p>
            </div>
            <div className="bg-rose-200 p-3 rounded-full">
              <TrendingDown className="h-4 w-4 text-rose-700" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-100 to-blue-50 border-blue-200 shadow-lg">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-900">Current Balance</p>
              <p className={`text-xl font-bold ${balance >= 0 ? "text-blue-900" : "text-rose-700"}`}>
                {formatCurrency(balance)}
              </p>
            </div>
            <div className="bg-blue-200 p-3 rounded-full">
              <Wallet className="h-4 w-4 text-blue-900" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
