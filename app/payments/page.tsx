import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

// Server Action
async function createTournament(formData: FormData) {
  'use server'

  const name = formData.get('name') as string
  const league = formData.get('league') as string
  const season = formData.get('season') as string
  const fee = Number(formData.get('fee'))

  if (!name || !league || !season || !fee) return

  await prisma.tournament.create({
    data: {
      name,
      league,
      season,
      fee,
    },
  })

  revalidatePath('/torneos')
}

export default async function TorneosPage() {
  const tournaments = await prisma.tournament.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="min-h-screen flex justify-center pt-28 px-4">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-8">
        {/* TÍTULO */}
        <h1 className="text-2xl font-bold text-purple-700 mb-6">
          Administración de Torneos
        </h1>

        {/* FORMULARIO */}
        <form action={createTournament} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          <input
            name="name"
            placeholder="Nombre del torneo"
            className="border rounded-md px-3 py-2"
            required
          />
          <input
            name="league"
            placeholder="Liga"
            className="border rounded-md px-3 py-2"
            required
          />
          <input
            name="season"
            placeholder="Temporada"
            className="border rounded-md px-3 py-2"
            required
          />
          <input
            name="fee"
            type="number"
            placeholder="Cuota"
            className="border rounded-md px-3 py-2"
            required
          />

          <button
            type="submit"
            className="md:col-span-4 bg-purple-700 text-white py-2 rounded-md hover:bg-purple-800 transition"
          >
            Crear torneo
          </button>
        </form>

        {/* LISTADO */}
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Torneos registrados
        </h2>

        {tournaments.length === 0 ? (
          <p className="text-gray-500">No hay torneos registrados aún.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-purple-100 text-purple-800">
                  <th className="p-3 text-left">Nombre</th>
                  <th className="p-3 text-left">Liga</th>
                  <th className="p-3 text-left">Temporada</th>
                  <th className="p-3 text-left">Cuota</th>
                </tr>
              </thead>
              <tbody>
                {tournaments.map((t) => (
                  <tr key={t.id} className="border-b">
                    <td className="p-3">{t.name}</td>
                    <td className="p-3">{t.league}</td>
                    <td className="p-3">{t.season}</td>
                    <td className="p-3">${t.fee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
