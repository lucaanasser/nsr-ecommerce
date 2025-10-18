import handlebars from 'handlebars';
import path from 'path';
import fs from 'fs/promises';
import { emailTransporter, emailDefaults } from '@config/email';
import { config } from '@config/env';
import { logger } from '@config/logger';
import {
  EmailOptions,
  EmailResult,
  WelcomeEmailData,
  OrderConfirmationEmailData,
  OrderStatusUpdateEmailData,
  PasswordResetEmailData,
  BaseTemplateData,
  OrderDetails,
  OrderItem,
} from '../types/email.types';

/**
 * Serviço de Email
 * Responsável por enviar emails transacionais usando templates Handlebars
 */
export class EmailService {
  private templateCache: Map<string, HandlebarsTemplateDelegate> = new Map();
  private readonly templatePath = path.join(__dirname, '../templates');

  /**
   * Carrega e compila um template Handlebars
   */
  private async loadTemplate(templateName: string): Promise<HandlebarsTemplateDelegate> {
    // Verificar cache
    if (this.templateCache.has(templateName)) {
      return this.templateCache.get(templateName)!;
    }

    // Carregar template do disco
    const templateFile = path.join(this.templatePath, `${templateName}.hbs`);
    const templateSource = await fs.readFile(templateFile, 'utf-8');
    const template = handlebars.compile(templateSource);

    // Adicionar ao cache
    this.templateCache.set(templateName, template);

    return template;
  }

  /**
   * Renderiza o template base com os dados fornecidos
   */
  private async renderTemplate(data: BaseTemplateData): Promise<string> {
    const template = await this.loadTemplate('base');
    return template({
      ...data,
      frontendUrl: config.frontend.url,
    });
  }

