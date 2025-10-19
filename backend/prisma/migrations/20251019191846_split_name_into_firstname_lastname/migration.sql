/*
  Warnings:

  - You are about to drop the column `validFrom` on the `coupons` table. All the data in the column will be lost.
  - You are about to drop the column `validUntil` on the `coupons` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.
  - Added the required column `endDate` to the `coupons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `coupons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "coupons" DROP COLUMN "validFrom",
DROP COLUMN "validUntil",
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "name",
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL;
