# Configuração do GitHub Actions para Vercel

## 📋 Secrets necessários no GitHub

Para o GitHub Actions funcionar, você precisa adicionar 3 secrets no seu repositório:

### 1. VERCEL_TOKEN
- Acesse: https://vercel.com/account/tokens
- Crie um novo token
- Copie o token

### 2. VERCEL_ORG_ID
Execute no terminal do seu projeto:
```bash
cd frontend
npx vercel login
npx vercel link
cat .vercel/project.json
```
Copie o valor de `"orgId"`

### 3. VERCEL_PROJECT_ID
No mesmo arquivo `.vercel/project.json`, copie o valor de `"projectId"`

---

## 🔧 Adicionar Secrets no GitHub

1. Vá para: https://github.com/lucaanasser/nsr-ecommerce/settings/secrets/actions
2. Clique em "New repository secret"
3. Adicione os 3 secrets:
   - `VERCEL_TOKEN` = seu token da Vercel
   - `VERCEL_ORG_ID` = ID da sua organização
   - `VERCEL_PROJECT_ID` = ID do projeto

---

## 🚀 Como funciona

Depois de configurar os secrets:
- Todo `git push` na branch `main` → Deploy automático
- Todo Pull Request → Deploy de preview

---

## ⚡ Alternativa Mais Simples (Recomendado)

Em vez de usar GitHub Actions, você pode:

1. Acessar: https://vercel.com/new
2. Importar seu repositório `lucaanasser/nsr-ecommerce`
3. Configurar Root Directory como `frontend`
4. Pronto! Deploy automático em cada push

Essa opção é mais simples e não precisa de secrets.
