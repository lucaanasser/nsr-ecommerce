# 📋 NSR E-commerce - Resumo do Projeto

## 🎯 Visão Geral

**NSR** (ناصر - Nasser) é um e-commerce de moda streetwear com estética árabe contemporânea. O projeto utiliza Next.js 14 com App Router, React 18, TypeScript e TailwindCSS para criar uma experiência visual minimalista e elegante.

---

## ��️ Arquitetura do Projeto

### **Tipo de Arquitetura: Feature-Based com App Router**

O projeto segue uma arquitetura modular baseada em funcionalidades, aproveitando o **App Router do Next.js 14** onde:
- Cada pasta em `/app` representa uma **rota**
- Arquivo `page.tsx` = página pública acessível
- Componentes organizados por **domínio** (layout, produto, ui)
- Contextos para **estado global** (carrinho)
- Dados mockados **centralizados**

### **Estrutura Simplificada:**
\`\`\`
frontend/
├── src/
│   ├── app/                    # Rotas e Páginas (Next.js App Router)
│   │   ├── page.tsx           # / (Página Inicial)
│   │   ├── loja/              # /loja (Vitrine Visual)
│   │   ├── produtos/          # /produtos (Catálogo Completo)
│   │   ├── produto/[slug]/    # /produto/:slug (Detalhes)
│   │   ├── carrinho/          # /carrinho
│   │   ├── sobre/             # /sobre
│   │   ├── lookbook/          # /lookbook
│   │   ├── login/             # /login (ATUALIZADO - com seleção admin/user)
│   │   └── admin/             # 🆕 PAINEL ADMINISTRATIVO
│   │       ├── layout.tsx     # Layout com sidebar + proteção de rota
│   │       ├── page.tsx       # Dashboard com métricas
│   │       ├── produtos/      # Gestão de produtos
│   │       ├── pedidos/       # Gestão de pedidos
│   │       ├── estoque/       # Controle de estoque
│   │       ├── usuarios/      # Gestão de clientes
│   │       └── configuracoes/ # Configurações da loja
│   ├── components/            # Componentes Reutilizáveis
│   │   ├── layout/           # Header, Footer
│   │   ├── product/          # ProductCard
│   │   ├── ui/               # Button, Container
│   │   ├── icons/            # Ícones customizados
│   │   └── admin/            # 🆕 COMPONENTES ADMIN
│   │       ├── Sidebar.tsx   # Navegação lateral admin
│   │       ├── AdminHeader.tsx # Header do painel
│   │       └── StatCard.tsx  # Card de estatísticas
│   ├── context/              # Estado Global
│   │   ├── CartContext.tsx   # Carrinho de compras
│   │   ├── FavoritesContext.tsx # Favoritos
│   │   └── AdminContext.tsx  # 🆕 AUTENTICAÇÃO ADMIN
│   └── data/
│       ├── products.ts       # Produtos mockados
│       └── adminData.ts      # 🆕 DADOS ADMIN (pedidos, clientes, estoque)
\`\`\`

---

## 📄 Páginas e Suas Funções

### **1. 🏠 Página Inicial (\`/\`)**
**Arquivo:** \`src/app/page.tsx\`

**Propósito:** Landing page com vídeo fullscreen e navegação minimalista.

**Funcionalidades:**
- Vídeo de fundo em loop com controle play/pause
- Logo árabe (ناصر) em destaque
- Menu de navegação com animações
- Design imersivo e elegante

---

### **2. 🛍️ Loja (\`/loja\`)**
**Arquivo:** \`src/app/loja/page.tsx\`

**Propósito:** **Vitrine visual com experiência rápida de compra**

**Funcionalidades:**
- Grid compacto sem espaçamento (imagens grandes)
- **Hover mostra segunda imagem + tamanhos disponíveis**
- **Adiciona ao carrinho DIRETO** (clica no tamanho)
- Preço sempre visível
- Filtros básicos por categoria
- Mobile: primeiro clique mostra detalhes, segundo navega

**Diferencial:** Foco em **velocidade visual** e compra rápida sem sair da página.

---

### **3. 📚 Produtos (\`/produtos\`)**
**Arquivo:** \`src/app/produtos/page.tsx\`

**Propósito:** **Catálogo completo com filtros avançados**

**Funcionalidades:**
- Grid espaçado com ProductCard
- Filtros por categoria (todos/masculino/feminino)
- Ordenação (novidades/preço)
- Contador de produtos
- **Clica no card para ver detalhes** (não adiciona direto)
- Layout respirável com muito espaço

**Diferencial:** Navegação tradicional para **exploração do catálogo**.

---

### **🤔 Por que duas páginas de produtos?**

| Aspecto | \`/loja\` | \`/produtos\` |
|---------|---------|-------------|
| **Experiência** | Rápida e visual | Exploração completa |
| **Interação** | Adiciona direto ao carrinho | Navega para detalhes |
| **Layout** | Imagens grandes, sem gap | Grid espaçado |
| **Público** | Quem sabe o que quer | Quem quer explorar |
| **Componente** | Código inline | Usa ProductCard |

**Ambas são úteis!** Use \`/loja\` como destaque no menu e \`/produtos\` como "Ver tudo" ou "Catálogo".

---

### **4. 👕 Produto Individual (\`/produto/[slug]\`)**
**Arquivo:** \`src/app/produto/[slug]/page.tsx\`

**Propósito:** Página de detalhes completos de um produto específico.

**Funcionalidades:**
- Galeria de imagens com thumbnails
- Seleção de tamanho e cor
- Controle de quantidade
- Botão "Adicionar ao Carrinho"
- Informações detalhadas (descrição, coleção, etc.)
- Produtos relacionados da mesma coleção
- Badges de benefícios (frete, trocas, segurança)

---

### **5. 🛒 Carrinho (\`/carrinho\`)**
**Arquivo:** \`src/app/carrinho/page.tsx\`

**Propósito:** Página do carrinho de compras com resumo e checkout.

**Funcionalidades:**
- Lista de produtos adicionados
- Controle de quantidade (+/-)
- Remoção de itens
- Cálculo automático (subtotal, frete, total)
- Indicador "Falta R$ X para frete grátis"
- Estado vazio com CTA
- Background com imagem e filtro vintage

---

### **6. 📖 Outras Páginas**

#### **Sobre (\`/sobre\`)**
- Vídeo lateral com texto sobre a marca
- Design editorial e elegante

#### **Lookbook (\`/lookbook\`)**
- Galeria de imagens das coleções
- Layout fullwidth com informações

#### **Login (\`/login\`)**
- Página de autenticação (não traduzida ainda)

---

## 🧩 Componentes Principais

### **Layout**
- **\`Header.tsx\`**: Cabeçalho fixo com menu, logo árabe, busca, carrinho e perfil
- **\`Footer.tsx\`**: Rodapé com links, newsletter e redes sociais

### **Produto**
- **\`ProductCard.tsx\`**: Card reutilizável com hover, badge "Novo", imagens e preço
  - **Por que está em \`/components/product/\`?**
    - É usado em **múltiplas páginas** (/produtos, /produto/[slug] para produtos relacionados)
    - Componente **reutilizável** e não específico de uma página
    - Padrão correto de organização por domínio!

### **UI**
- **\`Button.tsx\`**: Botão com 3 variantes (primary/secondary/ghost)
- **\`Container.tsx\`**: Container responsivo centralizado
- **\`Toast.tsx\`**: Notificações (não usado ainda)

### **Contextos**
- **\`CartContext.tsx\`**: Estado global do carrinho
  - \`adicionarAoCarrinho()\` / \`addToCart()\` (ambos funcionam!)
  - \`removerDoCarrinho()\` / \`removeFromCart()\`
  - \`obterTotalCarrinho()\` / \`getCartTotal()\`
  - Suporta nomes em **PT-BR e inglês** para compatibilidade

---

## 📊 Dados Mockados

### **\`data/products.ts\`**
- **8 produtos** completos com imagens, preços, tamanhos, cores
- **3 coleções**: Desert Dreams, Urban Nomad, Sahara Soul
- Tipos TypeScript: \`Product\`, \`CartItem\`, \`Collection\`

---

## 🎨 Design System

### **Paleta de Cores**
- Preto (#0A0A0A), Branco (#FAFAFA)
- Dourado (#C9A96E), Bronze (#B87333)
- Bege (#E8DCC4)
- Dark theme predominante

### **Tipografia**
- **Poppins**: Sans-serif principal
- **Amiri**: Fonte árabe para logo (ناصر)
- **NSR Custom**: Fonte customizada da marca

### **Animações**
- Framer Motion para transições suaves
- Hover elegante em cards
- Fade-in ao entrar na viewport
- Transições de 300-700ms

---

## 🛠️ Tecnologias

- **Next.js 14.2.3** (App Router)
- **React 18.3.1**
- **TypeScript 5.4.5**
- **TailwindCSS 3.4.4**
- **Framer Motion 11.2.0**
- **Lucide React** (ícones)
- **Docker** + Docker Compose

---

## �� Convenções de Nomenclatura

### **Por que todos os arquivos se chamam \`page.tsx\`?**

É o **padrão do Next.js 14 App Router**! O nome do arquivo define o comportamento:
- \`page.tsx\` = Página pública
- \`layout.tsx\` = Layout wrapper
- \`loading.tsx\` = Estado de loading
- \`error.tsx\` = Página de erro
- \`route.ts\` = API route

**A rota é definida pela PASTA, não pelo nome do arquivo:**
\`\`\`
/app/loja/page.tsx        → rota: /loja
/app/produtos/page.tsx    → rota: /produtos
/app/produto/[slug]/page.tsx → rota: /produto/:slug
\`\`\`

Isso é **correto e intencional**!

---

## 🌐 Estado de Tradução

### ✅ Traduzido para PT-BR:
- \`/loja/page.tsx\` (variáveis, comentários, interface)
- \`/produtos/page.tsx\` (variáveis, comentários, interface)
- \`/page.tsx\` (página inicial)
- \`CartContext.tsx\` (funções em PT-BR + inglês)

### ⏳ Ainda em inglês:
- \`/produto/[slug]/page.tsx\`
- \`/carrinho/page.tsx\`
- Componentes (Header, Footer, ProductCard)
- \`data/products.ts\` (tipos e comentários)

**Nota:** Alguns arquivos mantêm nomes em inglês propositalmente (como tipos e dados) para compatibilidade.

---

## 🚀 Como Rodar o Projeto

### **Desenvolvimento:**
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`
Acesse: \`http://localhost:3000\`

### **Com Docker:**
\`\`\`bash
docker-compose up --build
\`\`\`

---

## 🔮 Próximos Passos

### **Backend (Não implementado)**
- API REST com Node.js/Express
- Autenticação JWT
- CRUD de produtos
- Integração com pagamento

### **Melhorias Frontend**
- Finalizar tradução completa
- Integração com backend real
- Sistema de autenticação
- Painel de conta do usuário
- Wishlist/Favoritos
- Busca com filtros avançados
- Sistema de reviews

---

## 💡 Perguntas Frequentes

### **1. Por que \`product/\` está em \`components/\` e não em \`app/\`?**
Porque \`ProductCard\` é um **componente reutilizável** usado em várias páginas diferentes. A pasta \`app/\` é apenas para rotas/páginas.

### **2. Qual a diferença entre \`/loja\` e \`/produtos\`?**
- \`/loja\`: Vitrine visual, adiciona ao carrinho direto
- \`/produtos\`: Catálogo completo com filtros, navega para detalhes

### **3. Por que todos os arquivos se chamam \`page.tsx\`?**
É o padrão do Next.js 14 App Router. A rota é definida pela pasta, não pelo nome do arquivo.

### **4. Devo remover uma das páginas de produtos?**
Não necessariamente! Ambas têm propósitos diferentes e podem coexistir:
- Use \`/loja\` no menu principal
- Use \`/produtos\` como "Ver Catálogo Completo"

---

## 🔐 PAINEL ADMINISTRATIVO (NOVO!)

### **Visão Geral**

Sistema completo de administração mockado, mantendo a estética minimalista árabe do site.

### **🔑 Autenticação**

**Sistema de Login Dual** - A página `/login` foi atualizada com:
- Toggle para escolher entre **Usuário** ou **Admin**
- Botões de exemplo que preenchem credenciais automaticamente
- Validação mockada com redirecionamento automático

**Credenciais Mockadas:**
```
Usuário Comum:
- Email: usuario@nsr.com
- Senha: 123456
- Redireciona para: /perfil

