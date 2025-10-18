# 🔐 Fase 3 - Authentication API - Plano de Segurança

> **Data:** 17/10/2025  
> **Ambiente:** Produção  
> **Criticidade:** ALTA - Sistema de autenticação

---

## 🎯 Objetivo

Implementar sistema de autenticação **robusto e seguro** seguindo as melhores práticas da indústria (OWASP Top 10, NIST, OAuth 2.0 guidelines).

---

## 🛡️ Camadas de Segurança Implementadas

### 1. **Proteção de Senhas** ✅

#### Armazenamento
- ✅ **bcrypt** com salt rounds = 12 (OWASP recomenda 10+)
- ✅ **Nunca** armazenar senha em plain text
- ✅ **Nunca** retornar senha em responses (exceto login interno)
- ✅ Salt automático gerado por bcrypt

#### Validação de Força
- ✅ Mínimo 8 caracteres
- ✅ Pelo menos 1 letra maiúscula
- ✅ Pelo menos 1 letra minúscula
- ✅ Pelo menos 1 número
- ✅ Caracteres especiais recomendados (opcional)
- ✅ Rejeitar senhas comuns (top 10k passwords)
- ✅ Rejeitar senhas que contêm email/nome do usuário

#### Proteção Contra Ataques
- ✅ Timing-safe comparison (bcrypt.compare é timing-safe)
- ✅ Proteção contra rainbow tables (salt único por senha)
- ✅ Proteção contra brute force (rate limiting - FASE 5)

---

### 2. **JWT (JSON Web Tokens)** ✅

#### Access Token
- ✅ **Validade:** 15 minutos (curta duração)
- ✅ **Algoritmo:** HS256 (HMAC-SHA256)
- ✅ **Payload mínimo:** userId, email, role
- ✅ **Secret:** 256 bits mínimo (gerado com crypto.randomBytes)
- ✅ **Não armazenar dados sensíveis** no payload

#### Refresh Token
- ✅ **Validade:** 7 dias
- ✅ **Armazenado no banco** (refresh_tokens table)
- ✅ **Rotation:** Novo refresh token a cada refresh
- ✅ **Revogação:** Invalidação ao logout
- ✅ **One-time use:** Token usado é deletado
- ✅ **Família de tokens:** Detectar reutilização

#### Proteção
- ✅ Validação de assinatura
- ✅ Validação de expiração (exp claim)
- ✅ Validação de issuer (iss claim)
- ✅ Validação de audience (aud claim)
- ✅ Proteção contra token reuse
- ✅ Limpar tokens expirados periodicamente

---

### 3. **Validação de Input** ✅

#### Sanitização
- ✅ **Zod** para validação de schema
- ✅ Trim de strings
- ✅ Lowercase em emails
- ✅ Remover caracteres não-imprimíveis
- ✅ Validação de tipos rigorosa

#### Regras de Negócio
- ✅ Email único (validação no banco)
- ✅ CPF único e válido (algoritmo de validação)
- ✅ Formato de email RFC 5322
- ✅ Tamanhos máximos de campos
- ✅ Rejeitar SQL injection patterns (Prisma já protege)
- ✅ Rejeitar XSS patterns

---

### 4. **Proteção de Rotas** ✅

#### Middleware authenticate
- ✅ Extração segura do token (Bearer scheme)
- ✅ Validação de formato
- ✅ Verificação de assinatura
- ✅ Verificação de expiração
- ✅ Injeção de `req.user` tipado
- ✅ Error handling adequado

#### Middleware authorize
- ✅ Verificação de roles
- ✅ Suporte a múltiplos roles
- ✅ Mensagens de erro genéricas (não revelar estrutura)
- ✅ Logging de tentativas não autorizadas

---

### 5. **Proteção Contra Ataques Comuns** ✅

#### SQL Injection
- ✅ **Prisma ORM** usa prepared statements
- ✅ Validação de tipos com TypeScript
- ✅ Sanitização de inputs

#### XSS (Cross-Site Scripting)
- ✅ Validação de inputs
- ✅ Sanitização de outputs (JSON responses)
- ✅ Headers de segurança (helmet middleware já configurado)

#### CSRF (Cross-Site Request Forgery)
- ⚠️ **Não aplicável para API REST stateless**
- ✅ Tokens JWT no header (não em cookies)
- 📝 Se usar cookies: implementar SameSite=Strict

#### Brute Force
- 📝 **Rate Limiting** (implementar na FASE 5)
- 📝 Account lockout após N tentativas
- 📝 Exponential backoff
- ✅ Logging de tentativas falhas

