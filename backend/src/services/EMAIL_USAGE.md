# 📧 Email System - Quick Reference

## 🚀 Usando o Email Service

### Importar o Serviço

```typescript
import { emailService } from '@services/email.service';
```

### 1. Email de Boas-vindas

```typescript
await emailService.sendWelcomeEmail({
  userName: 'João Silva',
  userEmail: 'joao@example.com',
});
```

### 2. Confirmação de Pedido

```typescript
await emailService.sendOrderConfirmation({
  userName: 'João Silva',
  userEmail: 'joao@example.com',
  orderNumber: 'NSR-2025-0001',
  orderDate: new Date(),
  items: [
    {
      productName: 'Camiseta NSR Logo',
      size: 'M',
      color: 'Preto',
      quantity: 2,
      price: 149.90,
    }
  ],
  subtotal: 299.80,
  shippingCost: 15.00,
  discount: 30.00,
  total: 284.80,
  shippingAddress: {
    receiverName: 'João Silva',
    receiverPhone: '11987654321',
    street: 'Rua Exemplo',
    number: '123',
    complement: 'Apto 45',
    neighborhood: 'Centro',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01234-567',
  },
  paymentMethod: 'Cartão de Crédito',
});
```

### 3. Atualização de Status

```typescript
await emailService.sendOrderStatusUpdate({
  userName: 'João Silva',
  userEmail: 'joao@example.com',
  orderNumber: 'NSR-2025-0001',
  oldStatus: 'PROCESSING',
  newStatus: 'SHIPPED',
  statusMessage: 'Seu pedido foi enviado e está a caminho!',
  trackingCode: 'BR123456789BR',
});
```

### 4. Redefinição de Senha

```typescript
await emailService.sendPasswordReset({
  userName: 'João Silva',
  userEmail: 'joao@example.com',
  resetToken: 'abc123...',
  expiresIn: '1 hora',
});
```

## 📝 Pattern: Não-Bloqueante

**Sempre use `.catch()` para não bloquear operações principais:**

```typescript
emailService
  .sendWelcomeEmail(data)
  .catch((error) => {
    logger.error('Failed to send email', { error });
  });
```

## ⚙️ Configuração (.env)

```bash
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=seu-email@gmail.com
EMAIL_PASSWORD=senha-de-app-16-chars
EMAIL_FROM="NSR E-commerce <noreply@nsr.com>"
FRONTEND_URL=http://localhost:3000
```

## 🔧 Gmail - Obter Senha de App

1. Acesse: https://myaccount.google.com/apppasswords
2. App: "Mail" → Device: "NSR Backend"
3. Copie a senha gerada (16 caracteres)
4. Cole no `.env` como `EMAIL_PASSWORD`

## 📊 Status do Pedido - Traduções

| Status | Texto PT | CSS Class |
|--------|----------|-----------|
| PENDING | Aguardando Pagamento | pending |
| PAID | Pago | paid |
| PROCESSING | Em Processamento | processing |
| SHIPPED | Enviado | shipped |
| DELIVERED | Entregue | delivered |
| CANCELLED | Cancelado | cancelled |
| REFUNDED | Reembolsado | cancelled |

## 🎨 Template

Um único template (`base.hbs`) é reutilizado para todos os emails com dados dinâmicos.

**Variáveis disponíveis:**
- `subject` - Assunto do email
- `userName` - Nome do usuário
- `content` - Conteúdo principal (HTML)
- `buttonText` / `buttonUrl` - Botão de ação
- `orderDetails` - Detalhes do pedido (opcional)
- `additionalInfo` - Informações extras (HTML)
- `frontendUrl` - URL do frontend

## 🧹 Limpar Cache (Dev)

```typescript
emailService.clearTemplateCache();
```

## 📚 Documentação Completa

Ver: `.project_docs/fases_de_acao/FASE_7_EMAIL_NOTIFICATIONS.md`
