import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

/**
 * Componente da aba de formas de pagamento (mockado)
 */
export default function PaymentTab() {
  const cartoes: any[] = []; // Mockado por enquanto

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-6">
        <Button variant="primary" className="py-2 px-6">
          + Adicionar Cartão
        </Button>
      </div>

      {cartoes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-primary-white/50 mb-4">Você ainda não tem cartões cadastrados</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cartoes.map((cartao) => (
            <div
              key={cartao.id}
              className="bg-dark-card border border-dark-border p-6 rounded-sm hover:border-primary-bronze transition-colors relative"
            >
              {cartao.principal && (
                <span className="absolute top-4 right-4 text-xs bg-primary-bronze text-dark-bg px-2 py-1 rounded-sm">
                  Principal
                </span>
              )}
              <p className="text-primary-white/50 text-xs mb-2">{cartao.bandeira}</p>
              <p className="text-primary-white font-mono text-lg mb-2">{cartao.numero}</p>
              <p className="text-primary-white/70 text-sm mb-4">{cartao.nome}</p>
              <div className="flex gap-3">
                <Button variant="ghost" className="text-sm text-primary-bronze hover:underline p-0">
                  Editar
                </Button>
                <Button variant="ghost" className="text-sm text-red-500 hover:underline p-0">
                  Remover
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
