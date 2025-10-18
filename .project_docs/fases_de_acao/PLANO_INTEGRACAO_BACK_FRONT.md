# Plano Detalhado: Integração Backend ↔ Frontend NSR

## Objetivo
Conectar o backend (Express/Prisma) ao frontend (Next.js), removendo gradualmente dados mockados do front, garantindo deploy local via docker-compose e evitando quebras em ambos os lados.

---

## 1. Levantamento e Preparação
### 1.1. Revisar Endpoints Backend
- Listar todos os endpoints REST disponíveis e suas rotas.
- Validar quais já estão prontos para consumo externo (autenticação, produtos, carrinho, pedidos, etc).
- Conferir documentação Swagger.

### 1.2. Mapear Dados Mockados no Frontend
- Identificar todos os arquivos/data mocks usados (ex: `products.ts`, `adminData.ts`, etc).
- Relacionar cada mock a um endpoint real correspondente.
- Priorizar substituição dos mocks mais críticos (ex: produtos, carrinho).

---

## 2. Configuração de Ambiente Local
### 2.1. Ajustar docker-compose
- Garantir que backend e frontend estejam em containers separados.
- Configurar variáveis de ambiente para apontar o frontend para o backend (ex: NEXT_PUBLIC_API_URL).
- Expor e mapear as portas corretamente (ex: 3000 para front, 3333 para back).
- Testar comunicação entre containers (ex: curl do front para o back).

### 2.2. CORS e Segurança
- Garantir que o backend aceite requisições do domínio/porta do frontend.
- Ajustar middleware de CORS no Express.

---

## 3. Primeira Integração Real
### 3.1. Escolher um fluxo simples
- Exemplo: Listagem de produtos na loja.
- No front, substituir o mock de produtos por chamada fetch/axios ao endpoint real.
- Garantir fallback para mock caso o backend esteja offline (opcional).

### 3.2. Testar e Validar
- Validar dados renderizados, loading, erros.
- Corrigir eventuais problemas de tipagem, autenticação, CORS, etc.

---

## 4. Integração Gradual
### 4.1. Repetir para outros fluxos
- Carrinho, pedidos, perfil, admin, etc.
- Sempre substituir mocks por dados reais de forma incremental.
- Testar cada etapa antes de avançar.

### 4.2. Refatorar Contextos
- Atualizar Contexts do front para consumir APIs reais.
- Remover lógica de persistência local (localStorage) quando não fizer mais sentido.

---

## 5. Documentação e Checklist
- Documentar endpoints já integrados.
- Manter checklist de mocks removidos/substituídos.
- Anotar problemas encontrados e soluções.

---

## 6. Deploy Local Final
- Subir tudo via `docker-compose up`.
- Validar fluxo completo: cadastro, login, compra, admin, etc.
- Corrigir eventuais problemas de rede, build, variáveis de ambiente.

---

## 7. Próximos Passos
- Planejar deploy em ambiente de staging/produção.
- Automatizar testes de integração.
- Monitorar logs e performance.

---

> Siga cada etapa com commit e testes frequentes. Não avance para o próximo fluxo sem garantir que o anterior está estável.

