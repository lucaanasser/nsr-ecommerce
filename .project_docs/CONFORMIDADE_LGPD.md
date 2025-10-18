# 📋 Plano de Conformidade com LGPD
## NSR E-commerce - Checklist Completo de Adequação

**Data:** 18 de Outubro de 2025  
**Status:** Em Desenvolvimento  
**Prazo Recomendado:** 30-60 dias

---

## 📊 Status Atual: 40% Conforme

### ✅ **Já Implementado (40%)**
- [x] Senha hasheada com bcrypt (12 salt rounds)
- [x] CPF como campo opcional
- [x] JWT com expiração (15min access, 7 dias refresh)
- [x] Validação de força de senha (OWASP)
- [x] HTTPS ready (configurável)
- [x] Logs estruturados com Winston

### ⏳ **Precisa Implementar (60%)**
- [ ] Sistema de consentimento
- [ ] Política de Privacidade
- [ ] Termos de Uso
- [ ] Endpoints LGPD (exportar/deletar dados)
- [ ] Criptografia de dados sensíveis
- [ ] Sistema de retenção de dados
- [ ] Logs de auditoria LGPD
- [ ] Cookie Policy
- [ ] Processo de anonimização

---

## 🎯 FASE 1: Urgente (Prazo: 1 semana)

### 1.1 Atualizar Schema do Banco de Dados

**Arquivo:** `backend/prisma/schema.prisma`

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  role      UserRole @default(CUSTOMER)
  
  // Informações adicionais
  phone     String?
  cpf       String?  @unique
  
  // 🆕 LGPD - Consentimentos
  privacyPolicyAccepted    Boolean   @default(false)
  privacyPolicyAcceptedAt  DateTime?
  privacyPolicyVersion     String?   // Ex: "1.0", "2.0"
  termsAccepted            Boolean   @default(false)
  termsAcceptedAt          DateTime?
  termsVersion             String?
  marketingConsent         Boolean   @default(false)
  marketingConsentAt       DateTime?
  
  // 🆕 LGPD - Rastreabilidade
  dataRetentionDate        DateTime? // Data para deletar automaticamente
  anonymizedAt             DateTime? // Se usuário foi anonimizado
  deletionRequestedAt      DateTime? // Se solicitou exclusão
  
  // 🆕 LGPD - IP e Localização (para auditoria)
  registrationIp           String?
  registrationCountry      String?
  
  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  lastLogin DateTime?
  
  // Relações
  addresses Address[]
  orders    Order[]
  cart      Cart?
  reviews   Review[]
  refreshTokens RefreshToken[]
  
  // 🆕 LGPD - Logs de acesso
  auditLogs AuditLog[]
  
  @@map("users")
}

// 🆕 LGPD - Tabela de Auditoria
model AuditLog {
  id          String   @id @default(uuid())
  userId      String?
  user        User?    @relation(fields: [userId], references: [id], onDelete: SetNull)
  
  action      String   // "DATA_ACCESS", "DATA_EXPORT", "DATA_DELETE", "CONSENT_UPDATE"
  resource    String   // "User", "Order", "Address"
  resourceId  String?
  
  details     Json?    // Detalhes adicionais da ação
  ipAddress   String?
  userAgent   String?
  
  createdAt   DateTime @default(now())
  
  @@index([userId])
  @@index([action])
  @@index([createdAt])
  @@map("audit_logs")
}

// 🆕 LGPD - Registro de Consentimentos
model ConsentHistory {
  id            String   @id @default(uuid())
  userId        String
  
  consentType   String   // "PRIVACY_POLICY", "TERMS", "MARKETING"
  version       String   // Versão do documento
  accepted      Boolean
  
  ipAddress     String?
  userAgent     String?
  
  createdAt     DateTime @default(now())
  
  @@index([userId])
  @@index([consentType])
  @@map("consent_history")
}
```

**Comandos para executar:**
```bash
# Criar migration
npx prisma migrate dev --name add_lgpd_fields

