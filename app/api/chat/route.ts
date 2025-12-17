import { convertToModelMessages, streamText, type UIMessage } from "ai"
import { google } from "@ai-sdk/google"

export const runtime = "edge"
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const systemPrompt = `
Você é um assistente financeiro especializado...
  `.trim()

  const prompt = convertToModelMessages(messages)

const result = streamText({
  model: google("models/gemini-1.5-flash"),
  system: systemPrompt,
  messages: prompt,
  temperature: 0.7,
  maxOutputTokens: 2000,   // ✅ nome correto
})

  return result.toUIMessageStreamResponse()
}
