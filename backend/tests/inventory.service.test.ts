import { inventoryService } from '@services/inventory.service';
import { prisma } from '@config/database';

jest.mock('@config/database', () => {
  const product = { findUnique: jest.fn() };
  return { prisma: { product } };
});

const mockedPrisma = prisma as unknown as {
  product: { findUnique: jest.Mock };
};

describe('inventoryService.validateStockAvailability', () => {
  beforeEach(() => {
    mockedPrisma.product.findUnique.mockReset();
  });

  it('returns available when stock is sufficient', async () => {
    mockedPrisma.product.findUnique.mockResolvedValue({ stock: 5, name: 'Produto' });

    const result = await inventoryService.validateStockAvailability([
      { productId: 'p1', quantity: 2 },
    ]);

    expect(result.available).toBe(true);
    expect(result.unavailableItems).toHaveLength(0);
  });

  it('returns unavailable with productName when stock is insufficient', async () => {
    mockedPrisma.product.findUnique.mockResolvedValue({ stock: 1, name: 'Produto X' });

    const result = await inventoryService.validateStockAvailability([
      { productId: 'p1', quantity: 3 },
    ]);

    expect(result.available).toBe(false);
    expect(result.unavailableItems[0]).toMatchObject({
      productId: 'p1',
      productName: 'Produto X',
      requestedQuantity: 3,
      availableQuantity: 1,
    });
  });

  it('returns unavailable when product is missing', async () => {
    mockedPrisma.product.findUnique.mockResolvedValue(null);

    const result = await inventoryService.validateStockAvailability([
      { productId: 'missing', quantity: 1 },
    ]);

    expect(result.available).toBe(false);
    expect(result.unavailableItems[0]).toMatchObject({
      productId: 'missing',
      availableQuantity: 0,
    });
  });
});
