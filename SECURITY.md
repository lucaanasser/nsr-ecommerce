# 🔒 GUIA DE SEGURANÇA - NSR

Este documento contém as melhores práticas de segurança para contribuir com o projeto NSR.

## ⚠️ REGRAS CRÍTICAS - NUNCA VIOLE!

### ❌ NUNCA COMMITE:
- Arquivos `.env` (exceto `.env.example`)
- Senhas ou credenciais reais
- API Keys (Stripe, AWS, Google, etc.)
- Tokens de autenticação
- Certificados SSL (`.pem`, `.key`, `.crt`)
- Dados de usuários reais
- Dumps de banco de dados com dados reais

### ✅ SEMPRE FAÇA:
- Use variáveis de ambiente para dados sensíveis
- Mantenha `.env.example` atualizado (sem valores reais!)
- Use senhas mockadas/faker em exemplos
- Revise commits antes de fazer push
- Use `.gitignore` corretamente

---

## 📋 CHECKLIST ANTES DE COMMITAR

```bash
# 1. Verifique se não há arquivos sensíveis
git status

# 2. Revise as mudanças
git diff

# 3. Procure por possíveis credenciais (ajuste os termos conforme necessário)
grep -r "password.*=.*['\"].*['\"]" --include="*.ts" --include="*.tsx" --include="*.js" --exclude-dir=node_modules .
grep -r "apiKey.*=.*['\"].*['\"]" --include="*.ts" --include="*.tsx" --include="*.js" --exclude-dir=node_modules .
grep -r "secret.*=.*['\"].*['\"]" --include="*.ts" --include="*.tsx" --include="*.js" --exclude-dir=node_modules .

# 4. Verifique se .env não está sendo trackeado
git ls-files | grep "\.env$"
# (deve retornar vazio - se retornar algo, PARE!)
```

---

## 🛠️ CONFIGURAÇÃO INICIAL SEGURA

### 1. Inicializar o repositório:
```bash
cd /home/luca/NSR
git init
git add .gitignore .env.example
git commit -m "chore: add gitignore and env example"
```

### 2. Configurar variáveis de ambiente:
```bash
# Copie o exemplo
cp .env.example .env
cp frontend/.env.example frontend/.env

# Edite com seus valores REAIS (não commitados!)
nano .env
```

### 3. Verificar que .env está ignorado:
```bash
git status
# .env NÃO deve aparecer em "Untracked files"
```

---

## 🔐 BOAS PRÁTICAS

### Senhas e Segredos
- **Desenvolvimento**: Use valores mockados óbvios (`dev-secret-123`, `mock-password`)
- **Produção**: Use geradores de senha forte (min. 32 caracteres aleatórios)
- **JWT Secrets**: `openssl rand -base64 64`
- **Nunca** use a mesma senha/secret em dev e prod

### API Keys
- Use variáveis de ambiente SEMPRE
- Em produção, use serviços como AWS Secrets Manager, HashiCorp Vault
- Rotacione keys regularmente

### Banco de Dados
- NUNCA commite dumps com dados reais
- Se precisar de dados de exemplo, use faker/mock data
- Mantenha `database/data/` no `.gitignore`

---

## 🚨 O QUE FAZER SE COMMITOU ALGO SENSÍVEL

### Se ainda NÃO fez push:
```bash
# Remova o arquivo do commit
git reset HEAD~1
git rm --cached arquivo-sensivel
git commit -m "chore: remove sensitive data"
```

### Se JÁ fez push:
1. **REVOGUE imediatamente** qualquer credencial exposta
2. **Mude todas as senhas/keys**
3. Use `git-filter-repo` ou `BFG Repo-Cleaner` para limpar o histórico
4. Force push (se for seu repo privado)
5. **Avise a equipe** se for colaborativo

```bash
# Exemplo com BFG
bfg --delete-files .env
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push --force
```

⚠️ **IMPORTANTE**: Mesmo após remover do histórico, considere que a credencial foi comprometida e deve ser trocada!

---

## 📝 PADRÕES DE CÓDIGO SEGURO

### ✅ BOM:
```typescript
// Usando variável de ambiente
const apiKey = process.env.STRIPE_SECRET_KEY;

// Senha mockada óbvia
const MOCK_PASSWORD = "mock-user-password-123";

// Validação de entrada
const email = sanitize(userInput.email);
```

### ❌ RUIM:
```typescript
// Hardcoded API key
const apiKey = "sk_live_51HqfK2L..."; // ❌ NUNCA!

// Senha que parece real
const password = "MyP@ssw0rd2024"; // ❌ Ambíguo

// Sem validação
const email = userInput.email; // ❌ Vulnerável a injection
```

---

## 🔍 FERRAMENTAS ÚTEIS

### Git Hooks (Pre-commit)
Instale para verificar automaticamente:
```bash
npm install --save-dev husky
npx husky init
```

### Scan de Secrets
```bash
# GitLeaks
brew install gitleaks
gitleaks detect --source . --verbose

# TruffleHog
pip install trufflehog
trufflehog filesystem /home/luca/NSR
```

---

## 📚 RECURSOS ADICIONAIS

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [12 Factor App](https://12factor.net/)

---

## ✅ APROVAÇÃO PARA PRODUÇÃO

Antes de fazer deploy:
- [ ] Todas as variáveis de ambiente estão configuradas
- [ ] Nenhuma credencial no código
- [ ] `.gitignore` configurado corretamente
- [ ] HTTPS habilitado
- [ ] Rate limiting implementado
- [ ] Validação de entrada em todas as rotas
- [ ] Autenticação e autorização funcionando
- [ ] Logs não expõem dados sensíveis
- [ ] CORS configurado corretamente
- [ ] Backups automatizados configurados

---

**Lembre-se**: Segurança é um processo contínuo, não um estado final! 🔒
