/**
 * Dados Financeiros Mockados - NSR
 * Foco em empresa iniciante/pequena
 */

// Interface de Custo de Produto
export interface ProductCost {
  productId: string;
  productName: string;
  costs: {
    materials: number;      // Matéria-prima (tecido, aviamentos)
    labor: number;         // Mão de obra / facção
    packaging: number;     // Embalagem e etiquetas
    shipping: number;      // Frete para receber produto
  };
  totalCost: number;
  sellingPrice: number;
  markup: number;           // Multiplicador (preço/custo)
  marginPercent: number;    // Margem de lucro %
  unitsProduced: number;    // Unidades já produzidas
}

// Interface de Despesa
export interface Expense {
  id: string;
  date: string;
  category: 'marketing' | 'operacional' | 'producao';
  subcategory: string;
  description: string;
  amount: number;
  isPaid: boolean;
}

// Interface de Meta
export interface FinancialGoal {
  month: string;
  revenueGoal: number;      // Meta de faturamento
  expensesBudget: number;   // Orçamento de despesas
  profitGoal: number;       // Meta de lucro
  actualRevenue: number;    // Realizado
  actualExpenses: number;
  actualProfit: number;
}

// Custos por Produto (apenas 3-4 produtos iniciais)
export const productCosts: ProductCost[] = [
  {
    productId: '1',
    productName: 'Oversized Tee Geometric',
    costs: {
      materials: 28.00,      // Tecido + aviamentos
      labor: 18.00,         // Facção/costura
      packaging: 6.00,      // Saco + etiqueta + tag
      shipping: 3.50,       // Frete unitário
    },
    totalCost: 55.50,
    sellingPrice: 189.90,
    markup: 3.42,
    marginPercent: 70.8,
    unitsProduced: 0,        // Ainda não produziu
  },
  {
    productId: '2',
    productName: 'Calça Cargo Urban',
    costs: {
      materials: 45.00,
      labor: 28.00,
      packaging: 8.00,
      shipping: 5.00,
    },
    totalCost: 86.00,
    sellingPrice: 299.90,
    markup: 3.49,
    marginPercent: 71.3,
    unitsProduced: 0,
  },
  {
    productId: '3',
    productName: 'Moletom Medina',
    costs: {
      materials: 52.00,
      labor: 32.00,
      packaging: 8.00,
      shipping: 6.00,
    },
    totalCost: 98.00,
    sellingPrice: 349.90,
    markup: 3.57,
    marginPercent: 72.0,
    unitsProduced: 0,
  },
];

// Despesas da marca (iniciais/planejadas)
export const expenses: Expense[] = [
  // Marketing
  {
    id: 'EXP-001',
    date: '2025-10-01',
    category: 'marketing',
    subcategory: 'Fotografia',
    description: 'Ensaio fotográfico produtos (lookbook)',
    amount: 1200.00,
    isPaid: true,
  },
  {
    id: 'EXP-002',
    date: '2025-10-05',
    category: 'marketing',
    subcategory: 'Social Media',
    description: 'Anúncios Instagram/Meta - Outubro',
    amount: 500.00,
    isPaid: true,
  },
  {
    id: 'EXP-003',
    date: '2025-10-10',
    category: 'marketing',
    subcategory: 'Branding',
    description: 'Design de embalagens e etiquetas',
    amount: 800.00,
    isPaid: true,
  },
  
  // Operacional
  {
    id: 'EXP-004',
    date: '2025-10-01',
    category: 'operacional',
    subcategory: 'Infraestrutura',
    description: 'Desenvolvimento do site/e-commerce',
    amount: 2500.00,
    isPaid: true,
  },
  {
    id: 'EXP-005',
    date: '2025-10-15',
    category: 'operacional',
    subcategory: 'Serviços',
    description: 'Registro de marca (INPI)',
    amount: 355.00,
    isPaid: false,
  },
  {
    id: 'EXP-006',
    date: '2025-10-20',
    category: 'operacional',
    subcategory: 'Ferramentas',
    description: 'Assinatura ferramentas (Canva, hosting)',
    amount: 150.00,
    isPaid: false,
  },

  // Produção (planejada)
  {
    id: 'EXP-007',
    date: '2025-11-01',
    category: 'producao',
    subcategory: 'Amostra',
    description: 'Produção de 5 peças piloto',
    amount: 450.00,
    isPaid: false,
  },
];

