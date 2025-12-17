"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { useFinanceStore } from "@/lib/finance-store"
import { getCategoryLabel } from "@/lib/finance-utils"
import type { TransactionType, TransactionCategory } from "@/lib/types"

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
  const [isCredit, setIsCredit] = useState(false)
  const [creditCard, setCreditCard] = useState("")
  const [installments, setInstallments] = useState("1")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!amount || !description || !category) {
      return
    }

    if (isCredit && (!creditCard || Number.parseInt(installments) < 1)) {
      return
    }

    setIsSubmitting(true)

    try {
      await addTransaction({
        type,
        category,
        amount: Number.parseFloat(amount),
        description,
        date,
        isCredit: type === "expense" ? isCredit : false,
        creditCard: isCredit ? creditCard : undefined,
        installments: isCredit ? Number.parseInt(installments) : undefined,
      })

      // Reset form
      setAmount("")
      setDescription("")
      setDate(new Date().toISOString().split("T")[0])
      setIsCredit(false)
      setCreditCard("")
      setInstallments("1")
    } catch (error) {
      console.error("Erro ao adicionar transação:", error)
      alert("Erro ao adicionar transação. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const categories = type === "income" ? incomeCategories : expenseCategories

  return (
    <Card className="border-none shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-24">
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
                setIsCredit(false)
                setCreditCard("")
                setInstallments("1")
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
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isCredit"
                  checked={isCredit}
                  onCheckedChange={(checked) => setIsCredit(checked as boolean)}
                />
                <Label htmlFor="isCredit" className="cursor-pointer">
                  Pagamento no crédito
                </Label>
              </div>

              {isCredit && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="creditCard">Nome do Cartão</Label>
                    <Input
                      id="creditCard"
                      placeholder="Ex: Nubank, Itaú, Bradesco"
                      value={creditCard}
                      onChange={(e) => setCreditCard(e.target.value)}
                      required={isCredit}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="installments">Número de Parcelas</Label>
                    <Select value={installments} onValueChange={setInstallments}>
                      <SelectTrigger id="installments">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}x de {amount ? `R$ ${(Number.parseFloat(amount) / num).toFixed(2)}` : "R$ 0,00"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>
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
