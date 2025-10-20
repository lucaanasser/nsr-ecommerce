# 🔧 Guia de Refatoração Modular - Checkout

## 📊 Status Atual
- **Arquivo atual:** `page.tsx` com **1.105 linhas**
- **Problema:** Arquivo monolítico difícil de manter
- **Solução:** Dividir em componentes modulares reutilizáveis

---

## 🏗️ Estrutura Criada

### ✅ Já Criado:

```
frontend/src/
├── types/
│   └── checkout.types.ts         ✅ Tipos TypeScript
├── hooks/checkout/
│   ├── useCheckoutData.ts        ✅ Gerenciamento de estados
│   └── useSavedAddresses.ts      ✅ Endereços salvos
└── components/checkout/
    ├── CheckoutSteps.tsx         ✅ Indicador de etapas
    ├── CheckoutSummary.tsx       ✅ Resumo do pedido
    └── modals/
        └── AddressTitleModal.tsx ✅ Modal de título
```

---

## 📝 Próximos Passos para Completar a Refatoração

### 1️⃣ Criar Componentes de Etapas

#### `CompradorStep.tsx` (~200 linhas)
```tsx
// frontend/src/components/checkout/steps/CompradorStep.tsx
/**
 * Etapa 1: Dados do Comprador
 * - Formulário para criar conta (se não logado)
 * - Completar dados faltantes (se logado)
 * - Validação e salvamento
 */

import { motion } from 'framer-motion';
import { Package } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import type { DadosComprador } from '@/types/checkout.types';

interface CompradorStepProps {
  user: any | null;
  dadosComprador: DadosComprador;
  setDadosComprador: (dados: DadosComprador) => void;
  dadosCompradorFaltando: string[];
  senha: string;
  setSenha: (senha: string) => void;
  confirmarSenha: string;
  setConfirmarSenha: (senha: string) => void;
  dataNascimento: string;
  setDataNascimento: (data: string) => void;
  aceitouTermos: boolean;
  setAceitouTermos: (aceito: boolean) => void;
  salvarDadosComprador: boolean;
  setSalvarDadosComprador: (salvar: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function CompradorStep({ ... }: CompradorStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-dark-card border border-dark-border p-6 rounded-sm"
    >
      {/* Conteúdo da etapa do comprador */}
      {/* Copiar do page.tsx linhas ~411-602 */}
    </motion.div>
  );
}
```

#### `DestinatarioStep.tsx` (~300 linhas)
```tsx
// frontend/src/components/checkout/steps/DestinatarioStep.tsx
/**
 * Etapa 2: Dados do Destinatário e Endereço de Entrega
 * - Checkbox "Eu mesmo sou o destinatário"
 * - Seleção de endereços salvos
 * - Formulário de novo endereço
 */

interface DestinatarioStepProps {
  // Props necessárias...
}

export default function DestinatarioStep({ ... }: DestinatarioStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-dark-card border border-dark-border p-6 rounded-sm"
    >
      {/* Conteúdo da etapa do destinatário */}
      {/* Copiar do page.tsx linhas ~604-853 */}
    </motion.div>
  );
}
```

#### `PagamentoStep.tsx` (~100 linhas)
```tsx
// frontend/src/components/checkout/steps/PagamentoStep.tsx
/**
 * Etapa 3: Dados de Pagamento
 * - Formulário de cartão de crédito
 */

interface PagamentoStepProps {
  dadosPagamento: any;
  setDadosPagamento: (dados: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onVoltar: () => void;
}

export default function PagamentoStep({ ... }: PagamentoStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-dark-card border border-dark-border p-6 rounded-sm"
    >
      {/* Conteúdo da etapa de pagamento */}
      {/* Copiar do page.tsx linhas ~855-920 */}
    </motion.div>
  );
}
```

#### `ConfirmacaoStep.tsx` (~80 linhas)
```tsx
// frontend/src/components/checkout/steps/ConfirmacaoStep.tsx
/**
 * Etapa 4: Confirmação do Pedido
 * - Revisão dos dados
 * - Botão finalizar compra
 */

interface ConfirmacaoStepProps {
  dadosEntrega: any;
  dadosPagamento: any;
  onVoltar: () => void;
  onFinalizar: () => void;
}

export default function ConfirmacaoStep({ ... }: ConfirmacaoStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-dark-card border border-dark-border p-6 rounded-sm"
    >
      {/* Conteúdo da etapa de confirmação */}
      {/* Copiar do page.tsx linhas ~922-980 */}
    </motion.div>
  );
}
```

