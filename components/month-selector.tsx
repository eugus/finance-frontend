"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface MonthSelectorProps {
  selectedMonth: Date
  onMonthChange: (date: Date) => void
}

export function MonthSelector({ selectedMonth, onMonthChange }: MonthSelectorProps) {
  const handlePrevMonth = () => {
    const newDate = new Date(selectedMonth)
    newDate.setMonth(newDate.getMonth() - 1)
    onMonthChange(newDate)
  }

  const handleNextMonth = () => {
    const newDate = new Date(selectedMonth)
    newDate.setMonth(newDate.getMonth() + 1)
    onMonthChange(newDate)
  }

  const handleCurrentMonth = () => {
    onMonthChange(new Date())
  }

  return (
    <div className="flex items-center gap-4">
      <Button variant="outline" size="icon" onClick={handlePrevMonth}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold min-w-[180px] text-center">
          {format(selectedMonth, "MMMM 'de' yyyy", { locale: ptBR })}
        </span>
        <Button variant="ghost" size="sm" onClick={handleCurrentMonth}>
          Hoje
        </Button>
      </div>
      <Button variant="outline" size="icon" onClick={handleNextMonth}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
