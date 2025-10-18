# Overview do Frontend NSR

Este documento resume toda a estrutura e lógica do frontend do projeto NSR, facilitando referência rápida para futuras integrações e evitando acúmulo de código desnecessário.

## Estrutura Geral
- **Framework:** Next.js + React
- **Estilo:** Tailwind CSS, fontes customizadas
- **Contextos:** Cart, Favorites, Admin
- **Componentização:** UI, layout, admin, produto, ícones
- **Dados:** Mockados em arquivos de data
- **Configurações:** Imagens e vídeos otimizados via Cloudinary

## Páginas Principais
- **Landing Page:** Vídeo fullscreen, menu simples, logo árabe
- **Cadastro/Login:** Formulários minimalistas, integração com contexto de autenticação
- **Loja/Produtos:** Grid de produtos, filtros, ordenação, adição ao carrinho
- **Carrinho/Checkout:** Controle de quantidade, cálculo de frete, etapas de entrega/pagamento
- **Perfil:** Abas para pedidos, dados, endereços, favoritos
- **Lookbook:** Parallax, storytelling visual, produtos em destaque
- **Sobre:** Vídeo institucional, informações da marca
- **Admin:** Dashboard, métricas, controle de estoque, pedidos, usuários, financeiro

## Componentes
- **UI:** Button, Card, Container, Input, Toast
- **Layout:** Header, Footer
- **Admin:** Sidebar, StatCard, AdminHeader
- **Produto:** ProductCard
- **Ícones:** SVG customizados

## Contextos
- **CartContext:** Gerencia itens do carrinho, quantidade, total, métodos para adicionar/remover/atualizar
- **FavoritesContext:** Gerencia favoritos, persistência via localStorage
- **AdminContext:** Autenticação, controle de acesso, mock de usuários/admin

## Dados Mockados
- **products.ts:** Produtos, coleções, tamanhos, cores, imagens
- **adminData.ts:** Pedidos, clientes, métricas
- **collaborationData.ts:** Colaboradores, documentos
- **financeData.ts:** Custos, despesas, metas financeiras

## Configurações
- **images.ts:** URLs otimizadas Cloudinary
- **videos.ts:** URLs de vídeos e thumbnails

## Observações
- Todas as páginas e componentes seguem padrão de animação com Framer Motion.
- Estrutura modular facilita manutenção e expansão.
- Dados mockados prontos para integração futura com backend.

---
Este overview será atualizado conforme mudanças no frontend. Consulte os arquivos específicos para detalhes de cada página ou componente.
