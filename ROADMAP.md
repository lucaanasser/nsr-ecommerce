# 🗺️ NSR E-commerce - Roadmap de Desenvolvimento

> **Última atualização:** 17/10/2025  
> **Status Atual:** Fase 2 Completa ✅ (Database + Seed)

---

## ✅ FASES CONCLUÍDAS

### ✅ Fase 0 - Preparação e Arquitetura (COMPLETO)
- ✅ Estrutura de pastas backend (9 diretórios)
- ✅ TypeScript strict mode com path aliases
- ✅ Configuração Docker Compose (PostgreSQL 16)
- ✅ Prisma ORM setup
- ✅ Express + configurações (helmet, cors, morgan)
- ✅ Variáveis de ambiente (.env)

**Stack Definida:**
- Express.js 4.21.0 + TypeScript 5.6.2
- Prisma ORM 6.17.1 + PostgreSQL 16
- JWT + bcrypt (autenticação)
- Cloudinary (uploads)
- Nodemailer (emails)
- Swagger UI (documentação)
- Winston (logging)

---

### ✅ Fase 1 - Setup Básico (COMPLETO)
- ✅ Sistema de erros customizados (7 classes)
- ✅ Middleware de validação Zod
- ✅ Error handler centralizado
- ✅ Documentação Swagger (/api/docs)
- ✅ Sistema de rotas modular
- ✅ Health check endpoint

**Arquitetura:** Layered Architecture (6 camadas)
```
Routes → Middlewares → Controllers → Services → Repositories → Database
```

---

### ✅ Fase 2 - Database Schema & Prisma (COMPLETO)
- ✅ Schema Prisma com 15 tabelas otimizado para e-commerce
- ✅ Migration inicial aplicada (20251018013250_init)
- ✅ Prisma atualizado para v6.17.1
- ✅ Seed script implementado com dados de teste
- ✅ PostgreSQL conectado via VSCode extension

**Schema (15 Tabelas):**
- Autenticação: User, RefreshToken
- Catálogo: Category, Collection, Product, ProductVariant, Review
- Carrinho: Cart, CartItem
- Checkout: Address, Order, OrderItem
- E-commerce: ShippingMethod, Coupon

**Dados de Teste:**
- 3 categorias (Camisetas, Calças, Acessórios)
- 2 coleções (Verão 2025, Essentials)
- 3 produtos com variantes
- 2 usuários (admin@nsr.com / cliente@example.com)
- 3 métodos de frete (PAC, SEDEX, Express)
- 2 cupons (BEMVINDO10, FRETEGRATIS)

---

## 🚀 PRÓXIMAS FASES

### 🔄 Fase 2B - Repositories Pattern (30-45min)
**Objetivo:** Criar camada de abstração sobre Prisma

**Tarefas:**
- [ ] `base.repository.ts` - Repositório genérico com CRUD
- [ ] `user.repository.ts` - Operações de usuário
- [ ] `product.repository.ts` - Catálogo de produtos
- [ ] `cart.repository.ts` - Carrinho de compras
- [ ] `order.repository.ts` - Pedidos

**Métodos Principais:**
```typescript
// Base Repository
findById(id: string)
findMany(where, include)
create(data)
update(id, data)
delete(id)

// User Repository
findByEmail(email: string)
findByEmailWithPassword(email: string)
updatePassword(id: string, hashedPassword: string)

// Product Repository
findBySlug(slug: string)
findWithVariants(id: string)
search(query: string, filters: {})
```

---

### 🔐 Fase 3 - Authentication API (3-4h)
**Objetivo:** Sistema completo de autenticação JWT

#### 3.1 - Auth Services & Controllers
- [ ] `auth.service.ts` - Lógica de autenticação
- [ ] `auth.controller.ts` - Endpoints REST
- [ ] `auth.routes.ts` - Rotas de autenticação

#### 3.2 - Endpoints
```
POST   /api/v1/auth/register    - Criar nova conta
POST   /api/v1/auth/login       - Login (JWT + refresh token)
POST   /api/v1/auth/refresh     - Renovar access token
POST   /api/v1/auth/logout      - Invalidar refresh token
GET    /api/v1/auth/me          - Perfil do usuário autenticado
PUT    /api/v1/auth/me          - Atualizar perfil
```

