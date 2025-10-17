'use client';

import { Package, ShoppingCart, Users, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import StatCard from '@/components/admin/StatCard';
import { dashboardStats, dailySales, mockOrders, mockStock } from '@/data/adminData';
import { motion } from 'framer-motion';

/**
 * Dashboard Administrativo
 * Página inicial do painel admin com métricas e visão geral
 */
export default function AdminDashboard() {
  // Filtra produtos com estoque baixo
  const lowStockItems = mockStock.filter(item => item.quantity <= item.minStock);
  
  // Pega os últimos 5 pedidos
  const recentOrders = mockOrders.slice(0, 5);

  // Status colors
  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30',
    processing: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
    shipped: 'bg-purple-500/10 text-purple-500 border-purple-500/30',
    delivered: 'bg-green-500/10 text-green-500 border-green-500/30',
    cancelled: 'bg-red-500/10 text-red-500 border-red-500/30',
  };

  const statusLabels: Record<string, string> = {
    pending: 'Pendente',
    processing: 'Processando',
    shipped: 'Enviado',
    delivered: 'Entregue',
    cancelled: 'Cancelado',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary-white mb-2">Dashboard</h1>
        <p className="text-primary-white/60">Bem-vindo ao painel administrativo NSR</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Vendas do Mês"
          value={`R$ ${dashboardStats.totalSales.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          icon={DollarSign}
          trend={dashboardStats.trends.sales}
          color="gold"
        />
        <StatCard
          title="Total de Pedidos"
          value={dashboardStats.totalOrders}
          icon={ShoppingCart}
          trend={dashboardStats.trends.orders}
          color="blue"
        />
        <StatCard
          title="Produtos Ativos"
          value={dashboardStats.totalProducts}
          icon={Package}
          color="bronze"
        />
        <StatCard
          title="Clientes"
          value={dashboardStats.totalCustomers}
          icon={Users}
          trend={dashboardStats.trends.customers}
          color="green"
        />
      </div>

      {/* Charts and Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vendas Diárias */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-dark-card/50 backdrop-blur-sm border border-dark-border rounded-sm p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="text-primary-gold" size={20} />
            <h2 className="text-lg font-semibold text-primary-white">Vendas dos Últimos 7 Dias</h2>
          </div>
          
          <div className="space-y-3">
            {dailySales.map((item, index) => {
              const maxSales = Math.max(...dailySales.map(d => d.sales));
              const percentage = (item.sales / maxSales) * 100;
              
              return (
                <div key={index}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-primary-white/60">{item.day}</span>
                    <span className="text-primary-white font-medium">
                      R$ {item.sales.toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <div className="w-full bg-dark-bg rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                      className="bg-gradient-to-r from-primary-gold to-primary-bronze h-2 rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Alertas de Estoque Baixo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-dark-card/50 backdrop-blur-sm border border-dark-border rounded-sm p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <AlertCircle className="text-yellow-500" size={20} />
            <h2 className="text-lg font-semibold text-primary-white">Estoque Baixo</h2>
          </div>
          
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {lowStockItems.length > 0 ? (
              lowStockItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-dark-bg/50 rounded-sm border border-yellow-500/20"
                >
                  <div>
                    <p className="text-sm font-medium text-primary-white">{item.productName}</p>
                    <p className="text-xs text-primary-white/50">Tamanho: {item.size}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-yellow-500">{item.quantity} un.</p>
                    <p className="text-xs text-primary-white/50">Mín: {item.minStock}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-primary-white/50 text-center py-8">
                Nenhum produto com estoque baixo
              </p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Últimos Pedidos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-dark-card/50 backdrop-blur-sm border border-dark-border rounded-sm p-6"
      >
        <h2 className="text-lg font-semibold text-primary-white mb-6">Últimos Pedidos</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="text-left text-sm font-medium text-primary-white/60 pb-3">ID</th>
                <th className="text-left text-sm font-medium text-primary-white/60 pb-3">Cliente</th>
                <th className="text-left text-sm font-medium text-primary-white/60 pb-3">Data</th>
                <th className="text-left text-sm font-medium text-primary-white/60 pb-3">Status</th>
                <th className="text-right text-sm font-medium text-primary-white/60 pb-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, index) => (
                <tr key={index} className="border-b border-dark-border/50 hover:bg-dark-bg/50 transition-colors">
                  <td className="py-4 text-sm text-primary-white font-mono">{order.id}</td>
                  <td className="py-4 text-sm text-primary-white">{order.customerName}</td>
                  <td className="py-4 text-sm text-primary-white/60">
                    {new Date(order.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="py-4">
                    <span className={`inline-block px-2 py-1 rounded-sm text-xs font-medium border ${statusColors[order.status]}`}>
                      {statusLabels[order.status]}
                    </span>
                  </td>
                  <td className="py-4 text-sm text-primary-white font-semibold text-right">
                    R$ {order.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
