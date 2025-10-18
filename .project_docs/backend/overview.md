# Overview do Backend NSR

Este documento resume toda a estrutura e lógica do backend do projeto NSR, facilitando referência rápida para futuras integrações, rastreamento de mudanças e evitando acúmulo de código desnecessário.

## Estrutura Geral
- **Framework:** Express.js (TypeScript)
- **ORM:** Prisma
- **Documentação:** Swagger
- **Logs:** Morgan + Winston
- **Validação:** Zod (middlewares e validators)
- **Autenticação:** JWT + bcrypt, middlewares de autenticação/autorização
- **Upload:** Cloudinary + Multer
- **Email:** Nodemailer + Handlebars

## Status do Projeto
- **Fases Concluídas:** 0, 1, 2, 2B, 3, 4, 5, 6, 7
- **Endpoints Funcionais:** 24 endpoints
- **Tempo Total:** ~17h15min de desenvolvimento
- **Compilação:** ✅ 0 erros TypeScript

## Principais Arquivos
- **app.ts:** Inicialização do Express, middlewares globais, integração Swagger, logging, rotas, error handler
- **server.ts:** Inicializa o servidor Express
- **prisma/schema.prisma:** 15 tabelas, 4 enums
- **prisma/seed.ts:** Dados de teste (usuários, produtos, cupons, etc)

## Pastas e Estrutura

### **config/**
- `env.ts` - Variáveis de ambiente
- `database.ts` - Prisma client singleton
- `logger.ts` - Winston logger configurado
- `swagger.ts` - Documentação automática da API
- `email.ts` - Transporter do Nodemailer, verificação de conexão