#### Token Theft
- ✅ Refresh token rotation
- ✅ Token invalidation no logout
- ✅ Curta duração de access token
- 📝 Detecção de uso simultâneo
- 📝 IP/User-Agent binding (opcional)

#### Timing Attacks
- ✅ bcrypt.compare é timing-safe
- ✅ Mensagens de erro genéricas
- ✅ Mesmo tempo de resposta para email válido/inválido

---

### 6. **Gestão de Sessões** ✅

#### Lifecycle
```
1. Login → Gera Access + Refresh tokens
2. Request → Valida Access token
3. Token expira → Usa Refresh token
4. Refresh → Invalida token antigo + Gera novos
5. Logout → Invalida Refresh token
```

#### Revogação
- ✅ Logout invalida refresh token
- ✅ Mudança de senha invalida todos os tokens
- ✅ Admin pode revogar tokens de usuário
- ✅ Limpeza automática de tokens expirados

---

### 7. **Logging e Auditoria** ✅

#### Eventos Logados
- ✅ Login bem-sucedido (userId, timestamp, IP)
- ✅ Login falho (email, timestamp, IP, motivo)
- ✅ Logout (userId, timestamp)
- ✅ Refresh token (userId, timestamp)
- ✅ Registro de usuário (userId, timestamp)
- ✅ Tentativas de acesso não autorizado
- ✅ Mudança de senha

#### Proteção de Logs
- ✅ **Nunca** logar senhas
- ✅ **Nunca** logar tokens completos (apenas últimos 4 chars)
- ✅ Logar apenas dados necessários
- ✅ Usar Winston para logs estruturados

---

### 8. **Headers de Segurança** ✅

Já configurados via **Helmet** em `app.ts`:
- ✅ `X-Content-Type-Options: nosniff`
- ✅ `X-Frame-Options: DENY`
- ✅ `X-XSS-Protection: 1; mode=block`
- ✅ `Strict-Transport-Security` (HTTPS only)
- ✅ `Content-Security-Policy`
- ✅ `Referrer-Policy: no-referrer`

---

## 📋 Checklist de Implementação

### Utils
- [ ] `password.ts`
  - [ ] hashPassword() com bcrypt rounds=12
  - [ ] comparePassword() timing-safe
  - [ ] validatePasswordStrength() com 5+ regras
  - [ ] generateSecureToken() para reset de senha

- [ ] `jwt.ts`
  - [ ] generateAccessToken() 15min
  - [ ] generateRefreshToken() 7d
  - [ ] verifyAccessToken() com validações
  - [ ] verifyRefreshToken() com validações
  - [ ] Incluir claims: iss, aud, exp, iat

### Types
- [ ] `auth.types.ts`
  - [ ] LoginResponse
  - [ ] TokenPair
  - [ ] JWTPayload
  - [ ] RegisterDTO
  - [ ] UpdateProfileDTO
  - [ ] Estender Express Request com user

### Validators
- [ ] `auth.validator.ts`
  - [ ] registerSchema (email, password, name, cpf)
  - [ ] loginSchema (email, password)
  - [ ] refreshSchema (refreshToken)
  - [ ] updateProfileSchema (name, phone, cpf)
  - [ ] Validação de CPF com algoritmo
  - [ ] Validação de senha forte

### Middlewares
- [ ] `authenticate.ts`
  - [ ] Extrair token do header
  - [ ] Validar formato Bearer
  - [ ] Verificar assinatura
  - [ ] Verificar expiração
  - [ ] Injetar req.user
  - [ ] Error handling

- [ ] `authorize.ts`
  - [ ] Verificar roles
  - [ ] Suporte a array de roles
  - [ ] Error handling

### Services
- [ ] `auth.service.ts`
  - [ ] register() - Validar email/CPF único, hash senha
  - [ ] login() - Validar credenciais, gerar tokens
  - [ ] refreshToken() - Rotation, invalidar antigo
  - [ ] logout() - Invalidar refresh token
  - [ ] getProfile() - Dados do usuário
  - [ ] updateProfile() - Atualizar dados
  - [ ] changePassword() - Validar senha antiga

### Controllers
- [ ] `auth.controller.ts`
  - [ ] POST /register
  - [ ] POST /login
  - [ ] POST /refresh
  - [ ] POST /logout
  - [ ] GET /me
  - [ ] PUT /me
  - [ ] Error handling adequado

### Routes
- [ ] `auth.routes.ts`
  - [ ] Aplicar validators
  - [ ] Aplicar authenticate onde necessário
  - [ ] Rotas públicas vs protegidas

