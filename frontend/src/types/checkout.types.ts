/**
 * Tipos TypeScript para o fluxo de Checkout
 */

export type CheckoutStep = 'comprador' | 'destinatario' | 'pagamento' | 'confirmacao';

export interface DadosComprador {
  nome: string;
  sobrenome: string;
  email: string;
  telefone: string;
  cpf: string;
}

export interface DadosDestinatario {
  nomeCompleto: string;
  telefone: string;
}

export interface DadosEntrega {
  cep: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export interface DadosPagamento {
  metodo: 'pix' | 'credit_card';
  // Dados do cartão (apenas para credit_card)
  numeroCartao: string;
  nomeCartao: string;
  validade: string;
  cvv: string;
  cpfTitular: string;
}

export interface CheckoutFormData {
  comprador: DadosComprador;
  destinatario: DadosDestinatario;
  entrega: DadosEntrega;
  pagamento: DadosPagamento;
}

export interface CheckoutState {
  etapa: CheckoutStep;
  dadosComprador: DadosComprador;
  dadosCompradorFaltando: string[];
  salvarDadosComprador: boolean;
  senha: string;
  confirmarSenha: string;
  aceitouTermos: boolean;
  dataNascimento: string;
  dadosDestinatario: DadosDestinatario;
  destinatarioIgualComprador: boolean;
  dadosEntrega: DadosEntrega;
  dadosPagamento: DadosPagamento;
  salvarEndereco: boolean;
  enderecoSelecionadoId: string | null;
  mostrarModalTitulo: boolean;
  tituloNovoEndereco: string;
}
