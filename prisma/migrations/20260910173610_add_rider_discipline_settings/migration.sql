-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "maxRiderSuspensions" INTEGER NOT NULL DEFAULT 3,
ADD COLUMN     "riderRestoreCooldownHours" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "riderSuspensionWindowDays" INTEGER NOT NULL DEFAULT 30;
