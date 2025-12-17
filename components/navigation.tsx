"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Receipt, MessageSquare, ShoppingBag, LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [userName, setUserName] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        setUserEmail(user.email || null)

        const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).single()

        setUserName(profile?.full_name || null)
      }
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  const getInitials = (name: string | null, email: string | null) => {
    if (name) {
      const nameParts = name.split(" ")
      if (nameParts.length >= 2) {
        return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
      }
      return name.substring(0, 2).toUpperCase()
    }
    return email ? email.substring(0, 2).toUpperCase() : "??"
  }

  const links = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/transactions", label: "Transações", icon: Receipt },
    { href: "/future-purchases", label: "Compras Futuras", icon: ShoppingBag },
    { href: "/chat", label: "Assistente IA", icon: MessageSquare },
  ]

  const displayName = userName || userEmail

  return (
    <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
              <span className="text-primary-foreground font-bold text-lg">F</span>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              FinanceApp
            </span>
          </div>
          <div className="flex items-center gap-2">
            {links.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Link key={link.href} href={link.href}>
                  <Button variant={isActive ? "default" : "ghost"} className="gap-2">
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{link.label}</span>
                  </Button>
                </Link>
              )
            })}

            {displayName && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 pl-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {getInitials(userName, userEmail)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="max-w-[150px] truncate hidden md:inline">{displayName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{userName || "Minha Conta"}</p>
                      <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="gap-2 text-destructive cursor-pointer">
                    <LogOut className="h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
