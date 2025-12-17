"use client"

import type React from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { TrendingUp, Wallet, BarChart3, Lock, Mail, Shield, User } from "lucide-react"

export default function Page() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError("As senhas não coincidem")
      setIsLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || window.location.origin,
          data: {
            full_name: name,
          },
        },
      })
      if (error) throw error

      if (data.user) {
        await supabase.from("profiles").upsert({
          id: data.user.id,
          full_name: name,
          email: email,
        })
      }

      router.push("/auth/sign-up-success")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Ocorreu um erro")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_70%)]" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-white">
            <Wallet className="h-8 w-8" />
            <span className="text-2xl font-bold">FinanceControl</span>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <h1 className="text-5xl font-bold text-white leading-tight">
            Comece a gerenciar
            <br />
            suas finanças
            <br />
            hoje mesmo
          </h1>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-white/20 p-3 backdrop-blur-sm">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">Seguro e Confiável</h3>
                <p className="text-white/80 text-sm">Seus dados protegidos com criptografia</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-white/20 p-3 backdrop-blur-sm">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">Controle Total</h3>
                <p className="text-white/80 text-sm">Gerencie receitas, despesas e compras futuras</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-white/20 p-3 backdrop-blur-sm">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">Relatórios Detalhados</h3>
                <p className="text-white/80 text-sm">Análises completas dos seus gastos</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-white/60 text-sm">© 2025 FinanceControl. Todos os direitos reservados.</div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 md:p-10 bg-gradient-to-br from-background to-muted/20">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden text-center">
            <div className="inline-flex items-center gap-2 text-primary mb-4">
              <Wallet className="h-8 w-8" />
              <span className="text-2xl font-bold">FinanceControl</span>
            </div>
          </div>

          <Card className="border-2 shadow-xl">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Crie sua conta
              </CardTitle>
              <CardDescription className="text-center text-base">Preencha os dados abaixo para começar</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Nome Completo
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Seu nome completo"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10 h-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Senha
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 h-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="repeat-password" className="text-sm font-medium">
                      Confirmar Senha
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="repeat-password"
                        type="password"
                        required
                        value={repeatPassword}
                        onChange={(e) => setRepeatPassword(e.target.value)}
                        className="pl-10 h-11"
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <p className="text-sm text-destructive font-medium">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-11 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? "Criando conta..." : "Criar Conta"}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Já tem uma conta?</span>
                  </div>
                </div>

                <div className="text-center">
                  <Link
                    href="/auth/login"
                    className="text-sm font-medium text-primary hover:underline underline-offset-4 transition-colors"
                  >
                    Fazer login
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