---

### 2️⃣ Refatorar `page.tsx` (~200 linhas)

```tsx
// frontend/src/app/checkout/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';

// Layouts
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';

// Componentes de Checkout
import CheckoutSteps from '@/components/checkout/CheckoutSteps';
import CheckoutSummary from '@/components/checkout/CheckoutSummary';
import CompradorStep from '@/components/checkout/steps/CompradorStep';
import DestinatarioStep from '@/components/checkout/steps/DestinatarioStep';
import PagamentoStep from '@/components/checkout/steps/PagamentoStep';
import ConfirmacaoStep from '@/components/checkout/steps/ConfirmacaoStep';
import AddressTitleModal from '@/components/checkout/modals/AddressTitleModal';

// Hooks
import { useCart } from '@/context/CartContext';
import { useAuthContext } from '@/context/AuthContext';
import { useCheckoutData } from '@/hooks/checkout/useCheckoutData';
import { useSavedAddresses } from '@/hooks/checkout/useSavedAddresses';

// Services
import { addressService } from '@/services';

export default function CheckoutPage() {
  const router = useRouter();
  const { itensCarrinho, obterTotalCarrinho, limparCarrinho } = useCart();
  const { user, isAuthenticated, register } = useAuthContext();
  
  // Hooks customizados
  const checkoutData = useCheckoutData();
  const { enderecosSalvos, carregandoEnderecos, carregarEnderecos } = 
    useSavedAddresses(isAuthenticated);

  // Verificar dados do comprador ao carregar
  useEffect(() => {
    if (user) {
      verificarDadosComprador();
    }
  }, [user]);

  // Funções de handlers (linhas ~121-337 do arquivo original)
  const handleSubmitComprador = async (e: React.FormEvent) => { /* ... */ };
  const handleSubmitEntrega = async (e: React.FormEvent) => { /* ... */ };
  const handleSubmitPagamento = (e: React.FormEvent) => { /* ... */ };
  const handleFinalizarCompra = () => { /* ... */ };
  // ... outras funções auxiliares

  // Cálculos
  const subtotal = obterTotalCarrinho();
  const frete = subtotal > 299 ? 0 : 29.90;
  const total = subtotal + frete;

  // Verificar carrinho vazio
  if (itensCarrinho.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-dark-bg pt-24 pb-16">
          <Container>
            <div className="text-center py-20">
              <ShoppingBag size={64} className="mx-auto mb-4 text-primary-white/30" />
              <h1 className="text-3xl font-bold mb-4">Carrinho Vazio</h1>
              <p className="text-primary-white/60 mb-8">
                Adicione produtos ao carrinho antes de finalizar a compra.
              </p>
              <Button onClick={() => router.push('/loja')}>
                Ir para a Loja
              </Button>
            </div>
          </Container>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-dark-bg pt-24 pb-16">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1
              className="text-4xl md:text-5xl font-bold mb-8 text-primary-bronze"
              style={{ fontFamily: 'NSR, sans-serif' }}
            >
              Finalizar Compra
            </h1>

            {/* Indicador de Etapas */}
            <CheckoutSteps etapaAtual={checkoutData.etapa} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Formulários das Etapas */}
              <div className="lg:col-span-2">
                {checkoutData.etapa === 'comprador' && (
                  <CompradorStep
                    user={user}
                    dadosComprador={checkoutData.dadosComprador}
                    setDadosComprador={checkoutData.setDadosComprador}
                    dadosCompradorFaltando={checkoutData.dadosCompradorFaltando}
                    senha={checkoutData.senha}
                    setSenha={checkoutData.setSenha}
                    confirmarSenha={checkoutData.confirmarSenha}
                    setConfirmarSenha={checkoutData.setConfirmarSenha}
                    dataNascimento={checkoutData.dataNascimento}
                    setDataNascimento={checkoutData.setDataNascimento}
                    aceitouTermos={checkoutData.aceitouTermos}
                    setAceitouTermos={checkoutData.setAceitouTermos}
                    salvarDadosComprador={checkoutData.salvarDadosComprador}
                    setSalvarDadosComprador={checkoutData.setSalvarDadosComprador}
                    onSubmit={handleSubmitComprador}
                  />
                )}

                {checkoutData.etapa === 'destinatario' && (
                  <DestinatarioStep
                    // ... props
                  />
                )}

                {checkoutData.etapa === 'pagamento' && (
                  <PagamentoStep
                    dadosPagamento={checkoutData.dadosPagamento}
                    setDadosPagamento={checkoutData.setDadosPagamento}
                    onSubmit={handleSubmitPagamento}
                    onVoltar={() => checkoutData.setEtapa('destinatario')}
                  />
                )}

                {checkoutData.etapa === 'confirmacao' && (
                  <ConfirmacaoStep
                    dadosEntrega={checkoutData.dadosEntrega}
                    dadosPagamento={checkoutData.dadosPagamento}
                    onVoltar={() => checkoutData.setEtapa('pagamento')}
                    onFinalizar={handleFinalizarCompra}
                  />
                )}
              </div>

              {/* Resumo do Pedido */}
              <div className="lg:col-span-1">
                <CheckoutSummary
                  itens={itensCarrinho}
                  subtotal={subtotal}
                  frete={frete}
                  total={total}
                />
              </div>
            </div>
          </motion.div>
        </Container>
      </main>

      <Footer />

      {/* Modal de Título de Endereço */}
      <AddressTitleModal
        isOpen={checkoutData.mostrarModalTitulo}
        titulo={checkoutData.tituloNovoEndereco}
        onChangeTitulo={checkoutData.setTituloNovoEndereco}
        onConfirmar={handleSalvarNovoEndereco}
        onCancelar={() => checkoutData.setMostrarModalTitulo(false)}
      />
    </>
  );
}
```

