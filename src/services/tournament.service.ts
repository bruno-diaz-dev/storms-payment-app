import { prisma } from "@/src/lib/prisma";

/**
 * Crear un torneo
 */
export async function createTournament(data: {
  name: string;
  league: string;
  season: string;
  totalFee: number;
}) {
  return prisma.tournament.create({
    data: {
      name: data.name,
      league: data.league,
      season: data.season,
      totalFee: data.totalFee,
      isActive: true,
    },
  });
}

/**
 * Listar torneos activos
 */
export async function listActiveTournaments() {
  return prisma.tournament.findMany({
    where: { isActive: true },
    orderBy: {
      createdAt: "desc",
    },
  });
}

/**
 * Desactivar torneo (soft delete)
 */
export async function deactivateTournament(tournamentId: string) {
  return prisma.tournament.update({
    where: { id: tournamentId },
    data: { isActive: false },
  });
}
