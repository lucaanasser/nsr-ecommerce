export interface ShippingCalculation {
  methods: ShippingOption[];
}

export interface ShippingOption {
  id: string;
  name: string;
  description?: string;
  cost: number;
  estimatedDays: { min: number; max: number };
  isFree: boolean;
}

export interface CalculateShippingInput {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  zipCode: string;
  cartTotal: number;
}
