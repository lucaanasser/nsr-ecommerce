/**
 * Middleware responsável por validação de body, params e query usando Zod.
 * Centraliza validação de dados de entrada para rotas da API.
 */
import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ValidationError } from '@utils/errors';

/**
 * Middleware de validação com Zod
 * Valida body, params, e query de acordo com o schema fornecido
 */
export function validate(schema: AnyZodObject) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(error); // Error handler vai processar
      } else {
        next(new ValidationError('Validation failed'));
      }
    }
  };
}

/**
 * Validate apenas body
 */
export function validateBody(schema: AnyZodObject) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Validate apenas params
 */
export function validateParams(schema: AnyZodObject) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      req.params = await schema.parseAsync(req.params);
      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Validate apenas query
 */
export function validateQuery(schema: AnyZodObject) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      req.query = await schema.parseAsync(req.query);
      next();
    } catch (error) {
      next(error);
    }
  };
}
