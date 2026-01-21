import { prisma } from "@/src/lib/prisma";

/**
 * Resumen global del sistema
 */
export async function getGlobalDashboardSummary() {
  const enrollments = await prisma.enrollment.findMany({
    include: {
      tournament: true,
      payments: true,
    },
  });

  let totalExpected = 0;
  let totalPaid = 0;
  let playersWithDebt = 0;
  let playersClear = 0;

  enrollments.forEach((enrollment) => {
    const totalFee =
      enrollment.totalFeeOverride ?? enrollment.tournament.totalFee;

    const paid = enrollment.payments.reduce(
      (sum, p) => sum + p.amount,
      0
    );

    totalExpected += totalFee;
    totalPaid += paid;

    if (paid < totalFee) {
      playersWithDebt++;
    } else {
      playersClear++;
    }
  });

  return {
    totalExpected,
    totalPaid,
    totalPending: totalExpected - totalPaid,
    playersWithDebt,
    playersClear,
  };
}

/**
 * Resumen por torneo
 */
export async function getTournamentDashboardSummary(tournamentId: string) {
  const enrollments = await prisma.enrollment.findMany({
    where: { tournamentId },
    include: {
      player: true,
      tournament: true,
      payments: true,
    },
  });

  let totalExpected = 0;
  let totalPaid = 0;

  const players = enrollments.map((enrollment) => {
    const totalFee =
      enrollment.totalFeeOverride ?? enrollment.tournament.totalFee;

    const paid = enrollment.payments.reduce(
      (sum, p) => sum + p.amount,
      0
    );

    const balance = totalFee - paid;

    totalExpected += totalFee;
    totalPaid += paid;

    return {
      enrollmentId: enrollment.id,
      playerId: enrollment.player.id,
      playerName: enrollment.player.fullName,
      totalFee,
      paid,
      balance,
      status:
        balance === 0
          ? "CLEAR"
          : paid === 0
          ? "DEBT"
          : "PARTIAL",
    };
  });

  return {
    tournamentId,
    tournamentName: enrollments[0]?.tournament.name ?? "",
    totalExpected,
    totalPaid,
    totalPending: totalExpected - totalPaid,
    players,
  };
}
