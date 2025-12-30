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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className="bg-blue-100 dark:bg-[#002855] border-blue-200 dark:border-[#002855] shadow-lg">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-900 dark:text-white">Total Income</p>
              <p className="text-lg sm:text-xl font-bold text-blue-900 dark:text-white">{formatCurrency(income)}</p>
            </div>
            <div className="bg-blue-200 dark:bg-[#023E7D] p-3 rounded-full">
              <TrendingUp className="h-4 w-4 text-blue-900 dark:text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-rose-100 dark:bg-rose-900 border-rose-200 dark:border-rose-900 shadow-lg">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-rose-900 dark:text-white">Total Expense</p>
              <p className="text-lg sm:text-xl font-bold text-rose-900 dark:text-white">{formatCurrency(expense)}</p>
            </div>
            <div className="bg-rose-200 dark:bg-rose-800 p-3 rounded-full">
              <TrendingDown className="h-4 w-4 text-rose-700 dark:text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-100 dark:bg-[#002855] border-blue-200 dark:border-[#002855] shadow-lg">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-900 dark:text-white">Current Balance</p>
              <p
                className={`text-lg sm:text-xl font-bold ${balance >= 0 ? "text-blue-900 dark:text-white" : "text-rose-700 dark:text-white"}`}
              >
                {formatCurrency(balance)}
              </p>
            </div>
            <div className="bg-blue-200 dark:bg-[#023E7D] p-3 rounded-full">
              <Wallet className="h-4 w-4 text-blue-900 dark:text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}