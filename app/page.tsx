"use client"

import { useFinanceStore } from "@/lib/finance-store"
import { calculateMonthlyStats, calculateCategoryStats, formatCurrency } from "@/lib/finance-utils"
import { StatsCard } from "@/components/stats-card"
import { ExpenseChart } from "@/components/expense-chart"
import { IncomeChart } from "@/components/income-chart"
import { MonthlyTrendChart } from "@/components/monthly-trend-chart"
import { RecentTransactions } from "@/components/recent-transactions"
import { MonthSelector } from "@/components/month-selector"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Wallet, Receipt, Plus, Download, Sparkles } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { startOfMonth } from "date-fns"
import ExpenseReport from "@/components/expense-report"
import FinancialAnalysisReport from "@/components/financial-analysis-report"

export default function DashboardPage() {
  const { transactions, deleteTransaction, loadSampleData, fetchTransactions, isLoading } = useFinanceStore()
  const [selectedMonth, setSelectedMonth] = useState(startOfMonth(new Date()))

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  const filteredTransactions = transactions.filter((t) => {
    const tDate = new Date(t.date)
    return tDate.getFullYear() === selectedMonth.getFullYear() && tDate.getMonth() === selectedMonth.getMonth()
  })

  const stats = calculateMonthlyStats(filteredTransactions)
  const expenseStats = calculateCategoryStats(filteredTransactions, "expense")
  const incomeStats = calculateCategoryStats(filteredTransactions, "income")

  const hasData = filteredTransactions.length > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Dashboard Financeiro
            </h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Acompanhe suas finanças em tempo real
            </p>
          </div>
          <div className="flex gap-2">
            {transactions.length === 0 && (
              <Button variant="outline" onClick={loadSampleData} className="gap-2 border-2 bg-transparent">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Carregar Dados de Exemplo</span>
              </Button>
            )}
            <Link href="/transactions">
              <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all">
                <Plus className="h-4 w-4" />
                Nova Transação
              </Button>
            </Link>
          </div>
        </div>

        {transactions.length > 0 && (
          <div className="flex items-center justify-between">
            <MonthSelector selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />
            <div className="flex gap-2">
              <ExpenseReport
                transactions={filteredTransactions}
                stats={stats}
                expenseStats={expenseStats}
                selectedMonth={selectedMonth}
              />
              <FinancialAnalysisReport
                transactions={filteredTransactions}
                stats={stats}
                expenseStats={expenseStats}
                incomeStats={incomeStats}
                selectedMonth={selectedMonth}
              />
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-950 dark:to-purple-950 p-6">
              <Wallet className="h-12 w-12 text-blue-600 dark:text-blue-400 animate-pulse" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold">Carregando...</h2>
              <p className="text-muted-foreground">Buscando suas transações do banco de dados</p>
            </div>
          </div>
        ) : !hasData ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-6">
            <div className="rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-950 dark:to-purple-950 p-8 shadow-lg">
              <Wallet className="h-16 w-16 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-center space-y-3 max-w-md">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {transactions.length === 0 ? "Nenhuma transação encontrada" : "Nenhuma transação neste mês"}
              </h2>
              <p className="text-muted-foreground text-lg">
                {transactions.length === 0
                  ? "Comece adicionando suas primeiras transações ou carregue dados de exemplo para ver o sistema em ação."
                  : "Não há transações registradas para este mês. Adicione uma nova transação ou selecione outro mês."}
              </p>
            </div>
            <div className="flex gap-3">
              {transactions.length === 0 && (
                <Button onClick={loadSampleData} variant="outline" className="gap-2 border-2 h-11 bg-transparent">
                  <Download className="h-5 w-5" />
                  Carregar Dados de Exemplo
                </Button>
              )}
              <Link href="/transactions">
                <Button className="gap-2 h-11 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all">
                  <Plus className="h-5 w-5" />
                  Adicionar Transação
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Receitas"
                value={formatCurrency(stats.totalIncome)}
                icon={TrendingUp}
                description="Total de receitas"
              />
              <StatsCard
                title="Despesas"
                value={formatCurrency(stats.totalExpenses)}
                icon={TrendingDown}
                description="Total de despesas"
              />
              <StatsCard
                title="Saldo"
                value={formatCurrency(stats.balance)}
                icon={Wallet}
                description="Receitas - Despesas"
              />
              <StatsCard
                title="Transações"
                value={stats.transactionCount.toString()}
                icon={Receipt}
                description="Total de transações"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <ExpenseChart data={expenseStats} />
              <IncomeChart data={incomeStats} />
            </div>

            <MonthlyTrendChart transactions={transactions} />

            <RecentTransactions transactions={filteredTransactions} onDelete={deleteTransaction} />
          </>
        )}
      </div>
    </div>
  )
}
