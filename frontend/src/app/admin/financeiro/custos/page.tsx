'use client';

import { useState } from 'react';
import { Package, Edit, Trash2, Plus, TrendingUp, TrendingDown } from 'lucide-react';
import { productCosts, ProductCost } from '@/data/financeData';

/**
 * Página de Gestão de Custos por Produto
 * Permite cadastrar e visualizar o breakdown de custos de cada produto
 */
export default function CustosPage() {
  const [costs, setCosts] = useState<ProductCost[]>(productCosts);
  const [selectedProduct, setSelectedProduct] = useState<ProductCost | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Calcular margem média
  const averageMargin = costs.reduce((acc, product) => {
    return acc + product.marginPercent;
  }, 0) / costs.length;

  const getCostEfficiencyColor = (margin: number) => {
    if (margin >= 70) return 'text-green-400';
    if (margin >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getCostEfficiencyIcon = (margin: number) => {
    if (margin >= 70) return <TrendingUp size={16} />;
    return <TrendingDown size={16} />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary-white">Gestão de Custos</h1>
          <p className="text-sm text-primary-white/60 mt-1">
            Controle detalhado dos custos de produção por produto
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-gold text-dark-bg rounded-sm font-medium hover:bg-primary-bronze transition-colors">
          <Plus size={20} />
          Novo Produto
        </button>
      </div>

      {/* Resumo Geral */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-dark-card p-6 rounded-sm border border-dark-border">
          <p className="text-sm text-primary-white/60 mb-1">Produtos Cadastrados</p>
          <p className="text-3xl font-bold text-primary-white">{costs.length}</p>
        </div>
        
        <div className="bg-dark-card p-6 rounded-sm border border-dark-border">
          <p className="text-sm text-primary-white/60 mb-1">Custo Médio</p>
          <p className="text-3xl font-bold text-primary-white">
            R$ {(costs.reduce((acc, p) => acc + p.totalCost, 0) / costs.length).toFixed(2)}
          </p>
        </div>
        
        <div className="bg-dark-card p-6 rounded-sm border border-dark-border">
          <p className="text-sm text-primary-white/60 mb-1">Margem Média</p>
          <div className="flex items-center gap-2">
            <p className={`text-3xl font-bold ${getCostEfficiencyColor(averageMargin)}`}>
              {averageMargin.toFixed(1)}%
            </p>
            {getCostEfficiencyIcon(averageMargin)}
          </div>
        </div>
      </div>

      {/* Lista de Produtos */}
      <div className="bg-dark-card rounded-sm border border-dark-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-bg border-b border-dark-border">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-primary-white/80">Produto</th>
                <th className="text-right p-4 text-sm font-semibold text-primary-white/80">Materiais</th>
                <th className="text-right p-4 text-sm font-semibold text-primary-white/80">Mão de Obra</th>
                <th className="text-right p-4 text-sm font-semibold text-primary-white/80">Embalagem</th>
                <th className="text-right p-4 text-sm font-semibold text-primary-white/80">Envio</th>
                <th className="text-right p-4 text-sm font-semibold text-primary-white/80">Custo Total</th>
                <th className="text-right p-4 text-sm font-semibold text-primary-white/80">Preço Venda</th>
                <th className="text-right p-4 text-sm font-semibold text-primary-white/80">Margem</th>
                <th className="text-center p-4 text-sm font-semibold text-primary-white/80">Ações</th>
              </tr>
            </thead>
            <tbody>
              {costs.map((product) => {
                return (
                  <tr 
                    key={product.productId}
                    className="border-b border-dark-border hover:bg-dark-bg/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-dark-bg rounded-sm flex items-center justify-center">
                          <Package size={20} className="text-primary-gold" />
                        </div>
                        <span className="text-sm font-medium text-primary-white">{product.productName}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right text-sm text-primary-white/80">
                      R$ {product.costs.materials.toFixed(2)}
                    </td>
                    <td className="p-4 text-right text-sm text-primary-white/80">
                      R$ {product.costs.labor.toFixed(2)}
                    </td>
                    <td className="p-4 text-right text-sm text-primary-white/80">
                      R$ {product.costs.packaging.toFixed(2)}
                    </td>
                    <td className="p-4 text-right text-sm text-primary-white/80">
                      R$ {product.costs.shipping.toFixed(2)}
                    </td>
                    <td className="p-4 text-right text-sm font-semibold text-primary-white">
                      R$ {product.totalCost.toFixed(2)}
                    </td>
                    <td className="p-4 text-right text-sm font-semibold text-primary-gold">
                      R$ {product.sellingPrice.toFixed(2)}
                    </td>
                    <td className="p-4 text-right">
                      <span className={`text-sm font-bold ${getCostEfficiencyColor(product.marginPercent)}`}>
                        {product.marginPercent.toFixed(1)}%
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          className="p-2 text-primary-white/60 hover:text-primary-gold hover:bg-dark-bg rounded transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProduct(product);
                            setIsEditing(true);
                          }}
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className="p-2 text-primary-white/60 hover:text-red-400 hover:bg-dark-bg rounded transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Implementar delete
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detalhes do Produto Selecionado */}
      {selectedProduct && (
        <div className="bg-dark-card rounded-sm border border-dark-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-primary-white">Breakdown de Custos: {selectedProduct.productName}</h2>
            <button 
              onClick={() => setSelectedProduct(null)}
              className="text-primary-white/60 hover:text-primary-white transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Custos Diretos */}
            <div>
              <h3 className="text-sm font-semibold text-primary-white/80 mb-4">Custos Diretos</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-dark-bg rounded-sm">
                  <span className="text-sm text-primary-white/80">Materiais</span>
                  <span className="text-sm font-semibold text-primary-white">R$ {selectedProduct.costs.materials.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-dark-bg rounded-sm">
                  <span className="text-sm text-primary-white/80">Mão de Obra</span>
                  <span className="text-sm font-semibold text-primary-white">R$ {selectedProduct.costs.labor.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-dark-bg rounded-sm">
                  <span className="text-sm text-primary-white/80">Embalagem</span>
                  <span className="text-sm font-semibold text-primary-white">R$ {selectedProduct.costs.packaging.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-dark-bg rounded-sm">
                  <span className="text-sm text-primary-white/80">Envio</span>
                  <span className="text-sm font-semibold text-primary-white">R$ {selectedProduct.costs.shipping.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Análise de Rentabilidade */}
            <div>
              <h3 className="text-sm font-semibold text-primary-white/80 mb-4">Análise de Rentabilidade</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-dark-bg rounded-sm">
                  <span className="text-sm text-primary-white/80">Custo Total</span>
                  <span className="text-sm font-semibold text-primary-white">R$ {selectedProduct.totalCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-dark-bg rounded-sm">
                  <span className="text-sm text-primary-white/80">Preço de Venda</span>
                  <span className="text-sm font-semibold text-primary-gold">R$ {selectedProduct.sellingPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-dark-bg rounded-sm">
                  <span className="text-sm text-primary-white/80">Lucro Unitário</span>
                  <span className="text-sm font-semibold text-green-400">
                    R$ {(selectedProduct.sellingPrice - selectedProduct.totalCost).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-primary-gold/10 rounded-sm border border-primary-gold/20">
                  <span className="text-sm font-semibold text-primary-gold">Margem de Lucro</span>
                  <span className="text-lg font-bold text-primary-gold">
                    {selectedProduct.marginPercent.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Gráfico de Composição de Custos */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-primary-white/80 mb-4">Composição de Custos</h3>
            <div className="space-y-2">
              {[
                { label: 'Materiais', value: selectedProduct.costs.materials, color: 'bg-blue-500' },
                { label: 'Mão de Obra', value: selectedProduct.costs.labor, color: 'bg-green-500' },
                { label: 'Embalagem', value: selectedProduct.costs.packaging, color: 'bg-yellow-500' },
                { label: 'Envio', value: selectedProduct.costs.shipping, color: 'bg-purple-500' }
              ].map((item) => {
                const percentage = (item.value / selectedProduct.totalCost) * 100;
                return (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs text-primary-white/60 mb-1">
                      <span>{item.label}</span>
                      <span>{percentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-dark-bg rounded-full h-2">
                      <div 
                        className={`${item.color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
