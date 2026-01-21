import { prisma } from "@/src/lib/prisma";

/**
 * Inscribir jugador a torneo
 */
export async function enrollPlayer(data: {
  playerId: string;
  tournamentId: string;
  totalFeeOverride?: number;
}) {
  return prisma.enrollment.create({
    data: {
      playerId: data.playerId,
      tournamentId: data.tournamentId,
      totalFeeOverride: data.totalFeeOverride ?? null,
    },
  });
}

/**
 * Obtener inscripciones de un torneo
 */
export async function listTournamentEnrollments(tournamentId: string) {
  return prisma.enrollment.findMany({
    where: { tournamentId },
    include: {
      player: true,
      payments: true,
    },
  });
}

/**
 * Calcular deuda del jugador en un torneo
 */
export async function getEnrollmentBalance(enrollmentId: string) {
  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: {
      tournament: true,
      payments: true,
    },
  });

  if (!enrollment) {
    throw new Error("Enrollment no encontrado");
  }

  const totalFee =
    enrollment.totalFeeOverride ?? enrollment.tournament.totalFee;

  const paid = enrollment.payments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );

  return {
    totalFee,
    paid,
    balance: totalFee - paid,
  };
}
