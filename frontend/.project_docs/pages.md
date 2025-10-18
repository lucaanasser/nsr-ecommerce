# Resumo das Páginas do Frontend

## app/
- **layout.tsx**: Layout raiz, aplica Providers e estilos globais.
- **page.tsx**: Landing page com vídeo, menu simples, destaque para logo árabe.
- **globals.css**: Tailwind, fontes customizadas, estilos globais.

### Cadastro/Login
- **cadastro/page.tsx**: Formulário de cadastro, imagem de fundo, animação.
- **login/page.tsx**: Formulário de login, integração com contexto Admin.

### Loja/Produtos
- **loja/page.tsx**: Grid de produtos, filtros, adição ao carrinho.
- **produtos/page.tsx**: Catálogo completo, filtros avançados, ordenação.
- **produto/[slug]/page.tsx**: Detalhes do produto, galeria, seleção de tamanho/cor.

### Carrinho/Checkout
- **carrinho/page.tsx**: Lista de produtos, controles de quantidade, cálculo de frete.
- **checkout/page.tsx**: Etapas de entrega/pagamento, resumo do pedido.

### Perfil
- **perfil/page.tsx**: Abas para pedidos, dados pessoais, endereços, favoritos.

### Lookbook/Sobre
- **lookbook/page.tsx**: Storytelling visual, parallax, produtos em destaque.
- **sobre/page.tsx**: Vídeo institucional, informações da marca.

### Admin
- **admin/layout.tsx**: Protege rotas, estrutura com sidebar/header.
- **admin/page.tsx**: Dashboard, métricas, pedidos recentes, estoque baixo.
- **admin/[subpasta]/page.tsx**: Submódulos para calendário, configurações, documentos, estoque, financeiro, pedidos, planilhas, produtos, tarefas, usuários.

---
Consulte este arquivo para referência rápida das páginas existentes e suas funções.
