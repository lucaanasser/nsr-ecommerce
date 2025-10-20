/*
  Warnings:

  - Added the required column `birthDate` to the `users` table.
*/
-- AlterTable
-- Primeiro adiciona a coluna como opcional
ALTER TABLE "users" ADD COLUMN "birthDate" TIMESTAMP(3);

-- Define uma data padrão para registros existentes (01/01/2000)
UPDATE "users" SET "birthDate" = '2000-01-01T00:00:00.000Z' WHERE "birthDate" IS NULL;

-- Agora torna a coluna obrigatória
ALTER TABLE "users" ALTER COLUMN "birthDate" SET NOT NULL;