# Aplicar no banco
npx prisma generate
```

---

### 1.2 Criar Política de Privacidade

**Arquivo:** `frontend/src/app/politica-privacidade/page.tsx`

```tsx
export default function PoliticaPrivacidade() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Política de Privacidade</h1>
      
      <div className="prose prose-lg">
        <p className="text-gray-600 mb-6">
          Última atualização: {new Date().toLocaleDateString('pt-BR')}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introdução</h2>
          <p>
            A NSR E-commerce ("nós", "nosso" ou "empresa") está comprometida em 
            proteger sua privacidade. Esta Política de Privacidade explica como 
            coletamos, usamos, compartilhamos e protegemos suas informações pessoais 
            em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Dados Coletados</h2>
          
          <h3 className="text-xl font-semibold mb-2">2.1 Dados Fornecidos por Você</h3>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Nome completo:</strong> para identificação e entrega</li>
            <li><strong>Email:</strong> para comunicação sobre pedidos e login</li>
            <li><strong>Telefone:</strong> para contato sobre entregas</li>
            <li><strong>CPF:</strong> apenas quando necessário para emissão de nota fiscal (opcional)</li>
            <li><strong>Endereço:</strong> para entrega de produtos</li>
            <li><strong>Senha:</strong> armazenada de forma criptografada (bcrypt)</li>
          </ul>

          <h3 className="text-xl font-semibold mb-2">2.2 Dados Coletados Automaticamente</h3>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Endereço IP:</strong> para segurança e prevenção de fraudes</li>
            <li><strong>Navegador e dispositivo:</strong> para melhorar a experiência</li>
            <li><strong>Histórico de compras:</strong> para garantias e recomendações</li>
            <li><strong>Carrinho de compras:</strong> para recuperação de compras abandonadas</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Base Legal (LGPD)</h2>
          <p>Coletamos e processamos seus dados pessoais com base nas seguintes hipóteses legais:</p>
          
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Execução de contrato</strong> (Art. 7º, V): dados necessários para processar e entregar seu pedido</li>
            <li><strong>Consentimento</strong> (Art. 7º, I): marketing, cookies não essenciais</li>
            <li><strong>Legítimo interesse</strong> (Art. 7º, IX): prevenção de fraudes, segurança</li>
            <li><strong>Cumprimento de obrigação legal</strong> (Art. 7º, II): notas fiscais, registros contábeis</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Compartilhamento de Dados</h2>
          <p>Seus dados podem ser compartilhados com:</p>
          
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Transportadoras:</strong> nome, telefone e endereço para entrega</li>
            <li><strong>Gateways de pagamento:</strong> dados necessários para processar pagamento</li>
            <li><strong>Serviços de email:</strong> para envio de notificações transacionais</li>
            <li><strong>Autoridades:</strong> quando exigido por lei</li>
          </ul>
          
          <p className="font-semibold">❌ NÃO vendemos seus dados para terceiros.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Seus Direitos (LGPD)</h2>
          <p>Você tem os seguintes direitos sobre seus dados:</p>
          
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Confirmação e acesso:</strong> saber se processamos seus dados</li>
            <li><strong>Correção:</strong> atualizar dados incompletos ou incorretos</li>
            <li><strong>Portabilidade:</strong> receber seus dados em formato estruturado</li>
            <li><strong>Eliminação:</strong> solicitar exclusão de dados não mais necessários</li>
            <li><strong>Revogação de consentimento:</strong> retirar consentimento a qualquer momento</li>
            <li><strong>Informação sobre compartilhamento:</strong> saber com quem compartilhamos</li>
            <li><strong>Oposição:</strong> opor-se ao tratamento em certas circunstâncias</li>
          </ul>
          
          <p className="mt-4">
            Para exercer seus direitos, acesse sua conta em <strong>Configurações &gt; Privacidade</strong> 
            ou entre em contato: <a href="mailto:privacidade@nsr.com" className="text-blue-600">privacidade@nsr.com</a>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Retenção de Dados</h2>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Dados cadastrais:</strong> enquanto sua conta estiver ativa</li>
            <li><strong>Histórico de pedidos:</strong> 5 anos (prazo legal fiscal)</li>
            <li><strong>Carrinho abandonado:</strong> 90 dias</li>
            <li><strong>Logs de acesso:</strong> 6 meses</li>
          </ul>
          
          <p>Após inatividade de 3 anos, enviaremos notificação para reativar ou deletar sua conta.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Segurança</h2>
          <p>Implementamos medidas técnicas e organizacionais:</p>
          
          <ul className="list-disc pl-6 mb-4">
            <li>Criptografia de senhas (bcrypt com 12 salt rounds)</li>
            <li>Comunicação via HTTPS</li>
            <li>Tokens JWT com expiração curta (15 minutos)</li>
            <li>Validação forte de senhas (OWASP)</li>
            <li>Logs de auditoria para rastreabilidade</li>
            <li>Backups regulares criptografados</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Cookies</h2>
          <p>
            Utilizamos cookies essenciais para funcionamento do site e cookies de análise 
            (com seu consentimento). Veja nossa <a href="/politica-cookies" className="text-blue-600">Política de Cookies</a>.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Alterações</h2>
          <p>
            Esta política pode ser atualizada. Notificaremos sobre mudanças significativas 
            por email e solicitaremos novo consentimento quando necessário.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Contato - Encarregado de Dados (DPO)</h2>
          <p>Para questões sobre privacidade e LGPD:</p>
          <ul className="list-none mb-4">
            <li><strong>Email:</strong> dpo@nsr.com</li>
            <li><strong>Telefone:</strong> (XX) XXXX-XXXX</li>
            <li><strong>Endereço:</strong> [Seu endereço comercial]</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">11. Autoridade Nacional de Proteção de Dados (ANPD)</h2>
          <p>
            Você pode apresentar reclamações à ANPD em: 
            <a href="https://www.gov.br/anpd" className="text-blue-600" target="_blank"> www.gov.br/anpd</a>
          </p>
        </section>
      </div>
    </div>
  );
}
```

---

### 1.3 Criar Termos de Uso

**Arquivo:** `frontend/src/app/termos-uso/page.tsx`

```tsx
export default function TermosUso() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Termos de Uso</h1>
      
      <div className="prose prose-lg">
        <p className="text-gray-600 mb-6">
          Última atualização: {new Date().toLocaleDateString('pt-BR')}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Aceitação dos Termos</h2>
          <p>
            Ao criar uma conta ou fazer uma compra na NSR E-commerce, você concorda 
            com estes Termos de Uso e nossa Política de Privacidade.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Cadastro e Conta</h2>
          <ul className="list-disc pl-6">
            <li>Você deve fornecer informações verdadeiras e atualizadas</li>
            <li>Você é responsável pela segurança de sua senha</li>
            <li>Não compartilhe sua conta com terceiros</li>
            <li>Notifique-nos imediatamente sobre uso não autorizado</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Compras e Pagamentos</h2>
          <ul className="list-disc pl-6">
            <li>Todos os preços estão em Reais (BRL)</li>
            <li>Reservamos o direito de recusar pedidos</li>
            <li>Confirmação de pedido não garante disponibilidade</li>
            <li>Pagamento processado por gateways seguros</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Entrega</h2>
          <p>
            Prazos de entrega são estimativas e podem variar. Não nos responsabilizamos 
            por atrasos causados por transportadoras ou eventos fora de nosso controle.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Trocas e Devoluções</h2>
          <p>
            Conforme Código de Defesa do Consumidor, você tem 7 dias para desistir 
            da compra (direito de arrependimento). Produtos devem estar sem uso e 
            com embalagem original.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Propriedade Intelectual</h2>
          <p>
            Todo conteúdo do site (textos, imagens, logos, código) é propriedade 
            da NSR E-commerce e protegido por leis de direitos autorais.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Limitação de Responsabilidade</h2>
          <p>
            Não nos responsabilizamos por danos indiretos, lucros cessantes ou 
            uso inadequado dos produtos.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Modificações</h2>
          <p>
            Reservamos o direito de modificar estes termos a qualquer momento. 
            Mudanças significativas serão notificadas por email.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Lei Aplicável</h2>
          <p>
            Estes termos são regidos pelas leis do Brasil. Foro da comarca de [Sua Cidade].
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Contato</h2>
          <ul className="list-none">
            <li><strong>Email:</strong> contato@nsr.com</li>
            <li><strong>Telefone:</strong> (XX) XXXX-XXXX</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
