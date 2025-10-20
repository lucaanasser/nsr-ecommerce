/**
 * Etapa 3: Dados de Pagamento
 * Formulário para inserir dados do cartão de crédito
 */

import { motion } from 'framer-motion';
import { CreditCard } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import type { DadosPagamento } from '@/types/checkout.types';

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
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-dark-card border border-dark-border p-6 rounded-sm"
    >
      <div className="flex items-center gap-3 mb-6">
        <CreditCard className="text-primary-bronze" size={24} />
        <h2 className="text-2xl font-semibold">Dados de Pagamento</h2>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          type="text"
          placeholder="Número do Cartão"
          required
          value={dadosPagamento.numeroCartao}
          onChange={(e) => setDadosPagamento({ ...dadosPagamento, numeroCartao: e.target.value })}
          className="bg-dark-bg/50"
          maxLength={19}
        />

        <Input
          type="text"
          placeholder="Nome no Cartão"
          required
          value={dadosPagamento.nomeCartao}
          onChange={(e) => setDadosPagamento({ ...dadosPagamento, nomeCartao: e.target.value })}
          className="bg-dark-bg/50"
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            type="text"
            placeholder="Validade (MM/AA)"
            required
            value={dadosPagamento.validade}
            onChange={(e) => setDadosPagamento({ ...dadosPagamento, validade: e.target.value })}
            className="bg-dark-bg/50"
            maxLength={5}
          />
          <Input
            type="text"
            placeholder="CVV"
            required
            value={dadosPagamento.cvv}
            onChange={(e) => setDadosPagamento({ ...dadosPagamento, cvv: e.target.value })}
            className="bg-dark-bg/50"
            maxLength={4}
          />
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            variant="secondary"
            onClick={onVoltar}
            className="flex-1"
          >
            Voltar
          </Button>
          <Button type="submit" className="flex-1">
            Revisar Pedido
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
