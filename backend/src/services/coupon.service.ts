/**
 * Service responsável por validação e aplicação de cupons de desconto.
 * Implementa regras de negócio para uso de cupons no checkout.
 */
import { prisma } from '@config/database';
import { BadRequestError } from '@utils/errors';
import { CouponValidation, CouponApplication } from '../types/coupon.types';

export class CouponService {
  /**
   * Valida se um cupom pode ser usado
   */
  async validateCoupon(code: string, cartTotal: number): Promise<CouponValidation> {
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() }
    });

    // Verificações
    if (!coupon) {
      throw new BadRequestError('Cupom inválido');
    }

    if (!coupon.isActive) {
      throw new BadRequestError('Cupom inativo');
    }

    const now = new Date();
    if (now < coupon.startDate || now > coupon.endDate) {
      throw new BadRequestError('Cupom fora do período de validade');
    }

    if (coupon.minPurchase && cartTotal < Number(coupon.minPurchase)) {
      throw new BadRequestError(
        `Compra mínima de R$ ${coupon.minPurchase} para usar este cupom`
      );
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      throw new BadRequestError('Cupom atingiu limite de uso');
    }

    return {
      isValid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: Number(coupon.discountValue)
      }
    };
  }

  /**
   * Calcula o desconto do cupom
   */
  async applyCoupon(code: string, cartTotal: number): Promise<CouponApplication> {
    const { coupon } = await this.validateCoupon(code, cartTotal);

    if (!coupon) {
      throw new BadRequestError('Erro ao validar cupom');
    }

    let discountAmount = 0;

    if (coupon.discountType === 'percentage') {
      discountAmount = (cartTotal * coupon.discountValue) / 100;

      // Aplica desconto máximo
      const maxDiscount = await this.getMaxDiscount(coupon.id);
      if (maxDiscount && discountAmount > maxDiscount) {
        discountAmount = maxDiscount;
      }
    } else {
      // Desconto fixo
      discountAmount = coupon.discountValue;
    }

    // Desconto não pode ser maior que o total
    discountAmount = Math.min(discountAmount, cartTotal);

    return {
      discountAmount,
      finalTotal: cartTotal - discountAmount
    };
  }

  /**
   * Busca desconto máximo permitido para o cupom
   */
  private async getMaxDiscount(couponId: string): Promise<number | null> {
    const coupon = await prisma.coupon.findUnique({
      where: { id: couponId }
    });
    return coupon?.maxDiscount ? Number(coupon.maxDiscount) : null;
  }
}
