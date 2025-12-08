# 📋 PLANO DE EXECUÇÃO - CORREÇÕES E NOVAS FEATURES DO CHECKOUT

**Data**: 8 de Dezembro de 2025  
**Projeto**: NSR E-Commerce  
**Escopo**: Correção e implementação completa do fluxo de checkout com pagamento PIX e Cartão

---

## 🔍 ANÁLISE DE PROBLEMAS IDENTIFICADOS

### 🔴 PROBLEMAS CRÍTICOS (Bloqueadores)

#### 1. **AUSÊNCIA DO COMPONENTE DE SELEÇÃO DE FRETE** ⚠️ CRÍTICO
**Localização**: `frontend/src/app/checkout/components/steps/EntregaStep.tsx`

**Problema**: O componente não possui nenhum componente de seleção de método de frete. Quando o usuário preenche o endereço, não há como escolher PAC, SEDEX ou outro método de envio.

**Consequência**: 
- `metodoEnvioId` permanece `undefined`
- A validação na linha 274 de `page.tsx` lança erro: "Selecione um método de frete"
- **IMPOSSÍVEL CONCLUIR O CHECKOUT**

**Evidência**:
```typescript
// frontend/src/app/checkout/hooks/useCheckoutData.ts (linha 50)
metodoEnvioId: undefined, // ❌ Nunca é definido!
```

**Causa Raiz**: O componente foi refatorado mas o ShippingMethodSelector foi removido ou nunca foi implementado.

---

#### 2. **FALTA DE INTEGRAÇÃO COM CÁLCULO DE FRETE** ⚠️ CRÍTICO
**Localização**: `frontend/src/app/checkout/components/steps/EntregaStep.tsx`

**Problema**: O componente não faz chamada para `shippingService.calculateShipping()` após preencher o CEP ou selecionar endereço.

**Backend Disponível** (funcional):
- ✅ `POST /api/v1/shipping/calculate` - Calcula frete baseado em produtos e CEP
- ✅ `GET /api/v1/shipping/methods` - Lista métodos disponíveis
- ✅ Service implementado em `backend/src/services/shipping.service.ts`

**Frontend NÃO UTILIZA**:
```typescript
// ❌ shippingService.calculateShipping() NUNCA É CHAMADO
// ❌ Não há estado para armazenar métodos de frete disponíveis
// ❌ Não há UI para exibir e selecionar métodos de frete
```

**Impacto**:
- Usuário não vê opções de frete
- Não pode selecionar PAC/SEDEX
- `metodoEnvioId` fica `undefined`
- Checkout não finaliza

---

#### 3. **DADOS DO CARTÃO ENVIADOS MESMO AO SELECIONAR PIX** ⚠️ ALTO
**Localização**: `frontend/src/app/checkout/components/steps/PagamentoStep.tsx`

**Problema**: Os campos do cartão não são limpos quando o usuário muda de "Cartão" para "PIX".

**Risco de Segurança**: 
- Dados sensíveis permanecem em memória desnecessariamente
- Possível envio acidental de dados de cartão em requisição PIX

---

## 🎯 PLANO DE EXECUÇÃO - COMMITS

### 🔴 **FASE 1: CORREÇÕES CRÍTICAS (Bloqueadores)**

#### ✅ **Commit 1: fix: clear payment data when switching between payment methods** ✅ CONCLUÍDO
- ✅ Validação de `addressId` e `shippingMethodId` obrigatórios
- ✅ Correção no `ConfirmacaoStep` para exibir PIX ou Cartão
- ✅ Limpar dados do cartão quando usuário seleciona PIX
- ✅ Limpar estado ao trocar métodos de pagamento

**Arquivos afetados**:
- `frontend/src/app/checkout/components/steps/PagamentoStep.tsx`
- `frontend/src/app/checkout/page.tsx`

**Tempo real**: 1 hora
**Commit**: `77eafb7`

---

#### **Commit 2: feat: implementar cálculo e seleção de frete no checkout**
- Criar hook `useShippingCalculation` para gerenciar cálculo de frete
- Adicionar estado para métodos de frete disponíveis em `useCheckoutData`
- Integrar cálculo automático quando CEP/endereço for preenchido
- Adicionar componente `ShippingMethodSelector` no `EntregaStep`
- Salvar `metodoEnvioId` quando usuário selecionar método
- Atualizar resumo do pedido com frete real (não hardcoded)

**Arquivos afetados**:
- `frontend/src/app/checkout/hooks/useCheckoutData.ts`
- `frontend/src/app/checkout/hooks/useShippingCalculation.ts` (NOVO)
- `frontend/src/app/checkout/components/steps/EntregaStep.tsx`
- `frontend/src/app/checkout/components/ShippingMethodSelector.tsx` (NOVO)
- `frontend/src/app/checkout/page.tsx`

**Estimativa**: 6-8 horas

---

#### **Commit 3: fix: corrigir mapeamento de status de pagamento do PagBank**
- Implementar mapeamento correto de todos os status do PagBank
- Adicionar tratamento para estados intermediários (WAITING, IN_ANALYSIS)
- Atualizar lógica de aprovação de pagamento

**Arquivos afetados**:
- `backend/src/services/pagbank.service.ts`
- `backend/src/services/order.service.ts`

**Estimativa**: 2-3 horas

---

### 🟡 **FASE 2: MELHORIAS DE UX (Alta Prioridade)**

#### **Commit 4: feat: adicionar exibição de QR Code PIX na tela de confirmação**
- Criar componente `PixPaymentDisplay` para mostrar QR Code e código copia-cola
- Adicionar contador regressivo de 15 minutos
- Exibir QR Code como imagem (base64 do backend)
- Adicionar botão "Copiar Código PIX"

**Arquivos afetados**:
- `frontend/src/app/checkout/components/PixPaymentDisplay.tsx` (NOVO)
- `frontend/src/app/checkout/page.tsx`
- `frontend/src/app/pedidos/[id]/page.tsx`

**Estimativa**: 4-5 horas

---

#### **Commit 5: feat: adicionar componente de erro estilizado no checkout**
- Criar componente `CheckoutErrorMessage` seguindo design system
- Substituir todos os `alert()` por componente estilizado
- Adicionar animações de entrada/saída

**Arquivos afetados**:
- `frontend/src/components/checkout/CheckoutErrorMessage.tsx` (NOVO)
- `frontend/src/app/checkout/page.tsx`

**Estimativa**: 2-3 horas

---

#### **Commit 6: feat: adicionar feedback visual durante processamento**
- Adicionar loader durante criptografia do cartão
- Mostrar overlay bloqueando UI durante envio do pedido
- Adicionar skeleton loading para métodos de frete

**Arquivos afetados**:
- `frontend/src/app/checkout/page.tsx`
- `frontend/src/components/ui/LoadingOverlay.tsx` (NOVO)

**Estimativa**: 2-3 horas

---

## 📊 RESUMO DO PLANO

| Fase | Commits | Status | Tempo Estimado |
|------|---------|--------|----------------|
| Fase 1 | 3 | 🔄 Em Andamento | 10-14 horas |
| Fase 2 | 3 | ⏳ Pendente | 8-11 horas |
| **TOTAL** | **6** | - | **18-25 horas** |

---

**Última Atualização**: 8 de Dezembro de 2025  
**Status Atual**: 🔄 Fase 1 - Commit 1 em andamento