Administrador:
- Email: admin@nsr.com  
- Senha: admin123
- Redireciona para: /admin
```

**Implementação:**
- `AdminContext.tsx`: Gerencia autenticação, estado do usuário e proteção de rotas
- `AdminProvider`: Envolvido em toda a aplicação via `Providers.tsx`
- Dados salvos em `localStorage` para persistência

---

### **📊 Páginas do Admin**

#### **1. Dashboard (`/admin`)**
**Funcionalidades:**
- 4 cards de métricas principais (vendas, pedidos, produtos, clientes)
- Gráfico de vendas dos últimos 7 dias (barras horizontais animadas)
- Alertas de estoque baixo com detalhes
- Tabela dos últimos 5 pedidos
- Trends com percentual de crescimento

**Dados Exibidos:**
- Vendas do mês: R$ 127.450,80
- Total de pedidos: 342
- Produtos ativos: 8
- Total de clientes: 156

---

#### **2. Gestão de Produtos (`/admin/produtos`)**
**Funcionalidades:**
- Busca em tempo real (nome/descrição)
- Filtros por categoria (Todos/Masculino/Feminino)
- Tabela com imagem miniatura, categoria, coleção, preço
- Badges de status (Novo, Destaque)
- Ações: Visualizar, Editar, Excluir (mockado)
- Botão "Novo Produto" (mockado)
- Contador de produtos filtrados

**Colunas da Tabela:**
- Produto (com imagem e descrição)
- Categoria
- Coleção
- Preço
- Status (badges)
- Ações

---

#### **3. Gestão de Pedidos (`/admin/pedidos`)**
**Funcionalidades:**
- Busca por ID, cliente ou email
- Filtro por status (dropdown select)
- Tabela completa de pedidos mockados
- Status coloridos: Pendente, Processando, Enviado, Entregue, Cancelado
- Botão de visualizar detalhes (mockado)
- Contador de pedidos filtrados

**Dados dos Pedidos:**
- 5 pedidos mockados com dados completos
- Items, endereço de entrega, método de pagamento
- Valores de R$ 189,90 a R$ 699,80

**Status Colors:**
- Pendente: Amarelo
- Processando: Azul
- Enviado: Roxo
- Entregue: Verde
- Cancelado: Vermelho

---

#### **4. Controle de Estoque (`/admin/estoque`)**
**Funcionalidades:**
- Alerta destacado quando há produtos com estoque baixo
- Busca por nome de produto
- Toggle "Apenas Estoque Baixo"
- Tabela detalhada por produto/tamanho
- Barra de progresso visual do estoque
- Ações de adicionar/remover quantidade (mockado)
- Status com cores (OK em verde, Baixo em amarelo)

**Informações Exibidas:**
- Produto, Tamanho, Categoria
- Estoque atual vs Estoque mínimo
- Barra de progresso percentual
- Contador de itens com estoque baixo

**Exemplo de Dados:**
- Oversized Tee GG: 3 unidades (mínimo 10) ⚠️
- Crop Top M: 2 unidades (mínimo 12) ⚠️

---

#### **5. Gestão de Usuários/Clientes (`/admin/usuarios`)**
**Funcionalidades:**
- 3 cards de estatísticas (Ativos, Inativos, Receita Total)
- Busca por nome, email ou telefone
- Filtros: Todos, Ativos, Inativos
- Avatar circular com inicial do nome
- Informações de contato (email e telefone com ícones)
- Histórico de compras por cliente
- Status visual (Ativo/Inativo)

**Estatísticas:**
- Clientes ativos: 4
- Clientes inativos: 1
- Receita total: R$ 9.988,90

**Dados por Cliente:**
- Nome, Email, Telefone
- Data de cadastro
- Total de pedidos
- Total gasto
- Status

---

#### **6. Configurações (`/admin/configuracoes`)**
**Funcionalidades:**
- Informações da Loja (nome, email, descrição)
- Configurações de Frete (valor, frete grátis)
- Métodos de Pagamento (checkboxes)
- Notificações (checkboxes)
- Botão "Salvar Configurações" (mockado)

**Seções:**
1. **Informações da Loja**
   - Nome: NSR - ناصر
   - Email: contato@nsr.com
   - Descrição editável

2. **Frete**
   - Valor padrão: R$ 15,00
   - Frete grátis acima de: R$ 200,00
   - Toggle para habilitar/desabilitar

3. **Pagamento**
   - Cartão de Crédito ✓
   - PIX ✓
   - Boleto Bancário ✓

4. **Notificações**
   - Novos pedidos ✓
   - Estoque baixo ✓
   - Novos cadastros ☐

---

### **🎨 Componentes do Admin**

#### **Sidebar.tsx**
- Navegação lateral fixa
- Logo NSR em árabe (ناصر) com badge "ADMIN"
- Menu com ícones: Dashboard, Produtos, Pedidos, Estoque, Usuários, Configurações
- Indicador visual de página ativa (borda dourada)
- Botão de Logout (vermelho)
- **Botão de colapsar/expandir sidebar** (80px ↔ 260px)
- Animações suaves com Framer Motion

#### **AdminHeader.tsx**
- Barra superior com backdrop blur
- Campo de busca global
- Ícone de notificações com badge vermelho
- Avatar do admin com inicial e nome
- Sticky top para fixar no scroll

#### **StatCard.tsx**
- Card reutilizável para métricas
- Suporta 4 cores: gold, bronze, green, blue
- Ícone customizável
- Exibe trend opcional (% de crescimento)
- Animação de entrada

---

### **📦 Dados Mockados Admin**

**Arquivo:** `src/data/adminData.ts`

**Interfaces TypeScript:**
```typescript
- Order: Pedido completo com itens, cliente, endereço
- Customer: Cliente com histórico de compras
- StockItem: Item de estoque por produto/tamanho
- dashboardStats: Estatísticas do dashboard
- dailySales: Vendas diárias dos últimos 7 dias
```

**Dados Inclusos:**
- 5 pedidos mockados
- 5 clientes mockados
- 12 itens de estoque mockados
- Estatísticas completas
- Vendas diárias

---

### **🔒 Proteção de Rotas**

**AdminLayout** (`/admin/layout.tsx`):
- Verifica se usuário está autenticado
- Verifica se usuário é admin
- Redireciona para `/login` se não autenticado
- Redireciona para `/` se autenticado mas não admin
- Exibe tela de loading durante verificação

**Fluxo de Proteção:**
```
1. Usuário acessa /admin
2. AdminLayout verifica autenticação
3. Se não autenticado → redireciona /login
4. Se autenticado mas não admin → redireciona /
5. Se autenticado e admin → exibe conteúdo
```

---

### **🎯 Características do Painel Admin**

✅ **Design Consistente**
- Mantém paleta de cores NSR (dourado, bronze, preto)
- Mesma tipografia do site
- Estética minimalista árabe
- Dark theme nativo

✅ **Funcionalidades Completas**
- Dashboard com métricas em tempo real
- CRUD visual de produtos
- Gestão de pedidos com filtros
- Controle de estoque com alertas
- Gestão de clientes
- Configurações da loja

✅ **UX/UI de Qualidade**
- Animações suaves com Framer Motion
- Feedback visual em todas as ações
- Tabelas responsivas
- Filtros e buscas em tempo real
- Empty states bem definidos
- Loading states

✅ **100% Mockado**
- Todas as ações são visuais
- Dados persistem apenas em memória/localStorage
- Preparado para integração futura com backend
- Credenciais de teste visíveis

✅ **Componentes Reutilizáveis**
- Sidebar colapsável
- StatCard configurável
- Tabelas padronizadas
- Formulários estilizados

---

### **🚀 Como Acessar o Painel Admin**

1. Acesse: `http://localhost:3000/login`
2. Digite as credenciais de administrador:
   - Email: `admin@nsr.com`
   - Senha: `admin123`
