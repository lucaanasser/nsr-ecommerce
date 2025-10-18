// Exportar todos os serviços de um único ponto
export { authService } from './auth.service';
export { productService } from './product.service';
export { cartService } from './cart.service';
export { orderService } from './order.service';
export { shippingService } from './shipping.service';
export { api, getErrorMessage } from './api';

// Exportar tipos comuns
export type {
  ApiResponse,
  PaginatedResponse,
  ApiError,
} from './api';

export type {
  RegisterData,
  LoginData,
  AuthUser,
  AuthResponse,
  UpdateProfileData,
  ChangePasswordData,
} from './auth.service';

export type {
  Product,
  ProductImage,
  ProductVariant,
  ProductFilters,
} from './product.service';

export type {
  Cart,
  CartItem,
  AddToCartData,
  UpdateCartItemData,
} from './cart.service';

export type {
  Order,
  OrderItem,
  Address,
  CreateOrderData,
  OrderFilters,
} from './order.service';

export type {
  ShippingOption,
  CalculateShippingData,
  ShippingMethod,
} from './shipping.service';
