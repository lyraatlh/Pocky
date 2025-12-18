export interface Transaction {
  id: string
  type: "income" | "expense"
  description: string
  amount: number
  date: string
  category?: string
}

export interface Budget {
  id: string
  category: string
  limit: number
  color: string
}