import { Badge } from "@/components/ui/badge"
import { getPriorityLabel, getPriorityColor } from "@/lib/finance-utils"
import type { PurchasePriority } from "@/lib/types"
import { AlertCircle, AlertTriangle, Info, Zap } from "lucide-react"

interface PriorityBadgeProps {
  priority: PurchasePriority
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const color = getPriorityColor(priority)
  const label = getPriorityLabel(priority)

  const Icon = {
    low: Info,
    medium: AlertCircle,
    high: AlertTriangle,
    urgent: Zap,
  }[priority]

  return (
    <Badge
      variant="secondary"
      className="font-medium gap-1"
      style={{
        backgroundColor: `${color}20`,
        color: color,
        borderColor: color,
      }}
    >
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  )
}
