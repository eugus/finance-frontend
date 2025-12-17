<<<<<<< HEAD
# finance-frontend
=======
# Sistema de Finanças Pessoais

Sistema completo de controle financeiro com dashboard interativo, gráficos, controle mensal e chat com IA.

## 🚀 Funcionalidades

- ✅ **Dashboard Interativo** - Visualize suas finanças em tempo real
- 📊 **Gráficos e Métricas** - Análise visual de receitas e despesas por categoria
- 💳 **Pagamento Parcelado** - Controle de compras no crédito com parcelas
- 📅 **Controle Mensal** - Navegue entre diferentes meses mantendo histórico completo
- 📄 **Exportação de Relatórios** - Gere relatórios detalhados em texto
- 🤖 **Chat com IA** - Assistente financeiro inteligente para ajudar nas decisões
- ☁️ **Banco de Dados na Nuvem** - Dados seguros e sincronizados com Supabase

## 🗄️ Banco de Dados

O sistema utiliza **Supabase** como banco de dados PostgreSQL na nuvem. Todos os dados são armazenados de forma segura e podem ser acessados de qualquer dispositivo.

### Estrutura da Tabela `transactions`

- `id` - UUID único da transação
- `type` - Tipo (income/expense)
- `amount` - Valor da transação
- `category` - Categoria da transação
- `description` - Descrição
- `date` - Data da transação
- `is_credit` - Se foi pagamento no crédito
- `card_name` - Nome do cartão (se crédito)
- `installments` - Número de parcelas
- `current_installment` - Parcela atual
- `installment_group_id` - ID do grupo de parcelas
- `created_at` - Data de criação
- `updated_at` - Data de atualização

### Executar Scripts SQL

Para criar as tabelas no banco de dados, execute o script SQL localizado em:
- `scripts/001_create_transactions_table.sql`

## 🎨 Tecnologias

- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS v4** - Estilização
- **Supabase** - Banco de dados PostgreSQL
- **Zustand** - Gerenciamento de estado
- **Recharts** - Gráficos interativos
- **AI SDK** - Chat com IA
- **date-fns** - Manipulação de datas

## 📦 Instalação

1. Clone o repositório
2. Instale as dependências: `npm install`
3. Configure as variáveis de ambiente do Supabase
4. Execute o script SQL para criar as tabelas
5. Inicie o servidor: `npm run dev`

## 🔐 Segurança

O sistema utiliza Row Level Security (RLS) do Supabase para proteger os dados. Atualmente configurado para acesso público, mas pode ser facilmente adaptado para autenticação de usuários.

## 📱 Páginas

- `/` - Dashboard principal com métricas e gráficos
- `/transactions` - Gerenciamento de transações
- `/chat` - Chat com assistente financeiro IA

## 💡 Dicas de Uso

1. **Dados de Exemplo**: Clique em "Carregar Dados de Exemplo" para popular o sistema
2. **Parcelas**: Ao adicionar despesa no crédito, o sistema cria automaticamente as parcelas nos próximos meses
3. **Navegação Mensal**: Use as setas para navegar entre meses ou clique em "Hoje" para voltar ao mês atual
4. **Exportar Relatório**: Gere relatórios detalhados do mês selecionado
5. **Chat IA**: Peça conselhos financeiros, análise de gastos e dicas de economia

## 🎯 Próximos Passos

- [ ] Adicionar autenticação de usuários
- [ ] Implementar metas financeiras
- [ ] Adicionar categorias personalizadas
- [ ] Gráficos de comparação entre meses
- [ ] Notificações de vencimento de parcelas
>>>>>>> master
