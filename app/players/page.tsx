import { prisma } from '@/src/lib/prisma'
import { revalidatePath } from 'next/cache'
import { Player, Tournament } from '@prisma/client'

async function enrollPlayerAction(formData: FormData) {
  'use server'

  const playerId = formData.get('playerId') as string
  const tournamentId = formData.get('tournamentId') as string

  if (!playerId || !tournamentId) return

  await prisma.enrollment.create({
    data: {
      playerId,
      tournamentId,
    },
  })

  revalidatePath('/players')
  revalidatePath('/payments')
}

export default async function PlayersPage() {
  const players: Player[] = await prisma.player.findMany({
    orderBy: { createdAt: 'desc' },
  })

  const tournaments: Tournament[] = await prisma.tournament.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="page-container">
      <div className="card">
        <h1 className="title">Jugadores</h1>

        {players.length === 0 ? (
          <p>No hay jugadores registrados.</p>
        ) : (
          <table style={{ width: '100%', marginTop: '1rem' }}>
            <thead>
              <tr>
                <th>Jugador</th>
                <th>Inscribir a torneo</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player) => (
                <tr key={player.id}>
                  <td>{player.fullName}</td>
                  <td>
                    {tournaments.length === 0 ? (
                      <span style={{ opacity: 0.6 }}>
                        No hay torneos activos
                      </span>
                    ) : (
                      <form
                        action={enrollPlayerAction}
                        style={{ display: 'flex', gap: '0.5rem' }}
                      >
                        <input
                          type="hidden"
                          name="playerId"
                          value={player.id}
                        />

                        <select name="tournamentId" required>
                          <option value="">Selecciona torneo</option>
                          {tournaments.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.name} ({t.season})
                            </option>
                          ))}
                        </select>

                        <button type="submit">
                          Inscribir
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
