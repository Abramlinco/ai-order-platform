-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "deliveryOtpExpiresAt" TIMESTAMP(3),
ADD COLUMN     "feedbackRequestedAt" TIMESTAMP(3);
