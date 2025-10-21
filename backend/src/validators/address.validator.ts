/**
 * Schemas de validação (Zod) para endereços de entrega.
 * Inclui validação de CEP, telefone e campos obrigatórios.
 */
import { z } from 'zod';

/**
 * Schema base de endereço
 * Valida todos os campos necessários para um endereço de entrega
 */
const addressBaseSchema = z.object({
  label: z
    .string()
    .min(2, 'Título deve ter no mínimo 2 caracteres')
    .max(50, 'Título deve ter no máximo 50 caracteres')
    .trim(),

  receiverName: z
    .string()
    .min(3, 'Nome do destinatário deve ter no mínimo 3 caracteres')
    .max(100, 'Nome muito longo')
    .trim()
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Nome contém caracteres inválidos'),

  receiverPhone: z
    .string()
    .regex(
      /^(\+55\s?)?(\(?\d{2}\)?\s?)?9?\d{4}[-\s]?\d{4}$/,
      'Telefone inválido. Use formato: (11) 98765-4321'
    )
    .transform((phone) => phone.replace(/[^\d+]/g, '')),

  zipCode: z
    .string()
    .regex(/^\d{5}-?\d{3}$/, 'CEP inválido. Use formato: 12345-678')
    .transform((zip) => zip.replace(/\D/g, '')),

  street: z
    .string()
    .min(3, 'Endereço deve ter no mínimo 3 caracteres')
    .max(200, 'Endereço muito longo')
    .trim(),

  number: z
    .string()
    .min(1, 'Número é obrigatório')
    .max(10, 'Número muito longo')
    .trim(),

  complement: z
    .string()
    .max(100, 'Complemento muito longo')
    .trim()
    .optional(),

  neighborhood: z
    .string()
    .min(2, 'Bairro deve ter no mínimo 2 caracteres')
    .max(100, 'Bairro muito longo')
    .trim(),

  city: z
    .string()
    .min(2, 'Cidade deve ter no mínimo 2 caracteres')
    .max(100, 'Cidade muito longa')
    .trim(),

  state: z
    .string()
    .length(2, 'Estado deve ter 2 caracteres (ex: SP)')
    .toUpperCase()
    .regex(/^[A-Z]{2}$/, 'Estado inválido'),

  isDefault: z.boolean().optional(),
});

/**
 * Schema de validação para criar endereço
 */
export const createAddressSchema = addressBaseSchema;

/**
 * Schema de validação para atualizar endereço
 * Todos os campos são opcionais
 */
export const updateAddressSchema = addressBaseSchema.partial();

/**
 * Schema de validação para parâmetro de ID
 */
export const addressIdParamSchema = z.object({
  id: z.string().uuid('ID de endereço inválido'),
});

/**
 * Tipos inferidos dos schemas
 */
export type CreateAddressInput = z.infer<typeof createAddressSchema>;
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;
export type AddressIdParam = z.infer<typeof addressIdParamSchema>;
