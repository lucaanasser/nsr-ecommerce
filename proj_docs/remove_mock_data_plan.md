# Plano: Remoção de Dados Mockados e Correção de Validação de Estoque

**Data:** 08/12/2025  
**Status:** 🚧 Em Progresso  
**Branch:** development

---

## 📋 Resumo Executivo

### Problema Principal
O sistema possui dados de produtos mockados (`/data/products.ts`) que não são mais utilizados, e a validação de estoque no checkout está incorreta, causando erros de "produto inválido" ao tentar finalizar pedidos.

### Causa Raiz
1. **Validação de estoque incorreta**: O checkout valida `item.stock` (estoque geral do produto), mas deveria validar o estoque da **variante específica** (combinação de size + color)
2. **Adaptadores desnecessários**: Páginas convertem dados do backend (ProductResponse) para formato mock antigo, perdendo informações importantes como variants
3. **Tipos duplicados**: Existem dois tipos Product - um em `/data/products.ts` (mock) e outro em `/services/product.service.ts` (backend)
4. **Código obsoleto**: Vários componentes ainda importam de `/data/products.ts`

---

## 🎯 Objetivos

- ✅ Remover completamente dados mockados
- ✅ Unificar tipos de Product para usar apenas o do backend
- ✅ Corrigir validação de estoque para usar variants
- ✅ Simplificar código removendo adaptadores
- ✅ Manter boas práticas e reutilização

---

## 📊 Análise de Dependências

### Arquivos que importam de `/data/products.ts`:
1. ✅ `/context/CartContext.tsx` - Tipo Product
2. ✅ `/context/FavoritesContext.tsx` - Tipo Product
3. ✅ `/components/product/ProductCard.tsx` - Tipo Product
4. ⚠️ `/app/produto/[slug]/page.tsx` - Array products (PÁGINA COMPLETA DE DETALHES)
5. ⚠️ `/app/arquivo/page.tsx` - Array products (LOOKBOOK)
6. ⚠️ `/app/admin/produtos/[id]/page.tsx` - Array products (ADMIN)

### Arquivos com adaptadores desnecessários:
- `/app/loja/page.tsx` - Converte ProductResponse → formato mock
- `/app/novidades/page.tsx` - Converte ProductResponse → formato mock

### Arquivos com validação de estoque incorreta:
- `/app/checkout/utils/validateCartItems.ts` - Valida `item.stock` geral
- `/context/CartContext.tsx` - Valida `product.stock` geral ao adicionar

---

## 🗂️ Tipos de Product

### ❌ Tipo Mock (Obsoleto) - `/data/products.ts`
```typescript
interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: 'masculino' | 'feminino';
  collection: string;
  sizes: string[];
  unavailableSizes?: string[];
  colors: string[];
  images: string[];
  featured: boolean;
  new: boolean;
}
```

### ✅ Tipo Backend (Correto) - `/services/product.service.ts`
```typescript
interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number; // estoque geral (soma das variants)
  gender: 'MALE' | 'FEMALE' | 'UNISEX';
  isFeatured: boolean;
  isActive: boolean;
  details?: { description: string | null };
  images?: ProductImage[];
  collection?: { name: string };
  variants?: ProductVariant[]; // ⚠️ IMPORTANTE!
}

interface ProductVariant {
  id: string;
  size: string;
  color: string | null;
  stock: number; // ⚠️ estoque específico da variante
}
```

---

## 🔄 Estratégia de Implementação

### Fase 1: Análise e Preparação ✅
- [x] Identificar todos os arquivos que dependem de `/data/products.ts`
- [x] Analisar estrutura de tipos Product (mock vs backend)
- [x] Documentar problemas de validação de estoque
- [x] Criar este documento de planejamento

### Fase 2: Atualização de Tipos (Commits 1-3)
**Status:** 🔄 Próximo

#### Commit 1: Atualizar CartContext para usar Product do backend
- [ ] Modificar `/context/CartContext.tsx`
  - Importar `Product` de `/services/product.service.ts`
  - Manter interface `CartItem extends Product`
  - Adicionar campos necessários: `variants`, `details`, `collection`
- [ ] Commit: `refactor(cart): use backend Product type in CartContext`

#### Commit 2: Atualizar FavoritesContext para usar Product do backend
- [ ] Modificar `/context/FavoritesContext.tsx`
  - Importar `Product` de `/services/product.service.ts`
- [ ] Commit: `refactor(favorites): use backend Product type`

#### Commit 3: Atualizar ProductCard para usar Product do backend
- [ ] Modificar `/components/product/ProductCard.tsx`
  - Importar `Product` de `/services/product.service.ts`
  - Ajustar renderização para usar `images`, `variants`, etc.
  - Extrair tamanhos de `variants?.map(v => v.size)`
- [ ] Commit: `refactor(product-card): use backend Product type and variants`

### Fase 3: Remoção de Adaptadores (Commits 4-5)

#### Commit 4: Simplificar página Loja
- [ ] Modificar `/app/loja/page.tsx`
  - Remover `produtosAdaptados`
  - Passar `products` diretamente para `ProductCard`
  - Manter apenas filtros e ordenação
- [ ] Commit: `refactor(loja): remove unnecessary product adapters`

#### Commit 5: Simplificar página Novidades
- [ ] Modificar `/app/novidades/page.tsx`
  - Remover `produtosAdaptados`
  - Passar `products` diretamente
  - Manter feedback de hover e adicionar ao carrinho
- [ ] Commit: `refactor(novidades): remove unnecessary product adapters`

### Fase 4: Correção de Validação de Estoque (Commits 6-7)

#### Commit 6: Corrigir validação no checkout
- [ ] Modificar `/app/checkout/utils/validateCartItems.ts`
  ```typescript
  // ❌ ANTES: Valida stock geral
  if (knownStock <= 0) { ... }
  
  // ✅ DEPOIS: Valida stock da variante específica
  const variant = item.variants?.find(v => 
    v.size === item.selectedSize && 
    v.color === item.selectedColor
  );
  if (!variant || variant.stock <= 0) { ... }
  ```
- [ ] Commit: `fix(checkout): validate stock by specific variant (size+color)`

#### Commit 7: Atualizar validação no CartContext
- [ ] Modificar `/context/CartContext.tsx`
  - Função `addToCart`: validar estoque da variante antes de adicionar
  - Função `updateQuantity`: validar estoque da variante antes de aumentar
  ```typescript
  const variant = product.variants?.find(v => v.size === size && v.color === color);
  if (!variant || variant.stock <= 0) {
    console.warn('Variante sem estoque');
    return;
  }
  ```
- [ ] Commit: `fix(cart): validate variant stock when adding/updating items`

### Fase 5: Tratamento de Páginas Especiais (Commits 8-9)

#### Commit 8: Refatorar página de detalhes do produto
**Problema:** `/app/produto/[slug]/page.tsx` usa array mockado `products`

**Solução:**
- [ ] Implementar busca dinâmica via API
  ```typescript
  const { product, isLoading } = useProductBySlug(slug);
  ```
- [ ] Usar `productService.getProductBySlug(slug)`
- [ ] Extrair tamanhos e cores de `product.variants`
- [ ] Commit: `refactor(product-details): fetch product from backend API`

#### Commit 9: Refatorar lookbook (arquivo)
**Problema:** `/app/arquivo/page.tsx` usa array mockado para featured products

**Solução:**
- [ ] Usar `useFeaturedProducts()` hook existente
- [ ] Adaptar layout do lookbook para dados dinâmicos
- [ ] Commit: `refactor(lookbook): use featured products from backend`

### Fase 6: Limpeza Final (Commit 10)

#### Commit 10: Remover arquivos obsoletos
- [ ] Deletar `/frontend/src/data/products.ts`
- [ ] Verificar e deletar outros arquivos mock não utilizados:
  - `/data/adminData.ts` (verificar uso no admin)
  - `/data/collaborationData.ts` (verificar uso)
  - `/data/financeData.ts` (verificar uso)
- [ ] Commit: `chore: remove obsolete mock data files`

### Fase 7: Testes e Validação (Commit 11)

#### Commit 11: Atualizar documentação
- [ ] Atualizar este documento com status final
- [ ] Documentar novas práticas no README se necessário
- [ ] Commit: `docs: update project documentation after mock removal`

---

## 🧪 Checklist de Testes

### Funcionalidade de Produtos
- [ ] Loja exibe produtos do banco de dados
- [ ] Novidades exibe produtos featured corretamente
- [ ] ProductCard renderiza imagens, preços e variantes
- [ ] Detalhes do produto carrega dados via API

### Funcionalidade de Carrinho
- [ ] Adicionar produto ao carrinho com tamanho específico
- [ ] Não permite adicionar se variante sem estoque
- [ ] Atualizar quantidade respeitando estoque da variante
- [ ] Carrinho mantém referência correta aos produtos

