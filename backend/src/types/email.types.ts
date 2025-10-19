/**
 * Tipos e interfaces para envio, template e dados de emails transacionais do sistema.
 */
/**
 * Tipos para o serviço de email
 */

// ================================
// EMAIL BASE TYPES
// ================================

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
}

// ================================
// TEMPLATE DATA TYPES
// ================================

export interface OrderItem {
  name: string;
  variant?: string; // Ex: "P - Preto"
  quantity: number;
  price: string; // Formatado: "99,90"
  total: string; // Formatado: "199,80"
}

export interface ShippingAddress {
  receiverName: string;
  receiverPhone: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface OrderDetails {
  orderNumber: string;
  date: string; // Formatado: "18/10/2025 às 14:30"
  statusClass: string; // CSS class: "pending", "paid", "processing", etc.
  statusText: string; // Texto em PT: "Aguardando Pagamento", "Pago", etc.
  items?: OrderItem[];
  subtotal: string; // Formatado: "299,90"
  shippingCost: string; // Formatado: "15,00"
  discount?: string; // Formatado: "30,00"
  total: string; // Formatado: "314,90"
  shippingAddress?: ShippingAddress;
}

export interface BaseTemplateData {
  subject: string;
  userName?: string;
  content: string; // HTML content
  buttonText?: string;
  buttonUrl?: string;
  orderDetails?: OrderDetails;
  additionalInfo?: string; // HTML content
  frontendUrl: string;
}

// ================================
// EMAIL SERVICE TYPES
// ================================

export interface WelcomeEmailData {
  userName: string;
  userEmail: string;
}

export interface OrderConfirmationEmailData {
  userName: string;
  userEmail: string;
  orderNumber: string;
  orderDate: Date;
  items: {
    productName: string;
    size?: string;
    color?: string;
    quantity: number;
    price: number;
  }[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  shippingAddress: {
    receiverName: string;
    receiverPhone: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  paymentMethod: string;
}

export interface OrderStatusUpdateEmailData {
  userName: string;
  userEmail: string;
  orderNumber: string;
  oldStatus: string;
  newStatus: string;
  statusMessage: string;
  trackingCode?: string;
}

export interface PasswordResetEmailData {
  userName: string;
  userEmail: string;
  resetToken: string;
  expiresIn: string; // Ex: "1 hora"
}

// ================================
// EMAIL RESULT
// ================================

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}
