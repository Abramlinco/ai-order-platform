-- CreateEnum
CREATE TYPE "RiderAccountStatus" AS ENUM ('Active', 'Suspended', 'Blocked');

-- AlterTable
ALTER TABLE "Rider" ADD COLUMN     "accountStatus" "RiderAccountStatus" NOT NULL DEFAULT 'Active',
ADD COLUMN     "blockedAt" TIMESTAMP(3),
ADD COLUMN     "blockedReason" TEXT,
ADD COLUMN     "suspendedAt" TIMESTAMP(3),
ADD COLUMN     "suspensionReason" TEXT;
