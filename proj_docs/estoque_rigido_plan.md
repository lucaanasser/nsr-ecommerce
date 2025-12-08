# Plano: Estoque Rigoroso (checkout e carrinho)

Data: 2025-12-08
Responsável: Automação Copilot (GPT-5.1-Codex-Max)

## Objetivos
- Bloquear inclusão ou avanço no checkout de produtos sem estoque ou inativos.
- Garantir payloads corretos (`productId`, `quantity`, `size`, `color`) entre frontend e backend.
- Evitar erros com `product?.name` undefined e falhas de transação por consultas inconsistentes.
- Remover código obsoleto/lixo encontrado durante as alterações.

## Diagnóstico rápido (atual)
- `OrderService.createOrder` valida estoque via `inventoryService.validateStockAvailability`, mas a mensagem pode ficar com `product?.name` undefined se o produto não estiver no array carregado.
- `CartService` já valida estoque ao adicionar/atualizar, porém não existe bloqueio de UI no frontend; carrinho é apenas client-side e pode enviar itens sem sincronizar com backend.
- Checkout frontend monta `items` usando `item.id` do contexto local; precisa garantir que é o `productId` correto e não um slug/undefined.

## Princípios de implementação
- Validação dupla: UI bloqueia e backend confirma (fonte da verdade).
- Fail-fast: retornar 400 com mensagens claras antes de transacionar pagamento.
- Transação Prisma única para reservar/decrementar estoque junto do pedido/pagamento.
- Nenhum código morto: remover funções não usadas relacionadas a estoque/cartão/checkout quando tocadas.

## Plano de commits
1) **Higiene e rastreabilidade**
   - [x] Adicionar guards para payload de itens no `OrderService` e mensagens de erro com produto garantido.
   - [x] Documentar contrato esperado de `items` (productId, quantity, size, color) e validação via schema existente (Zod `createOrderSchema`).

2) **Validação de estoque no carrinho (backend)**
   - [x] Endurecer `cart.service` para impedir adicionar/atualizar itens com `stock <= 0` e responder 400 consistente.
   - [x] Ajustar validações para barrar itens sem estoque/inativos no carrinho (service) e mensagens consistentes.

3) **Transação de pedido e reserva de estoque**
   - [x] Em `OrderService.createOrder`, validar estoque imediatamente e evitar `product?.name` undefined, detalhando itens indisponíveis.
   - [x] Ajustar `inventoryService` para enriquecer mensagens com `productName` e reutilizar transação.

4) **Frontend: bloqueio de UI e payload correto**
   - [x] No checkout/carrinho, bloquear inclusão básica se `stock <= 0` ou `isActive` falso.
   - [x] Garantir que o payload enviado a `/orders` use `productId` válido e quantidade dentro do estoque (pré-checagem), removendo código morto relacionado.

5) **Testes e verificação**
   - [x] Cobrir cenários de estoque insuficiente no backend (unit test `inventory.service.test.ts`).
   - [x] Smoke test no frontend (ts-node) para bloquear UI sem estoque e validar montagem do payload.

## Rastreamento de progresso
- Checkboxes acima serão marcados conforme cada sub-tarefa for concluída.
- Commits deverão seguir a ordem do plano, pequenos e reversíveis.

## Anotações rápidas
- Se surgirem pontos de estoque por variação (size/color), alinhar schema de produto/variantes antes de reservar.
- Manter mensagens em PT-BR e claras para UX.
