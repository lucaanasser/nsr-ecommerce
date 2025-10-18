/**
 * Global Type Declarations
 * Extends Express Request interface to include user property
 */

import { UserRole } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: UserRole;
      };
    }
  }
}

export {};
