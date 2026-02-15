"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CategoryBadge } from "@/components/category-badge"
import { Plus, Trash2, Edit, ArrowLeft, CalendarDays } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { TransactionCategory } from "@/lib/types"
import { formatCurrency, getCategoryLabel } from "@/lib/finance-utils"
import { useRouter } from "next/navigation"

interface FixedExpense {
  id: string
  name: string
  description?: string
  amount: number
  category: TransactionCategory
  dayOfMonth: number
  isActive: boolean
  totalInstallments: number
}

const categories: TransactionCategory[] = [
  "housing",
  "bills",
  "transport",
  "health",
  "education",
  "food",
  "entertainment",
  "shopping",
  "other-expense",
]

export default function FixedExpensesPage() {
  const router = useRouter()
  const [expenses, setExpenses] = useState<FixedExpense[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Form state
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState<TransactionCategory>("bills")
  const [dayOfMonth, setDayOfMonth] = useState("1")
  const [installments, setInstallments] = useState("1")

  const installmentValue = amount && installments ? Number.parseFloat(amount) / Number.parseInt(installments) : 0

  useEffect(() => {
    fetchExpenses()
  }, [])

  const fetchExpenses = async () => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      const { data, error } = await supabase
        .from("fixed_expenses")
        .select("*")
        .eq("is_active", true)
        .order("day_of_month", { ascending: true })

      if (error) throw error

      setExpenses(
        (data || []).map((e) => ({
          id: e.id,
          name: e.name,
          description: e.description,
          amount: Number(e.amount),
          category: e.category,
          dayOfMonth: e.day_of_month,
          isActive: e.is_active,
          totalInstallments: e.total_installments || 1,
        })),
      )
    } catch (error) {
      console.error("Erro ao buscar despesas fixas:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !amount) return

    const supabase = createClient()

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        alert("Você precisa estar logado.")
        return
      }

      if (editingId) {
        const { error } = await supabase
          .from("fixed_expenses")
          .update({
            name,
            description,
            amount: Number.parseFloat(amount),
            category,
            day_of_month: Number.parseInt(dayOfMonth),
            total_installments: Number.parseInt(installments),
          })
          .eq("id", editingId)

        if (error) throw error
      } else {
        const { data: fixedExpense, error: insertError } = await supabase
          .from("fixed_expenses")
          .insert({
            user_id: user.id,
            name,
            description,
            amount: Number.parseFloat(amount),
            category,
            day_of_month: Number.parseInt(dayOfMonth),
            is_active: true,
            total_installments: Number.parseInt(installments),
          })
          .select()
          .single()

        if (insertError) throw insertError

        const transactions = []
        const totalMonths = Number.parseInt(installments)
        const amountPerMonth = Number.parseFloat(amount) / totalMonths
        const today = new Date()

        for (let i = 0; i < totalMonths; i++) {
          const dueDate = new Date(today.getFullYear(), today.getMonth() + i, Number.parseInt(dayOfMonth))

          transactions.push({
            user_id: user.id,
            type: "expense",
            amount: amountPerMonth,
            category,
            description: `${name} (${i + 1}/${totalMonths})`,
            date: dueDate.toISOString(),
            due_date: dueDate.toISOString().split("T")[0],
            expense_type: "fixed",
            is_paid: false,
            fixed_expense_id: fixedExpense.id,
          })
        }

        const { error: transactionsError } = await supabase.from("transactions").insert(transactions)

        if (transactionsError) throw transactionsError
      }

      resetForm()
      await fetchExpenses()
    } catch (error) {
      console.error("Erro ao salvar despesa fixa:", error)
      //alert("Erro ao salvar despesa fixa. Tente novamente.")
    }
  }

  const resetForm = () => {
    setName("")
    setDescription("")
    setAmount("")
    setCategory("bills")
    setDayOfMonth("1")
    setInstallments("1")
    setShowForm(false)
    setEditingId(null)
  }

  const editExpense = (expense: FixedExpense) => {
    setName(expense.name)
    setDescription(expense.description || "")
    setAmount(expense.amount.toString())
    setCategory(expense.category)
    setDayOfMonth(expense.dayOfMonth.toString())
    setInstallments((expense.totalInstallments || 1).toString())
    setEditingId(expense.id)
    setShowForm(true)
  }

  const deleteExpense = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta despesa fixa?")) return

    const supabase = createClient()

    try {
      const { error } = await supabase.from("fixed_expenses").update({ is_active: false }).eq("id", id)

      if (error) throw error

      await fetchExpenses()
    } catch (error) {
      console.error("Erro ao deletar despesa fixa:", error)
    }
  }

  const totalMonthly = expenses.reduce((sum, e) => sum + e.amount, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-950">
      <div className="container mx-auto px-6 py-8">
        <Button
          onClick={() => router.push("/dashboard")}
          variant="ghost"
          className="mb-4 gap-2 hover:bg-blue-100 dark:hover:bg-blue-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao Dashboard
        </Button>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Despesas Fixas
            </h1>
            <p className="text-muted-foreground">Gerencie suas despesas recorrentes mensais</p>
          </div>
          <Button
            onClick={() => {
              resetForm()
              setShowForm(!showForm)
            }}
            className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
          >
            <Plus className="h-4 w-4" />
            Nova Despesa Fixa
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8 border-none shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">{editingId ? "Editar" : "Adicionar"} Despesa Fixa</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome da Despesa</Label>
                    <Input
                      id="name"
                      placeholder="Ex: Aluguel, Internet, Academia"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Valor (R$)</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição (opcional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Detalhes sobre a despesa..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Select value={category} onValueChange={(v) => setCategory(v as TransactionCategory)}>
                      <SelectTrigger id="category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {getCategoryLabel(cat)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dayOfMonth">Dia do Vencimento</Label>
                    <Select value={dayOfMonth} onValueChange={setDayOfMonth}>
                      <SelectTrigger id="dayOfMonth">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                          <SelectItem key={day} value={day.toString()}>
                            Dia {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="installments">Quantidade de Meses</Label>
                  <Select value={installments} onValueChange={setInstallments}>
                    <SelectTrigger id="installments">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => i + 1).map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} meses
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {installmentValue > 0 && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      <strong>Valor mensal:</strong> {formatCurrency(installmentValue)}
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    {editingId ? "Atualizar" : "Adicionar"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card className="mb-6 border-none shadow-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium opacity-90 mb-1">Total de Despesas Fixas Mensais</div>
                <div className="text-4xl font-bold">{formatCurrency(totalMonthly)}</div>
              </div>
              <CalendarDays className="h-16 w-16 opacity-20" />
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando despesas fixas...</p>
          </div>
        ) : expenses.length === 0 ? (
          <Card className="border-none shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardContent className="py-12 text-center">
              <CalendarDays className="h-16 w-16 mx-auto mb-4 text-blue-400" />
              <p className="text-lg text-muted-foreground mb-4">Nenhuma despesa fixa cadastrada</p>
              <Button
                onClick={() => setShowForm(true)}
                variant="outline"
                className="gap-2 border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-950"
              >
                <Plus className="h-4 w-4" />
                Adicionar Primeira Despesa
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {expenses.map((expense) => (
              <Card
                key={expense.id}
                className="border-none shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{expense.name}</CardTitle>
                      <CategoryBadge category={expense.category} />
                    </div>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => editExpense(expense)} className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteExpense(expense.id)}
                        className="h-8 w-8 text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {expense.description && <p className="text-sm text-muted-foreground mb-4">{expense.description}</p>}

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Valor:</span>
                      <span className="text-xl font-bold text-red-600 dark:text-red-400">
                        {formatCurrency(expense.amount)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Vencimento:</span>
                      <span className="text-sm font-medium">Dia {expense.dayOfMonth}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
