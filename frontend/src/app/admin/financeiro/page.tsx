'use client';

import { DollarSign, TrendingUp, ShoppingBag, CreditCard } from 'lucide-react';
import StatCard from '@/components/admin/StatCard';
import { motion } from 'framer-motion';
import { useDashboardStats } from './hooks/useDashboardStats';

/**
 * Dashboard Financeiro
 * Visão geral financeira
 */
export default function FinanceiroDashboard() {
  const { stats, loading, error } = useDashboardStats();

  if (loading) {
    return <div className="text-primary-white/60 p-6">Carregando estatísticas...</div>;
  }

  if (error || !stats) {
    return <div className="text-red-500 p-6">Erro ao carregar dados: {error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary-white mb-2">Financeiro</h1>
        <p className="text-primary-white/60">Visão geral de vendas e pedidos</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Receita Total"
          value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.revenue.total)}
          icon={DollarSign}
          color="gold"
        />
        <StatCard
          title="Receita Mensal"
          value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.revenue.monthly)}
          icon={TrendingUp}
          color="green"
          trend={{
            value: Number(stats.revenue.growth.toFixed(1)),
            isPositive: stats.revenue.growth >= 0
          }}
        />
        <StatCard
          title="Pedidos Totais"
          value={stats.orders.total.toString()}
          icon={ShoppingBag}
          color="blue"
        />
        <StatCard
          title="Ticket Médio"
          value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.averageTicket)}
          icon={CreditCard}
          color="bronze"
        />
      </div>

      {/* Recent Orders Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-dark-card/50 backdrop-blur-sm border border-dark-border rounded-sm p-6"
      >
        <h2 className="text-lg font-semibold text-primary-white mb-4">Vendas Recentes</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-primary-white/60 border-b border-dark-border">
                <th className="pb-3">Cliente</th>
                <th className="pb-3">Data</th>
                <th className="pb-3">Valor</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {stats.recentOrders.map((order) => (
                <tr key={order.id} className="text-sm">
                  <td className="py-3 text-primary-white">
                    {order.user ? `${order.user.firstName} ${order.user.lastName}` : 'Cliente'}
                  </td>
                  <td className="py-3 text-primary-white/60">
                    {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="py-3 text-primary-white font-medium">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(order.total))}
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      order.paymentStatus === 'PAID' || order.status === 'DELIVERED' ? 'bg-green-500/10 text-green-500' :
                      order.status === 'CANCELLED' ? 'bg-red-500/10 text-red-500' :
                      'bg-yellow-500/10 text-yellow-500'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
