/**
 * Service responsável pela gestão de consentimentos LGPD.
 * Gerencia histórico de consentimentos de privacidade, termos e marketing.
 */
import { prisma } from '../config/database';
import { logger } from '@config/logger.colored';

export interface ConsentData {
  userId: string;
  privacyPolicy?: boolean;
  terms?: boolean;
  marketing?: boolean;
  ipAddress?: string;
  userAgent?: string;
}

export interface ConsentHistoryRecord {
  id: string;
  userId: string;
  consentType: string;
  version: string;
  accepted: boolean;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
}

/**
 * Consent Service
 * Gerencia todos os consentimentos LGPD dos usuários
 */
export class ConsentService {
  /**
   * Salva consentimentos do usuário no histórico
   * @param data - Dados dos consentimentos
   */
  async saveConsents(data: ConsentData): Promise<void> {
    const { userId, privacyPolicy, terms, marketing, ipAddress, userAgent } = data;
    const now = new Date();

    try {
      // Salva consentimento de política de privacidade
      if (privacyPolicy !== undefined) {
        await prisma.consentHistory.create({
          data: {
            userId,
            consentType: 'PRIVACY_POLICY',
            version: '1.0',
            accepted: privacyPolicy,
            ipAddress,
            userAgent,
            createdAt: now,
          },
        });
      }

      // Salva consentimento de termos de uso
      if (terms !== undefined) {
        await prisma.consentHistory.create({
          data: {
            userId,
            consentType: 'TERMS',
            version: '1.0',
            accepted: terms,
            ipAddress,
            userAgent,
            createdAt: now,
          },
        });
      }

      // Salva consentimento de marketing
      if (marketing !== undefined) {
        await prisma.consentHistory.create({
          data: {
            userId,
            consentType: 'MARKETING',
            version: '1.0',
            accepted: marketing,
            ipAddress,
            userAgent,
            createdAt: now,
          },
        });
      }

      logger.info('Consents saved to history', {
        userId,
        consentsCount: [privacyPolicy, terms, marketing].filter(c => c !== undefined).length,
      });
    } catch (error) {
      logger.error('Error saving consents', {
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Busca o histórico de consentimentos de um usuário
   * @param userId - ID do usuário
   * @param consentType - Tipo de consentimento (opcional)
   * @returns Histórico de consentimentos
   */
  async getConsentHistory(
    userId: string,
    consentType?: string
  ): Promise<ConsentHistoryRecord[]> {
    try {
      const consents = await prisma.consentHistory.findMany({
        where: {
          userId,
          ...(consentType && { consentType }),
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return consents;
    } catch (error) {
      logger.error('Error fetching consent history', {
        userId,
        consentType,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Busca o último consentimento de um tipo específico
   * @param userId - ID do usuário
   * @param consentType - Tipo de consentimento
   * @returns Último consentimento ou null
   */
  async getLatestConsent(
    userId: string,
    consentType: string
  ): Promise<ConsentHistoryRecord | null> {
    try {
      const consent = await prisma.consentHistory.findFirst({
        where: {
          userId,
          consentType,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return consent;
    } catch (error) {
      logger.error('Error fetching latest consent', {
        userId,
        consentType,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Verifica se o usuário aceitou um consentimento específico
   * @param userId - ID do usuário
   * @param consentType - Tipo de consentimento
   * @returns true se aceito, false caso contrário
   */
  async hasAcceptedConsent(userId: string, consentType: string): Promise<boolean> {
    const latestConsent = await this.getLatestConsent(userId, consentType);
    return latestConsent?.accepted ?? false;
  }

  /**
   * Atualiza um consentimento específico
   * @param userId - ID do usuário
   * @param consentType - Tipo de consentimento
   * @param accepted - Aceito ou não
   * @param ipAddress - IP do usuário (opcional)
   * @param userAgent - User agent do navegador (opcional)
   */
  async updateConsent(
    userId: string,
    consentType: string,
    accepted: boolean,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    try {
      await prisma.consentHistory.create({
        data: {
          userId,
          consentType,
          version: '1.0',
          accepted,
          ipAddress,
          userAgent,
        },
      });

      logger.info('Consent updated', {
        userId,
        consentType,
        accepted,
      });
    } catch (error) {
      logger.error('Error updating consent', {
        userId,
        consentType,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Busca status atual de todos os consentimentos de um usuário
   * @param userId - ID do usuário
   * @returns Status de cada tipo de consentimento
   */
  async getCurrentConsents(userId: string): Promise<{
    privacyPolicy: boolean;
    terms: boolean;
    marketing: boolean;
  }> {
    const [privacyPolicy, terms, marketing] = await Promise.all([
      this.hasAcceptedConsent(userId, 'PRIVACY_POLICY'),
      this.hasAcceptedConsent(userId, 'TERMS'),
      this.hasAcceptedConsent(userId, 'MARKETING'),
    ]);

    return {
      privacyPolicy,
      terms,
      marketing,
    };
  }
}

// Exporta instância única (Singleton)
export const consentService = new ConsentService();
