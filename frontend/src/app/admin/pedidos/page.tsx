'use client';

import { useState } from 'react';
import { Search, Eye, Filter } from 'lucide-react';
import { mockOrders } from '@/data/adminData';
import { motion } from 'framer-motion';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

/**
 * Página de Gestão de Pedidos
 * Listagem, filtros e visualização de pedidos
 */
export default function AdminPedidos() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  // Filtrar pedidos
  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'todos' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Cores e labels dos status
  const statusConfig: Record<string, { label: string; color: string }> = {
    pending: { label: 'Pendente', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30' },
    processing: { label: 'Processando', color: 'bg-blue-500/10 text-blue-500 border-blue-500/30' },
    shipped: { label: 'Enviado', color: 'bg-purple-500/10 text-purple-500 border-purple-500/30' },
    delivered: { label: 'Entregue', color: 'bg-green-500/10 text-green-500 border-green-500/30' },
    cancelled: { label: 'Cancelado', color: 'bg-red-500/10 text-red-500 border-red-500/30' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary-white mb-2">Pedidos</h1>
        <p className="text-primary-white/60">Gerencie todos os pedidos da loja</p>
      </div>

      {/* Filtros */}
      <div className="bg-dark-card/50 backdrop-blur-sm border border-dark-border rounded-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Busca */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-white/40 z-10" size={18} />
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por ID, cliente ou email..."
              className="w-full pl-10"
            />
          </div>

          {/* Filtro de Status */}
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-primary-white/40" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-dark-bg/50 border border-dark-border rounded-sm px-4 py-2 text-sm text-primary-white focus:outline-none focus:border-primary-gold transition-colors"
            >
              <option value="todos">Todos os Status</option>
              <option value="pending">Pendente</option>
              <option value="processing">Processando</option>
              <option value="shipped">Enviado</option>
              <option value="delivered">Entregue</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>
        </div>

        {/* Contador */}
        <div className="mt-3 text-sm text-primary-white/50">
          {filteredOrders.length} pedido{filteredOrders.length !== 1 ? 's' : ''} encontrado{filteredOrders.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Tabela de Pedidos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-dark-card/50 backdrop-blur-sm border border-dark-border rounded-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-bg/50">
              <tr className="border-b border-dark-border">
                <th className="text-left text-sm font-medium text-primary-white/60 p-4">ID do Pedido</th>
                <th className="text-left text-sm font-medium text-primary-white/60 p-4">Cliente</th>
                <th className="text-left text-sm font-medium text-primary-white/60 p-4">Data</th>
                <th className="text-left text-sm font-medium text-primary-white/60 p-4">Items</th>
                <th className="text-left text-sm font-medium text-primary-white/60 p-4">Status</th>
                <th className="text-right text-sm font-medium text-primary-white/60 p-4">Total</th>
                <th className="text-right text-sm font-medium text-primary-white/60 p-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-dark-border/50 hover:bg-dark-bg/30 transition-colors"
                >
                  <td className="p-4">
                    <span className="text-sm font-mono font-medium text-primary-white">{order.id}</span>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="text-sm font-medium text-primary-white">{order.customerName}</p>
                      <p className="text-xs text-primary-white/50">{order.customerEmail}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-primary-white/80">
                      {new Date(order.date).toLocaleDateString('pt-BR')}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-primary-white/60">
                      {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-block px-2 py-1 rounded-sm text-xs font-medium border ${statusConfig[order.status].color}`}>
                      {statusConfig[order.status].label}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <span className="text-sm font-semibold text-primary-gold">
                      R$ {order.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost"
                        className="p-2 text-primary-white/60 hover:text-blue-500 hover:bg-blue-500/10"
                        title="Ver detalhes"
                      >
                        <Eye size={16} />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-primary-white/50">Nenhum pedido encontrado</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
