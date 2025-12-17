export type TransactionType = "income" | "expense"

export type TransactionCategory =
  | "salary"
  | "freelance"
  | "investment"
  | "other-income"
  | "food"
  | "transport"
  | "housing"
  | "entertainment"
  | "health"
  | "education"
  | "shopping"
  | "bills"
  | "other-expense"

export interface CustomCategory {
  id: string
  name: string
  color: string
  type: "income" | "expense"
  createdAt: string
}

export type PurchasePriority = "low" | "medium" | "high" | "urgent"

export interface FuturePurchase {
  id: string
  name: string
  description: string
  estimatedPrice: number
  priority: PurchasePriority
  category: TransactionCategory | string
  targetDate?: string
  createdAt: string
  completed: boolean
}

export interface Transaction {
  id: string
  type: TransactionType
  category: TransactionCategory | string // Permitindo categorias customizadas
  amount: number
  description: string
  date: string
  createdAt?: string
  created_at?: string
  // Campos de parcelamento
  isCredit?: boolean
  is_credit?: boolean
  creditCard?: string
  card_name?: string
  installments?: number
  currentInstallment?: number
  current_installment?: number
  installmentGroupId?: string
  installment_group_id?: string
}

export interface MonthlyStats {
  totalIncome: number
  totalExpenses: number
  balance: number
  transactionCount: number
}

export interface CategoryStats {
  category: TransactionCategory | string // Permitindo categorias customizadas
  amount: number
  percentage: number
}
