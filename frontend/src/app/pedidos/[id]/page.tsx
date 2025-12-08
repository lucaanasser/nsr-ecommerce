'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, Package, CreditCard, Clock, Copy, CheckCheck, AlertCircle } from 'lucide-react';
import Image from 'next/image';

// Layouts
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';

// Services
import { orderService, type Order } from '@/services';

/**
 * Página de Confirmação do Pedido
 * Exibe detalhes do pedido, status do pagamento e QR Code PIX (se aplicável)
 */
export default function OrderConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pixCopied, setPixCopied] = useState(false);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const orderData = await orderService.getOrderById(orderId);
        setOrder(orderData);
      } catch (err: any) {
        console.error('Erro ao buscar pedido:', err);
        setError(err.response?.data?.message || 'Erro ao carregar pedido');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleCopyPixCode = async () => {
    if (order?.payment?.pixQrCode) {
      try {
        await navigator.clipboard.writeText(order.payment.pixQrCode);
        setPixCopied(true);
        setTimeout(() => setPixCopied(false), 2000);
      } catch (err) {
        console.error('Erro ao copiar código PIX:', err);
        alert('Erro ao copiar código. Tente selecionar manualmente.');
      }
    }
  };

  const getPaymentStatusInfo = () => {
    if (!order?.payment) return null;

    const status = order.payment.status;
    const method = order.paymentMethod;

    if (status === 'PAID') {
      return {
        icon: <CheckCircle className="text-green-500" size={24} />,
        title: 'Pagamento Confirmado',
        description: 'Seu pagamento foi aprovado com sucesso!',
        color: 'text-green-500',
        bg: 'bg-green-500/10',
        border: 'border-green-500/30',
      };
    }

    if (status === 'PENDING' && method === 'PIX') {
      return {
        icon: <Clock className="text-yellow-500" size={24} />,
        title: 'Aguardando Pagamento PIX',
        description: 'Escaneie o QR Code ou use o código Pix Copia e Cola abaixo',
        color: 'text-yellow-500',
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/30',
      };
    }

    if (status === 'DECLINED') {
      return {
        icon: <AlertCircle className="text-red-500" size={24} />,
        title: 'Pagamento Recusado',
        description: 'Houve um problema com o pagamento. Entre em contato conosco.',
        color: 'text-red-500',
        bg: 'bg-red-500/10',
        border: 'border-red-500/30',
      };
    }

    return {
      icon: <Clock className="text-primary-bronze" size={24} />,
      title: 'Processando Pagamento',
      description: 'Seu pagamento está sendo processado...',
      color: 'text-primary-bronze',
      bg: 'bg-primary-bronze/10',
      border: 'border-primary-bronze/30',
    };
  };

  // Loading state
  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-dark-bg pt-24 pb-16">
          <Container>
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-bronze mx-auto mb-4"></div>
                <p className="text-primary-white/60">Carregando pedido...</p>
              </div>
            </div>
          </Container>
        </main>
        <Footer />
      </>
    );
  }

  // Error state
  if (error || !order) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-dark-bg pt-24 pb-16">
          <Container>
            <div className="text-center py-20">
              <AlertCircle size={64} className="mx-auto mb-4 text-red-500" />
              <h1 className="text-3xl font-bold mb-4">Pedido não encontrado</h1>
              <p className="text-primary-white/60 mb-8">
                {error || 'Não foi possível encontrar este pedido.'}
              </p>
              <Button onClick={() => router.push('/perfil/pedidos')}>
                Ver Meus Pedidos
              </Button>
            </div>
          </Container>
        </main>
        <Footer />
      </>
    );
  }

  const paymentInfo = getPaymentStatusInfo();
  const isPix = order.paymentMethod === 'PIX';
  const isPixPending = isPix && order.payment?.status === 'PENDING';

  return (
    <>
      <Header />

      <main className="min-h-screen bg-dark-bg pt-24 pb-16">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            {/* Header de Confirmação */}
            <div className="text-center mb-8">
              <CheckCircle size={64} className="mx-auto mb-4 text-primary-bronze" />
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary-bronze" style={{ fontFamily: 'NSR, sans-serif' }}>
                Pedido Realizado!
              </h1>
              <p className="text-lg text-primary-white/80">
                Pedido <span className="font-semibold text-primary-bronze">#{order.orderNumber}</span>
              </p>
            </div>

            {/* Status do Pagamento */}
            {paymentInfo && (
              <div className={`${paymentInfo.bg} ${paymentInfo.border} border rounded-sm p-6 mb-6`}>
                <div className="flex items-start gap-4">
                  {paymentInfo.icon}
                  <div className="flex-1">
                    <h2 className={`text-xl font-semibold ${paymentInfo.color} mb-2`}>
                      {paymentInfo.title}
                    </h2>
                    <p className="text-primary-white/70">
                      {paymentInfo.description}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* QR Code PIX */}
            {isPixPending && order.payment?.pixQrCodeBase64 && (
              <div className="bg-dark-card border border-dark-border rounded-sm p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <CreditCard size={24} className="text-primary-bronze" />
                  Pagamento via PIX
                </h3>

                <div className="bg-white p-4 rounded-sm inline-block mb-4">
                  <Image
                    src={`data:image/png;base64,${order.payment.pixQrCodeBase64}`}
                    alt="QR Code PIX"
                    width={256}
                    height={256}
                    className="mx-auto"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-primary-white/70">
                      Ou copie o código Pix Copia e Cola:
                    </label>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-dark-bg/50 border border-dark-border rounded-sm p-3 overflow-x-auto">
                        <code className="text-xs text-primary-white/80 font-mono break-all">
                          {order.payment.pixQrCode}
                        </code>
                      </div>
                      <Button
                        variant="secondary"
                        onClick={handleCopyPixCode}
                        className="flex items-center gap-2 whitespace-nowrap"
                      >
                        {pixCopied ? (
                          <>
                            <CheckCheck size={18} />
                            Copiado!
                          </>
                        ) : (
                          <>
                            <Copy size={18} />
                            Copiar
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {order.payment.pixExpiresAt && (
                    <p className="text-sm text-primary-white/60">
                      ⏰ Este QR Code expira em:{' '}
                      <span className="font-semibold">
                        {new Date(order.payment.pixExpiresAt).toLocaleString('pt-BR')}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Detalhes do Pedido */}
            <div className="bg-dark-card border border-dark-border rounded-sm p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Package size={24} className="text-primary-bronze" />
                Detalhes do Pedido
              </h3>

              <div className="space-y-4">
                {/* Itens */}
                <div>
                  <h4 className="font-medium mb-2 text-primary-white/70">Itens:</h4>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-3 bg-dark-bg/50 rounded-sm">
                        {item.product.images[0] && (
                          <Image
                            src={item.product.images[0].url}
                            alt={item.product.name}
                            width={60}
                            height={60}
                            className="rounded-sm object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-primary-white/60">
                            Tamanho: {item.size} {item.color && `• Cor: ${item.color}`}
                          </p>
                          <p className="text-sm text-primary-white/60">
                            Quantidade: {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold">
                          R$ {item.subtotal.toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Endereço de Entrega */}
                <div>
                  <h4 className="font-medium mb-2 text-primary-white/70">Endereço de Entrega:</h4>
                  <div className="p-3 bg-dark-bg/50 rounded-sm text-sm">
                    <p>{order.shippingAddress.street}, {order.shippingAddress.number}</p>
                    {order.shippingAddress.complement && <p>{order.shippingAddress.complement}</p>}
                    <p>{order.shippingAddress.neighborhood}</p>
                    <p>{order.shippingAddress.city} - {order.shippingAddress.state}</p>
                    <p>CEP: {order.shippingAddress.zipCode}</p>
                  </div>
                </div>

                {/* Resumo dos Valores */}
                <div className="border-t border-dark-border pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-primary-white/70">
                      <span>Subtotal:</span>
                      <span>R$ {order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-primary-white/70">
                      <span>Frete:</span>
                      <span>R$ {order.shippingCost.toFixed(2)}</span>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between text-green-500">
                        <span>Desconto:</span>
                        <span>- R$ {order.discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xl font-bold pt-2 border-t border-dark-border">
                      <span>Total:</span>
                      <span className="text-primary-bronze">R$ {order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="flex gap-4 justify-center">
              <Button variant="secondary" onClick={() => router.push('/loja')}>
                Continuar Comprando
              </Button>
              <Button onClick={() => router.push('/perfil/pedidos')}>
                Ver Meus Pedidos
              </Button>
            </div>
          </motion.div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
