// "use client";

// import type React from "react";
// import { useChat } from "ai/react";

// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Send, Bot, User, Loader2 } from "lucide-react";
// import { useEffect, useRef } from "react";

// export default function ChatPage() {
//   const { messages, input, handleInputChange, submit, status } = useAssistant({
//     api: "/api/chat",
//   });

//   const isLoading = status === "in_progress";

//   const scrollRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
//     }
//   }, [messages]);

//   const sendSuggestedMessage = (text: string) => {
//     handleInputChange({ target: { value: text } } as any);

//     setTimeout(() => {
//       submit();
//     }, 50);
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="container mx-auto p-6">
//         <Card className="max-w-4xl mx-auto h-[calc(100vh-8rem)]">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Bot className="h-6 w-6" />
//               Assistente Financeiro IA
//             </CardTitle>
//             <p className="text-sm text-muted-foreground">
//               Converse com nosso assistente para obter ajuda com suas finanças
//             </p>
//           </CardHeader>

//           <CardContent className="flex flex-col h-[calc(100%-8rem)]">
//             <ScrollArea ref={scrollRef} className="flex-1 pr-4">
//               <div className="space-y-4">
//                 {messages.length === 0 && (
//                   <div className="flex flex-col items-center justify-center h-full py-12 text-center">
//                     <Bot className="h-16 w-16 text-muted-foreground mb-4" />
//                     <h3 className="text-lg font-semibold mb-2">
//                       Olá! Como posso ajudar?
//                     </h3>
//                     <p className="text-sm text-muted-foreground max-w-md">
//                       Faça perguntas sobre suas finanças, peça conselhos sobre economia, ou
//                       solicite ajuda para criar um orçamento.
//                     </p>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-6 w-full max-w-2xl">
//                       <Button
//                         variant="outline"
//                         className="text-left justify-start h-auto py-3 px-4 bg-transparent"
//                         onClick={() =>
//                           sendSuggestedMessage("Como posso economizar mais dinheiro?")
//                         }
//                       >
//                         <span className="text-sm">Como posso economizar mais dinheiro?</span>
//                       </Button>

//                       <Button
//                         variant="outline"
//                         className="text-left justify-start h-auto py-3 px-4 bg-transparent"
//                         onClick={() =>
//                           sendSuggestedMessage("Quais são boas práticas para controlar gastos?")
//                         }
//                       >
//                         <span className="text-sm">
//                           Quais são boas práticas para controlar gastos?
//                         </span>
//                       </Button>

//                       <Button
//                         variant="outline"
//                         className="text-left justify-start h-auto py-3 px-4 bg-transparent"
//                         onClick={() => sendSuggestedMessage("Como criar um orçamento mensal?")}
//                       >
//                         <span className="text-sm">Como criar um orçamento mensal?</span>
//                       </Button>

//                       <Button
//                         variant="outline"
//                         className="text-left justify-start h-auto py-3 px-4 bg-transparent"
//                         onClick={() =>
//                           sendSuggestedMessage("Dicas para aumentar minha renda?")
//                         }
//                       >
//                         <span className="text-sm">Dicas para aumentar minha renda?</span>
//                       </Button>
//                     </div>
//                   </div>
//                 )}

//                 {messages.map((message) => (
//                   <div
//                     key={message.id}
//                     className={`flex gap-3 ${
//                       message.role === "user" ? "justify-end" : "justify-start"
//                     }`}
//                   >
//                     {message.role === "assistant" && (
//                       <Avatar className="h-8 w-8">
//                         <AvatarFallback className="bg-primary text-primary-foreground">
//                           <Bot className="h-4 w-4" />
//                         </AvatarFallback>
//                       </Avatar>
//                     )}

//                     <div
//                       className={`rounded-lg px-4 py-2 max-w-[80%] ${
//                         message.role === "user"
//                           ? "bg-primary text-primary-foreground"
//                           : "bg-muted text-foreground"
//                       }`}
//                     >
//                       <p className="text-sm whitespace-pre-wrap leading-relaxed">
//                         {message.content}
//                       </p>
//                     </div>

//                     {message.role === "user" && (
//                       <Avatar className="h-8 w-8">
//                         <AvatarFallback className="bg-secondary">
//                           <User className="h-4 w-4" />
//                         </AvatarFallback>
//                       </Avatar>
//                     )}
//                   </div>
//                 ))}

//                 {isLoading && (
//                   <div className="flex gap-3 justify-start">
//                     <Avatar className="h-8 w-8">
//                       <AvatarFallback className="bg-primary text-primary-foreground">
//                         <Bot className="h-4 w-4" />
//                       </AvatarFallback>
//                     </Avatar>
//                     <div className="rounded-lg px-4 py-2 bg-muted">
//                       <Loader2 className="h-4 w-4 animate-spin" />
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </ScrollArea>

//             <form
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 submit();
//               }}
//               className="flex gap-2 mt-4"
//             >
//               <Input
//                 value={input}
//                 onChange={handleInputChange}
//                 placeholder="Digite sua pergunta..."
//                 disabled={isLoading}
//                 className="flex-1"
//                 autoComplete="off"
//               />

//               <Button type="submit" disabled={isLoading} size="icon">
//                 <Send className="h-4 w-4" />
//               </Button>
//             </form>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }
