import { Enrollment } from '@prisma/client'
import { prisma } from '@/src/lib/prisma'

export async function enrollPlayer(
  playerId: string,
  tournamentId: string
): Promise<Enrollment> {
  return prisma.enrollment.create({
    data: {
      playerId,
      tournamentId,
    },
  })
}

export async function listTournamentEnrollments(
  tournamentId: string
): Promise<Enrollment[]> {
  return prisma.enrollment.findMany({
    where: { tournamentId },
  })
}
