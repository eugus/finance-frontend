"use client"

import { create } from "zustand"
import type { Transaction } from "./types"
import { createClient } from "@/lib/supabase/client"

interface FinanceStore {
  transactions: Transaction[]
  isLoading: boolean
  addTransaction: (transaction: Omit<Transaction, "id" | "createdAt">) => Promise<void>
  deleteTransaction: (id: string) => Promise<void>
  updateTransaction: (id: string, transaction: Partial<Transaction>) => Promise<void>
  getTransactionsByMonth: (year: number, month: number) => Transaction[]
  clearAllTransactions: () => Promise<void>
  loadSampleData: () => Promise<void>
  fetchTransactions: () => Promise<void>
}

const createSampleTransactions = () => {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  return [
    // Receitas do mês atual
    {
      type: "income" as const,
      amount: 5000,
      category: "salary",
      description: "Salário mensal",
      date: new Date(currentYear, currentMonth, 5).toISOString(),
    },
    {
      type: "income" as const,
      amount: 1200,
      category: "freelance",
      description: "Projeto de desenvolvimento web",
      date: new Date(currentYear, currentMonth, 15).toISOString(),
    },
    {
      type: "income" as const,
      amount: 300,
      category: "investment",
      description: "Dividendos",
      date: new Date(currentYear, currentMonth, 20).toISOString(),
    },
    // Despesas do mês atual
    {
      type: "expense" as const,
      amount: 1200,
      category: "housing",
      description: "Aluguel",
      date: new Date(currentYear, currentMonth, 1).toISOString(),
    },
    {
      type: "expense" as const,
      amount: 450,
      category: "food",
      description: "Supermercado",
      date: new Date(currentYear, currentMonth, 10).toISOString(),
    },
    {
      type: "expense" as const,
      amount: 200,
      category: "transport",
      description: "Combustível e manutenção",
      date: new Date(currentYear, currentMonth, 12).toISOString(),
    },
    {
      type: "expense" as const,
      amount: 150,
      category: "entertainment",
      description: "Cinema e restaurantes",
      date: new Date(currentYear, currentMonth, 18).toISOString(),
    },
    {
      type: "expense" as const,
      amount: 100,
      category: "health",
      description: "Farmácia",
      date: new Date(currentYear, currentMonth, 8).toISOString(),
    },
    {
      type: "expense" as const,
      amount: 80,
      category: "education",
      description: "Curso online",
      date: new Date(currentYear, currentMonth, 14).toISOString(),
    },
    // Transações do mês anterior
    {
      type: "income" as const,
      amount: 5000,
      category: "salary",
      description: "Salário mensal",
      date: new Date(currentYear, currentMonth - 1, 5).toISOString(),
    },
    {
      type: "expense" as const,
      amount: 1200,
      category: "housing",
      description: "Aluguel",
      date: new Date(currentYear, currentMonth - 1, 1).toISOString(),
    },
    {
      type: "expense" as const,
      amount: 500,
      category: "food",
      description: "Supermercado",
      date: new Date(currentYear, currentMonth - 1, 10).toISOString(),
    },
  ]
}

