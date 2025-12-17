"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2, CreditCard } from "lucide-react"
import { formatCurrency } from "@/lib/finance-utils"
import { CategoryBadge } from "@/components/category-badge" // Importando CategoryBadge
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { Transaction } from "@/lib/types"

interface RecentTransactionsProps {
  transactions: Transaction[]
  onDelete: (id: string) => Promise<void>
}

export function RecentTransactions({ transactions, onDelete }: RecentTransactionsProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const recent = transactions.slice(0, 10)

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
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Transações Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        {recent.length > 0 ? (
          <div className="space-y-4">
            {recent.map((transaction) => {
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
            Nenhuma transação registrada
          </div>
        )}
      </CardContent>
    </Card>
  )
}
