"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { PriorityBadge } from "@/components/priority-bagde" // Corrigindo import do PriorityBadge
import { CategoryBadge } from "@/components/category-badge"
import { Plus, Trash2, Check, ShoppingBag, ArrowLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { FuturePurchase, PurchasePriority, TransactionCategory } from "@/lib/types"
import { formatCurrency, getCategoryLabel, formatDateForDisplay } from "@/lib/finance-utils"
import { EditPurchaseDialog } from "@/components/edit-purchase-dialog" // Importar dialog de edição
import { useRouter } from "next/navigation"
import { ptBR } from "date-fns/locale"

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

export default function FuturePurchasesPage() {
  const router = useRouter()
  const [purchases, setPurchases] = useState<FuturePurchase[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [filterPriority, setFilterPriority] = useState<PurchasePriority | "all">("all")
  const [filterCompleted, setFilterCompleted] = useState<"all" | "pending" | "completed">("pending")

  // Form state
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [estimatedPrice, setEstimatedPrice] = useState("")
  const [priority, setPriority] = useState<PurchasePriority>("medium")
  const [category, setCategory] = useState<TransactionCategory>("shopping")
  const [targetDate, setTargetDate] = useState("")

  useEffect(() => {
    fetchPurchases()
  }, [])

  const fetchPurchases = async () => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      const { data, error } = await supabase
        .from("future_purchases")
        .select("*")
        .order("priority", { ascending: false })
        .order("created_at", { ascending: false })

      if (error) throw error

      setPurchases(
        (data || []).map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          estimatedPrice: p.estimated_price,
          priority: p.priority,
          category: p.category,
          targetDate: p.target_date,
          createdAt: p.created_at,
          completed: p.completed,
        })),
      )
    } catch (error) {
      console.error("Erro ao buscar compras futuras:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !estimatedPrice) return

    const supabase = createClient()

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        alert("Você precisa estar logado para adicionar compras futuras.")
        return
      }

      const { error } = await supabase.from("future_purchases").insert({
        user_id: user.id, // Adicionando user_id
        name,
        description,
        estimated_price: Number.parseFloat(estimatedPrice),
        priority,
        category,
        target_date: targetDate || null,
        completed: false,
      })

      if (error) throw error

      // Reset form
      setName("")
      setDescription("")
      setEstimatedPrice("")
      setPriority("medium")
      setCategory("shopping")
      setTargetDate("")
      setShowForm(false)

      await fetchPurchases()
    } catch (error) {
      console.error("Erro ao adicionar compra futura:", error)
      alert("Erro ao adicionar compra futura. Tente novamente.")
    }
  }

  const toggleCompleted = async (id: string, currentStatus: boolean) => {
    const supabase = createClient()

    try {
      const { error } = await supabase.from("future_purchases").update({ completed: !currentStatus }).eq("id", id)

      if (error) throw error

      await fetchPurchases()
    } catch (error) {
      console.error("Erro ao atualizar status:", error)
    }
  }

  const deletePurchase = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta compra futura?")) return

    const supabase = createClient()

    try {
      const { error } = await supabase.from("future_purchases").delete().eq("id", id)

      if (error) throw error

      await fetchPurchases()
    } catch (error) {
      console.error("Erro ao deletar compra futura:", error)
    }
  }

  const updatePurchase = async (id: string, updates: Partial<FuturePurchase>) => {
    const supabase = createClient()

    try {
      const { error } = await supabase
        .from("future_purchases")
        .update({
          name: updates.name,
          description: updates.description,
          estimated_price: updates.estimatedPrice,
          priority: updates.priority,
          category: updates.category,
          target_date: updates.targetDate || null,
        })
        .eq("id", id)

      if (error) throw error

      await fetchPurchases()
    } catch (error) {
      console.error("Erro ao atualizar compra futura:", error)
      throw error
    }
  }

  const filteredPurchases = purchases.filter((p) => {
    if (filterPriority !== "all" && p.priority !== filterPriority) return false
    if (filterCompleted === "pending" && p.completed) return false
    if (filterCompleted === "completed" && !p.completed) return false
    return true
  })

  const totalEstimated = filteredPurchases.reduce((sum, p) => sum + p.estimatedPrice, 0)

  const priorityOrder: PurchasePriority[] = ["urgent", "high", "medium", "low"]
  const sortedPurchases = [...filteredPurchases].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1
    return priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority)
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950">
      <div className="container mx-auto px-6 py-8">
        <Button
          onClick={() => router.push("/dashboard")}
          variant="ghost"
          className="mb-4 gap-2 hover:bg-purple-100 dark:hover:bg-purple-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao Dashboard
        </Button>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Compras Futuras
            </h1>
            <p className="text-muted-foreground">Planeje suas próximas compras e organize suas prioridades</p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
          >
            <Plus className="h-4 w-4" />
            Nova Compra
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8 border-none shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Adicionar Compra Futura</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome da Compra</Label>
                    <Input
                      id="name"
                      placeholder="Ex: Notebook novo"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
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
                      placeholder="0.00"
                      value={estimatedPrice}
                      onChange={(e) => setEstimatedPrice(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição (opcional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Detalhes sobre a compra..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                  <div className="space-y-2">
                    <Label htmlFor="targetDate">Data Alvo (opcional)</Label>
                    <Input
                      id="targetDate"
                      type="date"
                      value={targetDate}
                      onChange={(e) => setTargetDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    Adicionar
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-none shadow-lg bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
            <CardContent className="pt-6">
              <div className="text-sm font-medium opacity-90 mb-1">Total Estimado</div>
              <div className="text-3xl font-bold">{formatCurrency(totalEstimated)}</div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground mb-2 font-medium">Filtrar por Prioridade</div>
              <Select value={filterPriority} onValueChange={(v) => setFilterPriority(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="low">Baixa</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground mb-2 font-medium">Filtrar por Status</div>
              <Select value={filterCompleted} onValueChange={(v) => setFilterCompleted(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="completed">Concluídas</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-gradient-to-br from-pink-500 to-orange-600 text-white">
            <CardContent className="pt-6">
              <div className="text-sm font-medium opacity-90 mb-1">Total de Compras</div>
              <div className="text-3xl font-bold">{filteredPurchases.length}</div>
            </CardContent>
          </Card>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando compras futuras...</p>
          </div>
        ) : sortedPurchases.length === 0 ? (
          <Card className="border-none shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardContent className="py-12 text-center">
              <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-purple-400" />
              <p className="text-lg text-muted-foreground mb-4">Nenhuma compra futura cadastrada</p>
              <Button
                onClick={() => setShowForm(true)}
                variant="outline"
                className="gap-2 border-purple-200 hover:bg-purple-50 dark:border-purple-800 dark:hover:bg-purple-950"
              >
                <Plus className="h-4 w-4" />
                Adicionar Primeira Compra
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedPurchases.map((purchase) => (
              <Card
                key={purchase.id}
                className={`
                  border-none shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm
                  hover:shadow-2xl transition-all duration-300 hover:-translate-y-1
                  ${purchase.completed ? "opacity-60" : ""}
                `}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className={`text-lg mb-2 ${purchase.completed ? "line-through" : ""}`}>
                        {purchase.name}
                      </CardTitle>
                      <div className="flex flex-wrap gap-2">
                        <PriorityBadge priority={purchase.priority} />
                        <CategoryBadge category={purchase.category} />
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <EditPurchaseDialog purchase={purchase} onUpdate={updatePurchase} />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => toggleCompleted(purchase.id, purchase.completed)}
                        className="h-8 w-8"
                      >
                        <Check className={`h-4 w-4 ${purchase.completed ? "text-green-600" : ""}`} />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deletePurchase(purchase.id)}
                        className="h-8 w-8 text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {purchase.description && <p className="text-sm text-muted-foreground mb-4">{purchase.description}</p>}

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Preço Estimado:</span>
                      <span className="text-lg font-bold text-primary">{formatCurrency(purchase.estimatedPrice)}</span>
                    </div>

                    {purchase.targetDate && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Data Alvo:</span>
                        <span className="text-sm font-medium">
                          {formatDateForDisplay(purchase.targetDate, ptBR)}
                        </span>
                      </div>
                    )}
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
