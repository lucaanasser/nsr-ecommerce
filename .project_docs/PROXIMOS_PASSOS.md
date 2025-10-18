# 🚀 Próximos Passos - NSR E-commerce Backend

> **Atualizado em:** 17/10/2025  
> **Início:** Fase 2B - Repositories Pattern

---

## 🔄 FASE 2B - REPOSITORIES PATTERN (30-45min)

### Objetivo
Criar camada de abstração sobre o Prisma para:
- ✅ Facilitar testes (mock dos repositories)
- ✅ Centralizar lógica de acesso a dados
- ✅ Reutilizar código entre services

### Arquivos a Criar

#### 1. Base Repository (15min)
**Arquivo:** `backend/src/repositories/base.repository.ts`

```typescript
interface IBaseRepository<T> {
  findById(id: string): Promise<T | null>;
  findMany(args: any): Promise<T[]>;
  create(data: any): Promise<T>;
  update(id: string, data: any): Promise<T>;
  delete(id: string): Promise<T>;
  count(args: any): Promise<number>;
}
```

#### 2. User Repository (10min)
**Arquivo:** `backend/src/repositories/user.repository.ts`

Métodos específicos:
- `findByEmail(email: string)`
- `findByEmailWithPassword(email: string)`
- `updatePassword(id: string, hashedPassword: string)`
- `findWithRefreshTokens(id: string)`

#### 3. Product Repository (10min)
**Arquivo:** `backend/src/repositories/product.repository.ts`

Métodos específicos:
- `findBySlug(slug: string)`
- `findWithVariants(id: string)`
- `search(query: string, filters: ProductFilters)`
- `findFeatured()`
- `findByCategory(categoryId: string)`

#### 4. Cart Repository (5min)
**Arquivo:** `backend/src/repositories/cart.repository.ts`

Métodos específicos:
- `findByUserId(userId: string)`
- `findWithItems(userId: string)`
- `clearCart(userId: string)`

#### 5. Order Repository (5min)
**Arquivo:** `backend/src/repositories/order.repository.ts`

Métodos específicos:
- `findByUserId(userId: string)`
- `findByOrderNumber(orderNumber: string)`
- `findWithItems(orderId: string)`
- `updateStatus(orderId: string, status: OrderStatus)`

---

## 🔐 FASE 3 - AUTHENTICATION API (3-4h)

### 3.1 - Services & Controllers (1h)

#### Auth Service
**Arquivo:** `backend/src/services/auth.service.ts`

Métodos:
- `register(data: RegisterDTO): Promise<User>`
- `login(email: string, password: string): Promise<LoginResponse>`
- `refreshToken(refreshToken: string): Promise<TokenPair>`
- `logout(userId: string, refreshToken: string): Promise<void>`
- `getProfile(userId: string): Promise<User>`
- `updateProfile(userId: string, data: UpdateProfileDTO): Promise<User>`

#### Auth Controller
**Arquivo:** `backend/src/controllers/auth.controller.ts`

