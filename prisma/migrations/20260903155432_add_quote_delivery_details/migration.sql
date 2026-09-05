/*
  Warnings:

  - Added the required column `deliveryType` to the `Quote` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DeliveryType" AS ENUM ('Local', 'Interstate');

-- AlterTable
ALTER TABLE "Quote" ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'NGN',
ADD COLUMN     "deliveryProvider" TEXT,
ADD COLUMN     "deliveryType" "DeliveryType" NOT NULL,
ADD COLUMN     "distanceKm" DOUBLE PRECISION,
ADD COLUMN     "estimatedDurationMinutes" INTEGER,
ADD COLUMN     "providerQuoteExpiresAt" TIMESTAMP(3),
ADD COLUMN     "providerQuoteId" TEXT,
ADD COLUMN     "trafficAware" BOOLEAN;