```

---

### 1.4 Atualizar Formulário de Cadastro

**Arquivo:** `frontend/src/app/cadastro/page.tsx`

Adicionar checkboxes de consentimento:

```tsx
// Adicionar ao estado
const [consents, setConsents] = useState({
  privacyPolicy: false,
  terms: false,
  marketing: false
});

// Adicionar antes do botão de cadastro
<div className="space-y-3">
  <label className="flex items-start gap-2">
    <input
      type="checkbox"
      checked={consents.privacyPolicy}
      onChange={(e) => setConsents({...consents, privacyPolicy: e.target.checked})}
      className="mt-1"
      required
    />
    <span className="text-sm">
      Li e aceito a{' '}
      <a href="/politica-privacidade" target="_blank" className="text-blue-600 underline">
        Política de Privacidade
      </a>{' '}
      *
    </span>
  </label>

  <label className="flex items-start gap-2">
    <input
      type="checkbox"
      checked={consents.terms}
      onChange={(e) => setConsents({...consents, terms: e.target.checked})}
      className="mt-1"
      required
    />
    <span className="text-sm">
      Li e aceito os{' '}
      <a href="/termos-uso" target="_blank" className="text-blue-600 underline">
        Termos de Uso
      </a>{' '}
      *
    </span>
  </label>

  <label className="flex items-start gap-2">
    <input
      type="checkbox"
      checked={consents.marketing}
      onChange={(e) => setConsents({...consents, marketing: e.target.checked})}
      className="mt-1"
    />
    <span className="text-sm">
      Aceito receber ofertas e novidades por email (opcional)
    </span>
  </label>
