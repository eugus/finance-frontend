"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { format, subMonths, startOfMonth } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { Transaction } from "@/lib/types"

interface MonthlyTrendChartProps {
  transactions: Transaction[]
}

export function MonthlyTrendChart({ transactions }: MonthlyTrendChartProps) {
  // Get last 6 months
  const months = Array.from({ length: 6 }, (_, i) => {
    return startOfMonth(subMonths(new Date(), 5 - i))
  })

  const chartData = months.map((month) => {
    const monthTransactions = transactions.filter((t) => {
      const tDate = new Date(t.date)
      return tDate.getFullYear() === month.getFullYear() && tDate.getMonth() === month.getMonth()
    })

    const income = monthTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

    const expenses = monthTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

    return {
      month: format(month, "MMM", { locale: ptBR }),
      receitas: income,
      despesas: expenses,
      saldo: income - expenses,
    }
  })

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Tendência Mensal</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip
              formatter={(value: number) =>
                new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(value)
              }
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="receitas"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: "#10b981", r: 4 }}
              activeDot={{ r: 6 }}
              animationBegin={0}
              animationDuration={800}
            />
            <Line
              type="monotone"
              dataKey="despesas"
              stroke="#f43f5e"
              strokeWidth={3}
              dot={{ fill: "#f43f5e", r: 4 }}
              activeDot={{ r: 6 }}
              animationBegin={0}
              animationDuration={800}
            />
            <Line
              type="monotone"
              dataKey="saldo"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: "#3b82f6", r: 4 }}
              activeDot={{ r: 6 }}
              animationBegin={0}
              animationDuration={800}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
