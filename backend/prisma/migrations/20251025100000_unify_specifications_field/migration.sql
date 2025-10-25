/*
  Warnings:
  - You are about to drop the column `material` on the `product_details` table. All the data in the column will be lost.
  - You are about to drop the column `careInstructions` on the `product_details` table. All the data in the column will be lost.
  - Added the column `specifications` to the `product_details` table.
*/
-- AlterTable
ALTER TABLE "product_details" DROP COLUMN "material", DROP COLUMN "careInstructions", ADD COLUMN "specifications" TEXT;
