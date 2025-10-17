'use client';

import { useState } from 'react';
import { Plus, DollarSign, TrendingUp, Calendar, Filter, CheckCircle, XCircle } from 'lucide-react';
import { expenses, Expense } from '@/data/financeData';

/**
 * Página de Gestão de Despesas
 * Controle de gastos operacionais, marketing e produção
 */
export default function DespesasPage() {
  const [allExpenses, setAllExpenses] = useState<Expense[]>(expenses);
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [selectedMonth, setSelectedMonth] = useState<string>('todas');

  // Filtrar despesas
  const filteredExpenses = allExpenses.filter((expense) => {
    const categoryMatch = selectedCategory === 'todas' || expense.category === selectedCategory;
    const monthMatch = selectedMonth === 'todas' || expense.date.startsWith(selectedMonth);
    return categoryMatch && monthMatch;
  });

  // Calcular totais
  const totalExpenses = filteredExpenses.reduce((acc, exp) => acc + exp.amount, 0);
  const paidExpenses = filteredExpenses.filter((exp) => exp.isPaid).reduce((acc, exp) => acc + exp.amount, 0);
  const pendingExpenses = filteredExpenses.filter((exp) => !exp.isPaid).reduce((acc, exp) => acc + exp.amount, 0);

  // Totais por categoria
  const expensesByCategory = {
    marketing: filteredExpenses.filter((e) => e.category === 'marketing').reduce((acc, e) => acc + e.amount, 0),
    operacional: filteredExpenses.filter((e) => e.category === 'operacional').reduce((acc, e) => acc + e.amount, 0),
    producao: filteredExpenses.filter((e) => e.category === 'producao').reduce((acc, e) => acc + e.amount, 0),
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      marketing: 'Marketing',
      operacional: 'Operacional',
      producao: 'Produção',
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      marketing: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      operacional: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
      producao: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    };
    return colors[category] || 'text-gray-400 bg-gray-500/10 border-gray-500/20';
  };

  // Meses disponíveis
  const availableMonths = Array.from(
    new Set(allExpenses.map((e) => e.date.slice(0, 7)))
  ).sort().reverse();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary-white">Gestão de Despesas</h1>
          <p className="text-sm text-primary-white/60 mt-1">
            Controle de gastos operacionais, marketing e produção
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-gold text-dark-bg rounded-sm font-medium hover:bg-primary-bronze transition-colors">
          <Plus size={20} />
          Nova Despesa
        </button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-dark-card p-6 rounded-sm border border-dark-border">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={16} className="text-primary-white/60" />
            <p className="text-sm text-primary-white/60">Total de Despesas</p>
          </div>
          <p className="text-2xl font-bold text-primary-white">R$ {totalExpenses.toFixed(2)}</p>
        </div>

        <div className="bg-dark-card p-6 rounded-sm border border-dark-border">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={16} className="text-green-400" />
            <p className="text-sm text-primary-white/60">Pagas</p>
          </div>
          <p className="text-2xl font-bold text-green-400">R$ {paidExpenses.toFixed(2)}</p>
        </div>

        <div className="bg-dark-card p-6 rounded-sm border border-dark-border">
          <div className="flex items-center gap-2 mb-2">
            <XCircle size={16} className="text-red-400" />
            <p className="text-sm text-primary-white/60">Pendentes</p>
          </div>
          <p className="text-2xl font-bold text-red-400">R$ {pendingExpenses.toFixed(2)}</p>
        </div>

        <div className="bg-dark-card p-6 rounded-sm border border-dark-border">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-primary-gold" />
            <p className="text-sm text-primary-white/60">Nº Despesas</p>
          </div>
          <p className="text-2xl font-bold text-primary-white">{filteredExpenses.length}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-dark-card rounded-sm border border-dark-border p-4">
        <div className="flex items-center gap-4">
          <Filter size={20} className="text-primary-gold" />
          
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-primary-white/60 mb-2 block">Categoria</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-dark-bg border border-dark-border rounded-sm px-3 py-2 text-primary-white focus:outline-none focus:border-primary-gold"
              >
                <option value="todas">Todas as categorias</option>
                <option value="marketing">Marketing</option>
                <option value="operacional">Operacional</option>
                <option value="producao">Produção</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-primary-white/60 mb-2 block">Mês</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full bg-dark-bg border border-dark-border rounded-sm px-3 py-2 text-primary-white focus:outline-none focus:border-primary-gold"
              >
                <option value="todas">Todos os meses</option>
                {availableMonths.map((month) => (
                  <option key={month} value={month}>
                    {new Date(month + '-01').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Distribuição por Categoria */}
      <div className="bg-dark-card rounded-sm border border-dark-border p-6">
        <h2 className="text-lg font-semibold text-primary-white mb-4">Distribuição por Categoria</h2>
        
        <div className="space-y-4">
          {Object.entries(expensesByCategory).map(([category, amount]) => {
            const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
            return (
              <div key={category}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-primary-white">{getCategoryLabel(category)}</span>
                  <div className="text-right">
                    <span className="text-sm font-bold text-primary-white">R$ {amount.toFixed(2)}</span>
                    <span className="text-xs text-primary-white/60 ml-2">({percentage.toFixed(1)}%)</span>
                  </div>
                </div>
                <div className="w-full bg-dark-bg rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      category === 'marketing' ? 'bg-blue-500' :
                      category === 'operacional' ? 'bg-yellow-500' :
                      'bg-purple-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lista de Despesas */}
      <div className="bg-dark-card rounded-sm border border-dark-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-bg border-b border-dark-border">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-primary-white/80">Data</th>
                <th className="text-left p-4 text-sm font-semibold text-primary-white/80">Categoria</th>
                <th className="text-left p-4 text-sm font-semibold text-primary-white/80">Subcategoria</th>
                <th className="text-left p-4 text-sm font-semibold text-primary-white/80">Descrição</th>
                <th className="text-right p-4 text-sm font-semibold text-primary-white/80">Valor</th>
                <th className="text-center p-4 text-sm font-semibold text-primary-white/80">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="border-b border-dark-border hover:bg-dark-bg/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm text-primary-white/80">
                      <Calendar size={14} />
                      {new Date(expense.date).toLocaleDateString('pt-BR')}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-block px-3 py-1 rounded-sm text-xs font-medium border ${getCategoryColor(expense.category)}`}>
                      {getCategoryLabel(expense.category)}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-primary-white/80">{expense.subcategory}</td>
                  <td className="p-4 text-sm text-primary-white">{expense.description}</td>
                  <td className="p-4 text-right text-sm font-semibold text-primary-white">
                    R$ {expense.amount.toFixed(2)}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center">
                      {expense.isPaid ? (
                        <span className="flex items-center gap-1 text-xs font-medium text-green-400">
                          <CheckCircle size={14} />
                          Paga
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-medium text-red-400">
                          <XCircle size={14} />
                          Pendente
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredExpenses.length === 0 && (
          <div className="p-12 text-center">
            <DollarSign size={48} className="text-primary-white/20 mx-auto mb-4" />
            <p className="text-primary-white/60">Nenhuma despesa encontrada com os filtros aplicados</p>
          </div>
        )}
      </div>
    </div>
  );
}
