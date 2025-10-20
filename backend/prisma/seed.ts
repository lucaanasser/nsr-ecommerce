/**
 * Script de seed para popular o banco de dados com dados iniciais.
 * Cria categorias, coleções, métodos de frete, cupons, usuários, endereços, produtos e reviews.
 * Út  const admin = await prisma.user.upsert({
    where: { email: 'admin@nsr.com' },
    update: {},
    create: {
      email: 'admin@nsr.com',
      password: adminPassword,
      firstName: 'Administrador',
      lastName: 'NSR',
      role: 'ADMIN',
      phone: '11999999999',
    },
  });envolvimento, testes e ambiente de homologação.
 */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...\n');

  // ================================
  // 1. CATEGORIES
  // ================================
  console.log('📦 Creating categories...');
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'camisetas' },
      update: {},
      create: {
        name: 'Camisetas',
        slug: 'camisetas',
        description: 'Camisetas de alta qualidade com designs exclusivos',
        order: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'calcas' },
      update: {},
      create: {
        name: 'Calças',
        slug: 'calcas',
        description: 'Calças confortáveis e estilosas',
        order: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'acessorios' },
      update: {},
      create: {
        name: 'Acessórios',
        slug: 'acessorios',
        description: 'Acessórios que complementam seu look',
        order: 3,
      },
    }),
  ]);
  console.log(`✓ Created ${categories.length} categories\n`);

  // ================================
  // 2. COLLECTIONS
  // ================================
  console.log('🎨 Creating collections...');
  const collections = await Promise.all([
    prisma.collection.upsert({
      where: { slug: 'verao-2025' },
      update: {},
      create: {
        name: 'Verão 2025',
        slug: 'verao-2025',
        description: 'Coleção de verão com peças leves e coloridas',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-03-31'),
      },
    }),
    prisma.collection.upsert({
      where: { slug: 'essentials' },
      update: {},
      create: {
        name: 'Essentials',
        slug: 'essentials',
        description: 'Peças essenciais para o dia a dia',
      },
    }),
  ]);
  console.log(`✓ Created ${collections.length} collections\n`);

  // ================================
  // 3. SHIPPING METHODS
  // ================================
  console.log('🚚 Creating shipping methods...');
  const shippingMethods = await Promise.all([
    prisma.shippingMethod.upsert({
      where: { name: 'PAC' },
      update: {},
      create: {
        name: 'PAC',
        description: 'Correios - Encomenda econômica',
        baseCost: 15.00,
        perKgCost: 5.00,
        freeAbove: 200.00,
        minDays: 7,
        maxDays: 15,
        isActive: true,
      },
    }),
    prisma.shippingMethod.upsert({
      where: { name: 'SEDEX' },
      update: {},
      create: {
        name: 'SEDEX',
        description: 'Correios - Encomenda expressa',
        baseCost: 25.00,
        perKgCost: 8.00,
        minDays: 2,
        maxDays: 5,
        isActive: true,
      },
    }),
    prisma.shippingMethod.upsert({
      where: { name: 'Entrega Expressa' },
      update: {},
      create: {
        name: 'Entrega Expressa',
        description: 'Entrega em até 24h (regiões metropolitanas)',
        baseCost: 40.00,
        perKgCost: 10.00,
        minDays: 1,
        maxDays: 2,
        isActive: true,
      },
    }),
  ]);
  console.log(`✓ Created ${shippingMethods.length} shipping methods\n`);

  // ================================
  // 4. COUPONS
  // ================================
  console.log('🎟️ Creating coupons...');
  const coupons = await Promise.all([
    prisma.coupon.upsert({
      where: { code: 'BEMVINDO10' },
      update: {},
      create: {
        code: 'BEMVINDO10',
        description: 'Desconto de boas-vindas para novos clientes',
        discountType: 'percentage',
        discountValue: 10,
        minPurchase: 100.00,
        maxDiscount: 50.00,
        usageLimit: 1000,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
        isActive: true,
      },
    }),
    prisma.coupon.upsert({
      where: { code: 'FRETEGRATIS' },
      update: {},
      create: {
        code: 'FRETEGRATIS',
        description: 'Frete grátis em qualquer compra',
        discountType: 'fixed',
        discountValue: 999.00, // Alto o suficiente para cobrir qualquer frete
        minPurchase: 150.00,
        usageLimit: 500,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-06-30'),
        isActive: true,
      },
    }),
  ]);
  console.log(`✓ Created ${coupons.length} coupons\n`);

  // ================================
  // 5. USERS
  // ================================
  console.log('👤 Creating users...');
  
  const adminPassword = await bcrypt.hash('admin123', 10);
  const customerPassword = await bcrypt.hash('password123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@nsr.com' },
    update: {},
    create: {
      email: 'admin@nsr.com',
      password: adminPassword,
      firstName: 'Administrador',
      lastName: 'NSR',
      role: 'ADMIN',
      phone: '11999999999',
      birthDate: new Date('1990-01-01'),
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: 'customer@nsr.com' },
    update: {},
    create: {
      email: 'customer@nsr.com',
      password: customerPassword,
      firstName: 'João',
      lastName: 'Silva',
      role: 'CUSTOMER',
      phone: '11988888888',
      cpf: '12345678900',
      birthDate: new Date('1995-05-15'),
    },
  });

  console.log(`✓ Created 2 users (admin + customer)\n`);

  // ================================
  // 6. ADDRESSES
  // ================================
  console.log('📍 Creating addresses...');
  await prisma.address.create({
    data: {
      userId: customer.id,
      label: 'Casa',
      street: 'Rua das Flores',
      number: '123',
      complement: 'Apto 45',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
      receiverName: 'João Silva',
      receiverPhone: '11988888888',
      isDefault: true,
    },
  });
  console.log('✓ Created 1 address\n');

  // ================================
  // 7. PRODUCTS
  // ================================
  console.log('👕 Creating products...');
  
  const camisetasCategory = categories.find(c => c.slug === 'camisetas');
  const verao2025Collection = collections.find(c => c.slug === 'verao-2025');
  
  const products = await Promise.all([
    // Produto 1
    prisma.product.create({
      data: {
        name: 'Camiseta NSR Classic',
        slug: 'camiseta-nsr-classic',
        description: 'Camiseta de algodão premium com logo bordado. Conforto e estilo para o dia a dia.',
        price: 89.90,
        comparePrice: 129.90,
        stock: 50,
        sku: 'NSR-CAM-001',
        categoryId: camisetasCategory?.id,
        collectionId: verao2025Collection?.id,
        gender: 'UNISEX',
        images: [
          'https://via.placeholder.com/800x1000/000000/FFFFFF?text=Camiseta+NSR+Classic',
          'https://via.placeholder.com/800x1000/FFFFFF/000000?text=Detalhe',
        ],
        weight: 0.25,
        length: 30,
        width: 40,
        height: 2,
        material: '100% Algodão',
        careInstructions: 'Lavar à mão ou máquina em água fria. Não usar alvejante.',
        metaTitle: 'Camiseta NSR Classic - Conforto e Estilo',
        metaDescription: 'Camiseta de algodão premium com design exclusivo NSR. Ideal para o dia a dia.',
        isFeatured: true,
        isActive: true,
        variants: {
          create: [
            { size: 'P', color: 'Preto', colorHex: '#000000', stock: 10, sku: 'NSR-CAM-001-P-BLK' },
            { size: 'M', color: 'Preto', colorHex: '#000000', stock: 15, sku: 'NSR-CAM-001-M-BLK' },
            { size: 'G', color: 'Preto', colorHex: '#000000', stock: 15, sku: 'NSR-CAM-001-G-BLK' },
            { size: 'GG', color: 'Preto', colorHex: '#000000', stock: 10, sku: 'NSR-CAM-001-GG-BLK' },
            { size: 'P', color: 'Branco', colorHex: '#FFFFFF', stock: 10, sku: 'NSR-CAM-001-P-WHT' },
            { size: 'M', color: 'Branco', colorHex: '#FFFFFF', stock: 15, sku: 'NSR-CAM-001-M-WHT' },
            { size: 'G', color: 'Branco', colorHex: '#FFFFFF', stock: 15, sku: 'NSR-CAM-001-G-WHT' },
          ],
        },
      },
    }),

    // Produto 2
    prisma.product.create({
      data: {
        name: 'Camiseta Oversized NSR',
        slug: 'camiseta-oversized-nsr',
        description: 'Camiseta oversized com estampa exclusiva. Modelagem ampla e confortável.',
        price: 99.90,
        stock: 40,
        sku: 'NSR-CAM-002',
        categoryId: camisetasCategory?.id,
        collectionId: verao2025Collection?.id,
        gender: 'UNISEX',
        images: [
          'https://via.placeholder.com/800x1000/333333/FFFFFF?text=Oversized+NSR',
        ],
        weight: 0.30,
        length: 35,
        width: 45,
        height: 2,
        material: '100% Algodão',
        isFeatured: true,
        isActive: true,
        variants: {
          create: [
            { size: 'P', color: 'Cinza', colorHex: '#808080', stock: 10 },
            { size: 'M', color: 'Cinza', colorHex: '#808080', stock: 15 },
            { size: 'G', color: 'Cinza', colorHex: '#808080', stock: 15 },
          ],
        },
      },
    }),

    // Produto 3
    prisma.product.create({
      data: {
        name: 'Camiseta Logo NSR',
        slug: 'camiseta-logo-nsr',
        description: 'Camiseta com logo NSR em relevo. Design minimalista e sofisticado.',
        price: 79.90,
        comparePrice: 99.90,
        stock: 60,
        sku: 'NSR-CAM-003',
        categoryId: camisetasCategory?.id,
        gender: 'UNISEX',
        images: [
          'https://via.placeholder.com/800x1000/FFFFFF/000000?text=Logo+NSR',
        ],
        weight: 0.25,
        material: '100% Algodão Egípcio',
        isFeatured: false,
        isActive: true,
        variants: {
          create: [
            { size: 'P', color: 'Branco', colorHex: '#FFFFFF', stock: 15 },
            { size: 'M', color: 'Branco', colorHex: '#FFFFFF', stock: 20 },
            { size: 'G', color: 'Branco', colorHex: '#FFFFFF', stock: 15 },
            { size: 'M', color: 'Preto', colorHex: '#000000', stock: 10 },
          ],
        },
      },
    }),
  ]);

  console.log(`✓ Created ${products.length} products\n`);

  // ================================
  // 8. REVIEWS
  // ================================
  console.log('⭐ Creating reviews...');
  await prisma.review.create({
    data: {
      userId: customer.id,
      productId: products[0]!.id,
      rating: 5,
      comment: 'Produto excelente! Qualidade impecável e entrega rápida.',
      isApproved: true,
    },
  });
  console.log('✓ Created 1 review\n');

  // ================================
  // SUMMARY
  // ================================
  console.log('✅ Seed completed successfully!\n');
  console.log('📊 Summary:');
  console.log(`   - ${categories.length} categories`);
  console.log(`   - ${collections.length} collections`);
  console.log(`   - ${shippingMethods.length} shipping methods`);
  console.log(`   - ${coupons.length} coupons`);
  console.log(`   - 2 users (1 admin, 1 customer)`);
  console.log(`   - 1 address`);
  console.log(`   - ${products.length} products`);
  console.log(`   - 14 product variants`);
  console.log(`   - 1 review\n`);
  
  console.log('👤 Test credentials:');
  console.log('   Admin: admin@nsr.com / admin123');
  console.log('   Customer: customer@nsr.com / password123\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
