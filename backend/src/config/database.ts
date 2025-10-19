/**
 * Configuração do singleton do Prisma Client para acesso ao banco de dados.
 * Garante uma única instância durante o ciclo de vida da aplicação e faz shutdown gracioso.
 */
import { PrismaClient } from '@prisma/client';
import { config } from './env';

// Singleton do Prisma Client
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: config.debug ? ['query', 'info', 'warn', 'error'] : ['error'],
  });
};

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (config.env !== 'production') {
  globalThis.prismaGlobal = prisma;
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