// Estatísticas financeiras gerais
export const financialStats = {
  // Capital inicial investido
  initialInvestment: 10000.00,
  
  // Gastos até agora
  totalSpent: 5505.00,
  
  // Breakdown de gastos
  spentByCategory: {
    marketing: 2500.00,
    operacional: 3005.00,
    producao: 0.00,
  },
  
  // Orçamento restante
  remainingBudget: 4495.00,
  
  // Previsão de primeira produção
  firstProductionPlan: {
    totalUnits: 50,           // 50 peças no total
    totalCost: 4000.00,      // Custo estimado
    projectedRevenue: 12000.00, // Se vender tudo
    projectedProfit: 8000.00,
  },
  
  // Break-even
  breakEven: {
    unitsToSell: 23,          // Precisa vender 23 peças para empatar
    revenue: 5505.00,         // Faturamento necessário
  },
};

// Meta mensal (iniciante - realista)
export const monthlyGoal: FinancialGoal = {
  month: 'Novembro 2025',
  revenueGoal: 8000.00,       // Meta modesta para iniciante
  expensesBudget: 3000.00,    // Limite de gastos
  profitGoal: 5000.00,        // Lucro esperado
  actualRevenue: 0.00,        // Ainda não faturou
  actualExpenses: 0.00,
  actualProfit: 0.00,
};

// Projeção de crescimento (próximos 6 meses)
export const growthProjection = [
  { month: 'Nov', revenue: 8000, expenses: 3000, profit: 5000 },
  { month: 'Dez', revenue: 15000, expenses: 5000, profit: 10000 },
  { month: 'Jan', revenue: 12000, expenses: 4000, profit: 8000 },
  { month: 'Fev', revenue: 18000, expenses: 6000, profit: 12000 },
  { month: 'Mar', revenue: 22000, expenses: 7000, profit: 15000 },
  { month: 'Abr', revenue: 25000, expenses: 8000, profit: 17000 },
];

// Calculadora de precificação
export function calculatePricing(
  productionCost: number,
  desiredMargin: number // em porcentagem (ex: 70)
): {
  suggestedPrice: number;
  markup: number;
  profit: number;
} {
  const suggestedPrice = productionCost / (1 - desiredMargin / 100);
  const markup = suggestedPrice / productionCost;
  const profit = suggestedPrice - productionCost;
  
  return {
    suggestedPrice: Math.ceil(suggestedPrice / 10) * 10 - 0.10, // Arredonda para .90
    markup: parseFloat(markup.toFixed(2)),
    profit: parseFloat(profit.toFixed(2)),
  };
}

// Análise de viabilidade
export function analyzeViability(
  productCost: number,
  sellingPrice: number,
  monthlyFixedCosts: number,
  estimatedMonthlySales: number
): {
  isViable: boolean;
  breakEvenUnits: number;
  projectedProfit: number;
  marginPercent: number;
} {
  const unitProfit = sellingPrice - productCost;
  const marginPercent = (unitProfit / sellingPrice) * 100;
  const breakEvenUnits = Math.ceil(monthlyFixedCosts / unitProfit);
  const projectedProfit = (estimatedMonthlySales * unitProfit) - monthlyFixedCosts;
  
  return {
    isViable: projectedProfit > 0 && marginPercent > 50, // Margem mínima de 50%
    breakEvenUnits,
    projectedProfit,
    marginPercent: parseFloat(marginPercent.toFixed(1)),
  };
}
