'use client';

import { useState } from 'react';
import { Plus, FileSpreadsheet, User, Clock, Eye, Edit, Trash2 } from 'lucide-react';
import { spreadsheets, Spreadsheet, getUserById } from '@/data/collaborationData';
import { useAdmin } from '@/context/AdminContext';
import Button from '@/components/ui/Button';

/**
 * Página de Planilhas
 * Gerenciamento de planilhas colaborativas para controle de estoque, vendas, etc
 */
export default function PlanilhasPage() {
  const { user } = useAdmin();
  const [allSpreadsheets] = useState<Spreadsheet[]>(spreadsheets);
  const [selectedSpreadsheet, setSelectedSpreadsheet] = useState<Spreadsheet | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary-white">Planilhas</h1>
          <p className="text-sm text-primary-white/60 mt-1">
            Crie e gerencie planilhas colaborativas
          </p>
        </div>
        <Button>
          <Plus size={20} className="mr-2" />
          Nova Planilha
        </Button>
      </div>

      {/* Templates Rápidos */}
      <div className="bg-dark-card rounded-sm border border-dark-border p-6">
        <h2 className="text-lg font-semibold text-primary-white mb-4">Templates Rápidos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'Controle de Estoque', icon: '📦', description: 'Gerencie produtos e quantidades' },
            { name: 'Fluxo de Caixa', icon: '💰', description: 'Controle entradas e saídas' },
            { name: 'Lista de Fornecedores', icon: '🏭', description: 'Organize contatos e preços' },
          ].map((template) => (
            <button
              key={template.name}
              className="p-4 bg-dark-bg border border-dark-border rounded-sm hover:border-primary-gold/50 transition-all text-left group"
            >
              <div className="text-3xl mb-2">{template.icon}</div>
              <h3 className="text-sm font-semibold text-primary-white group-hover:text-primary-gold transition-colors">
                {template.name}
              </h3>
              <p className="text-xs text-primary-white/60 mt-1">{template.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Planilhas */}
      <div className="bg-dark-card rounded-sm border border-dark-border overflow-hidden">
        <div className="p-4 border-b border-dark-border bg-dark-bg">
          <h2 className="text-lg font-semibold text-primary-white">Minhas Planilhas</h2>
        </div>

        <div className="divide-y divide-dark-border">
          {allSpreadsheets.map((sheet) => {
            const creator = getUserById(sheet.createdBy);
            const lastEditor = getUserById(sheet.lastEditedBy);

            return (
              <div
                key={sheet.id}
                className="p-4 hover:bg-dark-bg/50 transition-colors cursor-pointer"
                onClick={() => setSelectedSpreadsheet(sheet)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <FileSpreadsheet size={20} className="text-green-400 mt-1" />
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-primary-white hover:text-primary-gold transition-colors">
                        {sheet.name}
                      </h3>
                      <p className="text-xs text-primary-white/60 mt-1">{sheet.description}</p>
                      
                      <div className="flex items-center gap-4 mt-3 text-xs text-primary-white/40">
                        <div className="flex items-center gap-1">
                          <User size={12} />
                          Criado por {creator?.name}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          Editado há{' '}
                          {Math.floor(
                            (new Date().getTime() - new Date(sheet.lastEditedAt).getTime()) / (1000 * 60 * 60 * 24)
                          )}{' '}
                          dias
                        </div>
                        <div>
                          {sheet.rows} × {sheet.cols} células
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSpreadsheet(sheet);
                      }}
                      className="p-2 text-primary-white/60 hover:text-primary-gold hover:bg-dark-bg rounded transition-colors"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="p-2 text-primary-white/60 hover:text-green-400 hover:bg-dark-bg rounded transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="p-2 text-primary-white/60 hover:text-red-400 hover:bg-dark-bg rounded transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Owner Badge */}
                <div className="flex items-center gap-2 mt-3">
                  {sheet.owner === 'both' ? (
                    <span className="inline-block px-3 py-1 rounded-sm text-xs font-medium border text-purple-400 bg-purple-500/10 border-purple-500/20">
                      Compartilhado
                    </span>
                  ) : (
                    <span className="inline-block px-3 py-1 rounded-sm text-xs font-medium border text-yellow-400 bg-yellow-500/10 border-yellow-500/20">
                      Pessoal - {getUserById(sheet.owner)?.name}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de Visualização */}
      {selectedSpreadsheet && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedSpreadsheet(null)}
        >
          <div
            className="bg-dark-card rounded-sm border border-dark-border max-w-4xl w-full p-6 max-h-[80vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-primary-white">{selectedSpreadsheet.name}</h2>
                <p className="text-sm text-primary-white/60 mt-1">{selectedSpreadsheet.description}</p>
              </div>
              <button
                onClick={() => setSelectedSpreadsheet(null)}
                className="text-primary-white/60 hover:text-primary-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Tabela Preview */}
            <div className="bg-dark-bg rounded-sm border border-dark-border overflow-auto">
              <table className="w-full">
                <tbody>
                  {Array.from({ length: Math.min(selectedSpreadsheet.rows, 10) }).map((_, rowIndex) => (
                    <tr key={rowIndex} className="border-b border-dark-border last:border-b-0">
                      {Array.from({ length: selectedSpreadsheet.cols }).map((_, colIndex) => {
                        const cell = selectedSpreadsheet.cells.find(
                          (c) => c.row === rowIndex && c.col === colIndex
                        );
                        
                        const isHeader = rowIndex === 0;

                        return (
                          <td
                            key={colIndex}
                            className={`p-3 border-r border-dark-border last:border-r-0 ${
                              isHeader ? 'bg-dark-card font-semibold text-primary-white' : 'text-primary-white/80'
                            }`}
                          >
                            {cell?.value || ''}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-primary-white/60">
              <div>
                Última edição por {getUserById(selectedSpreadsheet.lastEditedBy)?.name} em{' '}
                {new Date(selectedSpreadsheet.lastEditedAt).toLocaleString('pt-BR')}
              </div>
              <button className="px-3 py-1 bg-primary-gold text-dark-bg rounded-sm font-medium hover:bg-primary-bronze transition-colors">
                Abrir Editor Completo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