3. Clique em "Entrar"
4. Será redirecionado automaticamente para `/admin` (Dashboard)

**Para Usuário Comum:**
- Email: `usuario@nsr.com`
- Senha: `123456`
- Redireciona para: `/perfil`

> **Nota:** O sistema detecta automaticamente se é admin ou usuário pelo email/senha. Não há necessidade de seleção manual.

---

## 📝 ALTERAÇÕES RECENTES

### **✨ O que foi Adicionado:**

**Contextos:**
- ✅ `AdminContext.tsx` - Autenticação e gerenciamento de usuários

**Páginas:**
- ✅ `/login` atualizada - Detecção automática admin/usuário por credenciais
- ✅ `/admin` - Dashboard com métricas e gráficos
- ✅ `/admin/produtos` - Gestão de produtos
- ✅ `/admin/pedidos` - Gestão de pedidos
- ✅ `/admin/estoque` - Controle de estoque
- ✅ `/admin/usuarios` - Gestão de clientes
- ✅ `/admin/configuracoes` - Configurações da loja

**Componentes:**
- ✅ `Sidebar.tsx` - Navegação lateral admin
- ✅ `AdminHeader.tsx` - Header do painel
- ✅ `StatCard.tsx` - Card de estatísticas

**Dados:**
- ✅ `adminData.ts` - Pedidos, clientes, estoque mockados

**Layouts:**
- ✅ `/admin/layout.tsx` - Layout com proteção de rota

**Providers:**
- ✅ `Providers.tsx` atualizado - Inclui AdminProvider

---

## ✨ Resumo Executivo

**NSR** é um e-commerce moderno de streetwear com:
- ✅ Código TypeScript 100% tipado
- ✅ Design minimalista árabe contemporâneo
- ✅ Duas experiências de compra (/loja e /produtos)
- ✅ **🆕 Painel administrativo completo e funcional**
- ✅ **🆕 Sistema de autenticação dual (usuário/admin)**
- ✅ Arquitetura escalável e organizada
- ✅ Componentes reutilizáveis
- ✅ Tradução parcial para PT-BR (em andamento)
- ✅ Pronto para integração com backend

**Páginas Totais:** 17 (11 públicas + 6 admin)
**Componentes:** 15+ reutilizáveis
**Contextos:** 3 (Cart, Favorites, Admin)

---

**🎉 Projeto criado com atenção aos detalhes e pronto para crescer!**
**🔐 Painel admin implementado com sucesso em 17/10/2025**