### Funcionalidade de Checkout
- [ ] Validação de estoque por variante funciona
- [ ] Erro "produto inválido" não ocorre mais
- [ ] Checkout finaliza com sucesso
- [ ] Backend recebe IDs de produtos corretos

### Edge Cases
- [ ] Produto sem variants (se aplicável)
- [ ] Produto com apenas uma variante
- [ ] Variante com estoque zero
- [ ] Produto inativo não aparece na loja

---

## 📈 Progresso

```
[████░░░░░░] 40% - Análise completa, iniciando implementação
```

### ✅ Concluído
- Análise de dependências
- Identificação de tipos duplicados
- Mapeamento de problemas de validação
- Criação do plano de ação

### 🔄 Em Progresso
- Atualização de tipos nos contexts

### ⏳ Pendente
- Remoção de adaptadores
- Correção de validação de estoque
- Refatoração de páginas especiais
- Limpeza de código obsoleto
- Testes end-to-end

---

## 🚨 Riscos e Mitigações

### Risco 1: Quebra de funcionalidade em prod
**Mitigação:** Testar cada commit individualmente antes de prosseguir

### Risco 2: Perda de dados do carrinho dos usuários
**Mitigação:** Manter compatibilidade com estrutura anterior no localStorage

### Risco 3: Páginas não listadas podem quebrar
**Mitigação:** Buscar por imports de `/data/products` antes de deletar

---

## 📝 Notas Técnicas

### Diferença entre stock geral e stock de variante
```typescript
// Produto tem stock geral (soma de todas variants)
product.stock = 100

// Mas cada variante tem seu próprio stock
product.variants = [
  { size: 'P', color: 'Preto', stock: 20 },
  { size: 'M', color: 'Preto', stock: 30 },
  { size: 'G', color: 'Preto', stock: 30 },
  { size: 'GG', color: 'Preto', stock: 20 },
]
```

**Validação correta:** Buscar a variante específica escolhida pelo usuário e validar `variant.stock`

### Estrutura de CartItem ideal
```typescript
interface CartItem {
  // Dados do produto (do backend)
  id: string;
  name: string;
  price: number;
  images?: ProductImage[];
  variants?: ProductVariant[];
  
  // Seleção do usuário
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  
  // Cache do estoque da variante selecionada (opcional, para performance)
  variantStock?: number;
}
```

---

## 🔗 Referências

- Backend Product Types: `/backend/src/types/product.types.ts`
- Backend Product Service: `/backend/src/services/product.service.ts`
- Frontend Product Service: `/frontend/src/services/product.service.ts`
- Prisma Schema: `/backend/prisma/schema.prisma`

---

---

## 📝 Log de Implementação

### 08/12/2025 - Fase 2 e 3 Concluídas ✅

**Commits realizados:**
1. ✅ `38e7c31` - refactor(cart): use backend Product type and validate variant stock
2. ✅ `91a14a3` - refactor(favorites): use backend Product type  
3. ✅ `b3c25d0` - refactor(product-card): use backend Product type and extract data from variants
4. ✅ `3eab81f` - refactor(loja): remove unnecessary product adapters
5. ✅ `e5b80ea` - refactor(novidades): remove unnecessary product adapters and use backend data
6. ✅ `8a9e8a7` - fix(checkout): validate stock by specific variant (size+color)

**Mudanças implementadas:**
- ✅ CartContext agora usa `Product` do backend e valida estoque por variante
- ✅ FavoritesContext atualizado para usar tipos do backend
- ✅ ProductCard extrai dados diretamente de `variants` e `images`
- ✅ Páginas Loja e Novidades removeram adaptadores desnecessários
- ✅ Validação de estoque no checkout agora verifica variante específica (size+color)
- ✅ Validação no carrinho previne adicionar itens sem estoque da variante

**Arquivos ainda usando `/data/products.ts`:**
- ⚠️ `/app/produto/[slug]/page.tsx` - Página de detalhes (usa array mockado)
- ⚠️ `/app/arquivo/page.tsx` - Lookbook (usa array mockado)
- ⚠️ `/app/admin/produtos/[id]/page.tsx` - Admin produtos (usa array mockado)

**Decisão:** Arquivos `adminData.ts`, `collaborationData.ts` e `financeData.ts` serão mantidos pois são usados pelas páginas admin e não interferem no fluxo de produtos da loja.

---

**Última atualização:** 08/12/2025 - Fase 2 e 3 concluídas, 6 commits realizados
