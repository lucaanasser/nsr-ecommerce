/**
 * Etapa 1: Seus Dados
 * Formulário para criar conta (usuários não logados) ou completar dados (usuários logados)
 */

import { motion } from 'framer-motion';
import { Package, Check } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import type { DadosComprador } from '@/types/checkout.types';
import type { AuthUser } from '@/services';

interface DadosStepProps {
  user: AuthUser | null;
  dadosComprador: DadosComprador;
  setDadosComprador: (dados: DadosComprador | ((prev: DadosComprador) => DadosComprador)) => void;
  dadosCompradorFaltando: string[];
  senha: string;
  setSenha: (senha: string) => void;
  confirmarSenha: string;
  setConfirmarSenha: (senha: string) => void;
  dataNascimento: string;
  setDataNascimento: (data: string) => void;
  aceitouTermos: boolean;
  setAceitouTermos: (aceito: boolean) => void;
  salvarDadosComprador: boolean;
  setSalvarDadosComprador: (salvar: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function DadosStep({
  user,
  dadosComprador,
  setDadosComprador,
  dadosCompradorFaltando,
  senha,
  setSenha,
  confirmarSenha,
  setConfirmarSenha,
  dataNascimento,
  setDataNascimento,
  aceitouTermos,
  setAceitouTermos,
  salvarDadosComprador,
  setSalvarDadosComprador,
  onSubmit,
}: DadosStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-dark-card border border-dark-border p-6 rounded-sm"
    >
      <div className="flex items-center gap-3 mb-2">
        <Package className="text-primary-bronze" size={24} />
        <h2 className="text-2xl font-semibold">Seus Dados</h2>
      </div>
      <p className="text-xs text-primary-white/50 mb-6">
        Quem está realizando a compra (para nota fiscal)
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Se não está logado - DEVE CRIAR CONTA */}
        {!user && (
          <>
            <div className="bg-primary-bronze/10 border border-primary-bronze/30 p-4 rounded-sm mb-6">
              <p className="text-sm text-primary-white/80">
                Para finalizar sua compra e acompanhar seu pedido, você precisa criar uma conta.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                type="text"
                placeholder="Nome"
                value={dadosComprador.nome}
                onChange={(e) => setDadosComprador({ ...dadosComprador, nome: e.target.value })}
                required
                className="bg-dark-bg/50"
              />
              <Input
                type="text"
                placeholder="Sobrenome"
                value={dadosComprador.sobrenome}
                onChange={(e) => setDadosComprador({ ...dadosComprador, sobrenome: e.target.value })}
                required
                className="bg-dark-bg/50"
              />
            </div>

            <Input
              type="email"
              placeholder="E-mail"
              value={dadosComprador.email}
              onChange={(e) => setDadosComprador({ ...dadosComprador, email: e.target.value })}
              required
              className="bg-dark-bg/50"
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                type="tel"
                placeholder="Telefone"
                value={dadosComprador.telefone}
                onChange={(e) => setDadosComprador({ ...dadosComprador, telefone: e.target.value })}
                required
                className="bg-dark-bg/50"
              />
              <Input
                type="text"
                placeholder="CPF"
                value={dadosComprador.cpf}
                onChange={(e) => setDadosComprador({ ...dadosComprador, cpf: e.target.value })}
                required
                className="bg-dark-bg/50"
              />
            </div>

            <Input
              type="date"
              placeholder="Data de Nascimento"
              value={dataNascimento}
              onChange={(e) => setDataNascimento(e.target.value)}
              required
              className="bg-dark-bg/50"
            />

            <div className="border-t border-dark-border pt-4 mt-6">
              <p className="text-sm font-semibold mb-4">Crie uma senha para sua conta:</p>
              
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="password"
                  placeholder="Senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  className="bg-dark-bg/50"
                />
                <Input
                  type="password"
                  placeholder="Confirmar Senha"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  required
                  className="bg-dark-bg/50"
                />
              </div>

              <div className="flex items-start gap-2 mt-4">
                <input
                  type="checkbox"
                  checked={aceitouTermos}
                  onChange={(e) => setAceitouTermos(e.target.checked)}
                  required
                  className="mt-1 w-4 h-4 accent-primary-bronze"
                />
                <label className="text-xs text-primary-white/70">
                  Li e aceito os{' '}
                  <a href="/termos-uso" target="_blank" className="text-primary-bronze hover:underline">
                    Termos de Uso
                  </a>
                  {' '}e a{' '}
                  <a href="/politica-privacidade" target="_blank" className="text-primary-bronze hover:underline">
                    Política de Privacidade
                  </a>
                </label>
              </div>
            </div>
          </>
        )}

        {/* Se está logado e falta dados */}
        {user && dadosCompradorFaltando.length > 0 && (
          <>
            <div className="bg-primary-gold/10 border border-primary-gold/30 p-4 rounded-sm mb-4">
              <p className="text-sm text-primary-white/80 mb-3">
                Complete seus dados para prosseguir com a compra:
              </p>
              <ul className="list-disc list-inside text-xs text-primary-white/70 space-y-1">
                {dadosCompradorFaltando.map((campo) => (
                  <li key={campo}>{campo}</li>
                ))}
              </ul>
            </div>

            {dadosCompradorFaltando.includes('telefone') && (
              <Input
                type="tel"
                placeholder="Telefone"
                value={dadosComprador.telefone}
                onChange={(e) => setDadosComprador({ ...dadosComprador, telefone: e.target.value })}
                required
                className="bg-dark-bg/50"
              />
            )}

            {dadosCompradorFaltando.includes('cpf') && (
              <Input
                type="text"
                placeholder="CPF"
                value={dadosComprador.cpf}
                onChange={(e) => setDadosComprador({ ...dadosComprador, cpf: e.target.value })}
                required
                className="bg-dark-bg/50"
              />
            )}

            <div className="flex items-center gap-2 mt-4">
              <input
                type="checkbox"
                checked={salvarDadosComprador}
                onChange={(e) => setSalvarDadosComprador(e.target.checked)}
                className="w-4 h-4 accent-primary-bronze"
              />
              <label className="text-sm text-primary-white/70">
                Salvar estes dados no meu perfil
              </label>
            </div>
          </>
        )}

        {/* Se está logado e tem todos os dados */}
        {user && dadosCompradorFaltando.length === 0 && (
          <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-sm">
            <div className="flex items-center gap-2 mb-2">
              <Check className="text-green-500" size={20} />
              <span className="font-semibold">Dados completos</span>
            </div>
            <div className="text-sm text-primary-white/70 space-y-1">
              <p>{user.firstName} {user.lastName}</p>
              <p>{user.email}</p>
              <p>{user.phone} • CPF: {user.cpf}</p>
            </div>
          </div>
        )}

        <Button type="submit" className="w-full mt-6">
          Continuar para Entrega
        </Button>
      </form>
    </motion.div>
  );
}
