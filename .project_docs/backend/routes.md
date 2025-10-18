# Resumo das Rotas do Backend

## routes/
- **index.ts**: Router principal, integra todas as rotas e health check.
- **auth.routes.ts**: Rotas públicas e privadas de autenticação.
- **product.routes.ts**: Rotas públicas de produtos (GET com filtros e paginação).
- **category.routes.ts**: Rotas públicas de categorias (GET).
- **collection.routes.ts**: Rotas públicas de coleções (GET).

## routes/admin/
- **product.routes.ts**: Rotas admin protegidas para CRUD de produtos, categorias, coleções e upload de imagens.

---
Consulte este arquivo para referência rápida das rotas existentes.
