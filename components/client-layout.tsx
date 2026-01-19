"use client"

import type React from "react"
import { Sidebar } from "@/components/sidebar"
import { usePathname } from "next/navigation"

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const isAuthPage =
    pathname?.startsWith("/auth") ||
    pathname === "/auth/login" ||
    pathname === "/auth/sign-up" ||
    pathname === "/auth/sign-up-success"

  return (
    <>
      {!isAuthPage && <Sidebar />}
      <div className={!isAuthPage ? "ml-64" : ""}>{children}</div>
    </>
  )
}