Endpoints:
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`
- `PUT /api/v1/auth/me`

### 3.2 - Middlewares (30min)

#### Authenticate
**Arquivo:** `backend/src/middlewares/authenticate.ts`

- Extrair JWT do header `Authorization: Bearer <token>`
- Validar assinatura e expiração
- Injetar `req.user` com dados do usuário

#### Authorize
**Arquivo:** `backend/src/middlewares/authorize.ts`

```typescript
authorize(...roles: UserRole[])
```

### 3.3 - Validators (30min)

**Arquivo:** `backend/src/validators/auth.validator.ts`

Schemas Zod:
- `registerSchema` - email, password, name, cpf
- `loginSchema` - email, password
- `refreshSchema` - refreshToken
- `updateProfileSchema` - name, phone, cpf

### 3.4 - Utils (30min)

#### JWT Helper
**Arquivo:** `backend/src/utils/jwt.ts`

- `generateAccessToken(payload)`
- `generateRefreshToken(payload)`
- `verifyAccessToken(token)`
- `verifyRefreshToken(token)`

#### Password Helper
**Arquivo:** `backend/src/utils/password.ts`

- `hashPassword(password: string): Promise<string>`
- `comparePassword(password: string, hash: string): Promise<boolean>`
- `validatePasswordStrength(password: string): boolean`

### 3.5 - Types (15min)

**Arquivo:** `backend/src/types/auth.types.ts`

```typescript
interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
}
```

### 3.6 - Testes (30min)

**Arquivo:** `backend/tests/auth.test.ts`

- Testar registro com dados válidos
- Testar login com credenciais corretas
- Testar refresh token rotation
- Testar acesso a rotas protegidas
- Testar autorização por role

---

## 📦 FASE 4 - PRODUCTS API (3-4h)

### 4.1 - Services (1h)

#### Product Service
**Arquivo:** `backend/src/services/product.service.ts`

Métodos:
- `getProducts(filters: ProductFilters, pagination: Pagination)`
- `getProductBySlug(slug: string)`
- `createProduct(data: CreateProductDTO)` (admin)
- `updateProduct(id: string, data: UpdateProductDTO)` (admin)
- `deleteProduct(id: string)` (admin, soft delete)

#### Category Service
**Arquivo:** `backend/src/services/category.service.ts`

Métodos:
- `getCategories()`
- `getCategoryBySlug(slug: string)`
- `createCategory(data: CreateCategoryDTO)` (admin)

### 4.2 - Controllers (1h)

**Arquivo:** `backend/src/controllers/product.controller.ts`

Públicos:
- `GET /api/v1/products`
- `GET /api/v1/products/:slug`
- `GET /api/v1/categories`
- `GET /api/v1/collections`

Admin:
- `POST /api/v1/admin/products`
- `PUT /api/v1/admin/products/:id`
- `DELETE /api/v1/admin/products/:id`

### 4.3 - Upload de Imagens (1h)

#### Cloudinary Service
**Arquivo:** `backend/src/services/cloudinary.service.ts`

Métodos:
- `uploadImage(file: Express.Multer.File): Promise<string>`
- `uploadMultiple(files: Express.Multer.File[]): Promise<string[]>`
- `deleteImage(publicId: string): Promise<void>`

#### Upload Middleware
**Arquivo:** `backend/src/middlewares/upload.ts`

- Configurar multer (memoryStorage)
- Validar tipo de arquivo (jpg, png, webp)
- Validar tamanho (max 5MB)

### 4.4 - Filtros & Busca (30min)

**Types:** `backend/src/types/product.types.ts`

```typescript
interface ProductFilters {
  search?: string;
  categoryId?: string;
  collectionId?: string;
  gender?: Gender;
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
}

