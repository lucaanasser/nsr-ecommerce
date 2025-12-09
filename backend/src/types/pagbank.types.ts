/**
 * Tipos TypeScript para integração com a API do PagBank
 * Documentação: https://dev.pagseguro.uol.com.br/reference/api-de-pagamentos
 */

// ================================
// REQUEST TYPES
// ================================

export interface CreateChargeRequest {
  reference_id: string; // ID do pedido interno
  customer: Customer;
  items: ChargeItem[];
  shipping?: Shipping;
  notification_urls?: string[];
  charges?: ChargePayment[]; // Para cartão de crédito
  qr_codes?: QrCode[]; // Para PIX
}

export interface QrCode {
  amount: {
    value: number; // Valor em centavos
  };
  expiration_date?: string;
}

export interface Customer {
  name: string;
  email: string;
  tax_id: string; // CPF
  phones: Phone[];
}

export interface Phone {
  country: string; // "55"
  area: string; // "11"
  number: string; // "999999999"
  type: 'MOBILE' | 'HOME' | 'BUSINESS';
}

export interface ChargeItem {
  reference_id: string;
  name: string;
  quantity: number;
  unit_amount: number; // Valor em centavos
}

export interface Shipping {
  address: Address;
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  locality: string; // Bairro
  city: string;
  region_code: string; // UF (SP, RJ, etc)
  country: string; // "BRA"
  postal_code: string; // CEP sem hífen
}

export interface ChargePayment {
  reference_id?: string;
  description?: string;
  amount: {
    value: number; // Valor total em centavos
    currency: 'BRL';
  };
  payment_method: {
    type: 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX';
    installments?: number;
    capture?: boolean;
    card?: CreditCard;
    holder?: CardHolder; // Holder fica fora de card
  };
}

export interface CreditCard {
  encrypted: string; // Dados do cartão criptografados
  security_code?: string;
  store?: boolean;
}

export interface CardHolder {
  name: string;
  tax_id: string; // CPF
}

// ================================
// RESPONSE TYPES
// ================================

export interface ChargeResponse {
  id: string; // ID da cobrança no PagBank
  reference_id: string;
  status: ChargeStatus;
  created_at: string;
  paid_at?: string;
  description?: string;
  amount: {
    value: number;
    currency: string;
    summary?: {
      total: number;
      paid: number;
      refunded: number;
    };
  };
  payment_response?: {
    code: string;
    message: string;
    reference: string;
  };
  payment_method: {
    type: string;
    pix?: PixDetails;
    card?: CardDetails;
  };
  links?: Link[];
}

export interface PixDetails {
  qr_codes: Array<{
    id: string;
    text: string; // Código PIX copia e cola
    links: Array<{
      rel: string;
      href: string; // URL do QR Code em imagem
      media: string;
      type: string;
    }>;
    expiration_date: string;
  }>;
}

export interface CardDetails {
  brand: string;
  first_digits: string;
  last_digits: string;
  exp_month: string;
  exp_year: string;
  holder: {
    name: string;
  };
}

export interface Link {
  rel: string;
  href: string;
  media?: string;
  type?: string;
}

export type ChargeStatus =
  | 'WAITING' // Aguardando pagamento
  | 'IN_ANALYSIS' // Em análise
  | 'PAID' // Pago
  | 'AVAILABLE' // Disponível
  | 'IN_DISPUTE' // Em disputa
  | 'RETURNED' // Devolvido
  | 'CANCELED' // Cancelado
  | 'DECLINED' // Recusado
  | 'AUTHORIZED'; // Autorizado (cartão)

// ================================
// WEBHOOK TYPES
// ================================

export interface WebhookNotification {
  id: string;
  reference_id: string;
  created_at: string;
  charges?: ChargeResponse[];
}

// ================================
// ERROR TYPES
// ================================

export interface PagBankError {
  error_messages: Array<{
    code: string;
    description: string;
    parameter_name?: string;
  }>;
}

// ================================
// INTERNAL MAPPING TYPES
// ================================

export interface CreatePaymentData {
  orderId: string;
  amount: number;
  method: 'CREDIT_CARD' | 'PIX';
  customer: {
    name: string;
    email: string;
    cpf: string;
    phone: string;
  };
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    unitAmount: number;
  }>;
  creditCard?: {
    encrypted: string;
    holderName: string;
    holderCpf: string;
  };
}

export interface PaymentResult {
  success: boolean;
  chargeId?: string;
  status: ChargeStatus;
  pixQrCode?: string;
  pixQrCodeImage?: string;
  pixExpiresAt?: Date;
  errorMessage?: string;
  errorCode?: string;
}
