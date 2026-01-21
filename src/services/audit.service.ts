import { prisma } from "@/src/lib/prisma";

export async function logAction(data: {
  action: string;
  entityType: string;
  entityId: string;
  performedBy: string;
}) {
  return prisma.auditLog.create({
    data: {
      action: data.action,
      entityType: data.entityType,
      entityId: data.entityId,
      performedBy: data.performedBy,
    },
  });
}