### Config
- [ ] `env.ts`
  - [ ] JWT_SECRET (256 bits)
  - [ ] JWT_EXPIRES_IN (15m)
  - [ ] REFRESH_TOKEN_SECRET (256 bits)
  - [ ] REFRESH_TOKEN_EXPIRES_IN (7d)

### Tests
- [ ] `auth.test.ts`
  - [ ] Registro com dados válidos
  - [ ] Registro com email duplicado
  - [ ] Registro com CPF duplicado
  - [ ] Registro com senha fraca
  - [ ] Login com credenciais válidas
  - [ ] Login com senha incorreta
  - [ ] Login com email inexistente
  - [ ] Refresh token válido
  - [ ] Refresh token expirado
  - [ ] Refresh token inválido
  - [ ] Logout
  - [ ] Acesso a rota protegida
  - [ ] Acesso sem token
  - [ ] Acesso com token expirado

### Documentação
- [ ] Swagger/OpenAPI
  - [ ] Schemas de request/response
  - [ ] Exemplos
  - [ ] Códigos de erro
  - [ ] Security schemes

---

## 🔒 Variáveis de Ambiente Sensíveis

```bash
# JWT Secrets - GERAR COM crypto.randomBytes(32).toString('hex')
JWT_SECRET=<256-bit-hex-string>
REFRESH_TOKEN_SECRET=<256-bit-hex-string>

# JWT Expiration
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# JWT Claims
JWT_ISSUER=nsr-ecommerce
JWT_AUDIENCE=nsr-api
```

⚠️ **NUNCA** commitar secrets reais no repositório!

---

## 🚨 Ameaças e Mitigações

| Ameaça | Mitigação | Status |
|--------|-----------|--------|
| Senhas fracas | Validação de força + bcrypt | ✅ |
| Rainbow tables | Salt único por senha | ✅ |
| Brute force | Rate limiting (Fase 5) | 📝 |
| Token theft | Refresh rotation + curta duração | ✅ |
| SQL Injection | Prisma ORM | ✅ |
| XSS | Sanitização + headers | ✅ |
| CSRF | Stateless JWT | ✅ |
| Timing attacks | Timing-safe comparison | ✅ |
| Session fixation | JWT stateless | ✅ |
| Man-in-the-middle | HTTPS only (prod) | 📝 |

---

## 📊 Fluxo de Autenticação

### Registro
```
1. Cliente → POST /api/v1/auth/register
2. Validar input (Zod)
3. Verificar email único
4. Verificar CPF único
5. Hash senha (bcrypt)
6. Criar usuário no banco
7. Retornar usuário (sem senha)
```

### Login
```
1. Cliente → POST /api/v1/auth/login
2. Validar input
3. Buscar usuário por email (com senha)
4. Comparar senha (bcrypt)
5. Gerar Access Token (15min)
6. Gerar Refresh Token (7d)
7. Salvar Refresh Token no banco
8. Atualizar lastLogin
9. Retornar { user, accessToken, refreshToken }
```

### Request Autenticado
```
1. Cliente → GET /api/v1/auth/me (Header: Authorization: Bearer <token>)
2. Middleware authenticate extrai token
3. Validar assinatura JWT
4. Verificar expiração
5. Injetar req.user
6. Controller processa request
7. Retornar response
```

### Refresh Token
```
1. Cliente → POST /api/v1/auth/refresh
2. Validar refresh token no banco
3. Verificar expiração
4. Invalidar token antigo (delete)
5. Gerar novos Access + Refresh tokens
6. Salvar novo Refresh Token
7. Retornar { accessToken, refreshToken }
```

### Logout
```
1. Cliente → POST /api/v1/auth/logout
2. Middleware authenticate valida Access Token
3. Invalidar Refresh Token no banco
4. Retornar sucesso
```

---

## 🎯 Métricas de Sucesso

- ✅ 0 senhas em plain text no banco
- ✅ 0 senhas em logs
- ✅ 0 tokens em logs (exceto últimos 4 chars)
- ✅ 100% dos endpoints validados com Zod
- ✅ 100% das rotas protegidas com authenticate
- ✅ Todos os testes passando
- ✅ Documentação Swagger completa
- ✅ TypeScript strict mode sem erros

---

## 📚 Referências

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [NIST Password Guidelines](https://pages.nist.gov/800-63-3/sp800-63b.html)
- [bcrypt Security](https://en.wikipedia.org/wiki/Bcrypt)

---

**Status:** 📝 Plano aprovado - Pronto para implementação

