/**
 * Middleware global de tratamento de erros.
 * Centraliza logging, formatação e resposta de erros para a API.
 * Deve ser o último middleware registrado na aplicação.
 */
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '@utils/errors';
import { logger } from '@config/logger.colored';
import { config } from '@config/env';

/**
 * Error Response Interface
 */
interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
  path: string;
  stack?: string;
  details?: unknown;
}

/**
 * Middleware de tratamento de erros
 * Deve ser o ÚLTIMO middleware registrado
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Log do erro padronizado
  logger.error(`${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Default error response
  let statusCode = 500;
  let message = 'Internal Server Error';
  let details: unknown = undefined;

  // AppError (nossos erros customizados)
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Zod Validation Error
  else if (err instanceof ZodError) {
    statusCode = 422;
    message = 'Validation failed';
    details = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
  }

  // Prisma Errors
  else if (err.name === 'PrismaClientKnownRequestError') {
    statusCode = 400;
    const prismaErr = err as unknown as { code: string; meta?: { target?: string[] } };
    
    // Unique constraint violation
    if (prismaErr.code === 'P2002') {
      const field = prismaErr.meta?.target?.[0] || 'field';
      message = `${field} already exists`;
    }
    
    // Foreign key constraint
    else if (prismaErr.code === 'P2003') {
      message = 'Related record not found';
    }
    
    // Record not found
    else if (prismaErr.code === 'P2025') {
      statusCode = 404;
      message = 'Record not found';
    }
    
    else {
      message = 'Database error';
      details = config.debug ? prismaErr.meta : undefined;
    }
  }

  // Prisma Validation Error
  else if (err.name === 'PrismaClientValidationError') {
    statusCode = 400;
    message = 'Invalid data provided';
  }

  // JWT Errors
  else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }
  else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Multer Errors (upload)
  else if (err.name === 'MulterError') {
    statusCode = 400;
    message = `Upload error: ${err.message}`;
  }

  // Generic Error
  else if (config.debug) {
    message = err.message;
  }

  // Build response
  const errorResponse: ErrorResponse = {
    error: err.name || 'Error',
    message,
    statusCode,
    timestamp: new Date().toISOString(),
    path: req.path,
  };

  // Add stack trace in development
  if (config.debug && err.stack) {
    errorResponse.stack = err.stack;
  }

  // Add details if available
  if (details) {
    errorResponse.details = details;
  }

  res.status(statusCode).json(errorResponse);
}

/**
 * Handler para rotas não encontradas (404)
 */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    statusCode: 404,
    timestamp: new Date().toISOString(),
    path: req.path,
  });
}

/**
 * Wrapper para async route handlers
 * Captura erros e passa para o error handler
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
