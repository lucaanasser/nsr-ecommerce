import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Product } from '@/services/product.service';

interface FavoritesTabProps {
  favoritos: Product[];
  onRemoveFavorite: (id: string) => void;
}

/**
 * Componente da aba de produtos favoritos
 */
export default function FavoritesTab({ favoritos, onRemoveFavorite }: FavoritesTabProps) {
  if (favoritos.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center mb-6">
          <Link href="/loja">
            <Button variant="primary" className="py-2 px-6">
              Explorar Produtos
            </Button>
          </Link>
        </div>
        <div className="text-center py-12">
          <p className="text-primary-white/50 mb-4">Você ainda não tem favoritos</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {favoritos.map((produto) => (
        <div
          key={produto.id}
          className="bg-dark-card border border-dark-border rounded-sm overflow-hidden hover:border-primary-bronze transition-colors group"
        >
          <Link href={`/produto/${produto.slug}`}>
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src={produto.images?.[0]?.url || '/images/placeholder.jpg'}
                alt={produto.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </Link>
          <div className="p-4">
            <Link href={`/produto/${produto.slug}`}>
              <h3 className="font-semibold mb-2 hover:text-primary-gold transition-colors text-primary-white">
                {produto.name}
              </h3>
            </Link>
            <p className="text-primary-gold font-bold mb-3">
              R$ {produto.price.toFixed(2)}
            </p>
            <div className="flex gap-2">
              <Link
                href={`/produto/${produto.slug}`}
                className="flex-1 py-2 text-center text-xs border border-primary-gold text-primary-gold hover:bg-primary-gold hover:text-primary-black transition-colors rounded-sm uppercase tracking-wider"
              >
                Ver Produto
              </Link>
              <Button
                variant="ghost"
                onClick={() => onRemoveFavorite(produto.id)}
                className="px-3 py-2 text-xs border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white"
              >
                Remover
              </Button>
            </div>
          </div>
        </div>
      ))}
    </motion.div>
  );
}
