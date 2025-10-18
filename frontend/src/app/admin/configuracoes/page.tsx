'use client';

import { Save, Settings as SettingsIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

/**
 * Página de Configurações
 * Configurações gerais do sistema (mockado)
 */
export default function AdminConfiguracoes() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary-white mb-2">Configurações</h1>
        <p className="text-primary-white/60">Gerencie as configurações da loja</p>
      </div>

      {/* Configurações Gerais */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-dark-card/50 backdrop-blur-sm border border-dark-border rounded-sm p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <SettingsIcon className="text-primary-gold" size={20} />
          <h2 className="text-lg font-semibold text-primary-white">Informações da Loja</h2>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-primary-white/80 mb-2">
                Nome da Loja
              </label>
              <input
                type="text"
                defaultValue="NSR - ناصر"
                className="w-full bg-dark-bg/50 border border-dark-border rounded-sm px-4 py-2 text-sm text-primary-white focus:outline-none focus:border-primary-gold transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-primary-white/80 mb-2">
                Email de Contato
              </label>
              <input
                type="email"
                defaultValue="contato@nsr.com"
                className="w-full bg-dark-bg/50 border border-dark-border rounded-sm px-4 py-2 text-sm text-primary-white focus:outline-none focus:border-primary-gold transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-white/80 mb-2">
              Descrição da Loja
            </label>
            <textarea
              rows={3}
              defaultValue="Streetwear árabe contemporâneo. Onde tradição encontra modernidade."
              className="w-full bg-dark-bg/50 border border-dark-border rounded-sm px-4 py-2 text-sm text-primary-white focus:outline-none focus:border-primary-gold transition-colors resize-none"
            />
          </div>
        </div>
      </motion.div>

      {/* Configurações de Frete */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-dark-card/50 backdrop-blur-sm border border-dark-border rounded-sm p-6"
      >
        <h2 className="text-lg font-semibold text-primary-white mb-6">Frete</h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-primary-white/80 mb-2">
                Valor do Frete
              </label>
              <input
                type="number"
                defaultValue="15.00"
                step="0.01"
                className="w-full bg-dark-bg/50 border border-dark-border rounded-sm px-4 py-2 text-sm text-primary-white focus:outline-none focus:border-primary-gold transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-primary-white/80 mb-2">
                Frete Grátis Acima de
              </label>
              <input
                type="number"
                defaultValue="200.00"
                step="0.01"
                className="w-full bg-dark-bg/50 border border-dark-border rounded-sm px-4 py-2 text-sm text-primary-white focus:outline-none focus:border-primary-gold transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 bg-dark-bg/50 border border-dark-border rounded-sm accent-primary-gold"
              />
              <span className="text-sm text-primary-white/80">Habilitar frete grátis</span>
            </label>
          </div>
        </div>
      </motion.div>

      {/* Métodos de Pagamento */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-dark-card/50 backdrop-blur-sm border border-dark-border rounded-sm p-6"
      >
        <h2 className="text-lg font-semibold text-primary-white mb-6">Métodos de Pagamento</h2>
        
        <div className="space-y-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 bg-dark-bg/50 border border-dark-border rounded-sm accent-primary-gold"
            />
            <span className="text-sm text-primary-white/80">Cartão de Crédito</span>
          </label>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 bg-dark-bg/50 border border-dark-border rounded-sm accent-primary-gold"
            />
            <span className="text-sm text-primary-white/80">PIX</span>
          </label>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 bg-dark-bg/50 border border-dark-border rounded-sm accent-primary-gold"
            />
            <span className="text-sm text-primary-white/80">Boleto Bancário</span>
          </label>
        </div>
      </motion.div>

      {/* Notificações */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-dark-card/50 backdrop-blur-sm border border-dark-border rounded-sm p-6"
      >
        <h2 className="text-lg font-semibold text-primary-white mb-6">Notificações</h2>
        
        <div className="space-y-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 bg-dark-bg/50 border border-dark-border rounded-sm accent-primary-gold"
            />
            <span className="text-sm text-primary-white/80">Novos pedidos</span>
          </label>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 bg-dark-bg/50 border border-dark-border rounded-sm accent-primary-gold"
            />
            <span className="text-sm text-primary-white/80">Estoque baixo</span>
          </label>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 bg-dark-bg/50 border border-dark-border rounded-sm accent-primary-gold"
            />
            <span className="text-sm text-primary-white/80">Novos cadastros</span>
          </label>
        </div>
      </motion.div>

      {/* Botão Salvar */}
      <div className="flex justify-end">
        <Button variant="primary" className="flex items-center gap-2 px-6 py-3">
          <Save size={18} />
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
}
