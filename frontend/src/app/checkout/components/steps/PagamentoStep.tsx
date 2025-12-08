'use client';

/**
 * Etapa 3: Dados de Pagamento
 * Suporta PIX e Cartão de Crédito com criptografia PagBank
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, QrCode, AlertCircle, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import type { DadosPagamento } from '@/types/checkout.types';
import { pagbankService } from '@/services/pagbank.service';

interface PagamentoStepProps {
  dadosPagamento: DadosPagamento;
  setDadosPagamento: (dados: DadosPagamento | ((prev: DadosPagamento) => DadosPagamento)) => void;
  onSubmit: (e: React.FormEvent) => void;
  onVoltar: () => void;
}

export default function PagamentoStep({
  dadosPagamento,
  setDadosPagamento,
  onSubmit,
  onVoltar,
}: PagamentoStepProps) {
  const [sdkLoading, setSdkLoading] = useState(true);
  const [sdkError, setSdkError] = useState<string | null>(null);
  const [cardBrand, setCardBrand] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Carregar SDK do PagBank
  useEffect(() => {
    const loadSDK = async () => {
      try {
        await pagbankService.loadSDK();
        setSdkLoading(false);
      } catch (error) {
        console.error('Erro ao carregar SDK:', error);
        setSdkError('Erro ao carregar sistema de pagamento. Tente novamente.');
        setSdkLoading(false);
      }
    };

    loadSDK();
  }, []);

  // Detectar bandeira do cartão conforme digita
  useEffect(() => {
    if (dadosPagamento.metodo === 'credit_card' && dadosPagamento.numeroCartao) {
      const brand = pagbankService.getCardBrand(dadosPagamento.numeroCartao);
      setCardBrand(brand);
    } else {
      setCardBrand(null);
    }
  }, [dadosPagamento.numeroCartao, dadosPagamento.metodo]);

  const handleCardNumberChange = (value: string) => {
    // Remove tudo exceto números
    const numbers = value.replace(/\D/g, '');
    // Limita a 16 dígitos
    const limited = numbers.slice(0, 16);
    // Formata com espaços
    const formatted = pagbankService.formatCardNumber(limited);
    
    setDadosPagamento({ ...dadosPagamento, numeroCartao: formatted });
    
    // Limpar erro se houver
    if (errors.numeroCartao) {
      setErrors({ ...errors, numeroCartao: '' });
    }
  };

  const handleExpiryChange = (value: string) => {
    // Remove tudo exceto números
    let numbers = value.replace(/\D/g, '');
    
    // Adiciona barra automaticamente após 2 dígitos
    if (numbers.length >= 2) {
      numbers = numbers.slice(0, 2) + '/' + numbers.slice(2, 4);
    }
    
    setDadosPagamento({ ...dadosPagamento, validade: numbers });
    
    // Limpar erro se houver
    if (errors.validade) {
      setErrors({ ...errors, validade: '' });
    }
  };

  const handleCPFChange = (value: string) => {
    // Remove tudo exceto números
    const numbers = value.replace(/\D/g, '');
    // Limita a 11 dígitos
    const limited = numbers.slice(0, 11);
    // Formata CPF
    const formatted = limited.length === 11 ? pagbankService.formatCPF(limited) : limited;
    
    setDadosPagamento({ ...dadosPagamento, cpfTitular: formatted });
    
    // Limpar erro se houver
    if (errors.cpfTitular) {
      setErrors({ ...errors, cpfTitular: '' });
    }
  };

  const handleCVVChange = (value: string) => {
    // Remove tudo exceto números
    const numbers = value.replace(/\D/g, '');
    setDadosPagamento({ ...dadosPagamento, cvv: numbers });
    
    // Limpar erro se houver
    if (errors.cvv) {
      setErrors({ ...errors, cvv: '' });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (dadosPagamento.metodo === 'credit_card') {
      // Validar número do cartão
      if (!dadosPagamento.numeroCartao) {
        newErrors.numeroCartao = 'Número do cartão é obrigatório';
      } else if (!pagbankService.validateCardNumber(dadosPagamento.numeroCartao)) {
        newErrors.numeroCartao = 'Número do cartão inválido';
      }

      // Validar nome
      if (!dadosPagamento.nomeCartao) {
        newErrors.nomeCartao = 'Nome no cartão é obrigatório';
      } else if (dadosPagamento.nomeCartao.length < 3) {
        newErrors.nomeCartao = 'Nome muito curto';
      }

      // Validar validade
      if (!dadosPagamento.validade) {
        newErrors.validade = 'Validade é obrigatória';
      } else {
        const [month, year] = dadosPagamento.validade.split('/');
        const monthNum = parseInt(month, 10);
        const yearNum = parseInt('20' + year, 10);
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;

        if (!month || !year || month.length !== 2 || year.length !== 2) {
          newErrors.validade = 'Formato inválido (MM/AA)';
        } else if (monthNum < 1 || monthNum > 12) {
          newErrors.validade = 'Mês inválido';
        } else if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
          newErrors.validade = 'Cartão expirado';
        }
      }

      // Validar CVV
      if (!dadosPagamento.cvv) {
        newErrors.cvv = 'CVV é obrigatório';
      } else if (dadosPagamento.cvv.length < 3 || dadosPagamento.cvv.length > 4) {
        newErrors.cvv = 'CVV deve ter 3 ou 4 dígitos';
      }

      // Validar CPF
      if (!dadosPagamento.cpfTitular) {
        newErrors.cpfTitular = 'CPF do titular é obrigatório';
      } else if (!pagbankService.validateCPF(dadosPagamento.cpfTitular)) {
        newErrors.cpfTitular = 'CPF inválido';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit(e);
  };

  return (
    <div className="bg-dark-card border border-dark-border p-6 rounded-sm">
      <div className="flex items-center gap-3 mb-6">
        <CreditCard className="text-primary-bronze" size={24} />
        <h2 className="text-2xl font-semibold">Forma de Pagamento</h2>
      </div>

      {sdkError && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-sm flex items-start gap-3">
          <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
          <div className="text-sm text-red-400">{sdkError}</div>
        </div>
      )}

      {sdkLoading && (
        <div className="mb-6 p-4 bg-primary-bronze/10 border border-primary-bronze/30 rounded-sm flex items-center gap-3">
          <Loader2 className="text-primary-bronze animate-spin" size={20} />
          <div className="text-sm text-primary-white/70">Carregando sistema de pagamento...</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Seletor de Método de Pagamento */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setDadosPagamento({ ...dadosPagamento, metodo: 'pix' })}
            className={`p-4 border-2 rounded-sm transition-all ${
              dadosPagamento.metodo === 'pix'
                ? 'border-primary-bronze bg-primary-bronze/10'
                : 'border-dark-border hover:border-primary-bronze/50'
            }`}
          >
            <QrCode className="mx-auto mb-2" size={32} />
            <div className="font-semibold">PIX</div>
            <div className="text-xs text-primary-white/60 mt-1">Pagamento instantâneo</div>
          </button>

          <button
            type="button"
            onClick={() => setDadosPagamento({ ...dadosPagamento, metodo: 'credit_card' })}
            className={`p-4 border-2 rounded-sm transition-all ${
              dadosPagamento.metodo === 'credit_card'
                ? 'border-primary-bronze bg-primary-bronze/10'
                : 'border-dark-border hover:border-primary-bronze/50'
            }`}
            disabled={sdkLoading || !!sdkError}
          >
            <CreditCard className="mx-auto mb-2" size={32} />
            <div className="font-semibold">Cartão de Crédito</div>
            <div className="text-xs text-primary-white/60 mt-1">Aprovação imediata</div>
          </button>
        </div>

        {/* Formulário PIX */}
        {dadosPagamento.metodo === 'pix' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-primary-bronze/5 border border-primary-bronze/20 rounded-sm"
          >
            <div className="flex items-start gap-3">
              <QrCode className="text-primary-bronze flex-shrink-0 mt-1" size={24} />
              <div className="text-sm text-primary-white/80">
                <p className="font-semibold mb-2">Como funciona o PIX:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Você terá <strong>15 minutos</strong> para pagar após confirmar o pedido</li>
                  <li>Estoque será reservado durante esse período</li>
                  <li>Após o pagamento, seu pedido será confirmado automaticamente</li>
                  <li>Se não pagar em 15 minutos, o pedido continua disponível por 24h</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {/* Formulário Cartão de Crédito */}
        {dadosPagamento.metodo === 'credit_card' && !sdkLoading && !sdkError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <div>
              <Input
                type="text"
                placeholder="Número do Cartão"
                required
                value={dadosPagamento.numeroCartao}
                onChange={(e) => handleCardNumberChange(e.target.value)}
                className="bg-dark-bg/50"
                maxLength={19}
              />
              {errors.numeroCartao && (
                <p className="text-red-400 text-sm mt-1">{errors.numeroCartao}</p>
              )}
              {cardBrand && (
                <p className="text-primary-bronze text-sm mt-1 capitalize">{cardBrand}</p>
              )}
            </div>

            <div>
              <Input
                type="text"
                placeholder="Nome no Cartão"
                required
                value={dadosPagamento.nomeCartao}
                onChange={(e) =>
                  setDadosPagamento({ ...dadosPagamento, nomeCartao: e.target.value.toUpperCase() })
                }
                className="bg-dark-bg/50"
              />
              {errors.nomeCartao && (
                <p className="text-red-400 text-sm mt-1">{errors.nomeCartao}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Input
                  type="text"
                  placeholder="Validade (MM/AA)"
                  required
                  value={dadosPagamento.validade}
                  onChange={(e) => handleExpiryChange(e.target.value)}
                  className="bg-dark-bg/50"
                  maxLength={5}
                />
                {errors.validade && (
                  <p className="text-red-400 text-sm mt-1">{errors.validade}</p>
                )}
              </div>
              <div>
                <Input
                  type="text"
                  placeholder="CVV"
                  required
                  value={dadosPagamento.cvv}
                  onChange={(e) => handleCVVChange(e.target.value)}
                  className="bg-dark-bg/50"
                  maxLength={4}
                />
                {errors.cvv && <p className="text-red-400 text-sm mt-1">{errors.cvv}</p>}
              </div>
            </div>

            <div>
              <Input
                type="text"
                placeholder="CPF do Titular"
                required
                value={dadosPagamento.cpfTitular}
                onChange={(e) => handleCPFChange(e.target.value)}
                className="bg-dark-bg/50"
                maxLength={14}
              />
              {errors.cpfTitular && (
                <p className="text-red-400 text-sm mt-1">{errors.cpfTitular}</p>
              )}
            </div>

            <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-sm text-sm text-blue-400">
              <p className="font-semibold mb-1">🔒 Pagamento Seguro</p>
              <p>Seus dados são criptografados e não são armazenados em nossos servidores.</p>
            </div>
          </motion.div>
        )}

        <div className="flex gap-3 mt-6">
          <Button variant="secondary" onClick={onVoltar} className="flex-1" type="button">
            Voltar
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={sdkLoading || (dadosPagamento.metodo === 'credit_card' && !!sdkError)}
          >
            Revisar Pedido
          </Button>
        </div>
      </form>
    </div>
  );
}