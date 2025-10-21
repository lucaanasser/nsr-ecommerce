/**
 * Address Controller
 * Gerencia requisições HTTP relacionadas a endereços de entrega
 */
import { Request, Response } from 'express';
import { addressService } from '@services/address.service';

export class AddressController {
  /**
   * GET /user/addresses
   * Lista todos os endereços do usuário autenticado
   */
  async getAddresses(req: Request, res: Response) {
    const userId = req.user!.userId;
    const addresses = await addressService.getUserAddresses(userId);

    res.json({
      success: true,
      data: addresses,
    });
  }

  /**
   * GET /user/addresses/:id
   * Busca um endereço específico
   */
  async getAddress(req: Request, res: Response) {
    const userId = req.user!.userId;
    const { id } = req.params;

    const address = await addressService.getAddressById(userId, id!);

    res.json({
      success: true,
      data: address,
    });
  }

  /**
   * POST /user/addresses
   * Cria novo endereço
   */
  async createAddress(req: Request, res: Response) {
    const userId = req.user!.userId;
    const address = await addressService.createAddress(userId, req.body);

    res.status(201).json({
      success: true,
      data: address,
      message: 'Endereço criado com sucesso',
    });
  }

  /**
   * PUT /user/addresses/:id
   * Atualiza endereço existente
   */
  async updateAddress(req: Request, res: Response) {
    const userId = req.user!.userId;
    const { id } = req.params;

    const address = await addressService.updateAddress(userId, id!, req.body);

    res.json({
      success: true,
      data: address,
      message: 'Endereço atualizado com sucesso',
    });
  }

  /**
   * PATCH /user/addresses/:id/default
   * Define endereço como padrão
   */
  async setDefaultAddress(req: Request, res: Response) {
    const userId = req.user!.userId;
    const { id } = req.params;

    const address = await addressService.setDefaultAddress(userId, id!);

    res.json({
      success: true,
      data: address,
      message: 'Endereço definido como padrão',
    });
  }

  /**
   * DELETE /user/addresses/:id
   * Remove endereço
   */
  async deleteAddress(req: Request, res: Response) {
    const userId = req.user!.userId;
    const { id } = req.params;

    await addressService.deleteAddress(userId, id!);

    res.json({
      success: true,
      message: 'Endereço removido com sucesso',
    });
  }
}

export const addressController = new AddressController();
