import { prisma } from '@config/database';
import { CalculateShippingInput, ShippingCalculation } from '../types/shipping.types';

export class ShippingService {
  /**
   * Calcula frete baseado em peso e métodos cadastrados no banco
   */
  async calculateShipping(input: CalculateShippingInput): Promise<ShippingCalculation> {
    // 1. Buscar métodos de envio ativos
    const methods = await prisma.shippingMethod.findMany({
      where: { isActive: true }
    });

    // 2. Buscar produtos do carrinho para pegar pesos
    const products = await prisma.product.findMany({
      where: {
        id: { in: input.items.map(i => i.productId) }
      }
    });

    // 3. Calcular peso total
    const totalWeight = this.calculateTotalWeight(products, input.items);

    // 4. Calcular custo de cada método
    const options = methods.map(method => {
      let cost = Number(method.baseCost);

      // Adiciona custo por peso
      if (totalWeight > 1) {
        const extraWeight = totalWeight - 1;
        cost += Number(method.perKgCost) * extraWeight;
      }

      // Verifica frete grátis
      const isFree = method.freeAbove 
        ? input.cartTotal >= Number(method.freeAbove)
        : false;

      return {
        id: method.id,
        name: method.name,
        description: method.description || '',
        cost: isFree ? 0 : cost,
        estimatedDays: {
          min: method.minDays,
          max: method.maxDays
        },
        isFree
      };
    });

    return { methods: options };
  }

  /**
   * Lista todos os métodos de envio disponíveis
   */
  async getShippingMethods() {
    return prisma.shippingMethod.findMany({
      where: { isActive: true },
      orderBy: { baseCost: 'asc' }
    });
  }

  /**
   * Calcula peso total dos produtos
   */
  private calculateTotalWeight(products: any[], items: any[]): number {
    return items.reduce((total, item) => {
      const product = products.find(p => p.id === item.productId);
      const weight = product?.weight ? Number(product.weight) : 0.5; // 0.5kg padrão
      return total + (weight * item.quantity);
    }, 0);
  }
}
