import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

interface Order {
  id: string;
  orderNumber?: string;
  createdAt: string;
  total?: number;
  status: string;
}

interface OrdersTabProps {
  pedidos: Order[];
  isLoading: boolean;
}

/**
 * Componente da aba de pedidos do usuário
 */
export default function OrdersTab({ pedidos, isLoading }: OrdersTabProps) {
  const router = useRouter();

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center py-8 text-primary-white/50"
      >
        Carregando pedidos...
      </motion.div>
    );
  }

  if (pedidos.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center py-8 text-primary-white/50"
      >
        Nenhum pedido encontrado.
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {pedidos.map((pedido) => (
        <div
          key={pedido.id}
          className="bg-dark-card border border-dark-border p-6 rounded-sm hover:border-primary-bronze transition-colors"
        >
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div>
              <p className="text-primary-bronze font-semibold text-lg">
                {pedido.orderNumber || pedido.id}
              </p>
              <p className="text-primary-white/50 text-sm mt-1">
                Data: {new Date(pedido.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-primary-white font-semibold">
                R$ {pedido.total ? Number(pedido.total).toFixed(2) : '-'}
              </p>
              <p
                className={`text-sm mt-1 ${
                  pedido.status === 'DELIVERED' ? 'text-green-500' : 'text-primary-gold'
                }`}
              >
                {pedido.status}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="mt-4 text-sm text-primary-bronze hover:underline p-0"
            onClick={() => router.push(`/pedidos/${pedido.id}`)}
          >
            Ver detalhes →
          </Button>
        </div>
      ))}
    </motion.div>
  );
}