export const useFinanceStore = create<FinanceStore>((set, get) => ({
  transactions: [],
  isLoading: false,

  fetchTransactions: async () => {
    set({ isLoading: true })
    const supabase = createClient()

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        set({ transactions: [], isLoading: false })
        return
      }

      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false })

      if (error) throw error

      set({ transactions: data || [], isLoading: false })
    } catch (error) {
      console.error("Erro ao buscar transações:", error)
      set({ isLoading: false })
    }
  },

  addTransaction: async (transaction) => {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("Usuário não autenticado")
    }

    // Se for uma compra parcelada no crédito
    if (transaction.isCredit && transaction.installments && transaction.installments > 1) {
      const installmentGroupId = crypto.randomUUID()
      const installmentAmount = transaction.amount / transaction.installments
      const baseDate = new Date(transaction.date)

      const installmentTransactions = []

      // Criar uma transação para cada parcela
      for (let i = 0; i < transaction.installments; i++) {
        const installmentDate = new Date(baseDate)
        installmentDate.setMonth(baseDate.getMonth() + i)

        installmentTransactions.push({
          user_id: user.id, // Adicionar user_id
          type: transaction.type,
          amount: installmentAmount,
          category: transaction.category,
          description: transaction.description,
          date: installmentDate.toISOString(),
          is_credit: true,
          card_name: transaction.creditCard,
          installments: transaction.installments,
          current_installment: i + 1,
          installment_group_id: installmentGroupId,
        })
      }

      const { error } = await supabase.from("transactions").insert(installmentTransactions)

      if (error) {
        console.error("Erro ao adicionar parcelas:", error)
        throw error
      }
    } else {
      // Transação normal (à vista ou receita)
      const { error } = await supabase.from("transactions").insert({
        user_id: user.id, // Adicionar user_id
        type: transaction.type,
        amount: transaction.amount,
        category: transaction.category,
        description: transaction.description,
        date: transaction.date,
        is_credit: transaction.isCredit || false,
        card_name: transaction.creditCard,
        installments: transaction.installments,
        current_installment: transaction.currentInstallment,
        installment_group_id: transaction.installmentGroupId,
      })

      if (error) {
        console.error("Erro ao adicionar transação:", error)
        throw error
      }
    }

    // Recarregar transações
    await get().fetchTransactions()
  },

  deleteTransaction: async (id) => {
    const supabase = createClient()
    const transaction = get().transactions.find((t) => t.id === id)

    // Se for uma parcela, deletar todas as parcelas do grupo
    if (transaction?.installmentGroupId) {
      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("installment_group_id", transaction.installmentGroupId)

      if (error) {
        console.error("Erro ao deletar grupo de parcelas:", error)
        throw error
      }
    } else {
      const { error } = await supabase.from("transactions").delete().eq("id", id)

      if (error) {
        console.error("Erro ao deletar transação:", error)
        throw error
      }
    }

    // Recarregar transações
    await get().fetchTransactions()
  },

  updateTransaction: async (id, updates) => {
    const supabase = createClient()

    const { error } = await supabase
      .from("transactions")
      .update({
        type: updates.type,
        amount: updates.amount,
        category: updates.category,
        description: updates.description,
        date: updates.date,
        is_credit: updates.isCredit,
        card_name: updates.creditCard,
        installments: updates.installments,
        current_installment: updates.currentInstallment,
        installment_group_id: updates.installmentGroupId,
      })
      .eq("id", id)

    if (error) {
      console.error("Erro ao atualizar transação:", error)
      throw error
    }

    // Recarregar transações
    await get().fetchTransactions()
  },

  getTransactionsByMonth: (year, month) => {
    return get().transactions.filter((t) => {
      const date = new Date(t.date)
      return date.getFullYear() === year && date.getMonth() === month
    })
  },

  clearAllTransactions: async () => {
    const supabase = createClient()

    const { error } = await supabase.from("transactions").delete().neq("id", "00000000-0000-0000-0000-000000000000")

    if (error) {
      console.error("Erro ao limpar transações:", error)
      throw error
    }

    set({ transactions: [] })
  },

  loadSampleData: async () => {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("Usuário não autenticado")
    }

    const sampleData = createSampleTransactions()

    const { error } = await supabase.from("transactions").insert(
      sampleData.map((t) => ({
        user_id: user.id, // Adicionar user_id
        type: t.type,
        amount: t.amount,
        category: t.category,
        description: t.description,
        date: t.date,
        is_credit: false,
      })),
    )

    if (error) {
      console.error("Erro ao carregar dados de exemplo:", error)
      throw error
    }

    // Recarregar transações
    await get().fetchTransactions()
  },
}))
