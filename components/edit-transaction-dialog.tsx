"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pencil } from "lucide-react"
import type { Transaction, TransactionType, TransactionCategory } from "@/lib/types"
import { getCategoryLabel } from "@/lib/finance-utils"

interface EditTransactionDialogProps {
  transaction: Transaction
  onUpdate: (id: string, updates: Partial<Transaction>) => Promise<void>
}

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

export function EditTransactionDialog({ transaction, onUpdate }: EditTransactionDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [type, setType] = useState<TransactionType>(transaction.type)
  const [amount, setAmount] = useState(transaction.amount.toString())
  const [category, setCategory] = useState<TransactionCategory | string>(transaction.category)
  const [description, setDescription] = useState(transaction.description)
  const [date, setDate] = useState(new Date(transaction.date).toISOString().split("T")[0])

  useEffect(() => {
    if (open) {
      setType(transaction.type)
      setAmount(transaction.amount.toString())
      setCategory(transaction.category)
      setDescription(transaction.description)
      setDate(new Date(transaction.date).toISOString().split("T")[0])
    }
  }, [open, transaction])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await onUpdate(transaction.id, {
        type,
        amount: Number.parseFloat(amount),
        category,
        description,
        date: new Date(date).toISOString(),
      })
      setOpen(false)
    } catch (error) {
      console.error("Erro ao atualizar transação:", error)
      alert("Erro ao atualizar transação. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const categories = type === "income" ? incomeCategories : expenseCategories

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Transação</DialogTitle>
          <DialogDescription>Faça as alterações necessárias na transação</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <Select value={type} onValueChange={(v) => setType(v as TransactionType)}>
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Receita</SelectItem>
                <SelectItem value="expense">Despesa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Valor (R$)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
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
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Salário mensal"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar Alterações"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
