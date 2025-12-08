# Testando Checkout com PagBank

## ✅ Status da Implementação

### Backend (100% completo)
- ✅ Serviço PagBank integrado
- ✅ Criptografia de cartão via SDK
- ✅ Criação de pedidos com pagamento
- ✅ Webhook para notificações
- ✅ Cron jobs para expiração
- ✅ Endpoints de retry payment
- ✅ Stock management (PIX 15min, cartão imediato)

### Frontend (95% completo)
- ✅ Componente de pagamento com PIX/Cartão
- ✅ Integração PagBank SDK para criptografia
- ✅ Validação de cartão (Luhn algorithm)
- ✅ Formatação automática (cartão, CPF, validade)
- ✅ Detecção de bandeira
- ⚠️ **FALTA**: Integrar chamada à API no checkout final
- ⚠️ **FALTA**: Componente para exibir QR Code do PIX
- ⚠️ **FALTA**: Polling de status do pagamento

## 🧪 Como Testar

### 1. Configuração

Certifique-se que as variáveis estão configuradas:

**Backend** (`backend/.env.dev`):
```env
PAGBANK_TOKEN=6c8e79b5-29cb-4c9f-ac69-5390d87d0af6c2642e3e494e9e5770a02c5e66218a91185b-0812-422a-8590-614d7d54cf9b
PAGBANK_ENV=sandbox
```

**Frontend** (`frontend/.env.dev`):
```env
NEXT_PUBLIC_PAGBANK_PUBLIC_KEY=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAr+ZqgD892U9/HXsa7XqBZUayPquAfh9xx4iwUbTSUAvTlmiXFQNTp0Bvt/5vK2FhMj39qSv1zi2OuBjvW38q1E3Lqz58j+sS7UJqCAHCMxYsNFcHhcNwGp7rr6KuNnD6uRq5VbFBN/xsxCZvvxDPqwXK5tQkM1VpBPYE+FStQdxoMjPiVUxTWYxCNMOlXcuMh7KgL+J6NeM8xhKBSCXeMjXcG1RmWYhWVHvPp5JW6V0vBLnDFvHsz2GCVPpN+JVCEvmFR6cSqTMYaDfaOTR5vQz2z3sJm0BqYXQjgdqnMzp1m7JMa1vvDcX1vBJxg5G6QP0RJt9WKjw4KqM5IxmVqJQIDAQAB
```

### 2. Iniciar Serviços

```bash
# Na raiz do projeto
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# Ou separadamente
cd backend && npm run dev
cd frontend && npm run dev
```

### 3. Testar PIX

**Fluxo:**
1. Adicionar produtos ao carrinho
2. Ir para checkout
3. Preencher dados pessoais (ou fazer login)
4. Preencher endereço de entrega
5. Selecionar **PIX** como forma de pagamento
6. Confirmar pedido

**Resultado esperado:**
- ✅ Pedido criado com status `PENDING`
- ✅ QR Code gerado (texto e base64)
- ✅ Estoque reservado por 15 minutos
- ✅ Expiração do PIX: 15min (sandbox) ou 24h (produção)

**⚠️ Limitação atual no frontend:**
O componente ainda não exibe o QR Code após a confirmação. Você pode ver os dados no response da API:

```bash
# Verificar pedido criado
curl http://localhost:4000/api/v1/orders/:orderId \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. Testar Cartão de Crédito

#### 📋 Cartões de Teste do PagBank (Sandbox)

**Cartões aprovados:**
```
Número: 4111 1111 1111 1111 (Visa)
Validade: 12/30
CVV: 123
Nome: JOAO SILVA
CPF: 147.085.290-93 (válido)
```

```
Número: 5555 5555 5555 5557 (Mastercard)
Validade: 12/30
CVV: 123
Nome: MARIA SANTOS
CPF: 147.085.290-93
```

**Cartão recusado (para testar erro):**
```
Número: 4111 1111 1111 1112
Validade: 12/30
CVV: 123
```

**Fluxo:**
1. Adicionar produtos ao carrinho
2. Ir para checkout
3. Preencher dados pessoais
4. Preencher endereço
5. Selecionar **Cartão de Crédito**
6. Preencher dados do cartão (usar cartão de teste acima)
7. Confirmar pedido

**Resultado esperado:**
- ✅ SDK do PagBank carregado automaticamente
- ✅ Cartão criptografado no navegador (não enviamos número real ao backend)
- ✅ Pedido criado
- ✅ Se aprovado: status `CONFIRMED`, estoque decrementado
- ✅ Se recusado: status `PENDING`, estoque NÃO decrementado, pode tentar novamente

### 5. Testar Retry Payment

Se um pagamento falhar, o usuário tem **24 horas** para tentar novamente:

```bash
POST http://localhost:4000/api/v1/orders/:orderId/retry-payment
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "paymentMethod": "credit_card",
  "creditCard": {
    "encrypted": "...",
    "holderName": "JOAO SILVA",
    "holderCpf": "14708529093"
  }
}
```

### 6. Verificar Status do Pagamento

```bash
GET http://localhost:4000/api/v1/orders/:orderId/payment-status
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "orderId": "uuid",
  "orderStatus": "PENDING",
  "payment": {
    "status": "WAITING",
    "pixQrCode": "00020126...",
    "pixExpiresAt": "2025-12-08T12:00:00Z"
  },
  "canRetry": true,
  "retryDeadline": "2025-12-09T11:00:00Z"
}
```

## 🔍 Debugging

### Ver logs do backend:
```bash
docker logs nsr-backend -f
```

### Ver PIX criado com sucesso:
Procure no log por:
```
✅ PIX charge created successfully
```

### Ver webhook recebido:
```
Received PagBank webhook
```

### Ver cron jobs rodando:
```
PIX expiration job completed
Order expiration job completed
```

## 📱 Próximos Passos (Frontend)

1. **Criar componente de sucesso do pedido**
   - Exibir QR Code do PIX (se PIX)
   - Exibir confirmação (se cartão aprovado)
   - Polling de status a cada 5s

2. **Criar página de acompanhamento**
   - Ver pedidos pendentes
   - Retry payment
   - Ver QR Code novamente (se não expirou)

3. **Melhorias UX**
   - Loading states
   - Error handling
   - Animações

## 🔐 Segurança

### O que está protegido:
- ✅ Dados do cartão criptografados no navegador (SDK PagBank)
- ✅ Chave privada apenas no backend
- ✅ JWT para autenticação
- ✅ Webhook signature validation (implementado, mas comentado)
- ✅ Stock reservation para evitar overselling

### O que NÃO enviar ao backend:
- ❌ Número do cartão (raw)
- ❌ CVV (raw)
- ❌ Data de validade (raw)

### O que ENVIAR ao backend:
- ✅ `encrypted` (string criptografada pelo SDK)
- ✅ `holderName` (nome no cartão)
- ✅ `holderCpf` (CPF do titular)

## 📊 Fluxo de Estados

### PIX:
```
PENDING → WAITING (QR gerado) → PAID (pagamento confirmado) → CONFIRMED (order)
                               → EXPIRED (15min) → pode retry
```

### Cartão:
```
PENDING → PROCESSING → APPROVED/DECLINED
                    → APPROVED → CONFIRMED (order, estoque decrementado)
                    → DECLINED → pode retry (estoque não mexido)
```

### Ordem após 24h sem pagamento:
```
PENDING → CANCELED (automático pelo cron)
```

## 🐛 Problemas Comuns

### "SDK do PagBank não carregou"
- Verificar `NEXT_PUBLIC_PAGBANK_PUBLIC_KEY` no `.env.dev`
- Verificar console do navegador
- Testar manualmente: `window.PagSeguro`

### "Cartão inválido"
- Usar cartões de teste do PagBank
- Verificar Luhn algorithm
- CPF deve ser válido (usar `147.085.290-93`)

### "401 Unauthorized no backend"
- Verificar JWT token
- Token expira em 7 dias
- Fazer login novamente

### "Estoque insuficiente"
- Verificar se produto tem estoque
- Verificar se não há reservas ativas (PIX não expirados)
- Liberar reservas manualmente no banco se necessário

## 📝 Notas Importantes

1. **Sandbox vs Produção:**
   - Sandbox: PIX expira em tempo real (pode testar 15min)
   - Produção: PIX expira em 24h (PagBank limitation)

2. **Email do comprador:**
   - NÃO usar `lucamarinhonasser@gmail.com` (é o merchant)
   - Usar qualquer outro email de teste

3. **CPF:**
   - Deve ser válido (algoritmo de validação)
   - Sugestão: `147.085.290-93`

4. **Carrinho:**
   - Apenas limpa após pagamento bem-sucedido
   - Pedido pendente mantém carrinho

5. **Multiple attempts:**
   - Usuário pode tentar até 24h
   - Cada tentativa cria um novo `Payment` record
   - `attemptNumber` incrementa automaticamente