</div>
```

---

## 🎯 FASE 2: Importante (Prazo: 2 semanas)

### 2.1 Criar Endpoints LGPD

**Arquivo:** `backend/src/routes/user.routes.ts`

```typescript
import { Router } from 'express';
import { authenticate } from '@middlewares/authenticate';
import * as UserController from '@controllers/user.controller';

const router = Router();

// 🆕 LGPD - Exportar todos os dados do usuário
router.get('/my-data', authenticate, UserController.exportUserData);

// 🆕 LGPD - Deletar conta permanentemente
router.delete('/delete-account', authenticate, UserController.deleteAccount);

// 🆕 LGPD - Atualizar consentimentos
router.put('/consent', authenticate, UserController.updateConsent);

// 🆕 LGPD - Solicitar exclusão (com período de carência)
router.post('/request-deletion', authenticate, UserController.requestDeletion);

// 🆕 LGPD - Cancelar solicitação de exclusão
router.delete('/cancel-deletion', authenticate, UserController.cancelDeletion);

export default router;
```

**Arquivo:** `backend/src/controllers/user.controller.ts`

```typescript
import { Request, Response } from 'express';
import { prisma } from '@config/database';
import { logger } from '@config/logger';

/**
 * LGPD - Exportar todos os dados do usuário
 */
