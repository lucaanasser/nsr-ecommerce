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
  // 1. COLLECTIONS
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
      cpf: '11144477735', // CPF válido para testes
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
      isDefault: true,
    },
  });
  console.log('✓ Created 1 address\n');

  // ================================
  // 7. PRODUCTS
  // ================================
  console.log('👕 Creating products...');
  
  const verao2025Collection = collections.find(c => c.slug === 'verao-2025');
  const essentialsCollection = collections.find(c => c.slug === 'essentials');
  
  // URLs das imagens do Cloudinary
  const CLOUDINARY_CLOUD = 'dcdbwwvtk';
  const cloudinaryImageMock = (publicId: string) =>
    `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/upload/f_auto,q_auto/images_nsr_ecommerce/mock_clothes/${publicId}`;

  const products = await Promise.all([
    // ========================================
    // PRODUTO 1: Oversized Tee Geometric
    // ========================================
    prisma.product.create({
      data: {
        id: '550e8400-e29b-41d4-a716-446655440001',
        name: 'Oversized Tee Geometric',
        slug: 'oversized-tee-geometric',
        price: 189.90,
        stock: 100,
        sku: 'NSR-OTG-001',
        category: 'camiseta',
        collectionId: verao2025Collection?.id,
        gender: 'MALE',
        isFeatured: true,  // ✓ Aparece em Novidades
        isActive: true,    // ✓ Aparece na Loja
        details: {
          create: {
            description: 'Camiseta oversized com estampa geométrica inspirada em padrões árabes tradicionais. Confeccionada em algodão premium, oferece conforto e estilo único.',
            specifications: 'Material: 100% Algodão Premium; Gramatura: 180g/m²; Modelagem: Oversized; Estampa: Silk Screen de alta qualidade; Instruções de Cuidado: Lavar à mão ou máquina em água fria. Não usar alvejante. Passar em temperatura baixa.',
          },
        },
        dimensions: {
          create: {
            weight: 0.25,
            length: 35,
            width: 45,
            height: 2,
          },
        },
        seo: {
          create: {
            metaTitle: 'Oversized Tee Geometric - Camiseta Premium NSR',
            metaDescription: 'Camiseta oversized com estampa geométrica árabe. Algodão premium, conforto e estilo único.',
            keywords: ['camiseta oversized', 'estampa geométrica', 'algodão premium', 'moda masculina', 'nsr'],
          },
        },
        images: {
          create: [
            {
              url: cloudinaryImageMock('roupa1_frente.png'),
              altText: 'Oversized Tee Geometric - Frente',
              order: 0,
              isPrimary: true,
            },
            {
              url: cloudinaryImageMock('roupa1_tras.png'),
              altText: 'Oversized Tee Geometric - Costas',
              order: 1,
              isPrimary: false,
            },
          ],
        },
        variants: {
          create: [
            { size: 'P', color: 'Preto', colorHex: '#000000', stock: 20, sku: 'NSR-OTG-001-P-BLK' },
            { size: 'M', color: 'Preto', colorHex: '#000000', stock: 30, sku: 'NSR-OTG-001-M-BLK' },
            { size: 'G', color: 'Preto', colorHex: '#000000', stock: 30, sku: 'NSR-OTG-001-G-BLK' },
            { size: 'GG', color: 'Preto', colorHex: '#000000', stock: 20, sku: 'NSR-OTG-001-GG-BLK' },
            { size: 'P', color: 'Bege', colorHex: '#F5F5DC', stock: 15, sku: 'NSR-OTG-001-P-BGE' },
            { size: 'M', color: 'Bege', colorHex: '#F5F5DC', stock: 25, sku: 'NSR-OTG-001-M-BGE' },
            { size: 'G', color: 'Bege', colorHex: '#F5F5DC', stock: 25, sku: 'NSR-OTG-001-G-BGE' },
            { size: 'GG', color: 'Bege', colorHex: '#F5F5DC', stock: 15, sku: 'NSR-OTG-001-GG-BGE' },
            { size: 'P', color: 'Branco', colorHex: '#FFFFFF', stock: 15, sku: 'NSR-OTG-001-P-WHT' },
            { size: 'M', color: 'Branco', colorHex: '#FFFFFF', stock: 25, sku: 'NSR-OTG-001-M-WHT' },
            { size: 'G', color: 'Branco', colorHex: '#FFFFFF', stock: 25, sku: 'NSR-OTG-001-G-WHT' },
            { size: 'GG', color: 'Branco', colorHex: '#FFFFFF', stock: 15, sku: 'NSR-OTG-001-GG-WHT' },
          ],
        },
      },
    }),

    // ========================================
    // PRODUTO 2: Calça Cargo Urban
    // ========================================
    prisma.product.create({
      data: {
        id: '550e8400-e29b-41d4-a716-446655440002',
        name: 'Calça Cargo Urban',
        slug: 'calca-cargo-urban',
        price: 299.90,
        stock: 80,
        sku: 'NSR-CCU-002',
        category: 'calca',
        collectionId: essentialsCollection?.id,
        gender: 'MALE',
        isFeatured: true,  // ✓ Aparece em Novidades
        isActive: true,    // ✓ Aparece na Loja
        details: {
          create: {
            description: 'Calça cargo com múltiplos bolsos e ajuste moderno. Design funcional com acabamento premium e detalhes em metal escovado.',
            specifications: 'Material: 65% Poliéster, 35% Algodão; Peso: 280g/m²; Múltiplos bolsos funcionais; Ajuste regular com elástico na cintura; Detalhes em metal escovado; Instruções de Cuidado: Lavar à máquina em água fria. Não usar alvejante.',
          },
        },
        dimensions: {
          create: {
            weight: 0.45,
            length: 40,
            width: 35,
            height: 3,
          },
        },
        seo: {
          create: {
            metaTitle: 'Calça Cargo Urban - Funcionalidade e Estilo NSR',
            metaDescription: 'Calça cargo masculina com múltiplos bolsos, design urbano e acabamento premium.',
            keywords: ['calça cargo', 'moda urbana', 'cargo masculina', 'bolsos funcionais', 'nsr'],
          },
        },
        images: {
          create: [
            {
              url: cloudinaryImageMock('roupa2_frente.png'),
              altText: 'Calça Cargo Urban - Frente',
              order: 0,
              isPrimary: true,
            },
            {
              url: cloudinaryImageMock('roupa2_tras.png'),
              altText: 'Calça Cargo Urban - Costas',
              order: 1,
              isPrimary: false,
            },
          ],
        },
        variants: {
          create: [
            { size: '38', color: 'Preto', colorHex: '#000000', stock: 15, sku: 'NSR-CCU-002-38-BLK' },
            { size: '40', color: 'Preto', colorHex: '#000000', stock: 20, sku: 'NSR-CCU-002-40-BLK' },
            { size: '42', color: 'Preto', colorHex: '#000000', stock: 20, sku: 'NSR-CCU-002-42-BLK' },
            { size: '44', color: 'Preto', colorHex: '#000000', stock: 15, sku: 'NSR-CCU-002-44-BLK' },
            { size: '38', color: 'Verde Oliva', colorHex: '#6B8E23', stock: 10, sku: 'NSR-CCU-002-38-OLV' },
            { size: '40', color: 'Verde Oliva', colorHex: '#6B8E23', stock: 15, sku: 'NSR-CCU-002-40-OLV' },
            { size: '42', color: 'Verde Oliva', colorHex: '#6B8E23', stock: 15, sku: 'NSR-CCU-002-42-OLV' },
            { size: '44', color: 'Verde Oliva', colorHex: '#6B8E23', stock: 10, sku: 'NSR-CCU-002-44-OLV' },
            { size: '38', color: 'Bege', colorHex: '#F5F5DC', stock: 10, sku: 'NSR-CCU-002-38-BGE' },
            { size: '40', color: 'Bege', colorHex: '#F5F5DC', stock: 15, sku: 'NSR-CCU-002-40-BGE' },
            { size: '42', color: 'Bege', colorHex: '#F5F5DC', stock: 15, sku: 'NSR-CCU-002-42-BGE' },
            { size: '44', color: 'Bege', colorHex: '#F5F5DC', stock: 10, sku: 'NSR-CCU-002-44-BGE' },
          ],
        },
      },
    }),

    // ========================================
    // PRODUTO 3: Moletom Medina
    // ========================================
    prisma.product.create({
      data: {
        id: '550e8400-e29b-41d4-a716-446655440003',
        name: 'Moletom Medina',
        slug: 'moletom-medina',
        price: 349.90,
        stock: 70,
        sku: 'NSR-MML-003',
        category: 'moletom',
        collectionId: verao2025Collection?.id,
        gender: 'MALE',
        isFeatured: false, // ✗ NÃO aparece em Novidades
        isActive: true,    // ✓ Aparece na Loja
        details: {
          create: {
            description: 'Moletom premium com capuz e bordado sutil em dourado. Corte moderno que valoriza a silhueta com máximo conforto.',
            specifications: 'Material: 80% Algodão, 20% Poliéster; Gramatura: 320g/m²; Capuz com ajuste; Bordado em dourado; Bolso canguru; Punhos e barra em ribana; Instruções de Cuidado: Lavar à máquina em água fria. Não usar alvejante. Secar na sombra.',
          },
        },
        dimensions: {
          create: {
            weight: 0.55,
            length: 40,
            width: 50,
            height: 4,
          },
        },
        seo: {
          create: {
            metaTitle: 'Moletom Medina Premium - Conforto e Estilo NSR',
            metaDescription: 'Moletom masculino premium com capuz, bordado dourado e máximo conforto.',
            keywords: ['moletom premium', 'moletom com capuz', 'bordado dourado', 'moda masculina', 'nsr'],
          },
        },
        images: {
          create: [
            {
              url: cloudinaryImageMock('roupa3_frente.png'),
              altText: 'Moletom Medina - Frente',
              order: 0,
              isPrimary: true,
            },
            {
              url: cloudinaryImageMock('roupa3_tras.png'),
              altText: 'Moletom Medina - Costas',
              order: 1,
              isPrimary: false,
            },
          ],
        },
        variants: {
          create: [
            { size: 'P', color: 'Preto', colorHex: '#000000', stock: 15, sku: 'NSR-MML-003-P-BLK' },
            { size: 'M', color: 'Preto', colorHex: '#000000', stock: 20, sku: 'NSR-MML-003-M-BLK' },
            { size: 'G', color: 'Preto', colorHex: '#000000', stock: 20, sku: 'NSR-MML-003-G-BLK' },
            { size: 'GG', color: 'Preto', colorHex: '#000000', stock: 15, sku: 'NSR-MML-003-GG-BLK' },
            { size: 'P', color: 'Cinza', colorHex: '#808080', stock: 12, sku: 'NSR-MML-003-P-GRY' },
            { size: 'M', color: 'Cinza', colorHex: '#808080', stock: 18, sku: 'NSR-MML-003-M-GRY' },
            { size: 'G', color: 'Cinza', colorHex: '#808080', stock: 18, sku: 'NSR-MML-003-G-GRY' },
            { size: 'GG', color: 'Cinza', colorHex: '#808080', stock: 12, sku: 'NSR-MML-003-GG-GRY' },
            { size: 'P', color: 'Bege', colorHex: '#F5F5DC', stock: 10, sku: 'NSR-MML-003-P-BGE' },
            { size: 'M', color: 'Bege', colorHex: '#F5F5DC', stock: 15, sku: 'NSR-MML-003-M-BGE' },
            { size: 'G', color: 'Bege', colorHex: '#F5F5DC', stock: 15, sku: 'NSR-MML-003-G-BGE' },
            { size: 'GG', color: 'Bege', colorHex: '#F5F5DC', stock: 10, sku: 'NSR-MML-003-GG-BGE' },
          ],
        },
      },
    }),

    // ========================================
    // PRODUTO 4: Crop Top Arabesque
    // ========================================
    prisma.product.create({
      data: {
        id: '550e8400-e29b-41d4-a716-446655440004',
        name: 'Crop Top Arabesque',
        slug: 'crop-top-arabesque',
        price: 159.90,
        stock: 90,
        sku: 'NSR-CTA-004',
        category: 'crop-top',
        collectionId: essentialsCollection?.id,
        gender: 'FEMALE',
        isFeatured: true,  // ✓ Aparece em Novidades
        isActive: true,    // ✓ Aparece na Loja
        details: {
          create: {
            description: 'Crop top feminino com estampa arabesque minimalista. Tecido leve e respirável, perfeito para compor looks modernos.',
            specifications: 'Material: 95% Viscose, 5% Elastano; Gramatura: 150g/m²; Modelagem: Cropped; Estampa: Arabesque minimalista; Tecido leve e respirável; Instruções de Cuidado: Lavar à mão em água fria. Não usar alvejante. Secar na sombra.',
          },
        },
        dimensions: {
          create: {
            weight: 0.15,
            length: 25,
            width: 35,
            height: 1,
          },
        },
        seo: {
          create: {
            metaTitle: 'Crop Top Arabesque - Elegância Feminina NSR',
            metaDescription: 'Crop top feminino com estampa arabesque, tecido leve e respirável para looks modernos.',
            keywords: ['crop top feminino', 'estampa arabesque', 'moda feminina', 'cropped', 'nsr'],
          },
        },
        images: {
          create: [
            {
              url: cloudinaryImageMock('roupa4_frente.png'),
              altText: 'Crop Top Arabesque - Frente',
              order: 0,
              isPrimary: true,
            },
            {
              url: cloudinaryImageMock('roupa4_tras.png'),
              altText: 'Crop Top Arabesque - Costas',
              order: 1,
              isPrimary: false,
            },
          ],
        },
        variants: {
          create: [
            { size: 'PP', color: 'Preto', colorHex: '#000000', stock: 15, sku: 'NSR-CTA-004-PP-BLK' },
            { size: 'P', color: 'Preto', colorHex: '#000000', stock: 20, sku: 'NSR-CTA-004-P-BLK' },
            { size: 'M', color: 'Preto', colorHex: '#000000', stock: 25, sku: 'NSR-CTA-004-M-BLK' },
            { size: 'G', color: 'Preto', colorHex: '#000000', stock: 15, sku: 'NSR-CTA-004-G-BLK' },
            { size: 'PP', color: 'Branco', colorHex: '#FFFFFF', stock: 15, sku: 'NSR-CTA-004-PP-WHT' },
            { size: 'P', color: 'Branco', colorHex: '#FFFFFF', stock: 20, sku: 'NSR-CTA-004-P-WHT' },
            { size: 'M', color: 'Branco', colorHex: '#FFFFFF', stock: 25, sku: 'NSR-CTA-004-M-WHT' },
            { size: 'G', color: 'Branco', colorHex: '#FFFFFF', stock: 15, sku: 'NSR-CTA-004-G-WHT' },
            { size: 'PP', color: 'Dourado', colorHex: '#FFD700', stock: 10, sku: 'NSR-CTA-004-PP-GLD' },
            { size: 'P', color: 'Dourado', colorHex: '#FFD700', stock: 15, sku: 'NSR-CTA-004-P-GLD' },
            { size: 'M', color: 'Dourado', colorHex: '#FFD700', stock: 20, sku: 'NSR-CTA-004-M-GLD' },
            { size: 'G', color: 'Dourado', colorHex: '#FFD700', stock: 10, sku: 'NSR-CTA-004-G-GLD' },
          ],
        },
      },
    }),
  ]);

  console.log(`✓ Created ${products.length} products (mockados da loja)\n`);

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
  console.log(`   - ${collections.length} collections`);
  console.log(`   - ${shippingMethods.length} shipping methods`);
  console.log(`   - ${coupons.length} coupons`);
  console.log(`   - 2 users (1 admin, 1 customer)`);
  console.log(`   - 1 address`);
  console.log(`   - ${products.length} products (mockados da loja)`);
  console.log(`   - 48 product variants (todas combinações de tamanho + cor)`);
  console.log(`   - 8 product images (2 por produto)`);
  console.log(`   - 1 review\n`);
  
  console.log('📦 Produtos criados:');
  console.log('   1. Oversized Tee Geometric - R$ 189,90 (Featured ✓)');
  console.log('   2. Calça Cargo Urban - R$ 299,90 (Featured ✓)');
  console.log('   3. Moletom Medina - R$ 349,90');
  console.log('   4. Crop Top Arabesque - R$ 159,90 (Featured ✓)\n');
  
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
