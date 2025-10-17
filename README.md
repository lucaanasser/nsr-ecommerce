# ناصر NSR - E-commerce Streetwear Árabe Contemporâneo

![NSR Logo](https://img.shields.io/badge/NSR-%D9%86%D8%B5%D8%B1-C9A96E?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)

## 📖 Sobre o Projeto

**NSR** (ناصر) é uma marca de streetwear moderna inspirada na estética árabe. Este repositório contém o código-fonte completo da **plataforma e-commerce NSR**, incluindo frontend desenvolvido em Next.js e backend em desenvolvimento ativo.

### ✨ Conceito Visual

- 🎨 **Estilo**: Minimalista e moderno
- 🖼️ **Foco**: Total no produto com espaços negativos estratégicos
- 🎨 **Paleta**: Preto, branco, bege e tons metálicos (dourado fosco, bronze)
- 🔤 **Tipografia**: Neutra e sofisticada (Poppins) com fonte árabe estilizada (Amiri)

## 🏗️ Arquitetura do Projeto

```
NSR/
├── frontend/          # Next.js 14 + React + TypeScript + TailwindCSS
│   ├── src/
│   │   ├── app/              # Pages (App Router)
│   │   │   ├── page.tsx      # Home
│   │   │   ├── produtos/     # Catálogo
│   │   │   ├── produto/      # Produto Individual
│   │   │   └── carrinho/     # Carrinho
│   │   ├── components/       # Componentes reutilizáveis
│   │   │   ├── layout/       # Header, Footer
│   │   │   ├── product/      # ProductCard
│   │   │   └── ui/           # Button, Container
│   │   └── data/             # Dados mockados
│   └── Dockerfile
├── backend/           # Backend (placeholder para implementação futura)
├── database/          # PostgreSQL (placeholder)
└── docker-compose.yml # Orquestração de containers
```

### 🎯 Arquitetura Escolhida: **Feature-Based Architecture**

Estrutura modular e escalável que organiza o código por funcionalidade, facilitando manutenção e expansão.

## 🚀 Tecnologias Utilizadas

### Frontend (✅ Implementado)
- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **TailwindCSS** - Estilização utility-first
- **Framer Motion** - Animações fluidas e elegantes
- **Lucide React** - Ícones modernos

### Backend (🚧 Em Desenvolvimento Ativo)
- **Node.js** - Runtime JavaScript
- **Express/NestJS** - Framework backend
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação e autorização
- **Stripe/PayPal** - Gateway de pagamento

### DevOps
- **Docker** - Containerização
- **Docker Compose** - Orquestração de serviços

## 📦 Instalação e Execução

### Pré-requisitos
- Node.js 20+
- Docker e Docker Compose (opcional)
- npm ou yarn

### Opção 1: Executar Localmente

```bash
# Clone o repositório
cd /home/luca/NSR/frontend

# Instale as dependências
npm install

# Execute em modo de desenvolvimento
npm run dev

# Acesse no navegador
http://localhost:3000
```

### Opção 2: Executar com Docker

```bash
# Na raiz do projeto
cd /home/luca/NSR

# Suba os containers
docker-compose up --build

# Acesse no navegador
http://localhost:3000
```

## 📄 Páginas Implementadas

### 1. 🏠 Home (`/`)
- Banner hero com logo árabe NSR (ناصر)
- Seção de novidades
- Produtos em destaque
- Coleções disponíveis
- CTA para explorar catálogo

### 2. 🛍️ Catálogo (`/produtos`)
- Grid de produtos com espaçamento generoso
- Filtros por categoria (Masculino/Feminino/Todos)
- Ordenação (Novidades, Preço)
- Layout responsivo

### 3. 👕 Produto Individual (`/produto/[slug]`)
- Galeria de imagens com thumbnails
- Seleção de tamanho e cor
- Controle de quantidade
- Botão "Adicionar ao Carrinho"
- Produtos relacionados
- Badges de benefícios (frete grátis, troca, segurança)

### 4. 🛒 Carrinho (`/carrinho`)
- Lista de produtos adicionados
- Controle de quantidade por item
- Remoção de itens
- Resumo do pedido com cálculo de frete
- Estado vazio com CTA

## 🎨 Componentes Reutilizáveis

### Layout
- **Header** - Navegação fixa com logo, menu e ícones
- **Footer** - Links, newsletter, redes sociais

### Product
- **ProductCard** - Card de produto com imagem, info e hover

### UI
- **Button** - Botões com variantes (primary, secondary, ghost)
- **Container** - Container responsivo padronizado

## 🗂️ Dados e Conteúdo

Atualmente o frontend utiliza dados mockados para demonstração. Com a implementação do backend, todos os dados serão dinâmicos e gerenciados através da API.

**Produtos em Desenvolvimento:**
- Integração com banco de dados PostgreSQL
- Sistema completo de gerenciamento de produtos
- Upload de imagens e gestão de mídia
- Controle de estoque em tempo real

## 🎭 Características Visuais

### Animações
- ✅ Fade-in ao carregar seções
- ✅ Hover suave em produtos e botões
- ✅ Transições elegantes entre páginas
- ✅ Scroll indicator no hero
- ✅ Parallax no banner

### Design System
- 🎨 Paleta de cores customizada
- 📝 Tipografia hierarquizada
- 🌑 Dark theme elegante por padrão
- 📐 Grid system com muito "breathing room"
- ✨ Sombras suaves e bordas minimalistas

## 🔮 Roadmap de Desenvolvimento

### ⏳ Em Implementação (Próximos Dias)
- [ ] Backend API completo (Node.js + Express/NestJS)
- [ ] Banco de dados PostgreSQL configurado
- [ ] Sistema de autenticação (JWT)
- [ ] CRUD de produtos via API
- [ ] Painel administrativo funcional

### 📅 Planejado
- [ ] Integração com gateway de pagamento (Stripe)
- [ ] Sistema de pedidos e checkout completo
- [ ] Gestão de estoque automatizada
- [ ] E-mails transacionais
- [ ] Dashboard de analytics
- [ ] Sistema de notificações
- [ ] Testes automatizados (Jest, Cypress)

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Iniciar servidor de produção
npm start

# Linting
npm run lint
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Se você deseja contribuir com o projeto:

1. Fork este repositório
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### 📋 Diretrizes
- Siga os padrões de código existentes
- Adicione testes quando aplicável
- Documente novas funcionalidades
- Mantenha commits atômicos e descritivos

## � Segurança

Este projeto segue as melhores práticas de segurança. Se você encontrar alguma vulnerabilidade, por favor reporte através do e-mail ou abra uma issue privada. Consulte o [SECURITY.md](./SECURITY.md) para mais informações.

## 📄 Licença

**Código-fonte**: Este projeto está licenciado sob a **MIT License** - você é livre para usar, modificar e distribuir o código.

**Identidade Visual & Marca**: A identidade visual, logo NSR (ناصر), tipografia personalizada, paleta de cores e todos os elementos de branding são **propriedade exclusiva** e não podem ser reutilizados sem autorização expressa.

### ⚖️ Em Resumo:
- ✅ Você PODE: Usar o código, estudar, modificar, criar projetos derivados
- ❌ Você NÃO PODE: Usar a marca NSR, logo, fontes customizadas ou identidade visual em outros projetos

Veja o arquivo [LICENSE](./LICENSE) para detalhes completos.

## 👨‍💻 Autor

**Luca Nasser**
- GitHub: [@lucaanasser](https://github.com/lucaanasser)
- E-commerce: [NSR - ناصر](#)

---

<div align="center">
  <h3>ناصر NSR</h3>
  <p><i>Onde tradição encontra modernidade</i></p>
  
  ⭐ Se este projeto foi útil para você, considere dar uma estrela!
</div>
