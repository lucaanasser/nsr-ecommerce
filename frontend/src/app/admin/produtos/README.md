# Gestão de Produtos - Admin Panel

Módulo completo de gerenciamento de produtos com arquitetura modular e componentes reutilizáveis.

## 📁 Estrutura de Arquivos

```
/app/admin/produtos/
├── layout.tsx                          # Layout com sub-navegação
├── page.tsx                            # Listagem de produtos
├── novo/
│   └── page.tsx                        # Criar novo produto
├── estoque/
│   └── page.tsx                        # Gestão de estoque
├── categorias/
│   └── page.tsx                        # Gestão de categorias
├── colecoes/
│   └── page.tsx                        # Gestão de coleções
├── relatorios/
│   └── page.tsx                        # Relatórios e analytics
├── components/
│   ├── index.ts                        # Exportações centralizadas
│   ├── SearchBar.tsx                   # Barra de busca reutilizável
│   ├── FilterButtonGroup.tsx           # Grupo de filtros genérico
│   ├── LoadingState.tsx                # Estado de carregamento
│   ├── ErrorState.tsx                  # Estado de erro
│   ├── EmptyState.tsx                  # Estado vazio
│   ├── ProductTable.tsx                # Tabela de produtos
│   ├── StepIndicator.tsx               # Indicador de progresso wizard
│   ├── ProductFormWizard.tsx           # Wizard principal
│   └── form-steps/
│       ├── BasicInfoStep.tsx           # Step 1: Info básicas
│       ├── DescriptionStep.tsx         # Step 2: Descrição
│       ├── ImagesStep.tsx              # Step 3: Imagens
│       └── ReviewStep.tsx              # Step 4: Revisão
└── hooks/
    ├── useProducts.ts                  # Hook para listagem
    └── useProductForm.ts               # Hook para formulário
```

## 🎯 Funcionalidades Implementadas

### ✅ CHECKPOINT 1: Estrutura Base
- [x] Layout com sub-navegação por abas
- [x] Hook `useProducts` para gerenciar estado
- [x] Componentes reutilizáveis:
  - SearchBar
  - FilterButtonGroup
  - LoadingState
  - ErrorState
  - EmptyState
  - ProductTable
- [x] Página de listagem refatorada
- [x] Sistema de filtros funcionais
- [x] Estados visuais (loading, erro, vazio)

### ✅ CHECKPOINT 2: Formulário de Criação
- [x] Hook `useProductForm` com validação
- [x] Wizard multi-step (4 etapas)
- [x] StepIndicator com progresso visual
- [x] Step 1: Informações Básicas
  - Nome, slug, SKU, preço, estoque
  - Auto-geração de slug
  - Flags (destaque, ativo)
- [x] Step 2: Descrição e Detalhes
  - Descrição completa
  - Material
  - Instruções de cuidado
- [x] Step 3: Upload de Imagens
  - Drag & drop
  - Preview em tempo real
  - Definir imagem principal
  - Remover imagens
- [x] Step 4: Revisão Final
  - Checklist de campos obrigatórios
  - Preview do produto
  - Validação antes de salvar

### ✅ CHECKPOINT 3: Edição e Ações em Lote
- [x] Página de edição de produto
- [x] Modal de visualização rápida (QuickView)
- [x] Modal de confirmação reutilizável
- [x] Hook useSelection para seleção múltipla
- [x] Barra de ações em lote
- [x] Ações individuais:
  - Visualizar
  - Editar
  - Duplicar
  - Excluir
- [x] Ações em lote:
  - Selecionar todos
  - Ativar múltiplos
  - Desativar múltiplos
  - Duplicar múltiplos
  - Excluir múltiplos
- [x] ProductFormWizard suporta modo edição
- [x] Tabela com checkboxes de seleção

### 🚧 Em Desenvolvimento
- [ ] Gestão de variantes (tamanhos/cores)
- [ ] Gestão de categorias
- [ ] Gestão de coleções
- [ ] Dashboard de estoque
- [ ] Relatórios e analytics
- [ ] Integração com API real

## 🎨 Padrões de Design

### Componentes Reutilizáveis
Todos os componentes seguem o princípio de responsabilidade única e são altamente reutilizáveis:

```tsx
// Exemplo de uso
import { SearchBar, FilterButtonGroup, ProductTable } from './components';

<SearchBar 
  value={search}
  onChange={setSearch}
  placeholder="Buscar..."
/>
```

### Hooks Customizados
Lógica de negócio separada em hooks para reuso:

```tsx
// Hook de produtos
const { products, isLoading, filters, updateFilters } = useProducts();

// Hook de formulário
const { formData, updateField, nextStep, submitForm } = useProductForm();
```

### Tipagem TypeScript
Todos os componentes e hooks são fortemente tipados:

```tsx
interface ProductFormData {
  name: string;
  slug: string;
  price: number;
  // ...
}
```

## 🔄 Fluxo de Dados

### Listagem de Produtos
```
useProducts Hook
    ↓
Filtros aplicados
    ↓
Estado atualizado
    ↓
ProductTable renderiza
    ↓
useSelection gerencia seleção múltipla
```

### Criação de Produto
```
useProductForm Hook
    ↓
Usuário preenche steps
    ↓
Validação por step
    ↓
Revisão final
    ↓
Submit (TODO: integrar API)
```

### Edição de Produto
```
Carregar dados do produto
    ↓
useProductForm(initialData)
    ↓
Wizard pré-preenchido
    ↓
Usuário edita
    ↓
Submit atualização
```

### Ações em Lote
```
Usuário seleciona itens
    ↓
useSelection gerencia Set de IDs
    ↓
BulkActionsBar aparece
    ↓
Usuário escolhe ação
    ↓
ConfirmModal confirma
    ↓
Ação executada
```

## 🚀 Próximos Passos

1. **Integração com API**
   - Conectar hooks com backend
   - Implementar upload real de imagens
   - Error handling robusto

2. **Página de Edição**
   - Reutilizar ProductFormWizard
   - Pré-carregar dados existentes
   - Implementar atualização

3. **Variantes**
   - Grid de tamanhos x cores
   - Estoque por variante
   - SKU automático

4. **Categorias e Coleções**
   - CRUD completo
   - Upload de imagens
   - Ordenação drag & drop

5. **Melhorias UX**
   - Toast notifications
   - Auto-save de rascunhos
   - Undo/Redo
   - Histórico de alterações

## 💡 Boas Práticas Aplicadas

- ✅ Componentes pequenos e focados
- ✅ Hooks para lógica de negócio
- ✅ Props bem definidas e tipadas
- ✅ Sem código duplicado
- ✅ Estados visuais consistentes
- ✅ Responsividade mobile-first
- ✅ Acessibilidade básica
- ✅ Comentários e documentação

## 🛠️ Como Usar

### Adicionar novo produto
```tsx
// Navegar para /admin/produtos/novo
// Preencher wizard em 4 etapas
// Revisar e publicar
```

### Listar produtos
```tsx
// Navegar para /admin/produtos
// Usar filtros e busca
// Ações: visualizar, editar, duplicar, excluir
```

## 📝 Notas Técnicas

- Todas as imagens usam Next.js Image para otimização
- Validação em tempo real no formulário
- Slug auto-gerado com normalização
- Preview de imagens antes do upload
- Responsivo para mobile e tablet
- Estados de loading e erro tratados
