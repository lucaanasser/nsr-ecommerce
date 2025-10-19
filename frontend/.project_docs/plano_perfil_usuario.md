# Plano de Ação: Integração da Página de Perfil do Usuário com o Banco de Dados

## Objetivo
Conectar a página de perfil do usuário (`frontend/src/app/perfil/page.tsx`) ao banco de dados, exibindo informações reais do usuário logado, garantindo reutilização máxima de código, evitando duplicação e mantendo o código limpo e reutilizável.

---

## 1. Levantamento de Infraestrutura Existente

### Backend
- **UserRepository** (`backend/src/repositories/user.repository.ts`): Métodos para buscar, atualizar e deletar usuários.
- **AuthService** (`backend/src/services/auth.service.ts`): Lógica de autenticação, atualização de perfil, mudança de senha, exclusão de conta, busca de perfil.
- **AuthController** (`backend/src/controllers/auth.controller.ts`): Endpoints REST para login, logout, buscar perfil, atualizar perfil, deletar conta.
- **Rotas** (`backend/src/routes/auth.routes.ts`): Exposição dos endpoints `/auth/me` (GET/PUT), `/auth/account` (DELETE), etc.
- **Tipos** (`backend/src/types/auth.types.ts`): Interfaces para dados de usuário, DTOs de atualização, resposta de login, etc.

### Frontend
- **AuthContext** (`frontend/src/context/AuthContext.tsx`): Contexto global de autenticação, armazena dados do usuário, métodos para login, logout, atualizar perfil, deletar conta.
- **authService** (`frontend/src/services/auth.service.ts`): Serviço para consumir endpoints do backend relacionados ao usuário.
- **Página de Perfil** (`frontend/src/app/perfil/page.tsx`): Renderiza dados do usuário, permite edição, exclusão, etc.

---

## 2. Fluxo de Dados Atual
- Após login, dados do usuário são salvos no `localStorage` e no `AuthContext`.
- O método `getProfile` do `authService` busca dados do usuário logado via `/auth/me`.
- Atualizações de perfil e senha usam os métodos `updateProfile` e `changePassword` do `authService`.
- Exclusão de conta usa `deleteAccount`.

---

## 3. Estratégia de Integração

### 3.1. Buscar Dados Reais do Usuário
- **No carregamento da página de perfil**, garantir que os dados exibidos venham do `AuthContext.user`.
- Se necessário, buscar dados atualizados do backend usando `authService.getProfile()` e atualizar o contexto.

### 3.2. Exibir Dados Dinâmicos
- Substituir dados mockados (nome, email, telefone, etc.) por dados reais do usuário logado (`user` do contexto).
- Para pedidos, endereços e cartões, criar métodos no backend para buscar essas informações associadas ao usuário e expor endpoints REST (se ainda não existirem).
- No frontend, criar hooks ou métodos no contexto para buscar e armazenar essas informações.

### 3.3. Atualização de Dados
- Ao editar dados pessoais, enviar requisição via `authService.updateProfile` e atualizar o contexto.
- Para mudança de senha, usar `authService.changePassword`.
- Para exclusão de conta, usar `authService.deleteAccount`.

### 3.4. Reutilização e Boas Práticas
- **Reutilizar o AuthContext** para centralizar dados e métodos do usuário.
- **Evitar duplicação**: Não criar novos estados locais para dados do usuário, sempre usar o contexto.
- **Hooks customizados**: Se necessário, criar hooks para buscar pedidos, endereços e cartões do usuário.
- **Componentização**: Extrair componentes para exibição/edição de dados do usuário, pedidos, endereços, etc.
- **Validação**: Validar dados antes de enviar ao backend.
- **Tratamento de erros**: Exibir mensagens amigáveis ao usuário.

---

## 4. Etapas Detalhadas

### 4.1. Backend
- [ ] Garantir que endpoints para buscar dados do usuário estejam implementados (`/auth/me`, `/user/orders`, `/user/addresses`, etc.).
- [ ] Implementar métodos no `UserRepository` para buscar pedidos, endereços e cartões do usuário.
- [ ] Garantir que respostas não exponham dados sensíveis (ex: senha).

### 4.2. Frontend
- [ ] No `AuthContext`, garantir que o usuário logado seja carregado corretamente e atualizado após alterações.
- [ ] Na página de perfil, substituir dados mockados por dados reais do contexto.
- [ ] Criar hooks ou métodos para buscar pedidos, endereços e cartões do usuário.
- [ ] Refatorar componentes para receber dados via props/contexto.
- [ ] Garantir atualização do contexto após edição/exclusão de dados.

### 4.3. Testes e Validação
- [ ] Testar fluxo de login, exibição, edição e exclusão de dados do usuário.
- [ ] Testar busca e exibição de pedidos, endereços e cartões reais.
- [ ] Validar tratamento de erros e mensagens ao usuário.

---

## 5. Sugestões de Refatoração
- Centralizar toda lógica de dados do usuário no `AuthContext` e `authService`.
- Extrair componentes para cada seção da página de perfil (dados pessoais, pedidos, endereços, pagamento, favoritos).
- Criar hooks customizados para dados relacionados ao usuário (ex: `useUserOrders`, `useUserAddresses`).
- Documentar endpoints e fluxos no backend para facilitar manutenção.

---

## 6. Boas Práticas
- **Reutilização máxima**: Usar contexto e hooks para evitar duplicação.
- **Componentização**: Facilita manutenção e testes.
- **Validação e tratamento de erros**: UX consistente.
- **Documentação**: Facilita onboarding e manutenção.

---

## 7. Arquivos Envolvidos
- `frontend/src/app/perfil/page.tsx`
- `frontend/src/context/AuthContext.tsx`
- `frontend/src/services/auth.service.ts`
- `backend/src/controllers/auth.controller.ts`
- `backend/src/services/auth.service.ts`
- `backend/src/repositories/user.repository.ts`
- `backend/src/routes/auth.routes.ts`
- `backend/src/types/auth.types.ts`

---

## 8. Checklist Final
- [ ] Dados do usuário logado exibidos corretamente na página de perfil
- [ ] Dados atualizados após edição
- [ ] Dados sensíveis protegidos
- [ ] Componentes reutilizáveis
- [ ] Código limpo e documentado

---

## 9. Referências
- [ ] Documentação dos endpoints REST
- [ ] Documentação dos contextos/hooks
- [ ] Documentação dos tipos/interfaces

---

> Este plano garante integração limpa, reutilizável e escalável entre frontend e backend, evitando duplicação e facilitando manutenção futura.
