'use client';

import { useState } from 'react';
import { Search, Eye, Mail, Phone } from 'lucide-react';
import { mockCustomers } from '@/data/adminData';
import { motion } from 'framer-motion';

/**
 * Página de Gestão de Usuários/Clientes
 * Listagem e informações dos clientes
 */
export default function AdminUsuarios() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'active' | 'inactive'>('todos');

  // Filtrar clientes
  const filteredCustomers = mockCustomers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'todos' || customer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Estatísticas
  const totalActive = mockCustomers.filter(c => c.status === 'active').length;
  const totalInactive = mockCustomers.filter(c => c.status === 'inactive').length;
  const totalRevenue = mockCustomers.reduce((sum, c) => sum + c.totalSpent, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary-white mb-2">Clientes</h1>
        <p className="text-primary-white/60">Gerencie todos os clientes cadastrados</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-dark-card/50 backdrop-blur-sm border border-dark-border rounded-sm p-4">
          <p className="text-sm text-primary-white/60 mb-1">Clientes Ativos</p>
          <p className="text-2xl font-bold text-green-500">{totalActive}</p>
        </div>
        <div className="bg-dark-card/50 backdrop-blur-sm border border-dark-border rounded-sm p-4">
          <p className="text-sm text-primary-white/60 mb-1">Clientes Inativos</p>
          <p className="text-2xl font-bold text-primary-white/60">{totalInactive}</p>
        </div>
        <div className="bg-dark-card/50 backdrop-blur-sm border border-dark-border rounded-sm p-4">
          <p className="text-sm text-primary-white/60 mb-1">Receita Total</p>
          <p className="text-2xl font-bold text-primary-gold">
            R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-dark-card/50 backdrop-blur-sm border border-dark-border rounded-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Busca */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-white/40" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome, email ou telefone..."
              className="w-full bg-dark-bg/50 border border-dark-border rounded-sm pl-10 pr-4 py-2 text-sm text-primary-white placeholder:text-primary-white/40 focus:outline-none focus:border-primary-gold transition-colors"
            />
          </div>

          {/* Filtro de Status */}
          <div className="flex gap-2">
            <button
              onClick={() => setStatusFilter('todos')}
              className={`px-4 py-2 rounded-sm text-sm font-medium transition-all ${
                statusFilter === 'todos'
                  ? 'bg-primary-gold text-dark-bg'
                  : 'bg-dark-bg/50 text-primary-white/60 hover:text-primary-white border border-dark-border'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-4 py-2 rounded-sm text-sm font-medium transition-all ${
                statusFilter === 'active'
                  ? 'bg-green-500 text-white'
                  : 'bg-dark-bg/50 text-primary-white/60 hover:text-primary-white border border-dark-border'
              }`}
            >
              Ativos
            </button>
            <button
              onClick={() => setStatusFilter('inactive')}
              className={`px-4 py-2 rounded-sm text-sm font-medium transition-all ${
                statusFilter === 'inactive'
                  ? 'bg-primary-white/20 text-white'
                  : 'bg-dark-bg/50 text-primary-white/60 hover:text-primary-white border border-dark-border'
              }`}
            >
              Inativos
            </button>
          </div>
        </div>

        {/* Contador */}
        <div className="mt-3 text-sm text-primary-white/50">
          {filteredCustomers.length} cliente{filteredCustomers.length !== 1 ? 's' : ''} encontrado{filteredCustomers.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Tabela de Clientes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-dark-card/50 backdrop-blur-sm border border-dark-border rounded-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-bg/50">
              <tr className="border-b border-dark-border">
                <th className="text-left text-sm font-medium text-primary-white/60 p-4">Cliente</th>
                <th className="text-left text-sm font-medium text-primary-white/60 p-4">Contato</th>
                <th className="text-left text-sm font-medium text-primary-white/60 p-4">Cadastrado em</th>
                <th className="text-center text-sm font-medium text-primary-white/60 p-4">Pedidos</th>
                <th className="text-right text-sm font-medium text-primary-white/60 p-4">Total Gasto</th>
                <th className="text-center text-sm font-medium text-primary-white/60 p-4">Status</th>
                <th className="text-right text-sm font-medium text-primary-white/60 p-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer, index) => (
                <motion.tr
                  key={customer.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-dark-border/50 hover:bg-dark-bg/30 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-gold/20 border border-primary-gold flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-semibold text-primary-gold">
                          {customer.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-primary-white">{customer.name}</p>
                        <p className="text-xs text-primary-white/50 font-mono">{customer.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-primary-white/80">
                        <Mail size={14} className="text-primary-white/40" />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-primary-white/60">
                        <Phone size={14} className="text-primary-white/40" />
                        {customer.phone}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-primary-white/80">
                      {new Date(customer.registeredAt).toLocaleDateString('pt-BR')}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="text-sm font-semibold text-primary-white">{customer.totalOrders}</span>
                  </td>
                  <td className="p-4 text-right">
                    <span className="text-sm font-semibold text-primary-gold">
                      R$ {customer.totalSpent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`inline-block px-2 py-1 rounded-sm text-xs font-medium border ${
                      customer.status === 'active'
                        ? 'bg-green-500/10 text-green-500 border-green-500/30'
                        : 'bg-primary-white/10 text-primary-white/60 border-primary-white/20'
                    }`}>
                      {customer.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-primary-white/60 hover:text-blue-500 hover:bg-blue-500/10 rounded-sm transition-all">
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-primary-white/50">Nenhum cliente encontrado</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
