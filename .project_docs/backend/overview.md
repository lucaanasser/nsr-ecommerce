# Overview do Backend NSR

Este documento resume toda a estrutura e lógica do backend do projeto NSR, facilitando referência rápida para futuras integrações, rastreamento de mudanças e evitando acúmulo de código desnecessário.

## Estrutura Geral
- **Framework:** Express.js (TypeScript)
- **ORM:** Prisma
- **Documentação:** Swagger
- **Logs:** Morgan + custom logger
- **Validação:** Middlewares e validators
- **Autenticação:** JWT, middlewares de autenticação/autorização

## Principais Arquivos
- **app.ts:** Inicialização do Express, middlewares globais, integração Swagger, logging, rotas, error handler.
- **server.ts:** Inicializa o servidor Express.

## Pastas
- **config/**: Configurações de ambiente, banco, logger, Swagger.
- **controllers/**: Lógica dos endpoints (ex: AuthController).
- **middlewares/**: Autenticação, autorização, validação, tratamento de erros.
- **repositories/**: Abstração de acesso ao banco (ex: UserRepository, ProductRepository).
- **routes/**: Definição das rotas (ex: AuthRoutes).
- **services/**: Regras de negócio (ex: AuthService, ProductService).
- **types/**: Tipos TypeScript para dados e respostas.
- **utils/**: Funções utilitárias (ex: JWT, password hash, erros).
- **validators/**: Schemas de validação (ex: AuthValidator).

## Observações
- Estrutura modular, fácil manutenção e expansão.
- Pronto para integração com frontend e futuras features.
- Documentação automática via Swagger disponível em `/api/docs`.

---
Este overview será atualizado conforme mudanças no backend. Consulte os arquivos específicos para detalhes de cada módulo.
