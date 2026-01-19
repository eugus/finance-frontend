import { useEffect, useState } from "react"

const CARD_BILLING_DAY_KEY = "card_billing_day"
const DEFAULT_BILLING_DAY = 10

export function useCardSettings() {
    const [billingDay, setBillingDay] = useState<number>(DEFAULT_BILLING_DAY)
    const [isLoaded, setIsLoaded] = useState(false)

    // Carregar configuração do localStorage
    useEffect(() => {
        const saved = localStorage.getItem(CARD_BILLING_DAY_KEY)
        if (saved) {
            setBillingDay(Number.parseInt(saved, 10))
        }
        setIsLoaded(true)
    }, [])

    // Salvar configuração no localStorage
    const saveBillingDay = (day: number) => {
        if (day > 0 && day <= 31) {
            localStorage.setItem(CARD_BILLING_DAY_KEY, String(day))
            setBillingDay(day)
        }
    }

    return {
        billingDay,
        saveBillingDay,
        isLoaded,
    }
}
