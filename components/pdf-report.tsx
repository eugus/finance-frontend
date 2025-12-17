"use client"

import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { Transaction, MonthlyStats, CategoryStats } from "@/lib/types"
import { getCategoryLabel } from "@/lib/finance-utils"

interface PDFReportProps {
  transactions: Transaction[]
  stats: MonthlyStats
  expenseStats: CategoryStats[]
  incomeStats: CategoryStats[]
  selectedMonth: Date
}

export function PDFReport({ transactions, stats, expenseStats, incomeStats, selectedMonth }: PDFReportProps) {
  const generateReport = () => {
    const monthYear = format(selectedMonth, "MMMM 'de' yyyy", { locale: ptBR })

    let html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Relatório Financeiro - ${monthYear}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      padding: 40px; 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
      border-bottom: 3px solid #667eea;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .stat-card {
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      padding: 24px;
      border-radius: 12px;
      border-left: 4px solid #667eea;
    }
    .stat-label { 
      font-size: 14px; 
      color: #64748b; 
      margin-bottom: 8px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .stat-value { 
      font-size: 28px; 
      font-weight: bold; 
      color: #1e293b; 
    }
    .stat-value.positive { color: #10b981; }
    .stat-value.negative { color: #ef4444; }
    .category-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      background: #f8fafc;
      border-radius: 8px;
      margin-bottom: 12px;
      border-left: 4px solid #667eea;
    }
    .category-name { 
      font-weight: 600; 
      color: #1e293b;
      font-size: 16px;
    }
    .category-amount { 
      font-weight: bold; 
      color: #667eea;
      font-size: 18px;
    }
    .category-percentage {
      font-size: 14px;
      color: #64748b;
      margin-left: 12px;
    }
    .transaction-item {
      padding: 20px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      margin-bottom: 12px;
      transition: all 0.2s;
    }
    .transaction-item:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      transform: translateY(-2px);
    }
    .transaction-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .transaction-type {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .transaction-type.income {
      background: #d1fae5;
      color: #065f46;
    }
    .transaction-type.expense {
      background: #fee2e2;
      color: #991b1b;
    }
    .transaction-amount {
      font-size: 20px;
      font-weight: bold;
    }
    .transaction-amount.income { color: #10b981; }
    .transaction-amount.expense { color: #ef4444; }
    .transaction-details {
      color: #64748b;
      font-size: 14px;
      margin-top: 8px;
    }
    .footer {
      background: #f8fafc;
      padding: 24px 40px;
      text-align: center;
      color: #64748b;
      font-size: 14px;
      border-top: 1px solid #e2e8f0;
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
      <h1>📊 Relatório Financeiro</h1>
      <p>${monthYear}</p>
    </div>
    
    <div class="content">
      <div class="section">
        <h2 class="section-title">Resumo Geral</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-label">Total de Receitas</div>
            <div class="stat-value positive">${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(stats.totalIncome)}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Total de Despesas</div>
            <div class="stat-value negative">${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(stats.totalExpenses)}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Saldo</div>
            <div class="stat-value ${stats.balance >= 0 ? "positive" : "negative"}">${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(stats.balance)}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Transações</div>
            <div class="stat-value">${stats.transactionCount}</div>
          </div>
        </div>
      </div>
`

    if (incomeStats.length > 0) {
      html += `
      <div class="section">
        <h2 class="section-title">Receitas por Categoria</h2>
`
      incomeStats.forEach((stat) => {
        const isStandard = [
          "salary",
          "freelance",
          "investment",
          "other-income",
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

    if (expenseStats.length > 0) {
      html += `
      <div class="section">
        <h2 class="section-title">Despesas por Categoria</h2>
`
      expenseStats.forEach((stat) => {
        const isStandard = [
          "salary",
          "freelance",
          "investment",
          "other-income",
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

    if (transactions.length > 0) {
      html += `
      <div class="section">
        <h2 class="section-title">Transações Detalhadas</h2>
`
      const sortedTransactions = [...transactions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      )

      sortedTransactions.forEach((transaction) => {
        const date = format(new Date(transaction.date), "dd/MM/yyyy")
        const isStandard = [
          "salary",
          "freelance",
          "investment",
          "other-income",
          "food",
          "transport",
          "housing",
          "entertainment",
          "health",
          "education",
          "shopping",
          "bills",
          "other-expense",
        ].includes(transaction.category)
        const category = isStandard ? getCategoryLabel(transaction.category as any) : transaction.category

        html += `
        <div class="transaction-item">
          <div class="transaction-header">
            <span class="transaction-type ${transaction.type}">${transaction.type === "income" ? "Receita" : "Despesa"}</span>
            <span class="transaction-amount ${transaction.type}">${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(transaction.amount)}</span>
          </div>
          <div class="transaction-details">
            <strong>${transaction.description}</strong> • ${category} • ${date}
            ${transaction.isCredit || transaction.is_credit ? ` • 💳 ${transaction.creditCard || transaction.card_name} (${transaction.currentInstallment || transaction.current_installment}/${transaction.installments})` : ""}
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
      Relatório gerado em ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
    </div>
  </div>
</body>
</html>
`

    const blob = new Blob([html], { type: "text/html;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `relatorio-financeiro-${format(selectedMonth, "yyyy-MM")}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <Button onClick={generateReport} variant="outline" className="gap-2 bg-transparent">
      <FileText className="h-4 w-4" />
      Gerar Relatório Visual
    </Button>
  )
}
