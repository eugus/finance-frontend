# Ciclo de Cartão de Crédito - Guia de Uso

## O que foi implementado?

Sistema inteligente para agrupar transações de cartão de crédito por **ciclo de fatura** em vez do calendário convencional.

## Problema Resolvido

**Antes:**
- Compras de 1º a 31 de janeiro = Mês de janeiro
- Compras de 1º a 10 de fevereiro = Mês de fevereiro
- ❌ Mesmo que o vencimento da fatura seja dia 10, as compras dos primeiros dias de fevereiro já contavam como "fevereiro"

**Depois:**
- Se o vencimento é dia 10 de fevereiro:
- Compras de 11 de janeiro a 9 de fevereiro = **Mesmo ciclo** (contam para janeiro)
- Compras de 10 de fevereiro em diante = Próximo ciclo (contam para fevereiro)
- ✅ As transações são agrupadas corretamente pelo ciclo de fatura

## Como Usar

### 1. Configurar o Dia de Vencimento

Na página de **Gerenciar Transações**, clique no botão de engrenagem **"Dia 10"** (ou o dia configurado):

```
[⚙ Dia 10]
```

### 2. Na Caixa de Diálogo

- **Dia do vencimento**: Insira o dia da sua fatura (1-31)
- **Exemplo**: Se sua fatura vence no dia 10, insira `10`

### 3. Exemplo Prático

Suponha que você configure dia **10**:

| Data da Compra | Categoria |
|---|---|
| 11 de janeiro | Ciclo de janeiro |
| 9 de fevereiro | Ciclo de janeiro |
| 10 de fevereiro | Ciclo de fevereiro |
| 28 de fevereiro | Ciclo de fevereiro |

## Funcionamento Técnico

### Funções Criadas

**`getCardBillingCycle(date, billingDay)`**
- Calcula o período do ciclo (data inicial e final)
- Baseado no dia de vencimento configurado

**`filterTransactionsByCardCycle(transactions, date, billingDay)`**
- Filtra as transações dentro do ciclo de fatura
- Substitui o filtro de calendário anterior

### Armazenamento

- A configuração é salva no **localStorage** do navegador
- Chave: `card_billing_day`
- Valor padrão: `10` (dia 10 de cada mês)

## Componentes Adicionados

### `CardBillingDayDialog`
Componente que exibe o botão de configuração e a caixa de diálogo para definir o dia de vencimento.

### Hook `useCardSettings()`
Gerencia o estado e persistência da configuração do dia de vencimento.

## Comportamento por Mês

### Navegação Entre Meses

Quando você seleciona um mês usando o **MonthSelector**, o sistema:
1. Calcula qual é o ciclo de fatura daquele mês
2. Filtra apenas as transações dentro desse ciclo
3. Exibe os totais (receita, despesa, saldo) correspondentes

### Exemplo com Vencimento dia 15

| Período | Inclui | Não Inclui |
|---|---|---|
| Janeiro | 15 jan a 14 fev | 1º a 14 jan |
| Fevereiro | 15 fev a 14 mar | 1º a 14 fev |

## Próximas Melhorias Sugeridas

1. **Sincronizar no banco de dados** em vez de localStorage
2. **Suporte a múltiplos cartões** com vencimentos diferentes
3. **Visualização do ciclo** (mostra "11 jan - 9 fev") no header
4. **Filtro por tipo de pagamento** (crédito, débito, dinheiro)
5. **Integração com despesas fixas** para sincronizar ciclos

---

**Versão**: 1.0
**Data**: 19 de janeiro de 2026
