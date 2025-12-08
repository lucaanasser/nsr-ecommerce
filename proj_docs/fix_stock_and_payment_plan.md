# Plano de Correção: Estoque e Pagamento

## Problemas Identificados
1. **Erro de Estoque no Pix**: O sistema tenta reservar estoque, mas pode haver condições de corrida ou falhas que não revertem corretamente. O fluxo atual valida estoque, cria pedido, processa pagamento e só então decrementa/reserva.
2. **Erro Genérico no Cartão**: Mensagens de erro do PagBank não estão sendo tratadas especificamente no frontend, e pode haver envio de dados incorretos.

## Plano de Ação

### 1. Backend: Refatoração do Controle de Estoque
- **Objetivo**: Garantir atomicidade na reserva de estoque.
- **Ação**:
    - Atualizar `InventoryService` para suportar transações do Prisma (`tx`).
    - Criar método unificado `reserveStock` que decrementa estoque e lança erro se insuficiente.
    - Remover métodos redundantes ou legados (`reserveStockForPix`, `decrementStockForOrder` sem tx).

### 2. Backend: Refatoração da Criação de Pedido (`OrderService`)
- **Objetivo**: Reservar estoque *antes* de processar pagamento.
- **Ação**:
    - Iniciar transação.
    - Criar registro do pedido (`PENDING`).
    - **Reservar Estoque**: Chamar `inventoryService.reserveStock` dentro da transação. Se falhar, rollback automático.
    - **Processar Pagamento**: Chamar API do PagBank.
    - Se pagamento falhar: Lançar erro (causa rollback da transação e do estoque).
    - Se pagamento sucesso: Atualizar status do pedido e pagamento.

### 3. Frontend: Melhoria no Tratamento de Erros
- **Objetivo**: Exibir mensagens claras para o usuário.
- **Ação**:
    - Capturar erros específicos do SDK do PagBank (`encryptCard`).
    - Validar campos do cartão antes de enviar.

### 4. Segurança
- **Objetivo**: Garantir que dados sensíveis do cartão não trafeguem em texto plano.
- **Ação**:
    - Verificar DTOs e Services para garantir que apenas `encrypted` hash é enviado ao backend.
    - Remover qualquer campo de número de cartão/cvv dos DTOs de entrada do backend.

## Arquivos Afetados
- `backend/src/services/inventory.service.ts`
- `backend/src/services/order.service.ts`
- `backend/src/types/order.types.ts`
- `frontend/src/app/checkout/page.tsx`
