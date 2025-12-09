# Plano de Implementação do Painel Administrativo

Este documento rastreia o progresso da implementação das funcionalidades reais do painel administrativo, conectando o frontend aos endpoints do backend.

## Status Geral
- [ ] **Backend: Admin Orders API**
- [ ] **Backend: Admin Dashboard API**
- [ ] **Frontend: Services Update**
- [ ] **Frontend: Admin Pedidos**
- [ ] **Frontend: Admin Financeiro**

---

## Detalhamento das Tarefas

### 1. Backend: Admin Orders API
- [x] Criar `backend/src/controllers/admin/order.controller.ts`
    - Implementar `getOrders` (listar todos, filtros, paginação)
    - Implementar `updateOrderStatus`
- [x] Criar `backend/src/routes/admin/order.routes.ts`
    - Proteger com `authenticate` e `authorize('ADMIN')`
- [x] Registrar rota em `backend/src/routes/index.ts`
- [x] Atualizar `OrderService` para suportar listagem administrativa (sem filtro de userId obrigatório)

### 2. Backend: Admin Dashboard API
- [x] Criar `backend/src/services/dashboard.service.ts`
    - Implementar lógica de agregação (vendas totais, pedidos recentes, ticket médio)
- [x] Criar `backend/src/controllers/admin/dashboard.controller.ts`
    - Implementar `getStats`
- [x] Criar `backend/src/routes/admin/dashboard.routes.ts`
- [x] Registrar rota em `backend/src/routes/index.ts`

### 3. Frontend: Services Update
- [ ] Atualizar `frontend/src/services/order.service.ts`
    - Adicionar `getAdminOrders`
    - Adicionar `updateOrderStatus`
- [ ] Criar `frontend/src/services/dashboard.service.ts`
    - Adicionar `getDashboardStats`

### 4. Frontend: Admin Pedidos
- [ ] Criar hook `useAdminOrders` em `frontend/src/app/admin/pedidos/hooks/useAdminOrders.ts`
- [ ] Refatorar `frontend/src/app/admin/pedidos/page.tsx`
    - Remover `mockOrders`
    - Integrar com `useAdminOrders`
    - Adicionar funcionalidade de alterar status

### 5. Frontend: Admin Financeiro
- [ ] Refatorar `frontend/src/app/admin/financeiro/page.tsx`
    - Remover dados fictícios (`financialStats`)
    - Conectar ao `dashboard.service.ts`
