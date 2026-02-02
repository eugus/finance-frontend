import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        // Aceita 'prompt' (o que seu front envia hoje) ou 'messages'
        const prompt = body.prompt || (body.messages && body.messages[body.messages.length - 1].content);

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // IMPORTANTE: Retorne um objeto que o seu front entenda
        // O seu front busca por 'data.content', então vamos enviar 'content'
        return NextResponse.json({ content: text }, { status: 200 });

    } catch (error: any) {
        console.error("Erro na API Gemini:", error);
        return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
    }
}