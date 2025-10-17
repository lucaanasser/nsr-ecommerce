'use client';

import { DollarSign, TrendingDown, Target, AlertCircle, Calculator, Package } from 'lucide-react';
import StatCard from '@/components/admin/StatCard';
import { financialStats, productCosts, expenses, monthlyGoal, growthProjection } from '@/data/financeData';
import { motion } from 'framer-motion';
import Link from 'next/link';

/**
 * Dashboard Financeiro
 * Visão geral financeira para marca iniciante
 */
export default function FinanceiroDashboard() {
  // Calcula totais
  const totalExpensesPaid = expenses
    .filter(e => e.isPaid)
    .reduce((sum, e) => sum + e.amount, 0);
  
  const totalExpensesPending = expenses
    .filter(e => !e.isPaid)
    .reduce((sum, e) => sum + e.amount, 0);

  // Margem média dos produtos
  const avgMargin = productCosts.reduce((sum, p) => sum + p.marginPercent, 0) / productCosts.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary-white mb-2">Financeiro</h1>
        <p className="text-primary-white/60">Controle financeiro da sua marca</p>
      </div>

      {/* Stats Grid - Métricas Essenciais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Capital Disponível"
          value={`R$ ${financialStats.remainingBudget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          icon={DollarSign}
          color="gold"
        />
        <StatCard
          title="Gastos Totais"
          value={`R$ ${totalExpensesPaid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          icon={TrendingDown}
          color="bronze"
        />
        <StatCard
          title="Margem Média"
          value={`${avgMargin.toFixed(1)}%`}
          icon={Target}
          color="green"
        />
        <StatCard
          title="Break-even"
          value={`${financialStats.breakEven.unitsToSell} un.`}
          icon={AlertCircle}
          color="blue"
        />
      </div>

      {/* Alertas/Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Investimento Inicial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-card/50 backdrop-blur-sm border border-dark-border rounded-sm p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="text-primary-gold" size={20} />
            <h2 className="text-lg font-semibold text-primary-white">Situação Atual</h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-primary-white/60">Capital Inicial</span>
              <span className="text-sm font-semibold text-primary-white">
                R$ {financialStats.initialInvestment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-primary-white/60">Gastos Pagos</span>
              <span className="text-sm font-semibold text-red-400">
                - R$ {totalExpensesPaid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-primary-white/60">Contas a Pagar</span>
              <span className="text-sm font-semibold text-yellow-400">
                - R$ {totalExpensesPending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            
            <div className="pt-3 border-t border-dark-border flex justify-between items-center">
              <span className="text-sm font-medium text-primary-white">Disponível</span>
              <span className="text-lg font-bold text-primary-gold">
                R$ {financialStats.remainingBudget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-dark-bg rounded-full h-2 mt-4">
              <div
                className="bg-primary-gold h-2 rounded-full transition-all"
                style={{ width: `${(financialStats.remainingBudget / financialStats.initialInvestment) * 100}%` }}
              />
            </div>
            <p className="text-xs text-primary-white/50 text-right">
              {((financialStats.remainingBudget / financialStats.initialInvestment) * 100).toFixed(0)}% do capital
            </p>
          </div>
        </motion.div>

        {/* Primeira Produção */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-dark-card/50 backdrop-blur-sm border border-dark-border rounded-sm p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Package className="text-green-500" size={20} />
            <h2 className="text-lg font-semibold text-primary-white">Plano de Produção</h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-primary-white/60">Peças Planejadas</span>
              <span className="text-sm font-semibold text-primary-white">
                {financialStats.firstProductionPlan.totalUnits} unidades
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-primary-white/60">Custo Estimado</span>
              <span className="text-sm font-semibold text-red-400">
                R$ {financialStats.firstProductionPlan.totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-primary-white/60">Receita Potencial</span>
              <span className="text-sm font-semibold text-green-500">
                R$ {financialStats.firstProductionPlan.projectedRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            
            <div className="pt-3 border-t border-dark-border flex justify-between items-center">
              <span className="text-sm font-medium text-primary-white">Lucro Projetado</span>
              <span className="text-lg font-bold text-green-500">
                R$ {financialStats.firstProductionPlan.projectedProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-sm">
              <p className="text-xs text-green-500">
                ✓ Venda {financialStats.breakEven.unitsToSell} peças para empatar investimentos
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Breakdown de Despesas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-dark-card/50 backdrop-blur-sm border border-dark-border rounded-sm p-6"
      >
        <h2 className="text-lg font-semibold text-primary-white mb-6">Distribuição de Gastos</h2>
        
        <div className="space-y-4">
          {/* Marketing */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-primary-white/80">Marketing</span>
              <span className="text-primary-white font-medium">
                R$ {financialStats.spentByCategory.marketing.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="w-full bg-dark-bg rounded-full h-2">
              <div
                className="bg-purple-500 h-2 rounded-full"
                style={{ width: `${(financialStats.spentByCategory.marketing / totalExpensesPaid) * 100}%` }}
              />
            </div>
          </div>

          {/* Operacional */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-primary-white/80">Operacional</span>
              <span className="text-primary-white font-medium">
                R$ {financialStats.spentByCategory.operacional.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="w-full bg-dark-bg rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${(financialStats.spentByCategory.operacional / totalExpensesPaid) * 100}%` }}
              />
            </div>
          </div>

          {/* Produção */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-primary-white/80">Produção</span>
              <span className="text-primary-white font-medium">
                R$ 0,00 <span className="text-xs text-primary-white/50">(Planejado)</span>
              </span>
            </div>
            <div className="w-full bg-dark-bg rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '0%' }} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/admin/financeiro/custos" className="block">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-dark-card/30 hover:bg-dark-card/50 border border-dark-border hover:border-primary-gold/50 rounded-sm p-4 transition-all cursor-pointer"
          >
            <Package className="text-primary-gold mb-2" size={24} />
            <h3 className="text-sm font-medium text-primary-white mb-1">Custos de Produção</h3>
            <p className="text-xs text-primary-white/60">Gerencie custos por produto</p>
          </motion.div>
        </Link>

        <Link href="/admin/financeiro/calculadora" className="block">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-dark-card/30 hover:bg-dark-card/50 border border-dark-border hover:border-primary-bronze/50 rounded-sm p-4 transition-all cursor-pointer"
          >
            <Calculator className="text-primary-bronze mb-2" size={24} />
            <h3 className="text-sm font-medium text-primary-white mb-1">Calculadora de Preços</h3>
            <p className="text-xs text-primary-white/60">Calcule preços com margem ideal</p>
          </motion.div>
        </Link>

        <Link href="/admin/financeiro/despesas" className="block">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-dark-card/30 hover:bg-dark-card/50 border border-dark-border hover:border-blue-500/50 rounded-sm p-4 transition-all cursor-pointer"
          >
            <TrendingDown className="text-blue-500 mb-2" size={24} />
            <h3 className="text-sm font-medium text-primary-white mb-1">Despesas</h3>
            <p className="text-xs text-primary-white/60">Controle todos os gastos</p>
          </motion.div>
        </Link>
      </div>
    </div>
  );
}