#### 3.3 - Middlewares
- [ ] `authenticate.middleware.ts` - Validar JWT
- [ ] `authorize.middleware.ts` - Verificar roles (ADMIN, CUSTOMER)

#### 3.4 - Validators
- [ ] Zod schemas para register, login, update profile

#### 3.5 - Testes
- [ ] Testar registro de usuário
- [ ] Testar login e geração de tokens
- [ ] Testar refresh token rotation
- [ ] Testar rotas protegidas

---

### 📦 Fase 4 - Products API (3-4h)
**Objetivo:** CRUD completo de produtos

#### 4.1 - Services & Controllers
- [ ] `product.service.ts` - Lógica de negócio
- [ ] `category.service.ts` - Gerenciamento de categorias
- [ ] `product.controller.ts` - Endpoints REST

#### 4.2 - Endpoints (Públicos)
```
GET    /api/v1/products           - Listar produtos (paginado + filtros)
GET    /api/v1/products/:slug     - Detalhes do produto
GET    /api/v1/categories         - Listar categorias
GET    /api/v1/collections        - Listar coleções
```

#### 4.3 - Endpoints (Admin)
```
POST   /api/v1/admin/products     - Criar produto
PUT    /api/v1/admin/products/:id - Atualizar produto
DELETE /api/v1/admin/products/:id - Deletar produto (soft delete)
POST   /api/v1/admin/categories   - Criar categoria
```

#### 4.4 - Upload de Imagens
- [ ] Integração com Cloudinary
- [ ] Middleware de upload (multer)
- [ ] Validação de arquivos (formato, tamanho)

#### 4.5 - Filtros & Busca
- [ ] Busca por texto (nome, descrição)
- [ ] Filtro por categoria
- [ ] Filtro por coleção
- [ ] Filtro por gênero
- [ ] Filtro por faixa de preço
- [ ] Paginação (limit, offset)
- [ ] Ordenação (price_asc, price_desc, newest, popular)

---

### 🛒 Fase 5 - Shopping Cart API (2-3h)
**Objetivo:** Carrinho persistente com validação de estoque

#### 5.1 - Cart Service & Controller
- [ ] `cart.service.ts` - Lógica do carrinho
- [ ] `cart.controller.ts` - Endpoints REST

#### 5.2 - Endpoints
```
GET    /api/v1/cart              - Ver carrinho
POST   /api/v1/cart/items        - Adicionar item
PUT    /api/v1/cart/items/:id    - Atualizar quantidade
DELETE /api/v1/cart/items/:id    - Remover item
DELETE /api/v1/cart              - Limpar carrinho
```

#### 5.3 - Validações
- [ ] Verificar disponibilidade de estoque
- [ ] Validar variantes (tamanho, cor)
- [ ] Calcular subtotal automaticamente
- [ ] Limitar quantidade por item

---

### 💳 Fase 6 - Checkout & Orders API (4-5h)
**Objetivo:** Fluxo completo de checkout e pedidos

#### 6.1 - Order Service & Controller
- [ ] `order.service.ts` - Lógica de pedidos
- [ ] `shipping.service.ts` - Cálculo de frete
- [ ] `coupon.service.ts` - Validação de cupons

#### 6.2 - Endpoints
```
POST   /api/v1/orders            - Criar pedido
GET    /api/v1/orders            - Listar meus pedidos
GET    /api/v1/orders/:id        - Detalhes do pedido
POST   /api/v1/shipping/calculate - Calcular frete
POST   /api/v1/coupons/validate  - Validar cupom
```

#### 6.3 - Cálculo de Frete
- [ ] Baseado em peso e dimensões do produto
- [ ] Aplicar regras de frete grátis
- [ ] Retornar opções (PAC, SEDEX, Express)

#### 6.4 - Validação de Cupons
- [ ] Verificar validade (datas)
- [ ] Verificar valor mínimo
- [ ] Verificar limite de uso
- [ ] Aplicar desconto (percentual ou fixo)

#### 6.5 - Criação de Pedido
- [ ] Snapshot de produtos e preços
- [ ] Snapshot de dados do cliente
- [ ] Validar estoque antes de finalizar
- [ ] Decrementar estoque
- [ ] Gerar orderNumber único
- [ ] Limpar carrinho após pedido

