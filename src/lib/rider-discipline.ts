import { prisma } from "@/lib/prisma";

const SUSPENSION_WINDOW_DAYS = 30;

export async function getRiderSuspensionCount(riderId: string) {
  const since = new Date();
  since.setDate(since.getDate() - SUSPENSION_WINDOW_DAYS);

  return prisma.riderAuditLog.count({
    where: {
      riderId,
      action: "suspend",
      createdAt: {
        gte: since,
      },
    },
  });
}