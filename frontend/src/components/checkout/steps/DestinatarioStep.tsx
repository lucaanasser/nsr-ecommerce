/**
 * Etapa 2: Dados do Destinatário e Endereço de Entrega
 * Permite escolher entre ser o próprio destinatário ou informar outra pessoa
 * Permite selecionar endereços salvos ou cadastrar um novo
 */

import { motion } from 'framer-motion';
import { Truck, MapPin, Check, ChevronRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import type { DadosDestinatario, DadosEntrega } from '@/types/checkout.types';
import type { SavedAddress } from '@/services';

interface DestinatarioStepProps {
  isAuthenticated: boolean;
  dadosDestinatario: DadosDestinatario;
  setDadosDestinatario: (dados: DadosDestinatario | ((prev: DadosDestinatario) => DadosDestinatario)) => void;
  destinatarioIgualComprador: boolean;
  setDestinatarioIgualComprador: (igual: boolean) => void;
  dadosEntrega: DadosEntrega;
  setDadosEntrega: (dados: DadosEntrega | ((prev: DadosEntrega) => DadosEntrega)) => void;
  enderecosSalvos: SavedAddress[];
  carregandoEnderecos: boolean;
  enderecoSelecionadoId: string | null;
  salvarEndereco: boolean;
  setSalvarEndereco: (salvar: boolean) => void;
  onUsarDadosComprador: () => void;
  onSelecionarEndereco: (endereco: SavedAddress) => void;
  onLimparSelecaoEndereco: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onVoltar: () => void;
}

export default function DestinatarioStep({
  isAuthenticated,
  dadosDestinatario,
  setDadosDestinatario,
  destinatarioIgualComprador,
  setDestinatarioIgualComprador,
  dadosEntrega,
  setDadosEntrega,
  enderecosSalvos,
  carregandoEnderecos,
  enderecoSelecionadoId,
  salvarEndereco,
  setSalvarEndereco,
  onUsarDadosComprador,
  onSelecionarEndereco,
  onLimparSelecaoEndereco,
  onSubmit,
  onVoltar,
}: DestinatarioStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-dark-card border border-dark-border p-6 rounded-sm"
    >
      <div className="flex items-center gap-3 mb-2">
        <Truck className="text-primary-bronze" size={24} />
        <h2 className="text-2xl font-semibold">Dados do Destinatário</h2>
      </div>
      <p className="text-xs text-primary-white/50 mb-6">
        Quem vai receber o pedido
      </p>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Checkbox: Eu mesmo sou o destinatário */}
        <div className="flex items-center gap-2 p-4 bg-dark-bg/50 rounded-sm">
          <input
            type="checkbox"
            checked={destinatarioIgualComprador}
            onChange={(e) => {
              if (e.target.checked) onUsarDadosComprador();
              else setDestinatarioIgualComprador(false);
            }}
            className="w-4 h-4 accent-primary-bronze"
          />
          <label className="text-sm">
            Eu mesmo sou o destinatário
          </label>
        </div>

        {/* Dados do destinatário (se diferente do comprador) */}
        {!destinatarioIgualComprador && (
          <div className="space-y-4 p-4 border border-dark-border rounded-sm">
            <h3 className="font-semibold text-sm text-primary-bronze">
              Informações de quem vai receber:
            </h3>
            
            <Input
              type="text"
              placeholder="Nome completo do destinatário"
              value={dadosDestinatario.nomeCompleto}
              onChange={(e) => setDadosDestinatario({ ...dadosDestinatario, nomeCompleto: e.target.value })}
              required
              className="bg-dark-bg/50"
            />
            
            <Input
              type="tel"
              placeholder="Telefone do destinatário"
              value={dadosDestinatario.telefone}
              onChange={(e) => setDadosDestinatario({ ...dadosDestinatario, telefone: e.target.value })}
              required
              className="bg-dark-bg/50"
            />
          </div>
        )}

        {/* Seção de Endereço de Entrega */}
        <div className="border-t border-dark-border pt-6">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="text-primary-bronze" size={20} />
            <h3 className="text-lg font-semibold">Endereço de Entrega</h3>
          </div>

          {/* Mensagem quando não há endereços salvos */}
          {isAuthenticated && enderecosSalvos.length === 0 && (
            <div className="mb-6 p-4 bg-primary-gold/10 border border-primary-gold/30 rounded-sm">
              <p className="text-sm text-primary-white/80">
                💡 Você ainda não tem endereços salvos. Preencha o formulário abaixo e marque a opção para salvar para compras futuras.
              </p>
            </div>
          )}

          {/* Seleção de Endereços Salvos */}
          {isAuthenticated && enderecosSalvos.length > 0 && !enderecoSelecionadoId && (
            <div className="mb-6">
              <p className="text-sm font-semibold mb-3">
                Selecione um endereço:
              </p>
              <div className="space-y-2">
                {enderecosSalvos.map((endereco) => (
                  <label
                    key={endereco.id}
                    className="flex items-start gap-3 p-4 bg-dark-bg/50 border border-dark-border hover:border-primary-bronze rounded-sm cursor-pointer transition-colors"
                  >
                    <input
                      type="radio"
                      name="endereco"
                      value={endereco.id}
                      onChange={() => onSelecionarEndereco(endereco)}
                      className="mt-1 w-4 h-4 accent-primary-bronze"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-primary-bronze">{endereco.label}</span>
                        {endereco.isDefault && (
                          <span className="text-xs bg-primary-bronze/20 text-primary-bronze px-2 py-0.5 rounded-sm">
                            Padrão
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-primary-white/70">
                        {endereco.street}, {endereco.number}
                        {endereco.complement && ` - ${endereco.complement}`}
                      </p>
                      <p className="text-sm text-primary-white/50">
                        {endereco.neighborhood}, {endereco.city} - {endereco.state}
                      </p>
                      <p className="text-xs text-primary-white/40 mt-1">CEP {endereco.zipCode}</p>
                    </div>
                  </label>
                ))}
              </div>
              <div className="text-center mt-4">
                <p className="text-sm text-primary-white/50 mb-2">Nenhum desses endereços?</p>
                <button
                  type="button"
                  onClick={onLimparSelecaoEndereco}
                  className="text-sm text-primary-bronze hover:underline"
                >
                  + Cadastrar novo endereço
                </button>
              </div>
            </div>
          )}

          {/* Endereço selecionado (preview) */}
          {enderecoSelecionadoId && (
            <div className="mb-4 p-3 bg-primary-bronze/10 border border-primary-bronze rounded-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Check size={16} className="text-primary-bronze" />
                    <span className="font-semibold text-primary-bronze">
                      {enderecosSalvos.find(e => e.id === enderecoSelecionadoId)?.label}
                    </span>
                  </div>
                  <p className="text-sm text-primary-white/80">
                    {dadosEntrega.endereco}, {dadosEntrega.numero}
                    {dadosEntrega.complemento && ` - ${dadosEntrega.complemento}`}
                  </p>
                  <p className="text-sm text-primary-white/70">
                    {dadosEntrega.bairro}, {dadosEntrega.cidade} - {dadosEntrega.estado}
                  </p>
                  <p className="text-xs text-primary-white/60">CEP: {dadosEntrega.cep}</p>
                </div>
                <button
                  type="button"
                  onClick={onLimparSelecaoEndereco}
                  className="text-xs text-primary-bronze hover:underline"
                >
                  Alterar
                </button>
              </div>
            </div>
          )}

          {/* Formulário de endereço manual */}
          {(!enderecoSelecionadoId || !isAuthenticated) && (
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="CEP"
                required
                value={dadosEntrega.cep}
                onChange={(e) => setDadosEntrega({ ...dadosEntrega, cep: e.target.value })}
                className="bg-dark-bg/50"
              />

              <Input
                type="text"
                placeholder="Endereço"
                required
                value={dadosEntrega.endereco}
                onChange={(e) => setDadosEntrega({ ...dadosEntrega, endereco: e.target.value })}
                className="bg-dark-bg/50"
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="text"
                  placeholder="Número"
                  required
                  value={dadosEntrega.numero}
                  onChange={(e) => setDadosEntrega({ ...dadosEntrega, numero: e.target.value })}
                  className="bg-dark-bg/50"
                />
                <Input
                  type="text"
                  placeholder="Complemento"
                  value={dadosEntrega.complemento}
                  onChange={(e) => setDadosEntrega({ ...dadosEntrega, complemento: e.target.value })}
                  className="bg-dark-bg/50"
                />
              </div>

              <Input
                type="text"
                placeholder="Bairro"
                required
                value={dadosEntrega.bairro}
                onChange={(e) => setDadosEntrega({ ...dadosEntrega, bairro: e.target.value })}
                className="bg-dark-bg/50"
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="text"
                  placeholder="Cidade"
                  required
                  value={dadosEntrega.cidade}
                  onChange={(e) => setDadosEntrega({ ...dadosEntrega, cidade: e.target.value })}
                  className="bg-dark-bg/50"
                />
                <Input
                  type="text"
                  placeholder="Estado"
                  required
                  value={dadosEntrega.estado}
                  onChange={(e) => setDadosEntrega({ ...dadosEntrega, estado: e.target.value })}
                  className="bg-dark-bg/50"
                />
              </div>
            </div>
          )}

          {/* Checkbox para salvar novo endereço */}
          {isAuthenticated && !enderecoSelecionadoId && (
            <div className="flex items-center gap-2 mt-4">
              <input
                type="checkbox"
                id="salvarEndereco"
                checked={salvarEndereco}
                onChange={(e) => setSalvarEndereco(e.target.checked)}
                className="w-4 h-4 rounded border-dark-border bg-dark-bg text-primary-bronze focus:ring-primary-bronze"
              />
              <label htmlFor="salvarEndereco" className="text-sm text-primary-white/70 cursor-pointer">
                Salvar este endereço para próximas compras
              </label>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            variant="secondary"
            onClick={onVoltar}
            className="flex-1"
          >
            Voltar
          </Button>
          <Button type="submit" className="flex-1">
            Continuar para Pagamento
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
