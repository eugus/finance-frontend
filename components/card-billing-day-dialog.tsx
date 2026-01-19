"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Settings } from "lucide-react"
import { useCardSettings } from "@/hooks/use-card-settings"

export function CardBillingDayDialog() {
    const { billingDay, saveBillingDay } = useCardSettings()
    const [open, setOpen] = useState(false)
    const [tempDay, setTempDay] = useState(String(billingDay))
    const [error, setError] = useState("")

    const handleSave = () => {
        const day = Number.parseInt(tempDay, 10)

        if (Number.isNaN(day) || day < 1 || day > 31) {
            setError("Por favor, insira um dia válido entre 1 e 31")
            return
        }

        saveBillingDay(day)
        setError("")
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <Button
                variant="outline"
                size="sm"
                onClick={() => {
                    setTempDay(String(billingDay))
                    setError("")
                    setOpen(true)
                }}
                className="gap-2"
            >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Dia {billingDay}</span>
            </Button>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Configurar Dia de Vencimento do Cartão</DialogTitle>
                    <DialogDescription>
                        Defina o dia de vencimento da sua fatura. Transações do dia X do mês anterior até o dia X-1 deste mês
                        serão agrupadas no mesmo ciclo.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="billing-day">Dia do vencimento</Label>
                        <div className="flex gap-2 items-end">
                            <Input
                                id="billing-day"
                                type="number"
                                min="1"
                                max="31"
                                value={tempDay}
                                onChange={(e) => {
                                    setTempDay(e.target.value)
                                    setError("")
                                }}
                                placeholder="10"
                                className="w-20"
                            />
                            <span className="text-sm text-muted-foreground">de cada mês</span>
                        </div>
                        {error && <p className="text-sm text-red-500">{error}</p>}
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3 space-y-2">
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Exemplo:</p>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                            Se o vencimento é dia 10, compras de 11 de janeiro até 9 de fevereiro contam para o ciclo de janeiro.
                        </p>
                    </div>
                </div>

                <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSave}>Salvar</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
