"use server";

import {
  createPlayer,
  listActivePlayers,
  deactivatePlayer,
} from "@/src/services/player.service";

export async function createPlayerAction(data: {
  fullName: string;
  phone?: string;
}) {
  if (!data.fullName) {
    throw new Error("Nombre requerido");
  }

  return createPlayer(data);
}

export async function listPlayersAction() {
  return listActivePlayers();
}

export async function deactivatePlayerAction(playerId: string) {
  if (!playerId) {
    throw new Error("PlayerId requerido");
  }

  return deactivatePlayer(playerId);
}
