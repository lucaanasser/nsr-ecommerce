/**
 * PagBank Service
 * Integração com PagBank para criptografia de cartão e criação de pedidos
 */

// Tipos do PagBank SDK (declarados globalmente via script)
declare global {
  interface Window {
    PagSeguro?: {
      encryptCard(data: {
        publicKey: string;
        holder: string;
        number: string;
        expMonth: string;
        expYear: string;
        securityCode: string;
      }): Promise<{
        encryptedCard: string;
        hasErrors: boolean;
        errors?: Array<{
          code: string;
          message: string;
        }>;
      }>;
    };
  }
}

export interface CardData {
  number: string;
  holder: string;
  expMonth: string;
  expYear: string;
  cvv: string;
}

export interface EncryptedCardData {
  encrypted: string;
  holderName: string;
  holderCpf: string;
}

export class PagBankService {
  private publicKey: string;
  private sdkLoaded: boolean = false;

  constructor() {
    this.publicKey = process.env.NEXT_PUBLIC_PAGBANK_PUBLIC_KEY || '';
  }

  /**
   * Carrega o SDK do PagBank
   */
  async loadSDK(): Promise<void> {
    if (this.sdkLoaded || typeof window === 'undefined') {
      return;
    }

    return new Promise((resolve, reject) => {
      // Verificar se já está carregado
      if (window.PagSeguro) {
        this.sdkLoaded = true;
        resolve();
        return;
      }

      // Criar script tag
      const script = document.createElement('script');
      script.src = 'https://assets.pagseguro.com.br/checkout-sdk-js/rc/dist/browser/pagseguro.min.js';
      script.async = true;

      script.onload = () => {
        this.sdkLoaded = true;
        console.log('✅ PagBank SDK carregado com sucesso');
        resolve();
      };

      script.onerror = () => {
        console.error('❌ Erro ao carregar PagBank SDK');
        reject(new Error('Falha ao carregar SDK do PagBank'));
      };

      document.head.appendChild(script);
    });
  }

  /**
   * Aguarda o SDK estar disponível
   */
  private async ensureSDKLoaded(): Promise<void> {
    if (!this.sdkLoaded) {
      await this.loadSDK();
    }

    // Aguardar até que window.PagSeguro esteja disponível
    let attempts = 0;
    while (!window.PagSeguro && attempts < 50) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }

    if (!window.PagSeguro) {
      throw new Error('PagBank SDK não está disponível');
    }
  }

  /**
   * Criptografa os dados do cartão usando o SDK do PagBank
   */
  async encryptCard(cardData: CardData, holderCpf: string): Promise<EncryptedCardData> {
    await this.ensureSDKLoaded();

    if (!window.PagSeguro) {
      throw new Error('SDK do PagBank não está carregado');
    }

    if (!this.publicKey) {
      throw new Error('Chave pública do PagBank não configurada');
    }

    try {
      // Limpar número do cartão (remover espaços e traços)
      const cleanCardNumber = cardData.number.replace(/\s|-/g, '');

      const result = await window.PagSeguro.encryptCard({
        publicKey: this.publicKey,
        holder: cardData.holder,
        number: cleanCardNumber,
        expMonth: cardData.expMonth,
        expYear: cardData.expYear,
        securityCode: cardData.cvv,
      });

      if (result.hasErrors) {
        const errorMessages = result.errors?.map(e => e.message).join(', ') || 'Erro desconhecido';
        throw new Error(`Erro ao criptografar cartão: ${errorMessages}`);
      }

      return {
        encrypted: result.encryptedCard,
        holderName: cardData.holder,
        holderCpf: holderCpf,
      };
    } catch (error) {
      console.error('Erro ao criptografar cartão:', error);
      throw error;
    }
  }

  /**
   * Valida formato do número do cartão (Luhn algorithm)
   */
  validateCardNumber(number: string): boolean {
    const cleanNumber = number.replace(/\s|-/g, '');
    
    if (!/^\d+$/.test(cleanNumber)) {
      return false;
    }

    let sum = 0;
    let isEven = false;

    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanNumber[i], 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  /**
   * Detecta bandeira do cartão
   */
  getCardBrand(number: string): string | null {
    const cleanNumber = number.replace(/\s|-/g, '');

    const patterns: Record<string, RegExp> = {
      visa: /^4/,
      mastercard: /^5[1-5]/,
      amex: /^3[47]/,
      elo: /^(4011|4312|4389|4514|4573|5041|5066|5067|5090|6277|6362|6363|6504|6505|6516)/,
      hipercard: /^(38|60)/,
    };

    for (const [brand, pattern] of Object.entries(patterns)) {
      if (pattern.test(cleanNumber)) {
        return brand;
      }
    }

    return null;
  }

  /**
   * Formata número do cartão com espaços
   */
  formatCardNumber(number: string): string {
    const cleaned = number.replace(/\s/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  }

  /**
   * Valida CPF
   */
  validateCPF(cpf: string): boolean {
    const cleanCpf = cpf.replace(/\D/g, '');

    if (cleanCpf.length !== 11) {
      return false;
    }

    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cleanCpf)) {
      return false;
    }

    // Validar primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCpf[i]) * (10 - i);
    }
    let digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(cleanCpf[9])) {
      return false;
    }

    // Validar segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCpf[i]) * (11 - i);
    }
    digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(cleanCpf[10])) {
      return false;
    }

    return true;
  }

  /**
   * Formata CPF
   */
  formatCPF(cpf: string): string {
    const cleaned = cpf.replace(/\D/g, '');
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
}

export const pagbankService = new PagBankService();