export async function exportUserData(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;

    // Buscar TODOS os dados do usuário
    const userData = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        addresses: true,
        orders: {
          include: {
            items: {
              include: {
                product: true
              }
            }
          }
        },
        cart: {
          include: {
            items: {
              include: {
                product: true
              }
            }
          }
        },
        reviews: {
          include: {
            product: true
          }
        }
      }
    });

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Remover senha do export
    const { password, ...userDataWithoutPassword } = userData;

    // Registrar auditoria
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'DATA_EXPORT',
        resource: 'User',
        resourceId: userId,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      }
    });

    logger.info(`User ${userId} exported their data`);

    res.json({
      success: true,
      message: 'Dados exportados com sucesso',
      data: userDataWithoutPassword,
      exportedAt: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error exporting user data:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao exportar dados'
    });
  }
}

/**
 * LGPD - Deletar conta permanentemente
 */
export async function deleteAccount(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;
    const { password } = req.body;

    // Verificar senha para confirmação
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    const { comparePassword } = await import('@utils/password');
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Senha incorreta'
      });
    }

    // Verificar se há pedidos pendentes
    const pendingOrders = await prisma.order.count({
      where: {
        userId,
        status: {
          in: ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED']
        }
      }
    });

    if (pendingOrders > 0) {
      return res.status(400).json({
        success: false,
        message: 'Não é possível deletar conta com pedidos pendentes. Aguarde a finalização ou cancelamento.'
      });
    }

    // Anonimizar ao invés de deletar (manter histórico legal)
    await prisma.user.update({
      where: { id: userId },
      data: {
        email: `deleted_${userId}@anonymized.com`,
        name: 'Usuário Deletado',
        phone: null,
        cpf: null,
        anonymizedAt: new Date()
      }
    });

    // Deletar endereços
    await prisma.address.deleteMany({
      where: { userId }
    });

    // Deletar carrinho
    await prisma.cart.deleteMany({
      where: { userId }
    });

    // Registrar auditoria
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'DATA_DELETE',
        resource: 'User',
        resourceId: userId,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      }
    });

    logger.info(`User ${userId} deleted their account`);

    res.json({
      success: true,
      message: 'Conta deletada com sucesso'
    });
  } catch (error) {
    logger.error('Error deleting account:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar conta'
    });
  }
}

/**
 * LGPD - Atualizar consentimentos
 */
export async function updateConsent(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;
    const { marketingConsent } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        marketingConsent,
        marketingConsentAt: marketingConsent ? new Date() : null
      }
    });

    // Registrar histórico de consentimento
    await prisma.consentHistory.create({
      data: {
        userId,
        consentType: 'MARKETING',
        version: '1.0',
        accepted: marketingConsent,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      }
    });

    logger.info(`User ${userId} updated marketing consent to ${marketingConsent}`);

    res.json({
      success: true,
      message: 'Consentimento atualizado',
      data: {
        marketingConsent: updatedUser.marketingConsent
      }
    });
  } catch (error) {
    logger.error('Error updating consent:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar consentimento'
    });
  }
}

/**
 * LGPD - Solicitar exclusão (com período de carência de 30 dias)
 */
export async function requestDeletion(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;

    const deletionDate = new Date();
    deletionDate.setDate(deletionDate.getDate() + 30); // 30 dias de carência

    await prisma.user.update({
      where: { id: userId },
      data: {
        deletionRequestedAt: new Date(),
        dataRetentionDate: deletionDate
      }
    });

    logger.info(`User ${userId} requested account deletion (scheduled for ${deletionDate})`);

    res.json({
      success: true,
      message: 'Solicitação de exclusão registrada. Sua conta será deletada em 30 dias. Você pode cancelar a qualquer momento.',
      data: {
        deletionDate
      }
    });
  } catch (error) {
    logger.error('Error requesting deletion:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao solicitar exclusão'
    });
  }
}

/**
 * LGPD - Cancelar solicitação de exclusão
 */
