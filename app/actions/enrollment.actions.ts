'use server'

import {
  enrollPlayer,
  listTournamentEnrollments,
} from '@/src/services/enrollment.service'

export async function enrollPlayerAction(
  playerId: string,
  tournamentId: string
) {
  return enrollPlayer(playerId, tournamentId)
}

export async function listTournamentEnrollmentsAction(
  tournamentId: string
) {
  return listTournamentEnrollments(tournamentId)
}
