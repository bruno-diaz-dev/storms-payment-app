"use server";

import {
  enrollPlayer,
  listTournamentEnrollments,
} from "@/src/services/enrollment.service";

export async function enrollPlayerAction(data: {
  playerId: string;
  tournamentId: string;
  totalFeeOverride?: number;
}) {
  return enrollPlayer(data);
}

export async function listEnrollmentsByTournamentAction(
  tournamentId: string
) {
  return listTournamentEnrollments(tournamentId);
}