export async function cancelDeletion(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;

    await prisma.user.update({
      where: { id: userId },
      data: {
        deletionRequestedAt: null,
        dataRetentionDate: null
      }
    });

    logger.info(`User ${userId} cancelled account deletion request`);

    res.json({
      success: true,
      message: 'Solicitação de exclusão cancelada'
    });
  } catch (error) {
    logger.error('Error cancelling deletion:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao cancelar exclusão'
    });
  }
}
```

---

### 2.2 Criar Serviço de Retenção de Dados

**Arquivo:** `backend/src/services/data-retention.service.ts`

```typescript
import { prisma } from '@config/database';
import { logger } from '@config/logger';

/**
 * LGPD - Limpar dados antigos automaticamente
 * Executar diariamente via cron job
 */
export async function cleanOldData() {
  try {
    const now = new Date();

    // 1. Deletar carrinhos abandonados > 90 dias
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    const deletedCarts = await prisma.cart.deleteMany({
      where: {
        updatedAt: {
          lt: ninetyDaysAgo
        }
      }
    });
    logger.info(`Deleted ${deletedCarts.count} abandoned carts`);

    // 2. Deletar usuários com solicitação de exclusão vencida
    const usersToDelete = await prisma.user.findMany({
      where: {
        dataRetentionDate: {
          lte: now
        },
        deletionRequestedAt: {
          not: null
        }
      }
    });

    for (const user of usersToDelete) {
      // Anonimizar
      await prisma.user.update({
        where: { id: user.id },
        data: {
          email: `deleted_${user.id}@anonymized.com`,
          name: 'Usuário Deletado',
          phone: null,
          cpf: null,
          anonymizedAt: now
        }
      });

      // Deletar dados relacionados
      await prisma.address.deleteMany({ where: { userId: user.id } });
      await prisma.cart.deleteMany({ where: { userId: user.id } });

      logger.info(`Anonymized user ${user.id} after retention period`);
    }

    // 3. Deletar logs de auditoria > 6 meses
    const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
    const deletedLogs = await prisma.auditLog.deleteMany({
      where: {
        createdAt: {
          lt: sixMonthsAgo
        }
      }
    });
    logger.info(`Deleted ${deletedLogs.count} old audit logs`);

    // 4. Notificar usuários inativos há 3 anos
    const threeYearsAgo = new Date(now.getTime() - 3 * 365 * 24 * 60 * 60 * 1000);
    const inactiveUsers = await prisma.user.findMany({
      where: {
        lastLogin: {
          lt: threeYearsAgo
        },
        deletionRequestedAt: null
      }
    });

    // TODO: Enviar email notificando sobre exclusão em 30 dias
    for (const user of inactiveUsers) {
      logger.info(`Inactive user detected: ${user.email} (last login: ${user.lastLogin})`);
      // await emailService.sendInactivityWarning(user.email);
    }

    return {
      deletedCarts: deletedCarts.count,
      anonymizedUsers: usersToDelete.length,
      deletedLogs: deletedLogs.count,
      inactiveUsers: inactiveUsers.length
    };
  } catch (error) {
    logger.error('Error in data retention cleanup:', error);
    throw error;
  }
}

/**
 * Configurar cron job para executar diariamente
 */
export function scheduleDataRetention() {
  // Executar todo dia às 3h da manhã
  const schedule = require('node-cron');
  
  schedule.schedule('0 3 * * *', async () => {
    logger.info('Running scheduled data retention cleanup');
    const result = await cleanOldData();
    logger.info('Data retention cleanup completed:', result);
  });
}
```

---

### 2.3 Criar Página de Configurações de Privacidade

**Arquivo:** `frontend/src/app/configuracoes/privacidade/page.tsx`

```tsx
'use client';

import { useState } from 'use';
import { useAuthContext } from '@hooks/useAuth';