  /**
   * Envia um email
   */
  private async sendEmail(options: EmailOptions): Promise<EmailResult> {
    try {
      const info = await emailTransporter.sendMail({
        from: options.from || emailDefaults.from,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        replyTo: options.replyTo,
        cc: options.cc,
        bcc: options.bcc,
      });

      logger.info('Email sent successfully', {
        messageId: info.messageId,
        to: options.to,
        subject: options.subject,
      });

      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      logger.error('Failed to send email', {
        error,
        to: options.to,
        subject: options.subject,
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Formata valor monetário
   */
  private formatCurrency(value: number): string {
    return value.toFixed(2).replace('.', ',');
  }

  /**
   * Formata data e hora
   */
  private formatDateTime(date: Date): string {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }

  /**
   * Traduz status do pedido
   */
  private translateOrderStatus(status: string): { text: string; class: string } {
    const statusMap: Record<string, { text: string; class: string }> = {
      PENDING: { text: 'Aguardando Pagamento', class: 'pending' },
      PAID: { text: 'Pago', class: 'paid' },
      PROCESSING: { text: 'Em Processamento', class: 'processing' },
      SHIPPED: { text: 'Enviado', class: 'shipped' },
      DELIVERED: { text: 'Entregue', class: 'delivered' },
      CANCELLED: { text: 'Cancelado', class: 'cancelled' },
      REFUNDED: { text: 'Reembolsado', class: 'cancelled' },
    };

    return statusMap[status] || { text: status, class: 'pending' };
  }

  // ================================
  // PUBLIC METHODS
  // ================================

  /**
   * Envia email de boas-vindas para novo usuário
   */
  async sendWelcomeEmail(data: WelcomeEmailData): Promise<EmailResult> {
    try {
      const content = `
        <p>Seja muito bem-vindo(a) à <strong>NSR</strong>! 🎉</p>
        <p>Estamos muito felizes em ter você conosco. Sua conta foi criada com sucesso e agora você pode aproveitar tudo que temos a oferecer.</p>
        <p><strong>O que você pode fazer agora:</strong></p>
        <ul style="margin: 15px 0; padding-left: 20px;">
          <li style="margin: 8px 0;">Explorar nossos produtos exclusivos de streetwear</li>
          <li style="margin: 8px 0;">Salvar seus produtos favoritos</li>
          <li style="margin: 8px 0;">Receber ofertas e lançamentos exclusivos</li>
          <li style="margin: 8px 0;">Acompanhar seus pedidos em tempo real</li>
        </ul>
      `;

      const templateData: BaseTemplateData = {
        subject: 'Bem-vindo à NSR! 🎉',
        userName: data.userName,
        content,
        buttonText: 'Explorar Produtos',
        buttonUrl: `${config.frontend.url}/produtos`,
        additionalInfo: '<p>Se tiver alguma dúvida, nossa equipe está à disposição para ajudar.</p>',
        frontendUrl: config.frontend.url,
      };

      const html = await this.renderTemplate(templateData);

      return await this.sendEmail({
        to: data.userEmail,
        subject: templateData.subject,
        html,
      });
    } catch (error) {
      logger.error('Failed to send welcome email', { error, data });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Envia email de confirmação de pedido
   */
  async sendOrderConfirmation(data: OrderConfirmationEmailData): Promise<EmailResult> {
    try {
      const content = `
        <p>Recebemos seu pedido com sucesso! 🎉</p>
        <p>Obrigado por comprar na NSR. Estamos preparando tudo com muito carinho para você.</p>
        <p>Você receberá atualizações sobre o status do seu pedido por email.</p>
      `;

      // Formatar itens do pedido
      const items: OrderItem[] = data.items.map((item) => ({
        name: item.productName,
        variant: [item.size, item.color].filter(Boolean).join(' - '),
        quantity: item.quantity,
        price: this.formatCurrency(item.price),
        total: this.formatCurrency(item.price * item.quantity),
      }));

      // Montar detalhes do pedido
      const orderDetails: OrderDetails = {
        orderNumber: data.orderNumber,
        date: this.formatDateTime(data.orderDate),
        statusClass: 'pending',
        statusText: 'Aguardando Pagamento',
        items,
        subtotal: this.formatCurrency(data.subtotal),
        shippingCost: this.formatCurrency(data.shippingCost),
        discount: data.discount > 0 ? this.formatCurrency(data.discount) : undefined,
        total: this.formatCurrency(data.total),
        shippingAddress: data.shippingAddress,
      };

      const templateData: BaseTemplateData = {
        subject: `Pedido Confirmado - ${data.orderNumber}`,
        userName: data.userName,
        content,
        buttonText: 'Acompanhar Pedido',
        buttonUrl: `${config.frontend.url}/perfil/pedidos`,
        orderDetails,
        additionalInfo: `
          <p><strong>Forma de Pagamento:</strong> ${data.paymentMethod}</p>
          <p style="color: #666; font-size: 14px;">
            Assim que o pagamento for confirmado, começaremos a preparar seu pedido.
          </p>
        `,
        frontendUrl: config.frontend.url,
      };

      const html = await this.renderTemplate(templateData);

      return await this.sendEmail({
        to: data.userEmail,
        subject: templateData.subject,
        html,
      });
    } catch (error) {
      logger.error('Failed to send order confirmation email', { error, data });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Envia email de atualização de status do pedido
   */
  async sendOrderStatusUpdate(data: OrderStatusUpdateEmailData): Promise<EmailResult> {
    try {
      const statusInfo = this.translateOrderStatus(data.newStatus);
      
      let content = `
        <p>Temos uma atualização sobre seu pedido <strong>${data.orderNumber}</strong>.</p>
        <p style="font-size: 16px; margin: 20px 0;">
          Status anterior: <strong>${this.translateOrderStatus(data.oldStatus).text}</strong><br>
          <span style="font-size: 18px;">Novo status: <strong>${statusInfo.text}</strong></span>
        </p>
      `;

      if (data.statusMessage) {
        content += `<p>${data.statusMessage}</p>`;
      }

      if (data.trackingCode) {
        content += `
          <p style="margin-top: 20px;">
            <strong>Código de Rastreamento:</strong><br>
            <code style="background: #f4f4f4; padding: 8px 12px; border-radius: 4px; font-size: 14px; display: inline-block; margin-top: 5px;">
              ${data.trackingCode}
            </code>
          </p>
        `;
      }

      const templateData: BaseTemplateData = {
        subject: `Atualização do Pedido ${data.orderNumber}`,
        userName: data.userName,
        content,
        buttonText: 'Ver Detalhes do Pedido',
        buttonUrl: `${config.frontend.url}/perfil/pedidos`,
        additionalInfo: '<p>Continue acompanhando seu pedido através da área de Meus Pedidos.</p>',
        frontendUrl: config.frontend.url,
      };

      const html = await this.renderTemplate(templateData);

      return await this.sendEmail({
        to: data.userEmail,
        subject: templateData.subject,
        html,
      });
    } catch (error) {
      logger.error('Failed to send order status update email', { error, data });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Envia email de redefinição de senha
   */
  async sendPasswordReset(data: PasswordResetEmailData): Promise<EmailResult> {
    try {
      const resetUrl = `${config.frontend.url}/recuperar-senha?token=${data.resetToken}`;

      const content = `
        <p>Recebemos uma solicitação para redefinir a senha da sua conta NSR.</p>
        <p>Se você não fez esta solicitação, por favor ignore este email. Sua senha permanecerá a mesma.</p>
        <p><strong>Para redefinir sua senha, clique no botão abaixo:</strong></p>
      `;

      const templateData: BaseTemplateData = {
        subject: 'Redefinição de Senha - NSR',
        userName: data.userName,
        content,
        buttonText: 'Redefinir Senha',
        buttonUrl: resetUrl,
        additionalInfo: `
          <p style="color: #d9534f; font-weight: 600;">
            ⚠️ Este link expira em ${data.expiresIn}.
          </p>
          <p style="font-size: 13px; color: #666;">
            Se o botão não funcionar, copie e cole este link no seu navegador:<br>
            <a href="${resetUrl}" style="color: #0066cc; word-break: break-all;">${resetUrl}</a>
          </p>
        `,
        frontendUrl: config.frontend.url,
      };

      const html = await this.renderTemplate(templateData);

      return await this.sendEmail({
        to: data.userEmail,
        subject: templateData.subject,
        html,
      });
    } catch (error) {
      logger.error('Failed to send password reset email', { error, data });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Limpa o cache de templates (útil em desenvolvimento)
   */
  clearTemplateCache(): void {
    this.templateCache.clear();
    logger.info('Email template cache cleared');
  }
}

// Exportar instância única (singleton)
export const emailService = new EmailService();
