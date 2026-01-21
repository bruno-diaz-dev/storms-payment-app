import { prisma } from "@/src/lib/prisma";

export async function createPlayer(data: {
  fullName: string;
  phone?: string;
}) {
  return prisma.player.create({
    data: {
      fullName: data.fullName,
      phone: data.phone ?? null,
      isActive: true,
    },
  });
}

export async function listActivePlayers() {
  return prisma.player.findMany({
    where: { isActive: true },
    orderBy: { fullName: "asc" },
  });
}

export async function deactivatePlayer(playerId: string) {
  return prisma.player.update({
    where: { id: playerId },
    data: { isActive: false },
  });
}