export default function ConfiguracoesPrivacidade() {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(user?.marketingConsent || false);

  const handleExportData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/user/my-data', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      const data = await response.json();
      
      // Download como JSON
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `meus-dados-${new Date().toISOString()}.json`;
      a.click();
      
      alert('Dados exportados com sucesso!');
    } catch (error) {
      alert('Erro ao exportar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateConsent = async () => {
    setLoading(true);
    try {
      await fetch('/api/v1/user/consent', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ marketingConsent })
      });
      
      alert('Consentimento atualizado!');
    } catch (error) {
      alert('Erro ao atualizar consentimento');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestDeletion = async () => {
    if (!confirm('Tem certeza que deseja solicitar a exclusão de sua conta? Esta ação será executada em 30 dias.')) {
      return;
    }

    setLoading(true);
    try {
      await fetch('/api/v1/user/request-deletion', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      alert('Solicitação de exclusão registrada. Você tem 30 dias para cancelar.');
    } catch (error) {
      alert('Erro ao solicitar exclusão');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Configurações de Privacidade</h1>

      {/* Consentimentos */}
      <section className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Consentimentos</h2>
        
        <label className="flex items-center gap-3 mb-4">
          <input
            type="checkbox"
            checked={marketingConsent}
            onChange={(e) => setMarketingConsent(e.target.checked)}
          />
          <span>Aceito receber ofertas e novidades por email</span>
        </label>

        <button
          onClick={handleUpdateConsent}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Salvar Consentimentos
        </button>
      </section>

      {/* Exportar Dados */}
      <section className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Exportar Meus Dados</h2>
        <p className="text-gray-600 mb-4">
          Você pode baixar todos os seus dados pessoais que temos armazenados.
        </p>
        <button
          onClick={handleExportData}
          disabled={loading}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          Exportar Dados (JSON)
        </button>
      </section>

      {/* Deletar Conta */}
      <section className="bg-white p-6 rounded-lg shadow border-2 border-red-200">
        <h2 className="text-xl font-semibold mb-4 text-red-600">Zona de Perigo</h2>
        <p className="text-gray-600 mb-4">
          A exclusão da conta é permanente e não pode ser desfeita. Você terá 30 dias para cancelar.
        </p>
        <button
          onClick={handleRequestDeletion}
          disabled={loading}
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 disabled:opacity-50"
        >
          Solicitar Exclusão de Conta
        </button>
      </section>
    </div>
  );
}
```

---

## 🎯 FASE 3: Recomendado (Prazo: 1 mês)

### 3.1 Criptografia de Dados Sensíveis (CPF)

**Arquivo:** `backend/src/utils/encryption.ts`

```typescript
import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY || '', 'hex');
const IV_LENGTH = 16;

/**
 * Criptografar dados sensíveis (CPF, etc)
 */
export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

/**
 * Descriptografar dados sensíveis
 */
export function decrypt(encryptedData: string): string {
  const parts = encryptedData.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const authTag = Buffer.from(parts[1], 'hex');
  const encrypted = parts[2];
  
  const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

/**
 * Mascarar CPF para exibição
 */
export function maskCPF(cpf: string): string {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.***-**');
}
```

Adicionar ao `.env`:
```bash
# Gerar chave: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
ENCRYPTION_KEY=sua_chave_de_32_bytes_em_hex
```

---

### 3.2 Cookie Policy

**Arquivo:** `frontend/src/app/politica-cookies/page.tsx`

```tsx
export default function PoliticaCookies() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Política de Cookies</h1>
      
      <div className="prose prose-lg">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">O que são Cookies?</h2>
          <p>
            Cookies são pequenos arquivos de texto armazenados no seu navegador 
            para melhorar sua experiência de navegação.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Cookies que Utilizamos</h2>
          
          <h3 className="text-xl font-semibold mb-2">Essenciais (não requerem consentimento)</h3>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>accessToken:</strong> Autenticação de sessão (expira em 15min)</li>
            <li><strong>refreshToken:</strong> Renovação de sessão (expira em 7 dias)</li>
          </ul>

          <h3 className="text-xl font-semibold mb-2">Análise (requerem consentimento)</h3>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Google Analytics:</strong> Estatísticas de uso anônimas</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Gerenciar Cookies</h2>
          <p>
            Você pode configurar seu navegador para recusar cookies, mas isso pode 
            afetar a funcionalidade do site.
          </p>
        </section>
      </div>
    </div>
  );
}
```

---

### 3.3 Banner de Cookies (LGPD)

**Arquivo:** `frontend/src/components/CookieBanner.tsx`

```tsx
'use client';

