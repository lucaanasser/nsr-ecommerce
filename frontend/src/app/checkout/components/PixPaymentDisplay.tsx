'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Clock, QrCode } from 'lucide-react';
import Button from '@/components/ui/Button';

interface PixPaymentDisplayProps {
  pixQrCode: string;
  pixQrCodeBase64?: string;
  pixExpiresAt: Date;
  orderNumber: string;
}

/**
 * Componente para exibir QR Code PIX com countdown e funcionalidade de cópia
 */
export default function PixPaymentDisplay({
  pixQrCode,
  pixQrCodeBase64,
  pixExpiresAt,
  orderNumber,
}: PixPaymentDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  // Atualizar countdown a cada segundo
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const expiresTime = new Date(pixExpiresAt).getTime();
      const distance = expiresTime - now;

      if (distance < 0) {
        setTimeRemaining('Expirado');
        return;
      }

      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    };

    // Atualizar imediatamente
    updateCountdown();

    // Atualizar a cada segundo
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [pixExpiresAt]);

  // Copiar código PIX
  const handleCopyPixCode = async () => {
    try {
      await navigator.clipboard.writeText(pixQrCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      console.error('Erro ao copiar código PIX:', error);
      // Fallback: selecionar o texto automaticamente
      const textarea = document.querySelector('textarea');
      if (textarea) {
        textarea.select();
      }
    }
  };

  const isExpired = timeRemaining === 'Expirado';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-dark-card border border-dark-border rounded-lg p-6 md:p-8"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-bronze-500/10 flex items-center justify-center">
            <QrCode className="w-6 h-6 text-bronze-500" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Pagamento via PIX
        </h2>
        <p className="text-gray-400">
          Pedido <span className="text-bronze-500 font-mono">#{orderNumber}</span>
        </p>
      </div>

      {/* Countdown Timer */}
      <div className="flex items-center justify-center gap-2 mb-6 p-4 bg-dark-bg rounded-lg border border-dark-border">
        <Clock className={`w-5 h-5 ${isExpired ? 'text-red-500' : 'text-bronze-500'}`} />
        <span className={`text-lg font-mono font-semibold ${isExpired ? 'text-red-500' : 'text-white'}`}>
          {timeRemaining}
        </span>
        {!isExpired && (
          <span className="text-gray-400 text-sm ml-2">para pagar</span>
        )}
      </div>

      {isExpired ? (
        // Mensagem de expirado
        <div className="text-center py-8">
          <p className="text-red-500 font-semibold mb-4">
            Este código PIX expirou
          </p>
          <p className="text-gray-400 text-sm mb-6">
            Por favor, faça um novo pedido para gerar um novo código PIX
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="mx-auto px-6 py-3 bg-dark-border hover:bg-dark-border/80 text-white rounded-lg transition-colors"
          >
            Voltar para a Loja
          </button>
        </div>
      ) : (
        <>
          {/* QR Code Image */}
          {pixQrCodeBase64 && (
            <div className="flex justify-center mb-6">
              <div className="bg-white p-4 rounded-lg">
                <img
                  src={pixQrCodeBase64}
                  alt="QR Code PIX"
                  className="w-64 h-64 object-contain"
                />
              </div>
            </div>
          )}

          {/* Instruções */}
          <div className="mb-6 space-y-3">
            <p className="text-gray-300 text-center text-sm">
              Escaneie o QR Code acima ou copie o código abaixo para pagar via PIX
            </p>
          </div>

          {/* Código PIX */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Código PIX
            </label>
            <div className="relative">
              <textarea
                readOnly
                value={pixQrCode}
                className="w-full bg-dark-bg border border-dark-border rounded-lg p-4 text-white font-mono text-xs resize-none focus:outline-none focus:ring-2 focus:ring-bronze-500/50"
                rows={4}
                onClick={(e) => e.currentTarget.select()}
              />
            </div>
          </div>

          {/* Botão de Copiar */}
          <Button
            onClick={handleCopyPixCode}
            variant={copied ? 'secondary' : 'primary'}
            className="w-full"
            disabled={copied}
          >
            {copied ? (
              <>
                <Check className="w-5 h-5 mr-2" />
                Código Copiado!
              </>
            ) : (
              <>
                <Copy className="w-5 h-5 mr-2" />
                Copiar Código PIX
              </>
            )}
          </Button>

          {/* Informações Adicionais */}
          <div className="mt-6 pt-6 border-t border-dark-border">
            <p className="text-gray-400 text-sm text-center mb-4">
              Após o pagamento, você receberá a confirmação por e-mail
            </p>
            <div className="bg-bronze-500/5 border border-bronze-500/20 rounded-lg p-4">
              <p className="text-bronze-500 text-xs text-center">
                💡 O pagamento via PIX é processado instantaneamente.
                Seu pedido será confirmado assim que identificarmos o pagamento.
              </p>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}
