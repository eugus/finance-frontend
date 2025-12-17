"use client"

import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { Transaction, MonthlyStats, CategoryStats } from "@/lib/types"
import { getCategoryLabel } from "@/lib/finance-utils"

interface FinancialAnalysisReportProps {
  transactions: Transaction[]
  stats: MonthlyStats
  expenseStats: CategoryStats[]
  incomeStats: CategoryStats[]
  selectedMonth: Date
}

export default function FinancialAnalysisReport({
  transactions,
  stats,
  expenseStats,
  incomeStats,
  selectedMonth,
}: FinancialAnalysisReportProps) {
  const generateReport = () => {
    const monthYear = format(selectedMonth, "MMMM 'de' yyyy", { locale: ptBR })
    const expenses = transactions.filter((t) => t.type === "expense")
    const incomes = transactions.filter((t) => t.type === "income")

    // Análises
    const savingsRate = stats.totalIncome > 0 ? ((stats.balance / stats.totalIncome) * 100).toFixed(1) : "0"
    const expenseRate = stats.totalIncome > 0 ? ((stats.totalExpenses / stats.totalIncome) * 100).toFixed(1) : "0"
    const topExpenseCategory = expenseStats.length > 0 ? expenseStats[0] : null
    const topIncomeCategory = incomeStats.length > 0 ? incomeStats[0] : null

    // Insights
    const insights = []
    if (stats.balance < 0) {
      insights.push({
        type: "warning",
        title: "Saldo Negativo",
        text: `Suas despesas superaram suas receitas em ${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Math.abs(stats.balance))}. É importante revisar seus gastos.`,
      })
    } else if (Number.parseFloat(savingsRate) > 20) {
      insights.push({
        type: "success",
        title: "Excelente Taxa de Poupança",
        text: `Você está economizando ${savingsRate}% da sua receita. Continue assim!`,
      })
    } else if (Number.parseFloat(savingsRate) < 10 && stats.balance > 0) {
      insights.push({
        type: "info",
        title: "Oportunidade de Economia",
        text: `Sua taxa de poupança é de ${savingsRate}%. Tente aumentar para pelo menos 20% para construir uma reserva financeira sólida.`,
      })
    }

    if (topExpenseCategory && topExpenseCategory.percentage > 40) {
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
      ].includes(topExpenseCategory.category)
      const label = isStandard ? getCategoryLabel(topExpenseCategory.category as any) : topExpenseCategory.category

      insights.push({
        type: "warning",
        title: "Concentração de Gastos",
        text: `${topExpenseCategory.percentage.toFixed(1)}% das suas despesas estão em ${label}. Considere diversificar ou reduzir gastos nesta categoria.`,
      })
    }

    if (Number.parseFloat(expenseRate) > 90) {
      insights.push({
        type: "warning",
        title: "Alto Comprometimento da Renda",
        text: `${expenseRate}% da sua receita está sendo gasta. Tente reduzir para ter mais margem de segurança financeira.`,
      })
    }

    const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Análise Financeira - ${monthYear}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      padding: 40px; 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
    }
    .container {
      max-width: 1000px;
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
    .header h1 { font-size: 36px; margin-bottom: 8px; }
    .header p { font-size: 18px; opacity: 0.9; }
    .content { padding: 40px; }
    .section { margin-bottom: 40px; }
    .section-title {
      font-size: 24px;
      color: #1e293b;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 3px solid #667eea;
      display: flex;
      align-items: center;
      gap: 10px;
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
    .insight-box {
      padding: 20px;
      border-radius: 12px;
      margin-bottom: 16px;
      border-left: 4px solid;
    }
    .insight-box.success {
      background: #d1fae5;
      border-color: #10b981;
    }
    .insight-box.warning {
      background: #fef3c7;
      border-color: #f59e0b;
    }
    .insight-box.info {
      background: #dbeafe;
      border-color: #3b82f6;
    }
    .insight-title {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 8px;
    }
    .insight-box.success .insight-title { color: #065f46; }
    .insight-box.warning .insight-title { color: #92400e; }
    .insight-box.info .insight-title { color: #1e40af; }
    .insight-text {
      line-height: 1.6;
    }
    .insight-box.success .insight-text { color: #047857; }
    .insight-box.warning .insight-text { color: #b45309; }
    .insight-box.info .insight-text { color: #2563eb; }
    .analysis-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }
    .analysis-card {
      background: #f8fafc;
      padding: 24px;
      border-radius: 12px;
      border: 2px solid #e2e8f0;
    }
    .analysis-card-title {
      font-size: 18px;
      font-weight: bold;
      color: #1e293b;
      margin-bottom: 16px;
    }
    .analysis-item {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #e2e8f0;
    }
    .analysis-item:last-child {
      border-bottom: none;
    }
    .analysis-label {
      color: #64748b;
      font-weight: 500;
    }
    .analysis-value {
      font-weight: bold;
      color: #1e293b;
    }
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
      <h1>📊 Análise Financeira Completa</h1>
      <p>${monthYear}</p>
    </div>
    
    <div class="content">
      <div class="section">
        <h2 class="section-title">📈 Visão Geral</h2>
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
            <div class="stat-label">Saldo do Mês</div>
            <div class="stat-value ${stats.balance >= 0 ? "positive" : "negative"}">${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(stats.balance)}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Taxa de Poupança</div>
            <div class="stat-value ${Number.parseFloat(savingsRate) > 20 ? "positive" : Number.parseFloat(savingsRate) < 10 ? "negative" : ""}">${savingsRate}%</div>
          </div>
        </div>
      </div>

      ${
        insights.length > 0
          ? `
      <div class="section">
        <h2 class="section-title">💡 Insights e Recomendações</h2>
        ${insights
          .map(
            (insight) => `
        <div class="insight-box ${insight.type}">
          <div class="insight-title">${insight.title}</div>
          <div class="insight-text">${insight.text}</div>
        </div>
        `,
          )
          .join("")}
      </div>
      `
          : ""
      }

      <div class="section">
        <h2 class="section-title">🔍 Análise Detalhada</h2>
        <div class="analysis-grid">
          <div class="analysis-card">
            <div class="analysis-card-title">Indicadores Financeiros</div>
            <div class="analysis-item">
              <span class="analysis-label">Comprometimento da Renda</span>
              <span class="analysis-value">${expenseRate}%</span>
            </div>
            <div class="analysis-item">
              <span class="analysis-label">Taxa de Economia</span>
              <span class="analysis-value">${savingsRate}%</span>
            </div>
            <div class="analysis-item">
              <span class="analysis-label">Média de Receita</span>
              <span class="analysis-value">${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(incomes.length > 0 ? stats.totalIncome / incomes.length : 0)}</span>
            </div>
            <div class="analysis-item">
              <span class="analysis-label">Média de Despesa</span>
              <span class="analysis-value">${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(expenses.length > 0 ? stats.totalExpenses / expenses.length : 0)}</span>
            </div>
          </div>

          <div class="analysis-card">
            <div class="analysis-card-title">Resumo de Transações</div>
            <div class="analysis-item">
              <span class="analysis-label">Total de Transações</span>
              <span class="analysis-value">${stats.transactionCount}</span>
            </div>
            <div class="analysis-item">
              <span class="analysis-label">Receitas</span>
              <span class="analysis-value">${incomes.length}</span>
            </div>
            <div class="analysis-item">
              <span class="analysis-label">Despesas</span>
              <span class="analysis-value">${expenses.length}</span>
            </div>
            <div class="analysis-item">
              <span class="analysis-label">Categorias Ativas</span>
              <span class="analysis-value">${expenseStats.length + incomeStats.length}</span>
            </div>
          </div>
        </div>
      </div>

      ${
        incomeStats.length > 0
          ? `
      <div class="section">
        <h2 class="section-title">💰 Receitas por Categoria</h2>
        ${incomeStats
          .map((stat) => {
            const isStandard = ["salary", "freelance", "investment", "other-income"].includes(stat.category)
            const label = isStandard ? getCategoryLabel(stat.category as any) : stat.category
            return `
        <div class="category-item">
          <span class="category-name">${label}</span>
          <div>
            <span class="category-amount">${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(stat.amount)}</span>
            <span class="category-percentage">(${stat.percentage.toFixed(1)}%)</span>
          </div>
        </div>
        `
          })
          .join("")}
      </div>
      `
          : ""
      }

      ${
        expenseStats.length > 0
          ? `
      <div class="section">
        <h2 class="section-title">💸 Despesas por Categoria</h2>
        ${expenseStats
          .map((stat) => {
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
            return `
        <div class="category-item">
          <span class="category-name">${label}</span>
          <div>
            <span class="category-amount">${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(stat.amount)}</span>
            <span class="category-percentage">(${stat.percentage.toFixed(1)}%)</span>
          </div>
        </div>
        `
          })
          .join("")}
      </div>
      `
          : ""
      }
    </div>
    
    <div class="footer">
      Análise Financeira gerada em ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
    </div>
  </div>
</body>
</html>
`

    const blob = new Blob([html], { type: "text/html;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `analise-financeira-${format(selectedMonth, "yyyy-MM")}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <Button onClick={generateReport} className="gap-2">
      <FileText className="h-4 w-4" />
      Análise Financeira
    </Button>
  )
}
