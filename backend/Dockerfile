# ================================
# STAGE 1: Build
# ================================
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar dependências necessárias para compilar bcrypt
RUN apk add --no-cache python3 make g++

# Defina um DATABASE_URL de build (não precisa existir o banco) para o Prisma gerar o client
ARG DATABASE_URL="postgresql://nsr_dev:dev_password@localhost:5432/nsr_development"
ENV DATABASE_URL=${DATABASE_URL}


RUN npm config set fetch-retry-maxtimeout 120000 && \
    npm config set fetch-retry-mintimeout 10000 && \
    npm config set fetch-retries 5

# Copiar package files
COPY package*.json ./

# Instalar dependências (incluindo devDependencies para build)
RUN npm ci --maxsockets=1 --prefer-offline

# Copiar Prisma schema após npm ci (precisa do pacote prisma instalado)
COPY prisma ./prisma/

# Copiar código fonte
COPY . .

# Gerar Prisma Client
RUN npx prisma generate

# Compilar TypeScript
RUN npm run build

# ================================
# STAGE 2: Production
# ================================
FROM node:20-alpine AS production

WORKDIR /app

# Instalar dependências necessárias para rodar bcrypt em produção
RUN apk add --no-cache python3 make g++

# Mesmo DATABASE_URL de build para npx prisma generate
ARG DATABASE_URL="postgresql://nsr_dev:dev_password@localhost:5432/nsr_development"
ENV DATABASE_URL=${DATABASE_URL}

# Configurar npm para ser mais robusto
RUN npm config set fetch-retry-maxtimeout 120000 && \
    npm config set fetch-retry-mintimeout 10000 && \
    npm config set fetch-retries 5

# Instalar tsx globalmente para permitir Prisma carregar arquivos TypeScript
RUN npm install -g tsx

# Instalar apenas dependências de produção
COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci --omit=dev --maxsockets=1 --prefer-offline && \
    npm cache clean --force

# Copiar Prisma Client gerado do builder (evita ter que rodar generate aqui)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

# Copiar código compilado do stage anterior
COPY --from=builder /app/dist ./dist

# Copiar templates de email
COPY --from=builder /app/src/templates ./dist/templates

# Copiar script de entrypoint
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Mudar ownership dos arquivos
RUN chown -R nodejs:nodejs /app

# Usar usuário não-root
USER nodejs

# Expor porta
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Comando de inicialização
ENTRYPOINT ["./docker-entrypoint.sh"]
