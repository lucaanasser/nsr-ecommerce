/**
 * Etapa 4: Confirmação do Pedido
 * Revisão final dos dados antes de finalizar a compra
 */

import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import type { DadosComprador, DadosDestinatario, DadosEntrega, DadosPagamento } from '@/types/checkout.types';

interface ConfirmacaoStepProps {
  dadosComprador: DadosComprador;
  dadosDestinatario: DadosDestinatario;
  destinatarioIgualComprador: boolean;
  dadosEntrega: DadosEntrega;
  dadosPagamento: DadosPagamento;
  onVoltar: () => void;
  onFinalizar: () => void;
  processando?: boolean;
}

export default function ConfirmacaoStep({
  dadosComprador,
  dadosDestinatario,
  destinatarioIgualComprador,
  dadosEntrega,
  dadosPagamento,
  onVoltar,
  onFinalizar,
  processando = false
}: ConfirmacaoStepProps) {
  // Determinar de onde vêm os dados do destinatário
  const receiverName = destinatarioIgualComprador 
    ? `${dadosComprador.nome} ${dadosComprador.sobrenome}`
    : dadosDestinatario.nomeCompleto;
    
  const receiverPhone = destinatarioIgualComprador
    ? dadosComprador.telefone
    : dadosDestinatario.telefone;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-dark-card border border-dark-border p-6 rounded-sm"
    >
      <h2 className="text-2xl font-semibold mb-6">Confirme seu Pedido</h2>

      <div className="space-y-6">
        {/* Dados de Entrega */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-primary-bronze">Entrega</h3>
          <div className="text-sm text-primary-white/70 space-y-1">
            <p>{receiverName}</p>
            <p>{receiverPhone}</p>
            <p className="mt-2">
              {dadosEntrega.endereco}, {dadosEntrega.numero}
              {dadosEntrega.complemento && ` - ${dadosEntrega.complemento}`}
            </p>
            <p>{dadosEntrega.bairro}</p>
            <p>{dadosEntrega.cidade} - {dadosEntrega.estado}</p>
            <p>CEP: {dadosEntrega.cep}</p>
          </div>
        </div>

        {/* Dados de Pagamento */}
        <div className="border-t border-dark-border pt-4">
          <h3 className="text-lg font-semibold mb-3 text-primary-bronze">Pagamento</h3>
          <div className="text-sm text-primary-white/70">
            {dadosPagamento.metodo === 'pix' ? (
              <>
                <p className="font-semibold">PIX</p>
                <p className="text-xs text-primary-white/50 mt-1">
                  QR Code será gerado após confirmar o pedido
                </p>
              </>
            ) : (
              <>
                <p>Cartão terminado em {dadosPagamento.numeroCartao.slice(-4)}</p>
                <p>{dadosPagamento.nomeCartao}</p>
              </>
            )}
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-3 mt-6">
          <Button
            variant="secondary"
            onClick={onVoltar}
            className="flex-1"
            disabled={processando}
          >
            Voltar
          </Button>
          <Button
            onClick={onFinalizar}
            className="flex-1"
            disabled={processando}
          >
            {processando ? 'Processando...' : 'Finalizar Compra'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
