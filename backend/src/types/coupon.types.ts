export interface CouponValidation {
  isValid: boolean;
  coupon?: {
    id: string;
    code: string;
    discountType: string;
    discountValue: number;
  };
  error?: string;
}

export interface CouponApplication {
  discountAmount: number;
  finalTotal: number;
}
