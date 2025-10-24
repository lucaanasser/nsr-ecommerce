/*
  Warnings:

  - You are about to drop the column `receiverName` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `receiverPhone` on the `addresses` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "addresses" DROP COLUMN "receiverName",
DROP COLUMN "receiverPhone";
