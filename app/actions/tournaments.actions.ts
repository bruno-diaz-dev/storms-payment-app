"use server";

import { prisma } from "@/src/lib/prisma";

export async function getTournaments() {
  return prisma.tournament.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });
}