### **controllers/**
- `auth.controller.ts` - 8 endpoints de autenticação
- `product.controller.ts` - Listagem pública de produtos
- `cart.controller.ts` - 5 endpoints de carrinho
- `order.controller.ts` - 4 endpoints de pedidos
- `shipping.controller.ts` - 2 endpoints de frete
- **admin/**
  - `product.controller.ts` - CRUD de produtos (admin only)

### **middlewares/**
- `authenticate.ts` - Validação de JWT, injeta req.user
- `authorize.ts` - Verifica roles (admin, customer)
- `validate.ts` - Validação com Zod schemas
- `errorHandler.ts` - Tratamento centralizado de erros
- `upload.ts` - Upload de arquivos (Multer + Cloudinary)

### **repositories/**
- `base.repository.ts` - Interface genérica IBaseRepository<T>
- `user.repository.ts` - Busca por email, atualização de senha, etc
- `product.repository.ts` - Busca avançada, filtros, estoque
- `cart.repository.ts` - Gerenciamento de itens do carrinho
- `order.repository.ts` - Criação, listagem, estatísticas
- `index.ts` - Exporta todos os repositories

### **routes/**
- `index.ts` - Registro de todas as rotas
- `auth.routes.ts` - `/api/v1/auth/*`
- `product.routes.ts` - `/api/v1/products/*`
- `category.routes.ts` - `/api/v1/categories/*`
- `collection.routes.ts` - `/api/v1/collections/*`
- `cart.routes.ts` - `/api/v1/cart/*`
- `order.routes.ts` - `/api/v1/orders/*`
- `shipping.routes.ts` - `/api/v1/shipping/*`
- **admin/**
  - `product.routes.ts` - `/api/v1/admin/products/*`

### **services/**
- `auth.service.ts` - Registro, login, refresh token, perfil
- `product.service.ts` - CRUD de produtos, filtros, busca
- `category.service.ts` - Gestão de categorias
- `collection.service.ts` - Gestão de coleções
- `cart.service.ts` - Adicionar, atualizar, remover itens
- `order.service.ts` - Criar pedido, listar, cancelar
- `shipping.service.ts` - Cálculo de frete por tabela
- `coupon.service.ts` - Validação e aplicação de cupons
- `cloudinary.service.ts` - Upload e gestão de imagens
- `email.service.ts` - Envio de emails transacionais (4 tipos)

### **types/**
- `auth.types.ts` - AuthUser, LoginResponse, RegisterDTO, etc
- `product.types.ts` - ProductFilters, ProductResponse, etc
- `cart.types.ts` - AddItemDTO, CartResponse, etc
- `order.types.ts` - CreateOrderDTO, OrderResponse, etc
- `shipping.types.ts` - ShippingCalculation, ShippingOption, etc
- `coupon.types.ts` - CouponValidation, CouponApplication, etc
- `email.types.ts` - EmailOptions, WelcomeEmailData, OrderConfirmationEmailData, etc
- `express.d.ts` - Extensão do Express.Request com user

### **utils/**
- `password.ts` - Hash, validação de força, geração segura
- `jwt.ts` - Geração e validação de tokens
- `errors.ts` - Classes de erro customizadas

### **validators/**
- `auth.validator.ts` - Schemas de registro, login, perfil
- `product.validator.ts` - Schemas de criação/atualização de produtos
- `cart.validator.ts` - Schemas de adição/atualização de itens
- `order.validator.ts` - Schemas de criação e cancelamento de pedidos
- `shipping.validator.ts` - Schema de cálculo de frete

### **templates/**
- `base.hbs` - Template HTML único para todos os emails (Handlebars)

### **tests/** (em desenvolvimento)
- `setup.ts` - Configuração global de testes
- `helpers.ts` - Helpers para criação de dados de teste
- `auth.test.ts` - Testes de autenticação
- `products.test.ts` - Testes de produtos (públicos)
- `products-admin.test.ts` - Testes de produtos (admin)
- `categories.test.ts` - Testes de categorias
- `collections.test.ts` - Testes de coleções
- `cart.test.ts` - Testes de carrinho
- `fase6-orders.http` - Testes manuais de pedidos (REST Client)

## Endpoints Disponíveis

### Autenticação (8 endpoints)
```
POST   /api/v1/auth/register          # Registrar usuário
POST   /api/v1/auth/login             # Login
POST   /api/v1/auth/refresh           # Refresh token
POST   /api/v1/auth/logout            # Logout
POST   /api/v1/auth/logout-all        # Logout de todas as sessões
GET    /api/v1/auth/me                # Perfil do usuário
PUT    /api/v1/auth/me                # Atualizar perfil
PUT    /api/v1/auth/change-password   # Mudar senha
```

### Produtos Públicos (6 endpoints)
```
GET    /api/v1/products               # Listar produtos (com filtros)
GET    /api/v1/products/:slug         # Detalhes do produto
GET    /api/v1/categories             # Listar categorias
GET    /api/v1/categories/:slug       # Detalhes da categoria
GET    /api/v1/collections            # Listar coleções
GET    /api/v1/collections/:slug      # Detalhes da coleção
```

### Produtos Admin (3 endpoints)
```
POST   /api/v1/admin/products         # Criar produto (ADMIN)
PUT    /api/v1/admin/products/:id     # Atualizar produto (ADMIN)
DELETE /api/v1/admin/products/:id     # Deletar produto (ADMIN)
```

### Carrinho (5 endpoints)
```
GET    /api/v1/cart                   # Buscar carrinho
POST   /api/v1/cart/items             # Adicionar item
PUT    /api/v1/cart/items/:id         # Atualizar quantidade
DELETE /api/v1/cart/items/:id         # Remover item
DELETE /api/v1/cart                   # Limpar carrinho
```

### Frete (2 endpoints)
```
GET    /api/v1/shipping/methods       # Listar métodos de envio
POST   /api/v1/shipping/calculate     # Calcular frete
```

### Pedidos (4 endpoints)
```
POST   /api/v1/orders                 # Criar pedido
GET    /api/v1/orders                 # Listar meus pedidos
GET    /api/v1/orders/:id             # Ver detalhes do pedido
POST   /api/v1/orders/:id/cancel      # Cancelar pedido
```

### Health Check (2 endpoints)
```
GET    /health                        # Health check
GET    /api/v1                        # Informações da API
```

## Database Schema

### Modelos (15 tabelas)
1. **User** - Usuários (admin, customer)
2. **RefreshToken** - Tokens de refresh JWT
3. **Address** - Endereços de entrega
4. **Category** - Categorias de produtos
5. **Collection** - Coleções/campanhas
6. **Product** - Produtos
7. **ProductVariant** - Variantes (tamanho, cor)
8. **Cart** - Carrinhos de compra
9. **CartItem** - Itens do carrinho
10. **Order** - Pedidos
11. **OrderItem** - Itens do pedido (snapshot)
12. **Review** - Avaliações de produtos
13. **ShippingMethod** - Métodos de envio
14. **Coupon** - Cupons de desconto

### Enums (4)
- **UserRole:** CUSTOMER, ADMIN
- **OrderStatus:** PENDING, PAID, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED
- **PaymentStatus:** PENDING, PROCESSING, APPROVED, DECLINED, REFUNDED, CANCELLED
- **Gender:** MALE, FEMALE, UNISEX

## Funcionalidades Implementadas

### ✅ Autenticação & Autorização
- JWT com refresh token rotation
- bcrypt com 12 salt rounds
- Validação de senha forte (8 regras)
- Logout individual e global
- Perfil de usuário
- Mudança de senha

### ✅ Produtos
- CRUD completo (admin)
- Listagem pública com filtros
- Busca por nome/descrição
- Filtros: categoria, coleção, gênero, preço, destaque
- Paginação
- Upload de imagens (Cloudinary)
- Soft delete

### ✅ Carrinho de Compras
- Adicionar itens com variantes
- Atualizar quantidade
- Remover itens
- Limpar carrinho
- Validação de estoque
- Cálculo de subtotais

### ✅ Checkout & Pedidos
- Criação de pedido completo
- Cálculo de frete por tabela
- Aplicação de cupons de desconto
- Validação de estoque
- Snapshots de dados
- Geração de número único (NSR-2025-XXXX)
- Decrementação de estoque
- Limpeza do carrinho
- Listagem de pedidos
- Detalhes do pedido
- Cancelamento com devolução de estoque

### ✅ Frete
- Cálculo por peso (tabela)
- Múltiplos métodos (PAC, SEDEX, Expresso)
- Frete grátis configurável
- Prazo estimado de entrega

### ✅ Cupons
- Desconto percentual ou fixo
- Validação de período
- Valor mínimo de compra
- Desconto máximo
- Limite de uso
- Incremento automático

## Segurança

### Implementado
- ✅ JWT tokens (access 15min, refresh 7d)
- ✅ Refresh token rotation
- ✅ bcrypt para senhas (12 rounds)
- ✅ Validação de força de senha
- ✅ Helmet (security headers)
- ✅ CORS configurado
- ✅ Validação de inputs (Zod)
- ✅ Sanitização de dados
- ✅ Logging de eventos de segurança
- ✅ Autorização por role (admin/customer)
- ✅ Proteção de recursos (owner/admin)

### Protegido Contra
- ✅ SQL Injection (Prisma ORM)
- ✅ XSS (validação e sanitização)
- ✅ Timing Attacks (bcrypt timing-safe)
- ✅ Token Theft (refresh rotation)
- ✅ Session Fixation (JWT stateless)

## Próximas Fases

### Fase 8 - Admin Features (3-4h) - PRÓXIMA
- Dashboard de vendas
- Gestão de pedidos
- Gestão de usuários
- Estatísticas e relatórios

### Fase 9 - Testes (3-4h)
- Aumentar cobertura de testes
- Testes E2E completos
- Meta: 80% de cobertura

### Fase 10 - Deploy (4-6h)
- Setup VPS
- CI/CD com GitHub Actions
- Monitoramento
- Backups automáticos

## Email System

### Implementado (Fase 7)
- ✅ Nodemailer + Handlebars
- ✅ Template HTML único reutilizável
- ✅ 4 tipos de emails transacionais
- ✅ Sistema não-bloqueante
- ✅ Cache de templates
- ✅ Formatação automática (moeda, data)
- ✅ Design responsivo

### Tipos de Emails
1. **Boas-vindas** - Enviado no registro
2. **Confirmação de pedido** - Com tabela de produtos e totais
3. **Atualização de status** - Com tracking code
4. **Redefinição de senha** - Com link e token

### Configuração
- Gmail SMTP (App Password)
- Templates Handlebars com CSS inline
- Blocos condicionais para reutilização
- Logging completo de envios

## Observações
- Estrutura modular, fácil manutenção e expansão
- Pronto para integração com frontend
- Documentação automática via Swagger em `/api/docs`
- TypeScript strict mode (0 erros)
- Transações atômicas para operações críticas
- Logging estruturado (Winston)
- Path aliases configurados (@config, @services, etc)
- Sistema de emails transacionais completo

---

**Última atualização:** 18/10/2025  
Este overview é atualizado conforme mudanças no backend. Consulte os arquivos específicos para detalhes de cada módulo.
