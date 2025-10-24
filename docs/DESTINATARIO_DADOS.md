# Gestão de Dados de Destinatário

## 📋 Contexto

Os dados de destinatário (nome e telefone de quem vai receber) **NÃO** são salvos na tabela `addresses`. Eles são usados apenas durante o checkout e salvos diretamente na tabela `orders`.

## 🗄️ Estrutura de Dados

### Tabela `addresses`
Armazena apenas informações do **endereço físico**, sem dados pessoais do destinatário:

```prisma
model Address {
  id           String   @id @default(uuid())
  userId       String
  label        String   // Ex: "Casa", "Trabalho"
  street       String
  number       String
  complement   String?
  neighborhood String
  city         String
  state        String
  zipCode      String
  isDefault    Boolean  @default(false)
  
  // SEM receiverName e receiverPhone!
}
```

### Tabela `orders`
Armazena o **snapshot** completo dos dados no momento da compra, incluindo informações do destinatário:

```prisma
model Order {
  // ... outros campos
  
  // Endereço de entrega (referência)
  addressId     String
  address       Address  @relation(fields: [addressId], references: [id])
  
  // Dados do cliente/destinatário (snapshot para histórico)
  customerName  String   // Nome de quem vai receber
  customerEmail String
  customerPhone String   // Telefone de quem vai receber
  
  // ... outros campos
}
```

## 🛒 Fluxo no Checkout

### 1. Etapa de Entrega (`EntregaStep`)

O usuário fornece:
- **Dados do Destinatário** (se diferente do comprador):
  - Nome completo
  - Telefone
- **Endereço de Entrega**:
  - Pode selecionar um endereço salvo
  - Ou preencher um novo endereço

### 2. Salvar Endereço (Opcional)

Se o usuário marcar "Salvar este endereço":
- ✅ **É salvo**: Endereço físico (rua, número, cidade, etc.)
- ❌ **NÃO é salvo**: Nome e telefone do destinatário

```typescript
// Exemplo de salvamento no checkout
const novoEndereco = await addressService.createAddress({
  label: 'Casa',
  street: 'Rua das Flores',
  number: '123',
  neighborhood: 'Centro',
  city: 'São Paulo',
  state: 'SP',
  zipCode: '01234567',
  // receiverName e receiverPhone NÃO são enviados!
});
```

### 3. Criação do Pedido

Ao finalizar a compra, os dados do destinatário são salvos no **pedido**:

```typescript
const order = await orderService.create({
  addressId: enderecoId, // Referência ao endereço
  customerName: destinatarioIgualComprador 
    ? `${comprador.nome} ${comprador.sobrenome}`
    : destinatario.nomeCompleto,
  customerEmail: comprador.email,
  customerPhone: destinatarioIgualComprador
    ? comprador.telefone
    : destinatario.telefone,
  // ... outros dados do pedido
});
```

## 📍 Onde os Dados Aparecem

### ✅ Página de Perfil (`/perfil`)
- Modal de endereço **NÃO pede** nome e telefone do destinatário
- Formulário apenas com:
  - Título do endereço
  - CEP (com busca automática)
  - Rua, número, complemento
  - Bairro, cidade, estado

### ✅ Checkout (`/checkout`)
- **Pede nome e telefone do destinatário** separadamente
- Permite escolher: "Eu mesmo sou o destinatário"
- Se marcar para salvar endereço, salva apenas o endereço físico

### ✅ Detalhes do Pedido
- Mostra nome e telefone do destinatário
- Mostra endereço completo
- Tudo vem da tabela `orders` (snapshot)

## 🔐 Privacidade (LGPD)

### Vantagens desta Abordagem

1. **Minimização de Dados**: 
   - Endereços salvos não contêm dados pessoais de terceiros
   - Usuário só salva localizações físicas

2. **Flexibilidade**:
   - Mesmo endereço pode ser usado para diferentes destinatários
   - Ex: Endereço "Casa" pode receber diferentes pessoas

3. **Histórico Completo**:
   - Pedidos mantêm snapshot de todos os dados
   - Mesmo se endereço for deletado, pedido mantém informações

4. **Menos Redundância**:
   - Não precisa criar múltiplos endereços "Casa - João", "Casa - Maria"
   - Um endereço "Casa" serve para todos os casos

## 🎯 Exemplo Prático

### Cenário 1: Compra para si mesmo
```typescript
// Etapa 1: Seleciona endereço salvo "Casa"
enderecoSelecionado = {
  label: "Casa",
  street: "Rua A",
  number: "123",
  // ... outros campos
  // SEM receiverName e receiverPhone
}

// Etapa 2: Marca "Eu mesmo sou o destinatário"
destinatarioIgualComprador = true

// Resultado: Pedido usa dados do comprador
order = {
  addressId: endereco.id,
  customerName: "João Silva", // Do perfil do usuário
  customerPhone: "(11) 98765-4321", // Do perfil do usuário
}
```

### Cenário 2: Presente para outra pessoa
```typescript
// Etapa 1: Seleciona endereço salvo "Casa dos Pais"
enderecoSelecionado = {
  label: "Casa dos Pais",
  street: "Rua B",
  number: "456",
  // ... outros campos
}

// Etapa 2: Preenche dados do destinatário
destinatario = {
  nomeCompleto: "Maria Silva",
  telefone: "(11) 91234-5678"
}

// Resultado: Pedido usa dados do destinatário informado
order = {
  addressId: endereco.id,
  customerName: "Maria Silva", // Do formulário
  customerPhone: "(11) 91234-5678", // Do formulário
}
```

## 🚀 Implementação

### Backend
- ✅ Tabela `addresses` sem campos de destinatário
- ✅ Validadores atualizados
- ✅ Migration aplicada

### Frontend
- ✅ Modal de perfil sem campos de destinatário
- ✅ Checkout mantém campos de destinatário
- ✅ Tipos TypeScript atualizados
- ✅ Lógica de salvamento correta

## 📝 Checklist de Implementação Futura

Quando implementar a criação de pedidos, lembre-se de:

- [ ] Capturar dados do destinatário no checkout
- [ ] Salvar `customerName` e `customerPhone` na tabela `orders`
- [ ] Fazer snapshot do endereço completo no pedido
- [ ] Não modificar endereço salvo com dados de destinatário
- [ ] Validar dados de destinatário apenas no checkout
- [ ] Exibir dados corretos na confirmação do pedido
- [ ] Mostrar dados do destinatário no histórico de pedidos