---

## 📊 Resultado Esperado

### Antes:
- ✗ 1 arquivo: **1.105 linhas**
- ✗ Difícil de manter
- ✗ Difícil de testar
- ✗ Código não reutilizável

### Depois:
- ✓ **11 arquivos modulares**
- ✓ `page.tsx`: ~200 linhas (orquestrador)
- ✓ Cada componente: 80-300 linhas
- ✓ Fácil de manter e testar
- ✓ Componentes reutilizáveis
- ✓ Separação clara de responsabilidades

---

## 🎯 Benefícios

1. **Manutenibilidade**: Cada arquivo tem uma responsabilidade única
2. **Testabilidade**: Componentes isolados são fáceis de testar
3. **Reutilização**: Componentes podem ser usados em outros lugares
4. **Legibilidade**: Código mais limpo e fácil de entender
5. **Performance**: Lazy loading de componentes se necessário
6. **Colaboração**: Múltiplos desenvolvedores podem trabalhar sem conflitos

---

## ⚡ Como Continuar

1. **Criar os 4 componentes de Steps** (CompradorStep, DestinatarioStep, PagamentoStep, ConfirmacaoStep)
2. **Copiar o código relevante** de cada etapa do `page.tsx` original
3. **Ajustar as props** de cada componente
4. **Refatorar o `page.tsx`** para usar os novos componentes
5. **Testar cada etapa** individualmente
6. **Remover código não utilizado**

---

## 📝 Checklist de Refatoração

- [x] Criar tipos TypeScript (`checkout.types.ts`)
- [x] Criar hook de dados (`useCheckoutData.ts`)
- [x] Criar hook de endereços (`useSavedAddresses.ts`)
- [x] Criar componente de steps (`CheckoutSteps.tsx`)
- [x] Criar componente de resumo (`CheckoutSummary.tsx`)
- [x] Criar modal de título (`AddressTitleModal.tsx`)
- [ ] Criar `CompradorStep.tsx`
- [ ] Criar `DestinatarioStep.tsx`
- [ ] Criar `PagamentoStep.tsx`
- [ ] Criar `ConfirmacaoStep.tsx`
- [ ] Refatorar `page.tsx` principal
- [ ] Testar todas as etapas
- [ ] Remover código antigo

---

**Quer que eu continue criando os componentes de Steps?** 🚀