---

### 📧 Fase 7 - Email & Notifications (2-3h)
**Objetivo:** Sistema de notificações por email

#### 7.1 - Email Service
- [ ] Configuração Nodemailer
- [ ] Templates HTML (Handlebars ou EJS)

#### 7.2 - Templates
- [ ] Email de boas-vindas (registro)
- [ ] Confirmação de pedido
- [ ] Atualização de status do pedido
- [ ] Reset de senha

---

### 👨‍💼 Fase 8 - Admin Features (3-4h)
**Objetivo:** Endpoints administrativos

#### 8.1 - Admin Endpoints
```
GET    /api/v1/admin/orders       - Listar todos os pedidos
PUT    /api/v1/admin/orders/:id   - Atualizar status
GET    /api/v1/admin/users        - Listar usuários
PUT    /api/v1/admin/users/:id    - Atualizar role
GET    /api/v1/admin/stats        - Dashboard (vendas, produtos)
```

#### 8.2 - Estatísticas
- [ ] Total de vendas (período)
- [ ] Produtos mais vendidos
- [ ] Receita por categoria
- [ ] Novos clientes

---

### 🧪 Fase 9 - Testes (3-4h)
**Objetivo:** Cobertura de testes

- [ ] Testes unitários (Services)
- [ ] Testes de integração (Controllers)
- [ ] Testes E2E (Fluxo completo)
- [ ] Cobertura mínima: 80%

---

### 🚀 Fase 10 - Deploy VPS (4-6h)
**Objetivo:** Deploy em produção

#### 10.1 - Preparação
- [ ] Configurar variáveis de ambiente de produção
- [ ] Build otimizado (TypeScript → JavaScript)
- [ ] Configurar PM2 para process management

#### 10.2 - VPS Setup
- [ ] Instalar Node.js + PostgreSQL
- [ ] Configurar Nginx como reverse proxy
- [ ] Configurar SSL (Let's Encrypt)
- [ ] Configurar firewall

#### 10.3 - CI/CD
- [ ] GitHub Actions para deploy automático
- [ ] Backup automático do banco

---

## 📊 PROGRESSO GERAL

```
[████████░░░░░░░░░░░░] 35% Completo

✅ Fase 0 - Preparação         [██████████] 100%
✅ Fase 1 - Setup Básico       [██████████] 100%
✅ Fase 2 - Database & Seed    [██████████] 100%
🔄 Fase 2B - Repositories      [░░░░░░░░░░]   0%
⏳ Fase 3 - Authentication     [░░░░░░░░░░]   0%
⏳ Fase 4 - Products API       [░░░░░░░░░░]   0%
⏳ Fase 5 - Cart API           [░░░░░░░░░░]   0%
⏳ Fase 6 - Checkout & Orders  [░░░░░░░░░░]   0%
⏳ Fase 7 - Email              [░░░░░░░░░░]   0%
⏳ Fase 8 - Admin              [░░░░░░░░░░]   0%
⏳ Fase 9 - Testes             [░░░░░░░░░░]   0%
⏳ Fase 10 - Deploy VPS        [░░░░░░░░░░]   0%
```

---

## 🎯 PRÓXIMA AÇÃO RECOMENDADA

**Implementar Fase 2B - Repositories Pattern**

Isso vai criar uma camada de abstração limpa sobre o Prisma, facilitando:
- Testes (mock dos repositories)
- Manutenção (lógica de acesso a dados centralizada)
- Reutilização (mesmos métodos em diferentes services)

**Tempo estimado:** 30-45 minutos

---

## 📝 NOTAS TÉCNICAS

### Credenciais de Teste
```
Admin: admin@nsr.com / senha123
Cliente: cliente@example.com / senha123
```

### URLs Importantes
```
Backend:         http://localhost:4000
Health Check:    http://localhost:4000/health
API Docs:        http://localhost:4000/api/docs
Prisma Studio:   http://localhost:5555
Frontend:        http://localhost:3000 (próxima integração)
```

### Database
```
Host:     localhost
Port:     5432
User:     nsr_dev
Password: dev_password_change_in_prod
Database: nsr_development
```

---

**Desenvolvido com ❤️ por Luca Anasser**
