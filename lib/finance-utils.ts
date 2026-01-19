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

  const categoryMap = new Map<string, number>()

  filtered.forEach((t) => {
    const current = categoryMap.get(t.category) || 0
    categoryMap.set(t.category, current + t.amount)
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

export function getCategoryLabel(category: TransactionCategory | string): string {
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
  // Se for uma categoria padrão, retorna o label, senão retorna a própria string
  return labels[category as TransactionCategory] || category
}

export function getCategoryColor(category: TransactionCategory | string): string {
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
  // Se for uma categoria padrão, retorna a cor, senão retorna uma cor padrão
  return colors[category as TransactionCategory] || "#64748b"
}

export function filterTransactionsByMonth(transactions: Transaction[], date: Date): Transaction[] {
  return transactions.filter((t) => {
    const tDate = new Date(t.date)
    return tDate.getFullYear() === date.getFullYear() && tDate.getMonth() === date.getMonth()
  })
}

export function getCardBillingCycle(date: Date, billingDay: number): { startDate: Date; endDate: Date } {
  // Se o dia de vencimento já passou neste mês, o ciclo é até este mês
  // Caso contrário, o ciclo anterior já começou
  const currentDay = date.getDate()
  const currentMonth = date.getMonth()
  const currentYear = date.getFullYear()

  let cycleStartDate: Date
  let cycleEndDate: Date

  if (currentDay >= billingDay) {
    // O ciclo atual começou no billingDay deste mês
    cycleStartDate = new Date(currentYear, currentMonth, billingDay)
    // O ciclo termina um dia antes do billingDay do próximo mês
    cycleEndDate = new Date(currentYear, currentMonth + 1, billingDay - 1)
  } else {
    // O ciclo atual começou no billingDay do mês anterior
    cycleStartDate = new Date(currentYear, currentMonth - 1, billingDay)
    // O ciclo termina um dia antes do billingDay deste mês
    cycleEndDate = new Date(currentYear, currentMonth, billingDay - 1)
  }

  return { startDate: cycleStartDate, endDate: cycleEndDate }
}

export function filterTransactionsByCardCycle(
  transactions: Transaction[],
  date: Date,
  billingDay: number,
): Transaction[] {
  const { startDate, endDate } = getCardBillingCycle(date, billingDay)

  return transactions.filter((t) => {
    const tDate = new Date(t.date)
    return tDate >= startDate && tDate <= endDate
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

/**
 * Converte uma data ISO (YYYY-MM-DD) para o formato de input date sem problemas de timezone
 * @param isoDate Data no formato ISO (ex: "2026-01-20")
 * @returns Data formatada para input type="date"
 */
export function formatDateToInput(isoDate: string): string {
  if (!isoDate) return ""
  // Se for apenas a data (YYYY-MM-DD), retorna como está
  if (isoDate.length === 10) {
    return isoDate
  }
  // Se for ISO completo, extrai apenas a data
  return isoDate.split("T")[0]
}

/**
 * Formata uma data de string para exibição, evitando problemas de timezone
 * @param dateString Data como string (ISO format ou YYYY-MM-DD)
 * @param locale Locale para formatação
 * @returns Data formatada para exibição
 */
export function formatDateForDisplay(dateString: string, locale: any): string {
  if (!dateString) return ""
  // Adiciona T00:00:00 para garantir que a data não sofra ajustes de timezone
  const dateWithTime = dateString.includes("T") ? dateString : `${dateString}T00:00:00`
  const date = new Date(dateWithTime)

  // Use Intl.DateTimeFormat para evitar problemas de timezone
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date)
}
