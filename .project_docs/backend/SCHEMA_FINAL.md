# 📊 Schema Final do E-commerce - Fase 2

## 📋 Resumo das Tabelas

### **Total: 15 Tabelas + 3 Enums**

---

## 🔐 Autenticação (2 tabelas)

### 1. **users**
```prisma
- id, email, password, name, role (CUSTOMER/ADMIN)
- phone, cpf
- createdAt, updatedAt, lastLogin
- Relações: addresses, orders, cart, reviews, refreshTokens
```

### 2. **refresh_tokens**
```prisma
- id, token, userId, expiresAt
- Relação: user (cascade delete)
```

---

## 📦 Catálogo de Produtos (5 tabelas)

### 3. **categories**
```prisma
- id, name, slug, description, imageUrl
- order (para ordenação)
- Relação: products
```

### 4. **collections**
```prisma
- id, name, slug, description, imageUrl
- startDate, endDate (datas da coleção)
- Relação: products
```

### 5. **products**
```prisma
- id, name, slug, description
- price, comparePrice (preço "de/por")
- stock, sku
- categoryId, collectionId, gender
- images[] (URLs Cloudinary)
- weight, length, width, height (para frete)
- material, careInstructions
- metaTitle, metaDescription (SEO)
- isFeatured, isActive
- Relações: variants, cartItems, orderItems, reviews
```

### 6. **product_variants**
```prisma
- id, productId
- size, color, colorHex
- stock, sku
- priceAdjustment (ajuste de preço)
- unique: [productId, size, color]
- Relação: product (cascade delete)
```

### 7. **reviews**
```prisma
- id, userId, productId
- rating (1-5), comment
- isApproved (moderação)
- unique: [userId, productId] (1 review por usuário)
- Relações: user, product (cascade delete)
```

---

## 🛒 Carrinho (2 tabelas)

### 8. **carts**
```prisma
- id, userId (unique - 1 carrinho por usuário)
- Relação: items, user (cascade delete)
```

### 9. **cart_items**
```prisma
- id, cartId, productId
- size, color (variante selecionada)
- quantity
- unique: [cartId, productId, size, color]
- Relações: cart, product (cascade delete)
```

---

## 📍 Endereços (1 tabela)

### 10. **addresses**
```prisma
- id, userId
- street, number, complement, neighborhood, city, state, zipCode
- receiverName, receiverPhone
- isDefault (endereço padrão)
- Relações: user, orders (cascade delete user)
```

---

## 🛍️ Pedidos (2 tabelas)

### 11. **orders**
```prisma
- id, orderNumber (ex: NSR-2025-0001)
- userId, addressId
- customerName, customerEmail, customerPhone (snapshot)
- status (PENDING, PAID, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED)
- paymentStatus (PENDING, PROCESSING, APPROVED, DECLINED, REFUNDED, CANCELLED)
- subtotal, shippingCost, discount, total
- paymentMethod, paymentId, paidAt
- shippingMethod, trackingCode, shippedAt, deliveredAt, estimatedDelivery
- couponCode
- cancelledAt, cancelReason
- notes
- Relações: user, address, items
```

### 12. **order_items**
```prisma
- id, orderId, productId
- productName, productImage (snapshot)
- size, color
- quantity, unitPrice, totalPrice
- Relações: order (cascade delete), product
```

---

## 🚚 Envio (1 tabela)

### 13. **shipping_methods**
```prisma
- id, name (PAC, SEDEX, etc), description
- baseCost, perKgCost (cálculo de frete)
- freeAbove (frete grátis acima de X)
- minDays, maxDays (prazo de entrega)
- isActive
```

---

## 🎟️ Cupons (1 tabela)

### 14. **coupons**
```prisma
- id, code (único), description
- discountType ("percentage" ou "fixed")
- discountValue (10% ou R$ 50.00)
- minPurchase, maxDiscount
- usageLimit, usageCount
- startDate, endDate
- isActive
```

---

## 📊 Enums

### UserRole
```prisma
CUSTOMER | ADMIN
```

### OrderStatus
```prisma
PENDING | PAID | PROCESSING | SHIPPED | DELIVERED | CANCELLED | REFUNDED
```

### PaymentStatus (NOVO)
```prisma
PENDING | PROCESSING | APPROVED | DECLINED | REFUNDED | CANCELLED
```

### Gender
```prisma
MALE | FEMALE | UNISEX
```

---

## 🔗 Relacionamentos Principais

```
User (1) ──< (N) Address
User (1) ──< (N) Order
User (1) ──< (N) Review
User (1) ──< (1) Cart
User (1) ──< (N) RefreshToken

Product (1) ──< (N) ProductVariant
Product (1) ──< (N) CartItem
Product (1) ──< (N) OrderItem
Product (1) ──< (N) Review
Product (N) ──> (1) Category
Product (N) ──> (1) Collection

Cart (1) ──< (N) CartItem

Order (1) ──< (N) OrderItem
Order (N) ──> (1) Address
Order (N) ──> (1) User
```

---

## ✅ Checklist de Features E-commerce

### Catálogo
- ✅ Produtos com múltiplas imagens
- ✅ Variantes (tamanho, cor)
- ✅ Categorias e coleções
- ✅ Preço "de/por"
- ✅ Controle de estoque
- ✅ SEO (meta tags)
- ✅ Produtos em destaque
- ✅ Filtro por gênero

### Carrinho
- ✅ Adicionar/remover itens
- ✅ Controle de quantidade
- ✅ Suporte a variantes
- ✅ Validação de estoque
- ✅ Persistência (1 cart por usuário)

### Checkout
- ✅ Múltiplos endereços
- ✅ Endereço padrão
- ✅ Snapshot de dados (histórico)
- ✅ Cálculo de frete (baseado em peso/dimensões)
- ✅ Métodos de envio configuráveis
- ✅ Prazo de entrega
- ✅ Cupons de desconto
- ✅ Frete grátis condicional

### Pagamento
- ✅ Múltiplos métodos (cartão, pix, boleto)
- ✅ Status de pagamento separado
- ✅ Gateway integration ready
- ✅ Histórico de transações

### Pedidos
- ✅ Número do pedido único
- ✅ Rastreamento (tracking code)
- ✅ Máquina de estados (status)
- ✅ Snapshot de produtos (preço no momento da compra)
- ✅ Cancelamento com motivo
- ✅ Histórico completo

### Pós-venda
- ✅ Sistema de avaliações
- ✅ Moderação de reviews
- ✅ 1 review por usuário/produto
- ✅ Rating 1-5 estrelas

### Autenticação
- ✅ JWT com refresh tokens
- ✅ Roles (customer/admin)
- ✅ Histórico de login
- ✅ Revogação de tokens

---

## 🚀 Pronto para:

1. ✅ Criar migration
2. ✅ Popular com seed
3. ✅ Implementar repositories
4. ✅ Construir API REST completa

**Schema 100% otimizado para e-commerce!** 🎉
