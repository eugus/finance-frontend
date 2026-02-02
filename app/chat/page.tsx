"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User, Loader2, ArrowLeft, Sparkles, Wallet, TrendingUp, PieChart } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

export default function ChatPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    // Só rola para baixo se a última mensagem for do usuário ou se o carregamento começou
    if (messages.length > 0) scrollToBottom()
  }, [messages, isLoading])

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return
    const userMessage: Message = { id: Date.now().toString(), role: "user", content: text }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMessage.content }),
      })
      const data = await response.json()
      if (data.error) throw new Error(data.error)

      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content,
      }])
    } catch (error) {
      setMessages((prev) => [...prev, {
        id: "error",
        role: "assistant",
        content: "Houve um erro técnico. Pode tentar novamente?",
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-[#f8fafc] dark:bg-[#020617] text-slate-900 dark:text-slate-100 overflow-hidden">

      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-72 flex-col border-r border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-6">
        <Button
          onClick={() => router.push("/dashboard")}
          variant="ghost"
          className="mb-8 justify-start gap-2 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar ao Início
        </Button>

        <div className="space-y-6">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">Sugestões</h3>
            <div className="grid gap-2">
              {[
                { icon: <Wallet className="h-4 w-4" />, text: "Dicas de economia" },
                { icon: <TrendingUp className="h-4 w-4" />, text: "Onde investir?" },
                { icon: <PieChart className="h-4 w-4" />, text: "Criar orçamento" }
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(item.text)}
                  className="flex items-center gap-3 text-sm p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all text-left group"
                >
                  <span className="text-indigo-500 group-hover:scale-110 transition-transform">{item.icon}</span>
                  {item.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative h-full">

        {/* Header Fixo */}
        <header className="h-20 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Bot className="text-white h-6 w-6" />
            </div>
            <div>
              <h2 className="font-bold text-lg leading-none">Finanças AI</h2>
              <span className="text-xs text-emerald-500 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Online Agora
              </span>
            </div>
          </div>
          <Sparkles className="h-5 w-5 text-amber-500" />
        </header>

        {/* Mensagens com Scroll Independente */}
        <div className="flex-1 overflow-hidden relative bg-slate-50/50 dark:bg-transparent">
          <ScrollArea className="h-full w-full">
            <div className="max-w-3xl mx-auto p-6 space-y-8">
              {messages.length === 0 && (
                <div className="py-20 text-center space-y-4">
                  <div className="bg-indigo-100 dark:bg-indigo-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Bot className="h-8 w-8 text-indigo-600" />
                  </div>
                  <h1 className="text-3xl font-extrabold tracking-tight">Como posso ajudar hoje?</h1>
                  <p className="text-slate-500 max-w-sm mx-auto">Tire dúvidas sobre investimentos, cartões de crédito ou como organizar sua vida financeira.</p>
                </div>
              )}

              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                  <div className={`flex gap-3 max-w-[85%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    <Avatar className="h-8 w-8 border border-slate-200 dark:border-slate-700 shadow-sm shrink-0">
                      <AvatarFallback className={message.role === "user" ? "bg-indigo-600 text-white" : "bg-white dark:bg-slate-800 text-indigo-600"}>
                        {message.role === "user" ? <User size={16} /> : <Bot size={16} />}
                      </AvatarFallback>
                    </Avatar>

                    <div className={`
                      p-4 rounded-2xl text-sm leading-relaxed shadow-sm break-words overflow-hidden
                      ${message.role === "user"
                        ? "bg-indigo-600 text-white rounded-tr-none shadow-indigo-200 dark:shadow-none"
                        : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-tl-none text-slate-800 dark:text-slate-200"}
                    `}>
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                  </div>
                  <div className="h-10 w-24 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-2xl rounded-tl-none" />
                </div>
              )}

              {/* Espaçador final para o scroll */}
              <div ref={messagesEndRef} className="h-4" />
            </div>
          </ScrollArea>
        </div>

        {/* Input Área Fixo no Rodapé */}
        <footer className="p-6 bg-white dark:bg-[#020617] border-t border-slate-200 dark:border-slate-800">
          <form
            onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
            className="max-w-3xl mx-auto relative group"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pergunte qualquer coisa sobre finanças..."
              className="h-14 pl-6 pr-16 rounded-2xl bg-slate-100 dark:bg-slate-900 border-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-all"
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-2 h-10 w-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30 transition-all hover:scale-105"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
          </form>
          <p className="text-[10px] text-center text-slate-400 mt-3">
            A IA pode cometer erros. Verifique informações importantes.
          </p>
        </footer>
      </main>
    </div>
  )
}