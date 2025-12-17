import type { Transaction, MonthlyStats, CategoryStats, TransactionCategory, PurchasePriority } from "./types"

export function calculateMonthlyStats(transactions: Transaction[]): MonthlyStats {
  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  return {
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses,
    transactionCount: transactions.length,
  }
}

export function calculateCategoryStats(transactions: Transaction[], type: "income" | "expense"): CategoryStats[] {
  const filtered = transactions.filter((t) => t.type === type)
  const total = filtered.reduce((sum, t) => sum + t.amount, 0)

  const categoryMap = new Map<TransactionCategory, number>()

  filtered.forEach((t) => {
    const cat = t.category as TransactionCategory
    const current = categoryMap.get(cat) || 0
    categoryMap.set(cat, current + t.amount)
  })

  return Array.from(categoryMap.entries())
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: total > 0 ? (amount / total) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount)
}

export function getCategoryLabel(category: TransactionCategory): string {
  const labels: Record<TransactionCategory, string> = {
    salary: "Salário",
    freelance: "Freelance",
    investment: "Investimento",
    "other-income": "Outras Receitas",
    food: "Alimentação",
    transport: "Transporte",
    housing: "Moradia",
    entertainment: "Entretenimento",
    health: "Saúde",
    education: "Educação",
    shopping: "Compras",
    bills: "Contas",
    "other-expense": "Outras Despesas",
  }
  return labels[category]
}

export function getCategoryColor(category: TransactionCategory): string {
  const colors: Record<TransactionCategory, string> = {
    salary: "#10b981",
    freelance: "#14b8a6",
    investment: "#06b6d4",
    "other-income": "#22d3ee",
    food: "#f97316",
    transport: "#3b82f6",
    housing: "#8b5cf6",
    entertainment: "#ec4899",
    health: "#ef4444",
    education: "#f59e0b",
    shopping: "#a855f7",
    bills: "#f43f5e",
    "other-expense": "#64748b",
  }
  return colors[category]
}

export function filterTransactionsByMonth(transactions: Transaction[], date: Date): Transaction[] {
  return transactions.filter((t) => {
    const tDate = new Date(t.date)
    return tDate.getFullYear() === date.getFullYear() && tDate.getMonth() === date.getMonth()
  })
}

export function getPriorityColor(priority: PurchasePriority): string {
  const colors: Record<PurchasePriority, string> = {
    low: "#10b981",
    medium: "#f59e0b",
    high: "#f97316",
    urgent: "#ef4444",
  }
  return colors[priority]
}

export function getPriorityLabel(priority: PurchasePriority): string {
  const labels: Record<PurchasePriority, string> = {
    low: "Baixa",
    medium: "Média",
    high: "Alta",
    urgent: "Urgente",
  }
  return labels[priority]
}
