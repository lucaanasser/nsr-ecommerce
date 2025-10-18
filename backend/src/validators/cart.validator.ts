import { z } from 'zod';

/**
 * Schema de validação para adicionar item ao carrinho
 */
export const addItemSchema = z.object({
  productId: z
    .string({
      required_error: 'ID do produto é obrigatório',
      invalid_type_error: 'ID do produto deve ser uma string',
    })
    .uuid('ID do produto deve ser um UUID válido'),

  size: z
    .string({
      required_error: 'Tamanho é obrigatório',
      invalid_type_error: 'Tamanho deve ser uma string',
    })
    .min(1, 'Tamanho não pode ser vazio')
    .max(10, 'Tamanho muito longo'),

  color: z
    .string({
      required_error: 'Cor é obrigatória',
      invalid_type_error: 'Cor deve ser uma string',
    })
    .min(1, 'Cor não pode ser vazia')
    .max(50, 'Cor muito longa'),

  quantity: z
    .number({
      required_error: 'Quantidade é obrigatória',
      invalid_type_error: 'Quantidade deve ser um número',
    })
    .int('Quantidade deve ser um número inteiro')
    .min(1, 'Quantidade mínima é 1')
    .max(10, 'Quantidade máxima é 10 por item'),
});

/**
 * Schema de validação para atualizar item do carrinho
 */
export const updateItemSchema = z.object({
  quantity: z
    .number({
      required_error: 'Quantidade é obrigatória',
      invalid_type_error: 'Quantidade deve ser um número',
    })
    .int('Quantidade deve ser um número inteiro')
    .min(1, 'Quantidade mínima é 1')
    .max(10, 'Quantidade máxima é 10 por item'),
});

/**
 * Schema de validação para parâmetro UUID (itemId)
 */
export const itemIdParamSchema = z.object({
  id: z
    .string({
      required_error: 'ID do item é obrigatório',
    })
    .uuid('ID do item deve ser um UUID válido'),
});

// Tipos inferidos dos schemas
export type AddItemInput = z.infer<typeof addItemSchema>;
export type UpdateItemInput = z.infer<typeof updateItemSchema>;
export type ItemIdParam = z.infer<typeof itemIdParamSchema>;
