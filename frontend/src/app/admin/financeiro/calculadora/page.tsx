'use client';

import { useState } from 'react';
import { Calculator, TrendingUp, AlertCircle } from 'lucide-react';

/**
 * Calculadora de Preços
 * Ferramenta para calcular preço de venda com base em custos e margem desejada
 */
export default function CalculadoraPage() {
  // Inputs
  const [materials, setMaterials] = useState<string>('28.00');
  const [labor, setLabor] = useState<string>('18.00');
  const [packaging, setPackaging] = useState<string>('6.00');
  const [shipping, setShipping] = useState<string>('3.50');
  
  // Estratégias de pricing
  const [strategy, setStrategy] = useState<'margin' | 'markup'>('margin');
  const [targetPercent, setTargetPercent] = useState<string>('70');

  // Calcular totais
  const totalCost = 
    parseFloat(materials || '0') + 
    parseFloat(labor || '0') + 
    parseFloat(packaging || '0') + 
    parseFloat(shipping || '0');

  // Calcular preço de venda
  let sellingPrice = 0;
  let actualMargin = 0;
  let actualMarkup = 0;
  
  const target = parseFloat(targetPercent || '0');

  if (strategy === 'margin') {
    // Margem = (Preço - Custo) / Preço * 100
    // Preço = Custo / (1 - Margem/100)
    sellingPrice = totalCost / (1 - target / 100);
    actualMargin = target;
    actualMarkup = (sellingPrice / totalCost);
  } else {
    // Markup = Preço / Custo
    // Preço = Custo * Markup
    sellingPrice = totalCost * (target / 100);
    actualMarkup = target / 100;
    actualMargin = ((sellingPrice - totalCost) / sellingPrice) * 100;
  }

  const profit = sellingPrice - totalCost;

  // Sugestões de preços
  const priceSuggestions = [
    { label: 'Margem 60%', value: totalCost / (1 - 0.60), margin: 60 },
    { label: 'Margem 70%', value: totalCost / (1 - 0.70), margin: 70 },
    { label: 'Margem 75%', value: totalCost / (1 - 0.75), margin: 75 },
    { label: 'Margem 80%', value: totalCost / (1 - 0.80), margin: 80 },
  ];

  const getMarginColor = (margin: number) => {
    if (margin >= 70) return 'text-green-400';
    if (margin >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getMarginStatus = (margin: number) => {
    if (margin >= 75) return 'Excelente';
    if (margin >= 70) return 'Muito Bom';
    if (margin >= 60) return 'Bom';
    if (margin >= 50) return 'Aceitável';
    return 'Baixo';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-primary-white">Calculadora de Preços</h1>
        <p className="text-sm text-primary-white/60 mt-1">
          Calcule o preço de venda ideal com base nos custos e margem desejada
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna 1: Inputs de Custos */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-dark-card rounded-sm border border-dark-border p-6">
            <h2 className="text-lg font-semibold text-primary-white mb-4 flex items-center gap-2">
              <Calculator size={20} className="text-primary-gold" />
              Custos de Produção
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-primary-white/80 mb-2 block">Materiais</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-white/60">R$</span>
                  <input
                    type="number"
                    value={materials}
                    onChange={(e) => setMaterials(e.target.value)}
                    className="w-full bg-dark-bg border border-dark-border rounded-sm px-3 py-2 pl-10 text-primary-white focus:outline-none focus:border-primary-gold"
                    step="0.01"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-primary-white/80 mb-2 block">Mão de Obra</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-white/60">R$</span>
                  <input
                    type="number"
                    value={labor}
                    onChange={(e) => setLabor(e.target.value)}
                    className="w-full bg-dark-bg border border-dark-border rounded-sm px-3 py-2 pl-10 text-primary-white focus:outline-none focus:border-primary-gold"
                    step="0.01"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-primary-white/80 mb-2 block">Embalagem</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-white/60">R$</span>
                  <input
                    type="number"
                    value={packaging}
                    onChange={(e) => setPackaging(e.target.value)}
                    className="w-full bg-dark-bg border border-dark-border rounded-sm px-3 py-2 pl-10 text-primary-white focus:outline-none focus:border-primary-gold"
                    step="0.01"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-primary-white/80 mb-2 block">Envio</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-white/60">R$</span>
                  <input
                    type="number"
                    value={shipping}
                    onChange={(e) => setShipping(e.target.value)}
                    className="w-full bg-dark-bg border border-dark-border rounded-sm px-3 py-2 pl-10 text-primary-white focus:outline-none focus:border-primary-gold"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-dark-border">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-primary-white/80">Custo Total</span>
                  <span className="text-xl font-bold text-primary-white">R$ {totalCost.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Estratégia de Pricing */}
          <div className="bg-dark-card rounded-sm border border-dark-border p-6">
            <h2 className="text-lg font-semibold text-primary-white mb-4">Estratégia</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-primary-white/80 mb-2 block">Calcular por</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setStrategy('margin')}
                    className={`px-4 py-2 rounded-sm text-sm font-medium transition-all ${
                      strategy === 'margin'
                        ? 'bg-primary-gold text-dark-bg'
                        : 'bg-dark-bg text-primary-white/60 hover:text-primary-white'
                    }`}
                  >
                    Margem %
                  </button>
                  <button
                    onClick={() => setStrategy('markup')}
                    className={`px-4 py-2 rounded-sm text-sm font-medium transition-all ${
                      strategy === 'markup'
                        ? 'bg-primary-gold text-dark-bg'
                        : 'bg-dark-bg text-primary-white/60 hover:text-primary-white'
                    }`}
                  >
                    Markup %
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm text-primary-white/80 mb-2 block">
                  {strategy === 'margin' ? 'Margem Desejada' : 'Markup Desejado'} (%)
                </label>
                <input
                  type="number"
                  value={targetPercent}
                  onChange={(e) => setTargetPercent(e.target.value)}
                  className="w-full bg-dark-bg border border-dark-border rounded-sm px-3 py-2 text-primary-white focus:outline-none focus:border-primary-gold"
                  step="1"
                />
              </div>

              {strategy === 'margin' && (
                <div className="bg-dark-bg/50 rounded-sm p-3 flex items-start gap-2">
                  <AlertCircle size={16} className="text-primary-gold mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-primary-white/60">
                    Margem = (Preço - Custo) / Preço × 100
                  </p>
                </div>
              )}

              {strategy === 'markup' && (
                <div className="bg-dark-bg/50 rounded-sm p-3 flex items-start gap-2">
                  <AlertCircle size={16} className="text-primary-gold mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-primary-white/60">
                    Markup = Preço / Custo × 100
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Coluna 2 e 3: Resultados */}
        <div className="lg:col-span-2 space-y-6">
          {/* Resultado Principal */}
          <div className="bg-gradient-to-br from-primary-gold/20 to-primary-bronze/10 border border-primary-gold/30 rounded-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp size={24} className="text-primary-gold" />
              <h2 className="text-xl font-semibold text-primary-white">Preço Recomendado</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-primary-white/60 mb-2">Preço de Venda</p>
                <p className="text-4xl font-bold text-primary-gold">R$ {sellingPrice.toFixed(2)}</p>
              </div>

              <div>
                <p className="text-sm text-primary-white/60 mb-2">Lucro Unitário</p>
                <p className="text-4xl font-bold text-green-400">R$ {profit.toFixed(2)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-primary-gold/20">
              <div className="bg-dark-card/50 rounded-sm p-4">
                <p className="text-xs text-primary-white/60 mb-1">Margem de Lucro</p>
                <p className={`text-2xl font-bold ${getMarginColor(actualMargin)}`}>
                  {actualMargin.toFixed(1)}%
                </p>
                <p className="text-xs text-primary-white/40 mt-1">{getMarginStatus(actualMargin)}</p>
              </div>

              <div className="bg-dark-card/50 rounded-sm p-4">
                <p className="text-xs text-primary-white/60 mb-1">Markup</p>
                <p className="text-2xl font-bold text-primary-white">{actualMarkup.toFixed(2)}x</p>
                <p className="text-xs text-primary-white/40 mt-1">{(actualMarkup * 100).toFixed(0)}%</p>
              </div>
            </div>
          </div>

          {/* Sugestões de Preços */}
          <div className="bg-dark-card rounded-sm border border-dark-border p-6">
            <h2 className="text-lg font-semibold text-primary-white mb-4">Sugestões de Preços</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {priceSuggestions.map((suggestion) => {
                const suggestionProfit = suggestion.value - totalCost;
                return (
                  <button
                    key={suggestion.label}
                    onClick={() => {
                      setStrategy('margin');
                      setTargetPercent(suggestion.margin.toString());
                    }}
                    className="bg-dark-bg hover:bg-dark-bg/70 border border-dark-border hover:border-primary-gold/50 rounded-sm p-4 text-left transition-all group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-semibold text-primary-white group-hover:text-primary-gold transition-colors">
                        {suggestion.label}
                      </span>
                      <span className={`text-xs font-medium ${getMarginColor(suggestion.margin)}`}>
                        {getMarginStatus(suggestion.margin)}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-primary-white mb-1">
                      R$ {suggestion.value.toFixed(2)}
                    </p>
                    <p className="text-xs text-primary-white/60">
                      Lucro: R$ {suggestionProfit.toFixed(2)}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Análise Comparativa */}
          <div className="bg-dark-card rounded-sm border border-dark-border p-6">
            <h2 className="text-lg font-semibold text-primary-white mb-4">Análise Comparativa</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-dark-border">
                  <tr>
                    <th className="text-left p-3 text-sm font-semibold text-primary-white/80">Unidades</th>
                    <th className="text-right p-3 text-sm font-semibold text-primary-white/80">Custo Total</th>
                    <th className="text-right p-3 text-sm font-semibold text-primary-white/80">Receita</th>
                    <th className="text-right p-3 text-sm font-semibold text-primary-white/80">Lucro</th>
                  </tr>
                </thead>
                <tbody>
                  {[10, 25, 50, 100].map((units) => (
                    <tr key={units} className="border-b border-dark-border/50">
                      <td className="p-3 text-sm text-primary-white">{units} un.</td>
                      <td className="p-3 text-sm text-right text-primary-white/80">
                        R$ {(totalCost * units).toFixed(2)}
                      </td>
                      <td className="p-3 text-sm text-right text-primary-gold">
                        R$ {(sellingPrice * units).toFixed(2)}
                      </td>
                      <td className="p-3 text-sm text-right text-green-400 font-semibold">
                        R$ {(profit * units).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
