-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "OrderStatus" ADD VALUE 'Confirmed';
ALTER TYPE "OrderStatus" ADD VALUE 'RiderAccepted';
ALTER TYPE "OrderStatus" ADD VALUE 'GoingToBusiness';
ALTER TYPE "OrderStatus" ADD VALUE 'ArrivedAtBusiness';
ALTER TYPE "OrderStatus" ADD VALUE 'OrderPickedUp';
ALTER TYPE "OrderStatus" ADD VALUE 'ArrivedAtCustomer';
ALTER TYPE "OrderStatus" ADD VALUE 'VerifyingOTP';

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'Confirmed';
