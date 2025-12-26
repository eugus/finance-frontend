"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { getCategoryLabel, getCategoryColor } from "@/lib/finance-utils"
import type { CategoryStats } from "@/lib/types"

interface IncomeChartProps {
  data: CategoryStats[]
}

export function IncomeChart({ data }: IncomeChartProps) {
  console.log("IncomeChart data:", data)
  const chartData = data.map((item) => ({
    name: getCategoryLabel(item.category),
    value: item.amount,
    fill: getCategoryColor(item.category),
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Receitas por Categoria</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
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
                cursor={{ fill: "hsl(var(--accent))", opacity: 0.1 }}
              />
              <Legend />
              <Bar dataKey="value" fill="#FFFF" radius={[8, 8, 0, 0]} animationBegin={0} animationDuration={800} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            Nenhuma receita registrada
          </div>
        )}
      </CardContent>
    </Card>
  )
}
