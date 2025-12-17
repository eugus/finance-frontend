import { Badge } from "@/components/ui/badge"
import { getCategoryLabel, getCategoryColor } from "@/lib/finance-utils"
import type { TransactionCategory } from "@/lib/types"

interface CategoryBadgeProps {
  category: TransactionCategory | string
  customColor?: string
}

export function CategoryBadge({ category, customColor }: CategoryBadgeProps) {
  const isStandardCategory = [
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
  ].includes(category)

  const label = isStandardCategory ? getCategoryLabel(category as TransactionCategory) : category
  const color = customColor || (isStandardCategory ? getCategoryColor(category as TransactionCategory) : "#64748b")

  return (
    <Badge
      variant="secondary"
      className="font-medium"
      style={{
        backgroundColor: `${color}20`,
        color: color,
        borderColor: color,
      }}
    >
      {label}
    </Badge>
  )
}
