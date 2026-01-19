"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useFinanceStore } from "@/lib/finance-store"
import { getCategoryLabel } from "@/lib/finance-utils"
import { createClient } from "@/lib/supabase-client"
import { formatCurrency } from "@/lib/utils"
import type { TransactionType, TransactionCategory, ExpenseType } from "@/lib/types"

const incomeCategories: TransactionCategory[] = ["salary", "freelance", "investment", "other-income"]
const expenseCategories: TransactionCategory[] = [
  "food",
  "transport",
  "housing",
  "entertainment",
  "health",
  "education",
  "shopping",
  "bills",
  "other-expense",
]

export function TransactionForm() {
  const { addTransaction } = useFinanceStore()
  const [type, setType] = useState<TransactionType>("expense")
  const [category, setCategory] = useState<TransactionCategory>("food")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [expenseType, setExpenseType] = useState<ExpenseType>("normal")
  const [dueDate, setDueDate] = useState(new Date().toISOString().split("T")[0])
  const [creditCard, setCreditCard] = useState("")
  const [installments, setInstallments] = useState("1")
  const [currentInstallment, setCurrentInstallment] = useState("1")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const installmentValue = amount && installments ? Number.parseFloat(amount) / Number.parseInt(installments) : 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!amount || !description || !category) {
      return
    }

    if (type === "expense" && expenseType === "installment" && (!creditCard || Number.parseInt(installments) < 1)) {
      alert("Preencha o cartão e número de parcelas para lançamento parcelado")
      return
    }

    setIsSubmitting(true)

    try {
      // Despesas fixas vão para fixed_expenses
      if (type === "expense" && expenseType === "fixed") {
        // Salvar como despesa fixa
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          alert("Você precisa estar logado.")
          return
        }

        const { error } = await supabase.from("fixed_expenses").insert({
          user_id: user.id,
          name: description,
          description: description,
          amount: Number.parseFloat(amount),
          category,
          day_of_month: new Date(dueDate).getDate(),
          is_active: true,
          total_installments: Number.parseInt(installments) || 1,
        })

        if (error) throw error
      } else {
        await addTransaction({
          type,
          category,
          amount: Number.parseFloat(amount),
          description,
          date,
          due_date: type === "expense" ? dueDate : undefined,
          expense_type: type === "expense" ? expenseType : undefined,
          is_paid: false,
          isCredit: expenseType === "installment",
          creditCard: expenseType === "installment" ? creditCard : undefined,
          installments: expenseType === "installment" ? Number.parseInt(installments) : undefined,
          currentInstallment: expenseType === "installment" ? Number.parseInt(currentInstallment) : undefined,
        })
      }

      // Reset form
      setAmount("")
      setDescription("")
      setDate(new Date().toISOString().split("T")[0])
      setDueDate(new Date().toISOString().split("T")[0])
      setExpenseType("normal")
      setCreditCard("")
      setInstallments("1")
      setCurrentInstallment("1")
    } catch (error) {
      console.error("Erro ao adicionar transação:", error)
      alert("Erro ao adicionar transação. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const categories = type === "income" ? incomeCategories : expenseCategories

  return (
    <Card className="border-none shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-6">
      <CardHeader>
        <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Nova Transação
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Tabs
            value={type}
            onValueChange={(v) => {
              setType(v as TransactionType)
              if (v === "income") {
                setExpenseType("normal")
                setCreditCard("")
                setInstallments("1")
                setCurrentInstallment("1")
              }
            }}
          >
            <TabsList className="grid w-full grid-cols-2 bg-slate-100 dark:bg-slate-800">
              <TabsTrigger
                value="expense"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-pink-600 data-[state=active]:text-white"
              >
                Despesa
              </TabsTrigger>
              <TabsTrigger
                value="income"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white"
              >
                Receita
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              placeholder="Ex: Compras no supermercado"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
            <Label htmlFor="date">Data</Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>

          {type === "expense" && (
            <>
              <div className="space-y-3 pt-4 border-t">
                <Label>Tipo de Parcelamento</Label>
                <RadioGroup value={expenseType} onValueChange={(v) => setExpenseType(v as ExpenseType)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fixed" id="fixed" />
                    <Label htmlFor="fixed" className="cursor-pointer font-normal">
                      Despesa Fixa
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="installment" id="installment" />
                    <Label htmlFor="installment" className="cursor-pointer font-normal">
                      Lançamento Parcelado
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="normal" id="normal" />
                    <Label htmlFor="normal" className="cursor-pointer font-normal">
                      Lançamento Normal
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Data de Vencimento</Label>
                <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
              </div>

              {(expenseType === "installment" || expenseType === "fixed") && (
                <div className="space-y-4 pt-2">
                  {expenseType === "installment" && (
                    <div className="space-y-2">
                      <Label htmlFor="creditCard">Nome do Cartão</Label>
                      <Input
                        id="creditCard"
                        placeholder="Ex: Nubank, Itaú, Bradesco"
                        value={creditCard}
                        onChange={(e) => setCreditCard(e.target.value)}
                        required
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="installments">{expenseType === "fixed" ? "Meses" : "Quantidade"}</Label>
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

                    {expenseType === "installment" && (
                      <div className="space-y-2">
                        <Label htmlFor="currentInstallment">Parcela Atual</Label>
                        <Select value={currentInstallment} onValueChange={setCurrentInstallment}>
                          <SelectTrigger id="currentInstallment">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: Number.parseInt(installments) || 1 }, (_, i) => i + 1).map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num}ª parcela
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  {installmentValue > 0 && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-sm text-blue-600 dark:text-blue-400">
                        <strong>Valor por parcela:</strong> {formatCurrency(installmentValue)}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          <Button
            type="submit"
            className={`w-full shadow-lg ${
              type === "income"
                ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                : "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adicionando..." : "Adicionar Transação"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
