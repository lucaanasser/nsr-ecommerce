# Como rodar o projeto (Dev e Prod)

## Pré-requisitos
- Docker e Docker Compose
- Node 20+ e npm 10+ (para rodar localmente backend/frontend sem Docker)
- Arquivos de ambiente:
  - Produção: `backend/.env`, `frontend/.env`
  - Desenvolvimento: `backend/.env.dev`, `frontend/.env.dev`

## Banco de dados
- Postgres roda como serviço Docker `database`.
- Dados ficam em volumes:
  - Dev: `postgres_data_dev`
  - Prod: `postgres_data_prod`

## Executar em desenvolvimento (stack completa)
1. Instale deps: `cd backend && npm install` e `cd ../frontend && npm install`.
2. Suba infra e apps: `docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d`.
3. Aplique migrações no banco dev: `cd backend && npx prisma migrate dev`.
4. Se quiser rodar backend em watch localmente: `npm run dev` (usa API em http://localhost:4000).
5. Rodar frontend: `cd ../frontend && npm run dev` (abre em http://localhost:3000).

## Executar em produção (stack local de prod)
1. Garanta que `backend/.env` e `frontend/.env` estão preenchidos (senhas fortes e URLs reais).
2. Suba a stack: `docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d`.
3. Aplique migrações no banco prod: `cd backend && npx prisma migrate deploy` (usa DATABASE_URL do `.env`).

## Rodar apenas serviços específicos
- Só banco (dev): `docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d database`.
- Derrubar tudo: `docker compose down` (não remove volumes/dados).

## Notas rápidas
- Prisma 7+: datasource URL está em `prisma.config.ts` (não mais no schema).
- `DATABASE_URL` escolhe qual banco usar; o host `database` resolve para o container do Postgres dentro da rede do Compose.
- Não versione arquivos `.env`.
