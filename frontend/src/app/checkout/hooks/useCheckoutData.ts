/**
 * Hook customizado para gerenciar dados do checkout
 * Centraliza todos os estados do checkout em um único lugar
 */

import { useState } from 'react';
import type { 
  CheckoutStep, 
  DadosComprador, 
  DadosDestinatario, 
  DadosEntrega, 
  DadosPagamento 
} from '@/types/checkout.types';

export function useCheckoutData() {
  // Etapa atual
  const [etapa, setEtapa] = useState<CheckoutStep>('comprador');

  // Estados - Comprador
  const [dadosComprador, setDadosComprador] = useState<DadosComprador>({
    nome: '',
    sobrenome: '',
    email: '',
    telefone: '',
    cpf: '',
  });
  const [dadosCompradorFaltando, setDadosCompradorFaltando] = useState<string[]>([]);
  const [salvarDadosComprador, setSalvarDadosComprador] = useState(false);
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [dataNascimento, setDataNascimento] = useState('');

  // Estados - Destinatário
  const [dadosDestinatario, setDadosDestinatario] = useState<DadosDestinatario>({
    nomeCompleto: '',
    telefone: '',
  });
  const [destinatarioIgualComprador, setDestinatarioIgualComprador] = useState(true);

  // Estados - Entrega
  const [dadosEntrega, setDadosEntrega] = useState<DadosEntrega>({
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
  });
  const [salvarEndereco, setSalvarEndereco] = useState(false);
  const [enderecoSelecionadoId, setEnderecoSelecionadoId] = useState<string | null>(null);
  const [mostrarModalTitulo, setMostrarModalTitulo] = useState(false);
  const [tituloNovoEndereco, setTituloNovoEndereco] = useState('');

  // Estados - Pagamento
  const [dadosPagamento, setDadosPagamento] = useState<DadosPagamento>({
    numeroCartao: '',
    nomeCartao: '',
    validade: '',
    cvv: '',
  });

  return {
    // Etapa
    etapa,
    setEtapa,
    
    // Comprador
    dadosComprador,
    setDadosComprador,
    dadosCompradorFaltando,
    setDadosCompradorFaltando,
    salvarDadosComprador,
    setSalvarDadosComprador,
    senha,
    setSenha,
    confirmarSenha,
    setConfirmarSenha,
    aceitouTermos,
    setAceitouTermos,
    dataNascimento,
    setDataNascimento,
    
    // Destinatário
    dadosDestinatario,
    setDadosDestinatario,
    destinatarioIgualComprador,
    setDestinatarioIgualComprador,
    
    // Entrega
    dadosEntrega,
    setDadosEntrega,
    salvarEndereco,
    setSalvarEndereco,
    enderecoSelecionadoId,
    setEnderecoSelecionadoId,
    mostrarModalTitulo,
    setMostrarModalTitulo,
    tituloNovoEndereco,
    setTituloNovoEndereco,
    
    // Pagamento
    dadosPagamento,
    setDadosPagamento,
  };
}
