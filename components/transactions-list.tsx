"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Search, CreditCard } from "lucide-react"
import { formatCurrency, getCategoryLabel } from "@/lib/finance-utils"
import { CategoryBadge } from "@/components/category-badge" // Importando CategoryBadge
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { Transaction, TransactionType } from "@/lib/types"
import { EditTransactionDialog } from "@/components/edit-transaction-dialog" // Importar dialog de edição

interface TransactionsListProps {
  transactions: Transaction[]
  onDelete: (id: string) => Promise<void>
  onUpdate: (id: string, updates: Partial<Transaction>) => Promise<void> // Adicionar prop onUpdate
}

export function TransactionsList({ transactions, onDelete, onUpdate }: TransactionsListProps) {
  const [search, setSearch] = useState("")
  const [filterType, setFilterType] = useState<TransactionType | "all">("all")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const filteredTransactions = transactions.filter((t) => {
    const isStandard = [
      "salary",
      "freelance",
      "investment",
      "other-income",
      "food",
      "transport",
      "housing",
      "entertainment",
      "health",
      "education",
      "shopping",
      "bills",
      "other-expense",
    ].includes(t.category)

    const categoryLabel = isStandard ? getCategoryLabel(t.category as any) : t.category

    const matchesSearch =
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      categoryLabel.toLowerCase().includes(search.toLowerCase())

    const matchesType = filterType === "all" || t.type === filterType

    return matchesSearch && matchesType
  })

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await onDelete(id)
    } catch (error) {
      console.error("Erro ao deletar:", error)
      alert("Erro ao deletar transação. Tente novamente.")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Todas as Transações</CardTitle>
        <div className="flex gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar transações..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterType} onValueChange={(v) => setFilterType(v as TransactionType | "all")}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="income">Receitas</SelectItem>
              <SelectItem value="expense">Despesas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {filteredTransactions.length > 0 ? (
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => {
              const isCredit = transaction.isCredit || transaction.is_credit
              const installments = transaction.installments
              const currentInstallment = transaction.currentInstallment || transaction.current_installment
              const creditCard = transaction.creditCard || transaction.card_name

              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium">{transaction.description}</p>
                      <Badge variant={transaction.type === "income" ? "default" : "destructive"}>
                        {transaction.type === "income" ? "Receita" : "Despesa"}
                      </Badge>
                      <CategoryBadge category={transaction.category} />
                      {isCredit && installments && (
                        <Badge variant="outline" className="gap-1">
                          <CreditCard className="h-3 w-3" />
                          {currentInstallment}/{installments}x
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(transaction.date), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                      </p>
                      {creditCard && (
                        <>
                          <span className="text-muted-foreground">•</span>
                          <p className="text-sm text-muted-foreground">{creditCard}</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className={`font-semibold ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </p>
                    <EditTransactionDialog transaction={transaction} onUpdate={onUpdate} />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(transaction.id)}
                      className="h-8 w-8"
                      disabled={deletingId === transaction.id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center h-[200px] text-muted-foreground">
            {search || filterType !== "all" ? "Nenhuma transação encontrada" : "Nenhuma transação registrada"}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
