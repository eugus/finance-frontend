"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { Transaction, MonthlyStats, CategoryStats } from "@/lib/types"
import { getCategoryLabel } from "@/lib/finance-utils"

interface PDFExportProps {
  transactions: Transaction[]
  stats: MonthlyStats
  expenseStats: CategoryStats[]
  incomeStats: CategoryStats[]
  selectedMonth: Date
}

export function PDFExport({ transactions, stats, expenseStats, incomeStats, selectedMonth }: PDFExportProps) {
  const generatePDF = () => {
    const monthYear = format(selectedMonth, "MMMM 'de' yyyy", { locale: ptBR })

    let content = `RELATÓRIO FINANCEIRO - ${monthYear.toUpperCase()}\n\n`
    content += `==============================================\n\n`

    content += `RESUMO GERAL\n`
    content += `----------------------------------------------\n`
    content += `Total de Receitas: ${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(stats.totalIncome)}\n`
    content += `Total de Despesas: ${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(stats.totalExpenses)}\n`
    content += `Saldo: ${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(stats.balance)}\n`
    content += `Total de Transações: ${stats.transactionCount}\n\n`

    if (incomeStats.length > 0) {
      content += `RECEITAS POR CATEGORIA\n`
      content += `----------------------------------------------\n`
      incomeStats.forEach((stat) => {
        content += `${getCategoryLabel(stat.category)}: ${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(stat.amount)} (${stat.percentage.toFixed(1)}%)\n`
      })
      content += `\n`
    }

    if (expenseStats.length > 0) {
      content += `DESPESAS POR CATEGORIA\n`
      content += `----------------------------------------------\n`
      expenseStats.forEach((stat) => {
        content += `${getCategoryLabel(stat.category)}: ${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(stat.amount)} (${stat.percentage.toFixed(1)}%)\n`
      })
      content += `\n`
    }

    if (transactions.length > 0) {
      content += `TRANSAÇÕES DETALHADAS\n`
      content += `----------------------------------------------\n`

      const sortedTransactions = [...transactions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      )

      sortedTransactions.forEach((transaction) => {
        const date = format(new Date(transaction.date), "dd/MM/yyyy")
        const type = transaction.type === "income" ? "RECEITA" : "DESPESA"
        const category = getCategoryLabel(transaction.category)
        const amount = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(transaction.amount)

        content += `${date} | ${type} | ${category}\n`
        content += `  ${transaction.description} - ${amount}\n\n`
      })
    }

    content += `==============================================\n`
    content += `Relatório gerado em ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}\n`

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `relatorio-financeiro-${format(selectedMonth, "yyyy-MM")}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <Button onClick={generatePDF} variant="outline" className="gap-2 bg-transparent">
      <Download className="h-4 w-4" />
      Exportar Relatório
    </Button>
  )
}
