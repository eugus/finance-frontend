# Configuração do Google Gemini para o Chat IA

O assistente financeiro IA utiliza o Google Gemini (modelo gemini-1.5-flash) para fornecer respostas inteligentes.

## Como Configurar

### Opção 1: Usar através do Vercel AI Gateway (Recomendado)

O Vercel AI Gateway já suporta modelos Google Gemini por padrão, sem necessidade de configuração adicional. O sistema está configurado para usar o modelo `gemini-1.5-flash`.

### Opção 2: Usar com sua própria API Key do Google

Se preferir usar sua própria chave de API do Google:

1. Obtenha uma API Key gratuita em: https://aistudio.google.com/app/apikey

2. Adicione a variável de ambiente no seu projeto Vercel:
   - Vá em **Settings > Environment Variables**
   - Adicione: `GOOGLE_GENERATIVE_AI_API_KEY` com sua chave

3. Ou adicione no arquivo `.env.local` para desenvolvimento local:
   \`\`\`
   GOOGLE_GENERATIVE_AI_API_KEY=sua_chave_aqui
   \`\`\`

## Modelos Disponíveis

- `gemini-1.5-flash` (atual) - Rápido e eficiente
- `gemini-1.5-pro` - Mais poderoso para tarefas complexas
- `gemini-2.0-flash-exp` - Versão experimental mais recente

Para trocar o modelo, edite o arquivo `app/api/chat/route.ts` e altere:
\`\`\`typescript
model: google('gemini-1.5-flash')
\`\`\`

## Funcionalidades do Chat

- Análise de gastos e receitas
- Conselhos sobre economia e investimentos
- Criação de orçamentos personalizados
- Explicação de conceitos financeiros
- Estratégias para reduzir despesas
- Dicas para aumentar receitas
