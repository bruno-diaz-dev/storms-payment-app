"use server";

import {
  getGlobalDashboardSummary,
  getTournamentDashboardSummary,
} from "@/src/services/dashboard.service";

export async function fetchGlobalDashboard() {
  return getGlobalDashboardSummary();
}

export async function fetchTournamentDashboard(tournamentId: string) {
  if (!tournamentId) {
    throw new Error("TournamentId requerido");
  }

  return getTournamentDashboardSummary(tournamentId);
}
