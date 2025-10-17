/**
 * Dados Mockados para o Painel Administrativo
 */

// Interface de Pedido
export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    size: string;
    price: number;
  }[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  paymentMethod: string;
}

// Interface de Cliente
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  registeredAt: string;
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'inactive';
}

// Interface de Estoque
export interface StockItem {
  productId: string;
  productName: string;
  size: string;
  quantity: number;
  minStock: number;
  category: string;
}

// Estatísticas do Dashboard
export const dashboardStats = {
  totalSales: 127450.80,
  totalOrders: 342,
  totalProducts: 8,
  totalCustomers: 156,
  trends: {
    sales: { value: 12.5, isPositive: true },
    orders: { value: 8.3, isPositive: true },
    products: { value: 0, isPositive: true },
    customers: { value: 15.2, isPositive: true },
  },
};

// Vendas por dia (últimos 7 dias)
export const dailySales = [
  { day: 'Seg', sales: 12300 },
  { day: 'Ter', sales: 15600 },
  { day: 'Qua', sales: 18900 },
  { day: 'Qui', sales: 14200 },
  { day: 'Sex', sales: 21400 },
  { day: 'Sáb', sales: 25800 },
  { day: 'Dom', sales: 19250 },
];

// Pedidos mockados
export const mockOrders: Order[] = [
  {
    id: 'PED-001',
    customerName: 'João Silva',
    customerEmail: 'joao.silva@email.com',
    date: '2025-10-17',
    status: 'pending',
    total: 539.80,
    items: [
      {
        productId: '1',
        productName: 'Oversized Tee Geometric',
        quantity: 2,
        size: 'M',
        price: 189.90,
      },
      {
        productId: '3',
        productName: 'Moletom Medina',
        quantity: 1,
        size: 'G',
        price: 349.90,
      },
    ],
    shippingAddress: {
      street: 'Rua das Flores, 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
    },
    paymentMethod: 'Cartão de Crédito',
  },
  {
    id: 'PED-002',
    customerName: 'Maria Santos',
    customerEmail: 'maria.santos@email.com',
    date: '2025-10-17',
    status: 'processing',
    total: 489.80,
    items: [
      {
        productId: '4',
        productName: 'Crop Top Arabesque',
        quantity: 1,
        size: 'M',
        price: 189.90,
      },
      {
        productId: '2',
        productName: 'Calça Cargo Urban',
        quantity: 1,
        size: '40',
        price: 299.90,
      },
    ],
    shippingAddress: {
      street: 'Av. Paulista, 1000',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100',
    },
    paymentMethod: 'PIX',
  },
  {
    id: 'PED-003',
    customerName: 'Carlos Oliveira',
    customerEmail: 'carlos.oliveira@email.com',
    date: '2025-10-16',
    status: 'shipped',
    total: 699.80,
    items: [
      {
        productId: '3',
        productName: 'Moletom Medina',
        quantity: 2,
        size: 'G',
        price: 349.90,
      },
    ],
    shippingAddress: {
      street: 'Rua Augusta, 456',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01305-000',
    },
    paymentMethod: 'Cartão de Crédito',
  },
  {
    id: 'PED-004',
    customerName: 'Ana Costa',
    customerEmail: 'ana.costa@email.com',
    date: '2025-10-16',
    status: 'delivered',
    total: 189.90,
    items: [
      {
        productId: '1',
        productName: 'Oversized Tee Geometric',
        quantity: 1,
        size: 'P',
        price: 189.90,
      },
    ],
    shippingAddress: {
      street: 'Rua Oscar Freire, 789',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01426-001',
    },
    paymentMethod: 'PIX',
  },
  {
    id: 'PED-005',
    customerName: 'Pedro Martins',
    customerEmail: 'pedro.martins@email.com',
    date: '2025-10-15',
    status: 'cancelled',
    total: 299.90,
    items: [
      {
        productId: '2',
        productName: 'Calça Cargo Urban',
        quantity: 1,
        size: '42',
        price: 299.90,
      },
    ],
    shippingAddress: {
      street: 'Rua Haddock Lobo, 321',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01414-001',
    },
    paymentMethod: 'Boleto',
  },
];

// Clientes mockados
export const mockCustomers: Customer[] = [
  {
    id: 'CLI-001',
    name: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '(11) 98765-4321',
    registeredAt: '2025-01-15',
    totalOrders: 8,
    totalSpent: 2340.50,
    status: 'active',
  },
  {
    id: 'CLI-002',
    name: 'Maria Santos',
    email: 'maria.santos@email.com',
    phone: '(11) 97654-3210',
    registeredAt: '2025-02-20',
    totalOrders: 5,
    totalSpent: 1890.00,
    status: 'active',
  },
  {
    id: 'CLI-003',
    name: 'Carlos Oliveira',
    email: 'carlos.oliveira@email.com',
    phone: '(11) 96543-2109',
    registeredAt: '2025-03-10',
    totalOrders: 12,
    totalSpent: 4567.80,
    status: 'active',
  },
  {
    id: 'CLI-004',
    name: 'Ana Costa',
    email: 'ana.costa@email.com',
    phone: '(11) 95432-1098',
    registeredAt: '2025-04-05',
    totalOrders: 3,
    totalSpent: 890.70,
    status: 'active',
  },
  {
    id: 'CLI-005',
    name: 'Pedro Martins',
    email: 'pedro.martins@email.com',
    phone: '(11) 94321-0987',
    registeredAt: '2024-12-01',
    totalOrders: 1,
    totalSpent: 299.90,
    status: 'inactive',
  },
];

// Estoque mockado
export const mockStock: StockItem[] = [
  {
    productId: '1',
    productName: 'Oversized Tee Geometric',
    size: 'P',
    quantity: 15,
    minStock: 10,
    category: 'masculino',
  },
  {
    productId: '1',
    productName: 'Oversized Tee Geometric',
    size: 'M',
    quantity: 8,
    minStock: 10,
    category: 'masculino',
  },
  {
    productId: '1',
    productName: 'Oversized Tee Geometric',
    size: 'G',
    quantity: 12,
    minStock: 10,
    category: 'masculino',
  },
  {
    productId: '1',
    productName: 'Oversized Tee Geometric',
    size: 'GG',
    quantity: 3,
    minStock: 10,
    category: 'masculino',
  },
  {
    productId: '2',
    productName: 'Calça Cargo Urban',
    size: '38',
    quantity: 20,
    minStock: 8,
    category: 'masculino',
  },
  {
    productId: '2',
    productName: 'Calça Cargo Urban',
    size: '40',
    quantity: 5,
    minStock: 8,
    category: 'masculino',
  },
  {
    productId: '2',
    productName: 'Calça Cargo Urban',
    size: '42',
    quantity: 15,
    minStock: 8,
    category: 'masculino',
  },
  {
    productId: '3',
    productName: 'Moletom Medina',
    size: 'P',
    quantity: 10,
    minStock: 10,
    category: 'masculino',
  },
  {
    productId: '3',
    productName: 'Moletom Medina',
    size: 'M',
    quantity: 7,
    minStock: 10,
    category: 'masculino',
  },
  {
    productId: '3',
    productName: 'Moletom Medina',
    size: 'G',
    quantity: 4,
    minStock: 10,
    category: 'masculino',
  },
  {
    productId: '4',
    productName: 'Crop Top Arabesque',
    size: 'P',
    quantity: 18,
    minStock: 12,
    category: 'feminino',
  },
  {
    productId: '4',
    productName: 'Crop Top Arabesque',
    size: 'M',
    quantity: 2,
    minStock: 12,
    category: 'feminino',
  },
];
