"use client"

import { useEffect, useState } from "react"
import { useFinanceStore } from "@/lib/finance-store"
import { TransactionForm } from "@/components/transaction-form"
import { TransactionsList } from "@/components/transactions-list"
import { Button } from "@/components/ui/button"
import { ArrowLeft, TrendingDown, TrendingUp, DollarSign, Calendar } from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency, filterTransactionsByCardCycle } from "@/lib/finance-utils"
import { MonthSelector } from "@/components/month-selector"
import { CardBillingDayDialog } from "@/components/card-billing-day-dialog"
import { useCardSettings } from "@/hooks/use-card-settings"
import { startOfMonth } from "date-fns"

export default function TransactionsPage() {
  const { transactions, deleteTransaction, updateTransaction, fetchTransactions } = useFinanceStore()
  const { billingDay, isLoaded } = useCardSettings()
  const [selectedMonth, setSelectedMonth] = useState(startOfMonth(new Date()))

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  // Usar filtro de ciclo de cartão em vez de apenas mês do calendário
  const filteredTransactions = isLoaded
    ? filterTransactionsByCardCycle(transactions, selectedMonth, billingDay).filter((t) => {
      const isNormalExpense = !t.expense_type || t.expense_type === "normal" || t.expense_type === "installment"
      return isNormalExpense
    })
    : []

  const totalIncome = filteredTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = filteredTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="hover:bg-white/80 dark:hover:bg-slate-800/80">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Gerenciar Transações
              </h1>
              <p className="text-muted-foreground mt-1">Adicione e gerencie suas receitas e despesas</p>
            </div>
            <div className="flex items-center gap-2">
              <CardBillingDayDialog />
              <MonthSelector selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-none shadow-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white overflow-hidden relative">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
              <CardContent className="pt-6 relative">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium opacity-90">Receitas do Mês</span>
                </div>
                <p className="text-3xl font-bold">{formatCurrency(totalIncome)}</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-gradient-to-br from-red-500 to-pink-600 text-white overflow-hidden relative">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
              <CardContent className="pt-6 relative">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <TrendingDown className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium opacity-90">Despesas do Mês</span>
                </div>
                <p className="text-3xl font-bold">{formatCurrency(totalExpense)}</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white overflow-hidden relative">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
              <CardContent className="pt-6 relative">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium opacity-90">Transações do Mês</span>
                </div>
                <p className="text-3xl font-bold">{filteredTransactions.length}</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-gradient-to-br from-purple-500 to-violet-600 text-white overflow-hidden relative">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
              <CardContent className="pt-6 relative">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium opacity-90">Saldo do Mês</span>
                </div>
                <p className="text-3xl font-bold">{formatCurrency(totalIncome - totalExpense)}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <TransactionForm />
          </div>
          <div className="lg:col-span-2">
            <TransactionsList
              transactions={filteredTransactions}
              onDelete={deleteTransaction}
              onUpdate={updateTransaction}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
