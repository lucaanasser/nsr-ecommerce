/*
  Warnings:

  - You are about to drop the column `careInstructions` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `height` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `length` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `material` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `metaDescription` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `metaTitle` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `width` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "careInstructions",
DROP COLUMN "description",
DROP COLUMN "height",
DROP COLUMN "images",
DROP COLUMN "length",
DROP COLUMN "material",
DROP COLUMN "metaDescription",
DROP COLUMN "metaTitle",
DROP COLUMN "weight",
DROP COLUMN "width";

-- CreateTable
CREATE TABLE "product_details" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "description" TEXT,
    "material" TEXT,
    "careInstructions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_dimensions" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "weight" DECIMAL(10,3) NOT NULL,
    "length" DECIMAL(10,2) NOT NULL,
    "width" DECIMAL(10,2) NOT NULL,
    "height" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_dimensions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_seo" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "keywords" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_seo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_images" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "altText" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_details_productId_key" ON "product_details"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "product_dimensions_productId_key" ON "product_dimensions"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "product_seo_productId_key" ON "product_seo"("productId");

-- CreateIndex
CREATE INDEX "product_images_productId_idx" ON "product_images"("productId");

-- AddForeignKey
ALTER TABLE "product_details" ADD CONSTRAINT "product_details_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_dimensions" ADD CONSTRAINT "product_dimensions_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_seo" ADD CONSTRAINT "product_seo_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
