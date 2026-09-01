-- CreateEnum
CREATE TYPE "InterstatePricingMethod" AS ENUM ('Fixed', 'PerOrder', 'ExternalProvider');

-- CreateTable
CREATE TABLE "Business" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "placeId" TEXT,
    "localDeliveryEnabled" BOOLEAN NOT NULL DEFAULT true,
    "interstateDeliveryEnabled" BOOLEAN NOT NULL DEFAULT false,
    "interstatePricingMethod" "InterstatePricingMethod" NOT NULL DEFAULT 'Fixed',
    "interstateFixedFee" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);
