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
import { Textarea } from "@/components/ui/textarea"
import { Pencil } from "lucide-react"
import type { FuturePurchase, PurchasePriority, TransactionCategory } from "@/lib/types"
import { getCategoryLabel, formatDateToInput } from "@/lib/finance-utils"

interface EditPurchaseDialogProps {
  purchase: FuturePurchase
  onUpdate: (id: string, updates: Partial<FuturePurchase>) => Promise<void>
}

const categories: TransactionCategory[] = [
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

export function EditPurchaseDialog({ purchase, onUpdate }: EditPurchaseDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [name, setName] = useState(purchase.name)
  const [description, setDescription] = useState(purchase.description || "")
  const [estimatedPrice, setEstimatedPrice] = useState(purchase.estimatedPrice.toString())
  const [priority, setPriority] = useState<PurchasePriority>(purchase.priority)
  const [category, setCategory] = useState<TransactionCategory | string>(purchase.category as TransactionCategory | string)
  const [targetDate, setTargetDate] = useState(
    purchase.targetDate ? formatDateToInput(purchase.targetDate) : "",
  )

  useEffect(() => {
    if (open) {
      setName(purchase.name)
      setDescription(purchase.description || "")
      setEstimatedPrice(purchase.estimatedPrice.toString())
      setPriority(purchase.priority)
      setCategory(purchase.category as TransactionCategory | string)
      setTargetDate(purchase.targetDate ? formatDateToInput(purchase.targetDate) : "")
    }
  }, [open, purchase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await onUpdate(purchase.id, {
        name,
        description,
        estimatedPrice: Number.parseFloat(estimatedPrice),
        priority,
        category,
        targetDate: targetDate || undefined,
      })
      setOpen(false)
    } catch (error) {
      console.error("Erro ao atualizar compra futura:", error)
      alert("Erro ao atualizar compra futura. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Compra Futura</DialogTitle>
          <DialogDescription>Faça as alterações necessárias na compra futura</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Compra</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Notebook novo"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimatedPrice">Preço Estimado (R$)</Label>
            <Input
              id="estimatedPrice"
              type="number"
              step="0.01"
              min="0"
              value={estimatedPrice}
              onChange={(e) => setEstimatedPrice(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalhes sobre a compra..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Prioridade</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as PurchasePriority)}>
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetDate">Data Alvo (opcional)</Label>
            <Input id="targetDate" type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
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
