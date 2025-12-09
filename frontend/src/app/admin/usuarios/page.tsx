'use client';

import { useState } from 'react';
import { Search, Eye, Mail, Phone, ShoppingBag, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAdminUsers } from './hooks/useAdminUsers';

/**
 * Página de Gestão de Usuários/Clientes
 * Listagem e informações dos clientes
 */
export default function AdminUsuarios() {
  const { 
    users, 
    loading, 
    error, 
    total, 
    filters, 
    handleFilterChange 
  } = useAdminUsers();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary-white mb-2">Clientes</h1>
        <p className="text-primary-white/60">Gerencie todos os clientes cadastrados</p>
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
              placeholder="Buscar por nome, email ou telefone..."
              className="w-full pl-10"
            />
          </div>

          {/* Filtro de Status */}
          <div className="flex gap-2">
            <Button
              variant={filters.status === 'todos' ? 'primary' : 'ghost'}
              onClick={() => handleFilterChange({ status: 'todos' })}
              className={`px-4 py-2 text-sm ${
                filters.status === 'todos'
                  ? ''
                  : 'bg-dark-bg/50 text-primary-white/60 hover:text-primary-white border border-dark-border'
              }`}
            >
              Todos
            </Button>
            <Button
              variant={filters.status === 'active' ? 'primary' : 'ghost'}
              onClick={() => handleFilterChange({ status: 'active' })}
              className={`px-4 py-2 text-sm ${
                filters.status === 'active'
                  ? 'bg-green-600 text-white'
                  : 'bg-dark-bg/50 text-primary-white/60 hover:text-primary-white border border-dark-border'
              }`}
            >
              Ativos
            </Button>
            <Button
              variant={filters.status === 'inactive' ? 'primary' : 'ghost'}
              onClick={() => handleFilterChange({ status: 'inactive' })}
              className={`px-4 py-2 text-sm ${
                filters.status === 'inactive'
                  ? 'bg-red-600 text-white'
                  : 'bg-dark-bg/50 text-primary-white/60 hover:text-primary-white border border-dark-border'
              }`}
            >
              Inativos
            </Button>
          </div>
        </div>

        {/* Contador */}
        <div className="mt-3 text-sm text-primary-white/50">
          {loading ? 'Carregando...' : `${total} cliente${total !== 1 ? 's' : ''} encontrado${total !== 1 ? 's' : ''}`}
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
                <th className="text-left text-sm font-medium text-primary-white/60 p-4">Cadastro</th>
                <th className="text-left text-sm font-medium text-primary-white/60 p-4">Pedidos</th>
                <th className="text-left text-sm font-medium text-primary-white/60 p-4">Status</th>
                <th className="text-right text-sm font-medium text-primary-white/60 p-4">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-primary-white/40">
                    Carregando clientes...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-primary-white/40">
                    Nenhum cliente encontrado
                  </td>
                </tr>
              ) : (
                users.map((customer, index) => (
                  <motion.tr
                    key={customer.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-dark-bg/30 transition-colors"
                  >
                    <td className="p-4">
                      <div>
                        <p className="text-sm font-medium text-primary-white">
                          {customer.firstName} {customer.lastName}
                        </p>
                        <p className="text-xs text-primary-white/50">ID: {customer.id.slice(0, 8)}...</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-primary-white/80">
                          <Mail size={14} className="text-primary-white/40" />
                          {customer.email}
                        </div>
                        {customer.phone && (
                          <div className="flex items-center gap-2 text-sm text-primary-white/80">
                            <Phone size={14} className="text-primary-white/40" />
                            {customer.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-primary-white/80">
                        <Calendar size={14} className="text-primary-white/40" />
                        {new Date(customer.createdAt).toLocaleDateString('pt-BR')}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-primary-white/80">
                        <ShoppingBag size={14} className="text-primary-white/40" />
                        {customer.ordersCount} pedidos
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-2 py-1 rounded-sm text-xs font-medium border ${
                        customer.status === 'active'
                          ? 'bg-green-500/10 text-green-500 border-green-500/30'
                          : 'bg-red-500/10 text-red-500 border-red-500/30'
                      }`}>
                        {customer.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Button 
                        variant="ghost"
                        className="p-2 text-primary-white/60 hover:text-blue-500 hover:bg-blue-500/10"
                        title="Ver detalhes"
                      >
                        <Eye size={16} />
                      </Button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
