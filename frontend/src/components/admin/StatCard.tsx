'use client';

import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'gold' | 'bronze' | 'green' | 'blue';
}

/**
 * Card de Estatística
 * Exibe métricas importantes no dashboard
 */
export default function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend,
  color = 'gold' 
}: StatCardProps) {
  const colorClasses = {
    gold: 'bg-primary-gold/10 text-primary-gold border-primary-gold/30',
    bronze: 'bg-primary-bronze/10 text-primary-bronze border-primary-bronze/30',
    green: 'bg-green-500/10 text-green-500 border-green-500/30',
    blue: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-dark-card/50 backdrop-blur-sm border border-dark-border rounded-sm p-6 hover:border-primary-gold/30 transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-primary-white/60 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-primary-white">{value}</h3>
        </div>
        <div className={`p-3 rounded-sm border ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
      </div>
      
      {trend && (
        <div className="flex items-center gap-1 text-sm">
          <span className={trend.isPositive ? 'text-green-500' : 'text-red-500'}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
          <span className="text-primary-white/50">vs mês anterior</span>
        </div>
      )}
    </motion.div>
  );
}
