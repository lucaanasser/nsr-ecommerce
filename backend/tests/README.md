# NSR E-commerce - Testes Automatizados

## 📋 Testes Implementados

### ✅ Testes de Autenticação (`auth.test.ts`)
- Registro de novo usuário
- Login com credenciais válidas
- Refresh token
- Logout
- Proteção de rotas
- Atualização de perfil
- Mudança de senha

### ✅ Testes de Produtos Públicos (`products.test.ts`)
- Listagem de produtos
- Filtros (categoria, preço, destaque)
- Busca por nome
- Paginação
- Detalhes do produto por slug

### ✅ Testes de Produtos Admin (`products-admin.test.ts`)
- Criar produto (somente admin)
- Atualizar produto (somente admin)
- Deletar produto - soft delete (somente admin)
- Validação de autenticação e autorização
- Validação de dados

### ✅ Testes de Categorias (`categories.test.ts`)
- Listagem de categorias
- Detalhes da categoria por slug
- Produtos por categoria

### ✅ Testes de Coleções (`collections.test.ts`)
- Listagem de coleções
- Detalhes da coleção por slug
- Produtos por coleção
- Coleções com datas (startDate, endDate)

## 🚀 Como Executar os Testes

### Pré-requisitos
- Banco de dados PostgreSQL rodando
- Variáveis de ambiente configuradas (`.env`)

### Comandos

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch (desenvolvimento)
npm run test:watch

# Executar testes com cobertura de código
npm run test:coverage

# Executar apenas um arquivo de teste específico
npm test -- tests/auth.test.ts

# Executar testes com output verboso
npm test -- --verbose
```

## 📊 Cobertura de Código

Meta estabelecida: **80% de cobertura**

A cobertura é medida nas seguintes métricas:
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

Para ver o relatório de cobertura:
```bash
npm run test:coverage
```

O relatório HTML será gerado em `coverage/index.html`.

## 🛠️ Estrutura dos Testes

```
backend/tests/
├── setup.ts                 # Configuração global dos testes
├── helpers.ts               # Funções auxiliares para criar dados de teste
├── auth.test.ts            # Testes de autenticação
├── products.test.ts        # Testes de produtos (público)
├── products-admin.test.ts  # Testes de produtos admin
├── categories.test.ts      # Testes de categorias
└── collections.test.ts     # Testes de coleções
```

## 🔧 Configuração

### Jest (`jest.config.js`)
- Preset: `ts-jest`
- Ambiente de teste: `node`
- Setup: `tests/setup.ts`
- Path aliases configurados
- Cobertura excluindo arquivos de configuração

### Setup (`tests/setup.ts`)
- Limpa banco de dados antes de todos os testes
- Limpa banco de dados após cada teste (isolamento)
- Desconecta do Prisma após todos os testes

### Helpers (`tests/helpers.ts`)
Funções auxiliares:
- `createTestUser()` - Cria usuário de teste
- `createTestAdmin()` - Cria admin de teste
- `createTestCustomer()` - Cria cliente de teste
- `createTestCategory()` - Cria categoria de teste
- `createTestCollection()` - Cria coleção de teste
- `createTestProduct()` - Cria produto de teste
- `cleanDatabase()` - Limpa banco de dados

## ⚠️ Importante

- Os testes usam o banco de dados configurado em `DATABASE_URL`
- **NUNCA execute testes em produção!**
- Os testes limpam todas as tabelas do banco
- Recomenda-se usar um banco de dados separado para testes

## 🐛 Troubleshooting

### Testes estão falhando
1. Verifique se o banco de dados está rodando
2. Verifique as variáveis de ambiente
3. Execute as migrações: `npm run prisma:migrate`
4. Limpe o cache do Jest: `npx jest --clearCache`

### Timeout errors
- Aumente o timeout no arquivo de teste:
  ```typescript
  jest.setTimeout(30000); // 30 segundos
  ```

### Erros de conexão com banco de dados
- Verifique o `DATABASE_URL` no `.env`
- Verifique se o PostgreSQL está acessível
- Tente reconectar: `npx prisma generate`

## 📝 Próximos Passos

### Testes a Implementar (Fases 5-8)
- [ ] Testes de Carrinho (`cart.test.ts`)
- [ ] Testes de Pedidos (`orders.test.ts`)
- [ ] Testes de Checkout (`checkout.test.ts`)
- [ ] Testes de Email (`email.test.ts`)
- [ ] Testes de Admin Dashboard (`admin.test.ts`)
- [ ] Testes de Cupons (`coupons.test.ts`)
- [ ] Testes de Frete (`shipping.test.ts`)

### Melhorias
- [ ] Testes E2E com fluxo completo
- [ ] Testes de performance
- [ ] Testes de segurança
- [ ] CI/CD pipeline com GitHub Actions
