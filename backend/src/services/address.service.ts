/**
 * Address Service
 * Gerencia todas as operações de negócio relacionadas a endereços de entrega
 */
import { prisma } from '@config/database';
import { CreateAddressInput, UpdateAddressInput } from '@validators/address.validator';
import { NotFoundError, ForbiddenError } from '@utils/errors';
import { logger } from '@config/logger.colored';

export class AddressService {
  /**
   * Lista todos os endereços do usuário
   * Retorna endereço padrão primeiro
   */
  async getUserAddresses(userId: string) {
    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: [
        { isDefault: 'desc' }, // Endereço padrão primeiro
        { createdAt: 'desc' },
      ],
    });

    logger.info('User addresses retrieved', { userId, count: addresses.length });
    return addresses;
  }

  /**
   * Busca um endereço específico
   * Valida se o endereço pertence ao usuário
   */
  async getAddressById(userId: string, addressId: string) {
    const address = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      throw new NotFoundError('Endereço não encontrado');
    }

    if (address.userId !== userId) {
      logger.warn('Unauthorized address access attempt', { userId, addressId });
      throw new ForbiddenError('Você não tem permissão para acessar este endereço');
    }

    return address;
  }

  /**
   * Cria novo endereço
   * Se for o primeiro endereço, define como padrão automaticamente
   */
  async createAddress(userId: string, data: CreateAddressInput) {
    // Se for definido como padrão, remove padrão dos outros
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    // Conta quantos endereços o usuário já tem
    const addressCount = await prisma.address.count({
      where: { userId },
    });

    // Se for o primeiro endereço, define como padrão automaticamente
    const address = await prisma.address.create({
      data: {
        ...data,
        userId,
        isDefault: data.isDefault ?? (addressCount === 0),
      },
    });

    logger.info('Address created', { userId, addressId: address.id, isDefault: address.isDefault });
    return address;
  }

  /**
   * Atualiza endereço existente
   * Valida propriedade antes de atualizar
   */
  async updateAddress(userId: string, addressId: string, data: UpdateAddressInput) {
    // Valida se o endereço pertence ao usuário
    await this.getAddressById(userId, addressId);

    // Se definindo como padrão, remove dos outros
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true, id: { not: addressId } },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.update({
      where: { id: addressId },
      data,
    });

    logger.info('Address updated', { userId, addressId });
    return address;
  }

  /**
   * Define endereço como padrão
   * Remove padrão dos outros endereços
   */
  async setDefaultAddress(userId: string, addressId: string) {
    // Valida se o endereço pertence ao usuário
    await this.getAddressById(userId, addressId);

    await prisma.$transaction([
      // Remove padrão dos outros
      prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      }),
      // Define este como padrão
      prisma.address.update({
        where: { id: addressId },
        data: { isDefault: true },
      }),
    ]);

    const address = await prisma.address.findUnique({
      where: { id: addressId },
    });

    logger.info('Default address updated', { userId, addressId });
    return address;
  }

  /**
   * Deleta endereço
   * Se for o padrão, define outro como padrão antes de deletar
   */
  async deleteAddress(userId: string, addressId: string) {
    const address = await this.getAddressById(userId, addressId);

    // Se for o padrão, define outro como padrão antes de deletar
    if (address.isDefault) {
      const otherAddress = await prisma.address.findFirst({
        where: { userId, id: { not: addressId } },
        orderBy: { createdAt: 'desc' },
      });

      if (otherAddress) {
        await prisma.address.update({
          where: { id: otherAddress.id },
          data: { isDefault: true },
        });
        logger.info('New default address set before deletion', {
          userId,
          newDefaultId: otherAddress.id,
        });
      }
    }

    await prisma.address.delete({
      where: { id: addressId },
    });

    logger.info('Address deleted', { userId, addressId });
  }
}

export const addressService = new AddressService();
