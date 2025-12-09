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
    
    const sanitized = JSON.parse(JSON.stringify(data)); // Deep clone
    
    // Remove dados do cartão
    if (sanitized.charges) {
      sanitized.charges = sanitized.charges.map((charge: any) => {
        if (charge.payment_method?.card) {
          return {
            ...charge,
            payment_method: {
              ...charge.payment_method,
              card: {
                encrypted: '[REDACTED]',
                holder: charge.payment_method.card.holder // Manter holder no log para debug
              },
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

      // Validações
      const customerCpf = data.customer.cpf.replace(/\D/g, '');
      const holderCpf = data.creditCard.holderCpf.replace(/\D/g, '');
      const postalCode = data.address.zipCode.replace(/\D/g, '');

      logger.info('Validating payment data', {
        customerCpfLength: customerCpf.length,
        holderCpfLength: holderCpf.length,
        holderName: data.creditCard.holderName,
        postalCodeLength: postalCode.length,
        addressNumber: data.address.number,
        neighborhood: data.address.neighborhood,
      });

      if (customerCpf.length !== 11) {
        throw new Error(`CPF do cliente inválido: ${customerCpf} (${customerCpf.length} dígitos)`);
      }
      if (holderCpf.length !== 11) {
        throw new Error(`CPF do titular do cartão inválido: ${holderCpf} (${holderCpf.length} dígitos)`);
      }
      if (!data.creditCard.holderName || data.creditCard.holderName.trim() === '') {
        throw new Error('Nome do titular do cartão é obrigatório');
      }
      if (postalCode.length !== 8) {
        throw new Error(`CEP inválido: ${postalCode} (${postalCode.length} dígitos)`);
      }
      if (!data.address.number || data.address.number.trim() === '') {
        throw new Error('Número do endereço é obrigatório');
      }
      if (!data.address.neighborhood || data.address.neighborhood.trim() === '') {
        throw new Error('Bairro é obrigatório');
      }

      const request: CreateChargeRequest = {
        reference_id: data.orderId,
        customer: {
          name: data.customer.name,
          email: data.customer.email,
          tax_id: customerCpf,
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
            ...(data.address.complement && { complement: data.address.complement }),
            locality: data.address.neighborhood,
            city: data.address.city,
            region_code: data.address.state,
            country: 'BRA',
            postal_code: postalCode,
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
                  name: data.creditCard.holderName.toUpperCase().trim(),
                  tax_id: holderCpf,
                },
              },
            },
          },
        ],
      };

      // Log detalhado antes de enviar
      logger.info('Sending request to PagBank - Detailed payload', {
        reference_id: request.reference_id,
        customer: {
          name: request.customer?.name,
          email: request.customer?.email,
          tax_id: request.customer?.tax_id,
          tax_id_length: request.customer?.tax_id?.length,
          phones: request.customer?.phones,
        },
        items_count: request.items?.length,
        shipping: {
          ...request.shipping?.address,
          postal_code_length: request.shipping?.address?.postal_code?.length,
        },
        charges: [{
          reference_id: request.charges?.[0]?.reference_id,
          amount: request.charges?.[0]?.amount,
          payment_method: {
            type: request.charges?.[0]?.payment_method?.type,
            installments: request.charges?.[0]?.payment_method?.installments,
            capture: request.charges?.[0]?.payment_method?.capture,
            card: {
              has_encrypted: !!request.charges?.[0]?.payment_method?.card?.encrypted,
              encrypted_length: request.charges?.[0]?.payment_method?.card?.encrypted?.length,
              holder: request.charges?.[0]?.payment_method?.card?.holder,
            }
          }
        }],
        notification_urls: request.notification_urls,
      });

      const response = await this.client.post<ChargeResponse>(
        '/orders',
        request
      );

      return this.mapChargeResponse(response.data);
    } catch (error) {
      // Log detalhado do erro antes de processar
      if (axios.isAxiosError(error) && error.response) {
        logger.error('PagBank Credit Card Error - Full Response', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          orderId: data.orderId,
        });
      }
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
    
    // O chargeId correto está dentro de charges[0].id, não no charge.id (que é o orderId)
    const chargeId = charge.charges?.[0]?.id || charge.id;
    
    const result: PaymentResult = {
      success: true, // Se chegou aqui, foi criado com sucesso
      chargeId: chargeId,
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
        // Logar todos os erros para debug
        logger.error('PagBank detailed errors', {
          errors: pagbankError.error_messages,
          fullResponse: pagbankError,
        });

        const firstError = pagbankError.error_messages[0];
        
        // Construir mensagem mais descritiva
        let errorMessage = firstError?.description || 'Erro desconhecido';
        
        // Se tiver parameter_name ou error, adicionar à mensagem
        if (firstError && typeof firstError === 'object') {
          const errorObj = firstError as any;
          if (errorObj.parameter_name) {
            errorMessage += ` (campo: ${errorObj.parameter_name})`;
          }
          if (errorObj.error) {
            errorMessage = errorObj.error;
          }
        }
        
        return {
          success: false,
          status: 'DECLINED',
          errorMessage,
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
   * Mapeia status do PagBank para status do sistema
   */
  public mapChargeStatusToPaymentStatus(pagbankStatus: ChargeStatus): string {
    const statusMap: Record<ChargeStatus, string> = {
      'WAITING': 'WAITING',           // PIX gerado, aguardando pagamento
      'IN_ANALYSIS': 'IN_ANALYSIS',   // Em análise antifraude
      'PAID': 'PAID',                 // Pago e confirmado
      'AVAILABLE': 'PAID',            // Disponível = Pago
      'AUTHORIZED': 'AUTHORIZED',     // Cartão pré-autorizado
      'DECLINED': 'DECLINED',         // Recusado
      'CANCELED': 'CANCELLED',        // Cancelado
      'IN_DISPUTE': 'IN_ANALYSIS',    // Disputa = análise
      'RETURNED': 'REFUNDED',         // Devolvido = reembolsado
    };

    return statusMap[pagbankStatus] || 'PENDING';
  }

  /**
   * Faz parse de um telefone brasileiro
   */
  private parsePhone(phone: string): { country: string; area: string; number: string; type: 'MOBILE' } {
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length < 10 || cleaned.length > 11) {
      throw new Error(`Telefone inválido: ${phone} (deve ter 10 ou 11 dígitos)`);
    }
    
    // Formato esperado: (11) 99999-9999 -> 11999999999
    const area = cleaned.slice(0, 2);
    const number = cleaned.slice(2);

    if (number.length < 8 || number.length > 9) {
      throw new Error(`Número de telefone inválido: ${number} (deve ter 8 ou 9 dígitos)`);
    }

    return {
      country: '55',
      area,
      number,
      type: 'MOBILE',
    };
  }
}

export const pagbankService = new PagBankService();
