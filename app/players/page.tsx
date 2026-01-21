import { prisma } from '@/src/lib/prisma'
import { Player } from '@prisma/client'

export default async function PlayersPage() {
  const players: Player[] = await prisma.player.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="page-container">
      <div className="card">
        <h1 className="title">Jugadores</h1>

        {players.length === 0 ? (
          <p>No hay jugadores registrados.</p>
        ) : (
          <ul>
            {players.map((player) => (
              <li key={player.id}>
                {player.fullName}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
