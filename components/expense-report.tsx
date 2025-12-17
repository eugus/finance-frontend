"use client"

import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { Transaction, MonthlyStats, CategoryStats } from "@/lib/types"
import { getCategoryLabel } from "@/lib/finance-utils"

interface ExpenseReportProps {
  transactions: Transaction[]
  stats: MonthlyStats
  expenseStats: CategoryStats[]
  selectedMonth: Date
}

export default function ExpenseReport({ transactions, stats, expenseStats, selectedMonth }: ExpenseReportProps) {
  const generateReport = () => {
    const monthYear = format(selectedMonth, "MMMM 'de' yyyy", { locale: ptBR })
    const expenses = transactions.filter((t) => t.type === "expense")

    let html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Relatório de Despesas - ${monthYear}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      padding: 40px; 
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      min-height: 100vh;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: white;
      padding: 40px;
      text-align: center;
    }
    .header h1 { font-size: 32px; margin-bottom: 8px; }
    .header p { font-size: 18px; opacity: 0.9; }
    .content { padding: 40px; }
    .section { margin-bottom: 40px; }
    .section-title {
      font-size: 24px;
      color: #1e293b;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 3px solid #ef4444;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .stat-card {
      background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
      padding: 24px;
      border-radius: 12px;
      border-left: 4px solid #ef4444;
    }
    .stat-label { 
      font-size: 14px; 
      color: #991b1b; 
      margin-bottom: 8px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .stat-value { 
      font-size: 28px; 
      font-weight: bold; 
      color: #dc2626; 
    }
    .category-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      background: #fef2f2;
      border-radius: 8px;
      margin-bottom: 12px;
      border-left: 4px solid #ef4444;
    }
    .category-name { 
      font-weight: 600; 
      color: #1e293b;
      font-size: 16px;
    }
    .category-amount { 
      font-weight: bold; 
      color: #dc2626;
      font-size: 18px;
    }
    .category-percentage {
      font-size: 14px;
      color: #991b1b;
      margin-left: 12px;
    }
    .expense-item {
      padding: 20px;
      background: #ffffff;
      border: 1px solid #fee2e2;
      border-radius: 8px;
      margin-bottom: 12px;
      transition: all 0.2s;
    }
    .expense-item:hover {
      box-shadow: 0 4px 12px rgba(239,68,68,0.2);
      transform: translateY(-2px);
    }
    .expense-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .expense-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      background: #fee2e2;
      color: #991b1b;
    }
    .expense-amount {
      font-size: 20px;
      font-weight: bold;
      color: #dc2626;
    }
    .expense-details {
      color: #64748b;
      font-size: 14px;
      margin-top: 8px;
    }
    .footer {
      background: #fef2f2;
      padding: 24px 40px;
      text-align: center;
      color: #991b1b;
      font-size: 14px;
      border-top: 1px solid #fee2e2;
    }
    .alert-box {
      background: #fef2f2;
      border: 2px solid #fecaca;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 30px;
    }
    .alert-title {
      font-size: 18px;
      font-weight: bold;
      color: #dc2626;
      margin-bottom: 8px;
    }
    .alert-text {
      color: #991b1b;
      line-height: 1.6;
    }
    @media print {
      body { background: white; padding: 0; }
      .container { box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>💸 Relatório de Despesas</h1>
      <p>${monthYear}</p>
    </div>
    
    <div class="content">
      <div class="section">
        <h2 class="section-title">Resumo de Despesas</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-label">Total de Despesas</div>
            <div class="stat-value">${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(stats.totalExpenses)}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Número de Despesas</div>
            <div class="stat-value">${expenses.length}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Média por Despesa</div>
            <div class="stat-value">${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(expenses.length > 0 ? stats.totalExpenses / expenses.length : 0)}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Categorias</div>
            <div class="stat-value">${expenseStats.length}</div>
          </div>
        </div>
      </div>
`

    if (stats.balance < 0) {
      html += `
      <div class="alert-box">
        <div class="alert-title">⚠️ Atenção: Saldo Negativo</div>
        <div class="alert-text">
          Suas despesas superaram suas receitas em ${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Math.abs(stats.balance))}. 
          Considere revisar seus gastos e buscar formas de reduzir despesas ou aumentar receitas.
        </div>
      </div>
`
    }

    if (expenseStats.length > 0) {
      html += `
      <div class="section">
        <h2 class="section-title">Despesas por Categoria</h2>
`
      expenseStats.forEach((stat) => {
        const isStandard = [
          "food",
          "transport",
          "housing",
          "entertainment",
          "health",
          "education",
          "shopping",
          "bills",
          "other-expense",
        ].includes(stat.category)
        const label = isStandard ? getCategoryLabel(stat.category as any) : stat.category

        html += `
        <div class="category-item">
          <span class="category-name">${label}</span>
          <div>
            <span class="category-amount">${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(stat.amount)}</span>
            <span class="category-percentage">(${stat.percentage.toFixed(1)}%)</span>
          </div>
        </div>
`
      })
      html += `
      </div>
`
    }

    if (expenses.length > 0) {
      html += `
      <div class="section">
        <h2 class="section-title">Todas as Despesas</h2>
`
      const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

      sortedExpenses.forEach((expense) => {
        const date = format(new Date(expense.date), "dd/MM/yyyy")
        const isStandard = [
          "food",
          "transport",
          "housing",
          "entertainment",
          "health",
          "education",
          "shopping",
          "bills",
          "other-expense",
        ].includes(expense.category)
        const category = isStandard ? getCategoryLabel(expense.category as any) : expense.category

        html += `
        <div class="expense-item">
          <div class="expense-header">
            <span class="expense-badge">Despesa</span>
            <span class="expense-amount">${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(expense.amount)}</span>
          </div>
          <div class="expense-details">
            <strong>${expense.description}</strong> • ${category} • ${date}
            ${expense.isCredit || expense.is_credit ? ` • 💳 ${expense.creditCard || expense.card_name} (${expense.currentInstallment || expense.current_installment}/${expense.installments})` : ""}
          </div>
        </div>
`
      })
      html += `
      </div>
`
    }

    html += `
    </div>
    
    <div class="footer">
      Relatório de Despesas gerado em ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
    </div>
  </div>
</body>
</html>
`

    const blob = new Blob([html], { type: "text/html;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `relatorio-despesas-${format(selectedMonth, "yyyy-MM")}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <Button onClick={generateReport} variant="outline" className="gap-2 bg-transparent">
      <FileText className="h-4 w-4" />
      Relatório de Despesas
    </Button>
  )
}
