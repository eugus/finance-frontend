"use client"

import type React from "react"
import { Navigation } from "@/components/navigation"
import { usePathname } from "next/navigation"

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const isAuthPage =
    pathname?.startsWith("/auth") ||
    pathname === "/auth/login" ||
    pathname === "/auth/sign-up" ||
    pathname === "/auth/sign-up-success"

  console.log("[v0] Current pathname:", pathname, "isAuthPage:", isAuthPage)

  return (
    <>
      {!isAuthPage && <Navigation />}
      {children}
    </>
  )
}
