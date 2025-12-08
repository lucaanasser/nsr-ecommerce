/**
 * Serviço de integração com a API do PagBank
 * Gerencia criação de cobranças, consultas e cancelamentos
 */
import axios, { AxiosInstance, AxiosError } from 'axios';
import { pagbankConfig } from '@config/pagbank';
import { logger } from '@config/logger.colored';
import {
  CreateChargeRequest,
  ChargeResponse,
  CreatePaymentData,
  PaymentResult,
  PagBankError,
  ChargeStatus,
} from '../types/pagbank.types';

class PagBankService {
  private client: AxiosInstance;

  constructor() {
    logger.info('Initializing PagBank Service', {
      apiUrl: pagbankConfig.apiUrl,
      tokenLength: pagbankConfig.token.length,
      tokenStart: pagbankConfig.token.substring(0, 20),
    });
    
    this.client = axios.create({
      baseURL: pagbankConfig.apiUrl,
      headers: {
        'Authorization': `Bearer ${pagbankConfig.token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      timeout: 30000, // 30 segundos
    });

    // Interceptor para logs
    this.client.interceptors.request.use((config) => {
      logger.info('PagBank API Request', {
        method: config.method,
        url: config.url,
        data: this.sanitizeLogData(config.data),
      });
      return config;
    });

    this.client.interceptors.response.use(
      (response) => {
        logger.info('PagBank API Response', {
          status: response.status,
          data: this.sanitizeLogData(response.data),
        });
        return response;
      },
      (error: AxiosError) => {
        logger.error('PagBank API Error', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        return Promise.reject(error);
      }
    );
  }

  /**
   * Remove dados sensíveis dos logs
   */
  private sanitizeLogData(data: any): any {
    if (!data) return data;
    
    const sanitized = { ...data };
    
    // Remove dados do cartão
    if (sanitized.charges) {
      sanitized.charges = sanitized.charges.map((charge: any) => {
        if (charge.payment_method?.card) {
          return {
            ...charge,
            payment_method: {
              ...charge.payment_method,
              card: { encrypted: '[REDACTED]' },
            },
          };
        }
        return charge;
      });
    }
    
    return sanitized;
  }

  /**
   * Cria uma cobrança com cartão de crédito
   */
  async createCreditCardCharge(data: CreatePaymentData): Promise<PaymentResult> {
    try {
      if (!data.creditCard) {
        throw new Error('Dados do cartão de crédito não fornecidos');
      }

      const request: CreateChargeRequest = {
        reference_id: data.orderId,
        customer: {
          name: data.customer.name,
          email: data.customer.email,
          tax_id: data.customer.cpf.replace(/\D/g, ''),
          phones: [this.parsePhone(data.customer.phone)],
        },
        items: data.items.map((item, index) => ({
          reference_id: `item-${index + 1}`,
          name: item.name,
          quantity: item.quantity,
          unit_amount: Math.round(item.unitAmount * 100), // Converter para centavos
        })),
        shipping: {
          address: {
            street: data.address.street,
            number: data.address.number,
            complement: data.address.complement || '',
            locality: data.address.neighborhood,
            city: data.address.city,
            region_code: data.address.state,
            country: 'BRA',
            postal_code: data.address.zipCode.replace(/\D/g, ''),
          },
        },
        notification_urls: pagbankConfig.notificationUrl
          ? [pagbankConfig.notificationUrl]
          : [],
        charges: [
          {
            reference_id: data.orderId,
            description: `Pedido ${data.orderId}`,
            amount: {
              value: Math.round(data.amount * 100), // Converter para centavos
              currency: 'BRL',
            },
            payment_method: {
              type: 'CREDIT_CARD',
              installments: 1,
              capture: true,
              card: {
                encrypted: data.creditCard.encrypted,
                holder: {
                  name: data.creditCard.holderName,
                  tax_id: data.creditCard.holderCpf.replace(/\D/g, ''),
                },
              },
            },
          },
        ],
      };

      const response = await this.client.post<ChargeResponse>(
        '/orders',
        request
      );

      return this.mapChargeResponse(response.data);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Cria uma cobrança com PIX
   */
  async createPixCharge(data: CreatePaymentData): Promise<PaymentResult> {
    try {
      const request: CreateChargeRequest = {
        reference_id: data.orderId,
        customer: {
          name: data.customer.name,
          email: data.customer.email,
          tax_id: data.customer.cpf.replace(/\D/g, ''),
          phones: [this.parsePhone(data.customer.phone)],
        },
        items: data.items.map((item, index) => ({
          reference_id: `item-${index + 1}`,
          name: item.name,
          quantity: item.quantity,
          unit_amount: Math.round(item.unitAmount * 100),
        })),
        notification_urls: pagbankConfig.notificationUrl
          ? [pagbankConfig.notificationUrl]
          : [],
        qr_codes: [
          {
            amount: {
              value: Math.round(data.amount * 100),
            },
          },
        ],
      };

      const response = await this.client.post<ChargeResponse>(
        '/orders',
        request
      );

      return this.mapChargeResponse(response.data);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Consulta o status de uma cobrança
   */
  async getChargeStatus(chargeId: string): Promise<PaymentResult> {
    try {
      const response = await this.client.get<ChargeResponse>(
        `/orders/${chargeId}`
      );

      return this.mapChargeResponse(response.data);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Cancela uma cobrança
   */
  async cancelCharge(chargeId: string): Promise<boolean> {
    try {
      await this.client.post(`/orders/${chargeId}/cancel`);
      logger.info('Charge cancelled successfully', { chargeId });
      return true;
    } catch (error) {
      logger.error('Failed to cancel charge', { chargeId, error });
      return false;
    }
  }

  /**
   * Realiza um estorno (refund)
   */
  async refundCharge(chargeId: string, amount?: number): Promise<boolean> {
    try {
      const data = amount
        ? { amount: { value: Math.round(amount * 100) } }
        : {};

      await this.client.post(`/orders/${chargeId}/refund`, data);
      logger.info('Charge refunded successfully', { chargeId, amount });
      return true;
    } catch (error) {
      logger.error('Failed to refund charge', { chargeId, error });
      return false;
    }
  }

  /**
   * Mapeia a resposta do PagBank para o formato interno
   */
  private mapChargeResponse(charge: any): PaymentResult {
    // Para orders com PIX, não tem status na raiz
    const status = charge.status || (charge.qr_codes ? 'WAITING' : 'DECLINED');
    
    const result: PaymentResult = {
      success: true, // Se chegou aqui, foi criado com sucesso
      chargeId: charge.id,
      status: status as ChargeStatus,
    };

    // Dados do PIX (diretamente no root da response para orders)
    if (charge.qr_codes?.[0]) {
      const qrCode = charge.qr_codes[0];
      result.pixQrCode = qrCode.text;
      result.pixQrCodeImage = qrCode.links?.find((l: any) => l.media === 'image/png')?.href;
      result.pixExpiresAt = new Date(qrCode.expiration_date);
    }
    
    // Dados do PIX (dentro de payment_method para charges)
    if (charge.payment_method?.pix?.qr_codes?.[0]) {
      const qrCode = charge.payment_method.pix.qr_codes[0];
      result.pixQrCode = qrCode.text;
      result.pixQrCodeImage = qrCode.links[0]?.href;
      result.pixExpiresAt = new Date(qrCode.expiration_date);
    }

    // Mensagem de erro
    if (charge.payment_response?.message) {
      result.errorMessage = charge.payment_response.message;
      result.errorCode = charge.payment_response.code;
      result.success = false;
    }

    return result;
  }

  /**
   * Trata erros da API
   */
  private handleError(error: unknown): PaymentResult {
    if (axios.isAxiosError(error)) {
      const pagbankError = error.response?.data as PagBankError | undefined;
      
      if (pagbankError?.error_messages && pagbankError.error_messages.length > 0) {
        const firstError = pagbankError.error_messages[0];
        return {
          success: false,
          status: 'DECLINED',
          errorMessage: firstError?.description || 'Erro desconhecido',
          errorCode: firstError?.code,
        };
      }
    }

    return {
      success: false,
      status: 'DECLINED',
      errorMessage:
        error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }

  /**
   * Faz parse de um telefone brasileiro
   */
  private parsePhone(phone: string): { country: string; area: string; number: string; type: 'MOBILE' } {
    const cleaned = phone.replace(/\D/g, '');
    
    // Formato esperado: (11) 99999-9999 -> 11999999999
    const area = cleaned.slice(0, 2);
    const number = cleaned.slice(2);

    return {
      country: '55',
      area,
      number,
      type: 'MOBILE',
    };
  }
}

export const pagbankService = new PagBankService();
