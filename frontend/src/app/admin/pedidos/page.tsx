'use client';

import { useState } from 'react';
import { Search, Eye, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import Input from '@/components/ui/Input';
import { useAdminOrders } from './hooks/useAdminOrders';
import Toast from '@/components/ui/Toast';

export default function AdminPedidos() {
  const { 
    orders, 
    loading, 
    error, 
    total, 
    filters, 
    handleFilterChange, 
    updateStatus 
  } = useAdminOrders();

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const success = await updateStatus(orderId, newStatus);
    if (success) {
      setToast({ show: true, message: 'Status atualizado com sucesso', type: 'success' });
    } else {
      setToast({ show: true, message: 'Erro ao atualizar status', type: 'error' });
    }
  };

  // Cores e labels dos status
  const statusConfig: Record<string, { label: string; color: string }> = {
    PENDING: { label: 'Pendente', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30' },
    PROCESSING: { label: 'Processando', color: 'bg-blue-500/10 text-blue-500 border-blue-500/30' },
    SHIPPED: { label: 'Enviado', color: 'bg-purple-500/10 text-purple-500 border-purple-500/30' },
    DELIVERED: { label: 'Entregue', color: 'bg-green-500/10 text-green-500 border-green-500/30' },
    CANCELLED: { label: 'Cancelado', color: 'bg-red-500/10 text-red-500 border-red-500/30' },
    CONFIRMED: { label: 'Confirmado', color: 'bg-blue-500/10 text-blue-500 border-blue-500/30' },
  };

  return (
    <div className="space-y-6">
      <Toast 
        isVisible={toast.show} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast(prev => ({ ...prev, show: false }))} 
      />

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
              value={filters.search || ''}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
              placeholder="Buscar por ID, cliente ou email..."
              className="w-full pl-10"
            />
          </div>

          {/* Filtro de Status */}
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-primary-white/40" />
            <select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange({ status: e.target.value })}
              className="bg-dark-bg/50 border border-dark-border rounded-sm px-4 py-2 text-sm text-primary-white focus:outline-none focus:border-primary-gold transition-colors"
            >
              <option value="">Todos os Status</option>
              <option value="PENDING">Pendente</option>
              <option value="PROCESSING">Processando</option>
              <option value="SHIPPED">Enviado</option>
              <option value="DELIVERED">Entregue</option>
              <option value="CANCELLED">Cancelado</option>
            </select>
          </div>
        </div>

        {/* Contador */}
        <div className="mt-3 text-sm text-primary-white/50">
          {loading ? 'Carregando...' : `${total} pedido${total !== 1 ? 's' : ''} encontrado${total !== 1 ? 's' : ''}`}
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
                <th className="text-left text-sm font-medium text-primary-white/60 p-4">Total</th>
                <th className="text-right text-sm font-medium text-primary-white/60 p-4">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-primary-white/40">
                    Carregando pedidos...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-primary-white/40">
                    Nenhum pedido encontrado
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-dark-bg/30 transition-colors">
                    <td className="p-4 text-sm text-primary-white font-mono">#{order.orderNumber || order.id.slice(0, 8)}</td>
                    <td className="p-4">
                      <div className="text-sm text-primary-white font-medium">
                        {order.user ? `${order.user.firstName} ${order.user.lastName}` : 'Cliente'}
                      </div>
                      <div className="text-xs text-primary-white/60">{order.user?.email}</div>
                    </td>
                    <td className="p-4 text-sm text-primary-white/60">
                      {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="p-4 text-sm text-primary-white/60">
                      {order.items?.length || 0} itens
                    </td>
                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`text-xs px-2 py-1 rounded-full border ${statusConfig[order.status]?.color || 'bg-gray-500/10 text-gray-500 border-gray-500/30'} bg-transparent cursor-pointer`}
                      >
                        {Object.keys(statusConfig).map((status) => (
                          <option key={status} value={status} className="bg-dark-card text-primary-white">
                            {statusConfig[status].label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4 text-sm text-primary-white font-medium">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(order.total))}
                    </td>
                    <td className="p-4 text-right">
                      <button className="p-2 hover:bg-primary-gold/10 text-primary-gold rounded-full transition-colors">
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
