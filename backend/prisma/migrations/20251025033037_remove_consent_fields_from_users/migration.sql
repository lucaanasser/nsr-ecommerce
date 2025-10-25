/*
  Warnings:

  - You are about to drop the column `marketingConsent` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `marketingConsentAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `privacyPolicyAccepted` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `privacyPolicyAcceptedAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `privacyPolicyVersion` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `termsAccepted` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `termsAcceptedAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `termsVersion` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "marketingConsent",
DROP COLUMN "marketingConsentAt",
DROP COLUMN "privacyPolicyAccepted",
DROP COLUMN "privacyPolicyAcceptedAt",
DROP COLUMN "privacyPolicyVersion",
DROP COLUMN "termsAccepted",
DROP COLUMN "termsAcceptedAt",
DROP COLUMN "termsVersion";
