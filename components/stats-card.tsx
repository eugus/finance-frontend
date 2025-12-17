import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string
  icon: LucideIcon
  trend?: {
    value: string
    positive: boolean
  }
  description?: string
}

export function StatsCard({ title, value, icon: Icon, trend, description }: StatsCardProps) {
  const getCardStyle = () => {
    switch (title) {
      case "Receitas":
        return "border-green-200 dark:border-green-900 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 hover:shadow-green-200/50"
      case "Despesas":
        return "border-red-200 dark:border-red-900 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/50 dark:to-rose-950/50 hover:shadow-red-200/50"
      case "Saldo":
        return "border-blue-200 dark:border-blue-900 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 hover:shadow-blue-200/50"
      case "Transações":
        return "border-purple-200 dark:border-purple-900 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 hover:shadow-purple-200/50"
      default:
        return "border-gray-200 dark:border-gray-800"
    }
  }

  const getIconStyle = () => {
    switch (title) {
      case "Receitas":
        return "h-5 w-5 text-green-600 dark:text-green-400"
      case "Despesas":
        return "h-5 w-5 text-red-600 dark:text-red-400"
      case "Saldo":
        return "h-5 w-5 text-blue-600 dark:text-blue-400"
      case "Transações":
        return "h-5 w-5 text-purple-600 dark:text-purple-400"
      default:
        return "h-5 w-5 text-muted-foreground"
    }
  }

  const getIconBgStyle = () => {
    switch (title) {
      case "Receitas":
        return "bg-green-100 dark:bg-green-900/30"
      case "Despesas":
        return "bg-red-100 dark:bg-red-900/30"
      case "Saldo":
        return "bg-blue-100 dark:bg-blue-900/30"
      case "Transações":
        return "bg-purple-100 dark:bg-purple-900/30"
      default:
        return "bg-muted"
    }
  }

  return (
    <Card
      className={`${getCardStyle()} border-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-foreground/80">{title}</CardTitle>
        <div className={`${getIconBgStyle()} p-2 rounded-lg`}>
          <Icon className={getIconStyle()} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
          {value}
        </div>
        {trend && (
          <p
            className={`text-xs font-semibold ${trend.positive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
          >
            {trend.positive ? "+" : ""}
            {trend.value}
          </p>
        )}
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  )
}