interface Pagination {
  page: number;
  limit: number;
  orderBy?: 'price_asc' | 'price_desc' | 'newest' | 'popular';
}
```

### 4.5 - Validators (30min)

**Arquivo:** `backend/src/validators/product.validator.ts`

Schemas:
- `createProductSchema`
- `updateProductSchema`
- `productFiltersSchema`

---

## 🛒 FASE 5 - SHOPPING CART API (2-3h)

### 5.1 - Cart Service (1h)

**Arquivo:** `backend/src/services/cart.service.ts`

Métodos:
- `getCart(userId: string)`
- `addItem(userId: string, data: AddItemDTO)`
- `updateItem(userId: string, itemId: string, quantity: number)`
- `removeItem(userId: string, itemId: string)`
- `clearCart(userId: string)`

### 5.2 - Cart Controller (30min)

**Arquivo:** `backend/src/controllers/cart.controller.ts`

Endpoints:
- `GET /api/v1/cart`
- `POST /api/v1/cart/items`
- `PUT /api/v1/cart/items/:id`
- `DELETE /api/v1/cart/items/:id`
- `DELETE /api/v1/cart`

### 5.3 - Validações (1h)

- Verificar disponibilidade de estoque
- Validar variante (size, color)
- Calcular subtotal automaticamente
- Limitar quantidade por item (max 10)
- Verificar se produto está ativo

---

## 💳 FASE 6 - CHECKOUT & ORDERS (4-5h)

### 6.1 - Order Service (2h)

**Arquivo:** `backend/src/services/order.service.ts`

Métodos:
- `createOrder(userId: string, data: CreateOrderDTO)`
- `getOrders(userId: string)`
- `getOrderById(orderId: string)`
- `cancelOrder(userId: string, orderId: string, reason: string)`

### 6.2 - Shipping Service (1h)

**Arquivo:** `backend/src/services/shipping.service.ts`

Métodos:
- `calculateShipping(items: CartItem[], cep: string)`
- `getShippingMethods()`

Lógica:
- Somar peso total dos produtos
- Calcular dimensões totais
- Aplicar fórmula: `baseCost + (weight * perKgCost)`
- Verificar frete grátis (`freeAbove`)

### 6.3 - Coupon Service (1h)

**Arquivo:** `backend/src/services/coupon.service.ts`

Métodos:
- `validateCoupon(code: string, cartTotal: number)`
- `applyCoupon(code: string, cartTotal: number)`

Validações:
- Verificar se cupom existe e está ativo
- Verificar datas (startDate, endDate)
- Verificar valor mínimo (minPurchase)
- Verificar limite de uso (usageLimit vs usageCount)
- Calcular desconto (percentage ou fixed)
- Aplicar desconto máximo (maxDiscount)

### 6.4 - Order Creation (1h)

Fluxo:
1. Validar dados do pedido
2. Validar estoque de todos os itens
3. Calcular frete
4. Aplicar cupom (se houver)
5. Criar snapshots:
   - Dados do cliente (nome, email, phone)
   - Dados dos produtos (nome, preço, imagem)
6. Gerar orderNumber único (`NSR-2025-0001`)
7. Decrementar estoque
8. Incrementar usageCount do cupom
9. Limpar carrinho
10. Retornar pedido criado

---

## 📧 FASE 7 - EMAIL & NOTIFICATIONS (2-3h)

### 7.1 - Email Service (1h)

**Arquivo:** `backend/src/services/email.service.ts`

Métodos:
- `sendWelcomeEmail(user: User)`
- `sendOrderConfirmation(order: Order)`
- `sendOrderStatusUpdate(order: Order)`
- `sendPasswordReset(user: User, token: string)`

### 7.2 - Templates (1h)

**Pasta:** `backend/src/templates/`

Templates HTML (Handlebars):
- `welcome.hbs` - Email de boas-vindas
- `order-confirmation.hbs` - Confirmação de pedido
- `order-update.hbs` - Atualização de status
- `password-reset.hbs` - Reset de senha

### 7.3 - Queue (1h)

**Opcional:** Implementar fila para emails (Bull + Redis)

Benefícios:
- Não bloquear requisição HTTP
- Retry automático em caso de falha
- Melhor performance

---

## 👨‍💼 FASE 8 - ADMIN FEATURES (3-4h)

### 8.1 - Admin Services (2h)

**Arquivo:** `backend/src/services/admin.service.ts`

Métodos:
- `getAllOrders(filters, pagination)`
- `updateOrderStatus(orderId, status)`
- `getAllUsers(filters, pagination)`
- `updateUserRole(userId, role)`
- `getStats(period: 'day' | 'week' | 'month' | 'year')`

### 8.2 - Admin Controller (1h)

**Arquivo:** `backend/src/controllers/admin.controller.ts`

Endpoints:
- `GET /api/v1/admin/orders`
- `PUT /api/v1/admin/orders/:id/status`
- `GET /api/v1/admin/users`
- `PUT /api/v1/admin/users/:id/role`
- `GET /api/v1/admin/stats`

### 8.3 - Estatísticas (1h)

**Dashboard Stats:**
- Total de vendas (período)
- Receita total
- Produtos mais vendidos
- Receita por categoria
- Novos clientes
- Taxa de conversão
- Ticket médio

---

## 🧪 FASE 9 - TESTES (3-4h)

### 9.1 - Setup Jest (30min)

- Configurar Jest + ts-jest
- Configurar banco de testes
- Criar helpers de teste

### 9.2 - Testes Unitários (1h)

- Services (lógica de negócio)
- Repositories (acesso a dados)
- Utils (helpers)

### 9.3 - Testes de Integração (1h)

- Controllers (endpoints)
- Middlewares (auth, validation)

### 9.4 - Testes E2E (1-2h)

- Fluxo completo de checkout
- Fluxo de autenticação
- Admin operations

**Meta:** Cobertura mínima de 80%

---

## 🚀 FASE 10 - DEPLOY VPS (4-6h)

### 10.1 - Preparação (1h)

- Variáveis de ambiente de produção
- Build otimizado (TypeScript → JavaScript)
- Configurar PM2 (process manager)
- Documentar processo de deploy

### 10.2 - VPS Setup (2h)

- Instalar Node.js 20 LTS
- Instalar PostgreSQL 16
- Configurar Nginx como reverse proxy
- Configurar SSL (Let's Encrypt)
- Configurar firewall (UFW)

### 10.3 - CI/CD (1-2h)

- GitHub Actions workflow
- Deploy automático (push to main)
- Backup automático do banco (daily)

### 10.4 - Monitoramento (1h)

- Logs centralizados
- Health checks
- Alertas (email/telegram)

---

## 📊 CRONOGRAMA ESTIMADO

```
Fase 2B - Repositories:     30-45min   ▓░░░░░░░░░
Fase 3 - Authentication:    3-4h       ▓▓▓▓░░░░░░
Fase 4 - Products API:      3-4h       ▓▓▓▓░░░░░░
Fase 5 - Cart API:          2-3h       ▓▓▓░░░░░░░
Fase 6 - Checkout/Orders:   4-5h       ▓▓▓▓▓░░░░░
Fase 7 - Email:             2-3h       ▓▓▓░░░░░░░
Fase 8 - Admin:             3-4h       ▓▓▓▓░░░░░░
Fase 9 - Testes:            3-4h       ▓▓▓▓░░░░░░
Fase 10 - Deploy:           4-6h       ▓▓▓▓▓▓░░░░

TOTAL: ~25-35 horas de desenvolvimento
```

---

## ✅ CHECKLIST - FASE 2B

### Repositories Pattern

- [ ] Criar `base.repository.ts` com interface genérica
- [ ] Implementar `user.repository.ts`
- [ ] Implementar `product.repository.ts`
- [ ] Implementar `cart.repository.ts`
- [ ] Implementar `order.repository.ts`
- [ ] Adicionar JSDoc em todos os métodos
- [ ] Exportar repositories no index
- [ ] Testar compilação TypeScript (0 erros)

**Tempo estimado:** 30-45 minutos  
**Arquivo de referência:** Ver exemplos na Fase 3

---

## 🎯 RECOMENDAÇÃO

**Começar por:** Fase 2B - Repositories Pattern

É rápido (30-45min) e vai facilitar muito as próximas fases, especialmente Authentication e Products API.

**Ordem sugerida:**
1. ✅ Repositories (agora)
2. ✅ Authentication (mais crítico)
3. ✅ Products API (core do e-commerce)
4. ✅ Cart API
5. ✅ Checkout & Orders
6. ✅ Email
7. ✅ Admin
8. ✅ Testes
9. ✅ Deploy

---

**Pronto para começar a Fase 2B?** 🚀
