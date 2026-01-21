'use server'

import { prisma } from '@/src/lib/prisma'
import {
  getGlobalDashboardSummary,
  getTournamentDashboardSummary,
} from '@/src/services/dashboard.service'

export async function loadGlobalDashboard() {
  const enrollments = await prisma.enrollment.findMany({
    include: { payments: true },
  })

  return getGlobalDashboardSummary(enrollments)
}

export async function loadTournamentDashboard(tournamentId: string) {
  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
  })

  if (!tournament) return null

  const enrollments = await prisma.enrollment.findMany({
    where: { tournamentId },
    include: { payments: true },
  })

  return getTournamentDashboardSummary(tournament, enrollments)
}
