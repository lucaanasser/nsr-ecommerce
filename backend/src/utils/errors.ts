/**
 * Custom Error Classes
 * Hierarquia de erros para diferentes cenários
 */

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

// 400 - Bad Request
export class BadRequestError extends AppError {
  constructor(message = 'Bad Request') {
    super(message, 400);
  }
}

// 401 - Unauthorized
export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

// 403 - Forbidden
export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

// 404 - Not Found
export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

// 409 - Conflict
export class ConflictError extends AppError {
  constructor(message = 'Conflict') {
    super(message, 409);
  }
}

// 422 - Unprocessable Entity (validation errors)
export class ValidationError extends AppError {
  public readonly details?: any;

  constructor(message = 'Validation failed', details?: any) {
    super(message, 422);
    this.details = details;
  }
}

// 500 - Internal Server Error
export class InternalServerError extends AppError {
  constructor(message = 'Internal Server Error') {
    super(message, 500, false); // Not operational
  }
}
