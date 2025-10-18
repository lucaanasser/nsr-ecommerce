# Backend NSR E-commerce

Backend REST API para o e-commerce NSR, construído com Node.js, Express, TypeScript e PostgreSQL.

## 🚀 Stack Tecnológico

- **Runtime:** Node.js 20 LTS
- **Framework:** Express.js
- **Linguagem:** TypeScript (strict mode)
- **ORM:** Prisma
- **Database:** PostgreSQL 16
- **Autenticação:** JWT + bcrypt
- **Upload:** Cloudinary
- **Email:** Nodemailer
- **Validação:** Zod
- **Docs:** Swagger/OpenAPI
- **Logs:** Winston + Morgan

## 🔧 Setup Rápido

```bash
# 1. Instalar dependências
cd backend
npm install

# 2. Configurar .env
cp .env.example .env
# Edite .env com suas credenciais

# 3. Subir PostgreSQL
npm run docker:dev

# 4. Configurar Prisma
npm run prisma:generate
npm run prisma:migrate

# 5. Iniciar servidor
npm run dev
```

Acesse: http://localhost:4000/health

## 📜 Scripts

- `npm run dev` - Desenvolvimento com hot-reload
- `npm run build` - Compilar TypeScript
- `npm start` - Executar produção
- `npm run prisma:studio` - GUI do banco
- `npm test` - Executar testes

Ver documentação completa em `.project_docs/backend/`

---

**Status:** ✅ Fase 0 completa - Arquitetura pronta!