import { useState, useEffect } from 'react';

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setShow(false);
    // Ativar Google Analytics aqui
  };

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'false');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm">
          Utilizamos cookies essenciais e, com seu consentimento, cookies de análise. 
          Veja nossa{' '}
          <a href="/politica-cookies" className="underline">Política de Cookies</a>.
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleReject}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
          >
            Apenas Essenciais
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            Aceitar Todos
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## 📋 CHECKLIST FINAL DE IMPLEMENTAÇÃO

### ✅ Banco de Dados
- [ ] Adicionar campos de consentimento ao modelo User
- [ ] Criar modelo AuditLog
- [ ] Criar modelo ConsentHistory
- [ ] Executar migration `prisma migrate dev --name add_lgpd_fields`

### ✅ Backend
- [ ] Criar endpoints LGPD em `user.routes.ts`
- [ ] Implementar `user.controller.ts` com funções LGPD
- [ ] Criar `data-retention.service.ts`
- [ ] Criar `encryption.ts` para CPF
- [ ] Configurar variável `ENCRYPTION_KEY` no `.env`
- [ ] Adicionar cron job para limpeza de dados
- [ ] Atualizar registro de usuário para salvar consentimentos
- [ ] Registrar IP no cadastro

### ✅ Frontend
- [ ] Criar página `/politica-privacidade`
- [ ] Criar página `/termos-uso`
- [ ] Criar página `/politica-cookies`
- [ ] Criar página `/configuracoes/privacidade`
- [ ] Adicionar checkboxes de consentimento em `/cadastro`
- [ ] Implementar `CookieBanner` component
- [ ] Adicionar CookieBanner ao layout principal

### ✅ Documentação
- [ ] Nomear Encarregado de Dados (DPO)
- [ ] Criar Registro de Tratamento de Dados (interno)
- [ ] Criar Plano de Resposta a Incidentes
- [ ] Documentar processos de backup
- [ ] Documentar política de retenção

### ✅ Operacional
- [ ] Configurar email `dpo@nsr.com` ou `privacidade@nsr.com`
- [ ] Treinar equipe sobre LGPD
- [ ] Configurar monitoramento de solicitações LGPD
- [ ] Testar fluxo de exportação de dados
- [ ] Testar fluxo de exclusão de conta
- [ ] Configurar backups criptografados

---

## 🚨 PENALIDADES LGPD (Motivação!)

Não conformidade pode resultar em:
- **Multa:** Até 2% do faturamento (limitado a R$ 50 milhões por infração)
- **Publicização da infração:** Dano à reputação
- **Bloqueio de dados:** Proibição de tratar dados
- **Eliminação de dados:** Ordem para deletar dados

---

## 📞 Próximos Passos

1. **Semana 1:** Implementar FASE 1 (Schema + Política + Termos + Cadastro)
2. **Semana 2-3:** Implementar FASE 2 (Endpoints + Retenção + Config)
3. **Semana 4:** Implementar FASE 3 (Criptografia + Cookies)
4. **Testes:** Validar todos os fluxos LGPD
5. **Deploy:** Publicar com conformidade LGPD

---

## 📚 Recursos Úteis

- [LGPD - Texto completo](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)
- [Guia ANPD](https://www.gov.br/anpd/pt-br)
- [Serpro - Guia LGPD](https://www.serpro.gov.br/lgpd)
- [OWASP - Senha Segura](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

---

**Documento criado em:** 18/10/2025  
**Versão:** 1.0  
**Mantenedor:** Equipe NSR E-commerce
