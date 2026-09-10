-- CreateTable
CREATE TABLE "RiderAuditLog" (
    "id" TEXT NOT NULL,
    "riderId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RiderAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RiderAuditLog_riderId_idx" ON "RiderAuditLog"("riderId");

-- CreateIndex
CREATE INDEX "RiderAuditLog_createdAt_idx" ON "RiderAuditLog"("createdAt");

-- AddForeignKey
ALTER TABLE "RiderAuditLog" ADD CONSTRAINT "RiderAuditLog_riderId_fkey" FOREIGN KEY ("riderId") REFERENCES "Rider"("id") ON DELETE CASCADE ON UPDATE CASCADE;
