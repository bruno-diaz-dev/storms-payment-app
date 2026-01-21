import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

// Server Action: registrar pago
async function registerPayment(formData: FormData) {
  'use server'

  const enrollmentId = formData.get('enrollmentId') as string
  const amount = Number(formData.get('amount'))

  if (!enrollmentId || !amount || amount <= 0) return

  await prisma.payment.create({
    data: {
      enrollmentId,
      amount,
    },
  })

  revalidatePath('/pagos')
}

export default async function PagosPage() {
  const enrollments = await prisma.enrollment.findMany({
    include: {
      player: true,
      tournament: true,
      payments: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div className="min-h-screen flex justify-center pt-28 px-4">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg p-8">
        {/* TÍTULO */}
        <h1 className="text-2xl font-bold text-purple-700 mb-6">
          Pagos e Inscripciones
        </h1>

        {/* ESTADO SIN INSCRIPCIONES */}
        {enrollments.length === 0 ? (
          <div className="text-gray-600 space-y-4">
            <p>
              No hay inscripciones registradas.
            </p>

            <p className="text-sm text-gray-500">
              Para registrar pagos, primero debes crear jugadores e inscribirlos a un torneo.
            </p>

            <div className="flex gap-4 pt-2">
              <a
                href="/players"
                className="bg-purple-700 text-white px-4 py-2 rounded-md hover:bg-purple-800 transition"
              >
                Registrar jugadores
              </a>

              <a
                href="/tournaments"
                className="border border-purple-700 text-purple-700 px-4 py-2 rounded-md hover:bg-purple-50 transition"
              >
                Ver torneos
              </a>
            </div>
          </div>
        ) : (
          /* TABLA DE INSCRIPCIONES */
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-purple-100 text-purple-800">
                  <th className="p-3 text-left">Jugador</th>
                  <th className="p-3 text-left">Torneo</th>
                  <th className="p-3 text-left">Cuota</th>
                  <th className="p-3 text-left">Pagado</th>
                  <th className="p-3 text-left">Registrar pago</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((e) => {
                  const totalPaid = e.payments.reduce(
                    (sum, p) => sum + p.amount,
                    0
                  )

                  return (
                    <tr key={e.id} className="border-b">
                      <td className="p-3">
                        {e.player.firstName} {e.player.lastName}
                      </td>
                      <td className="p-3">
                        {e.tournament.name}
                      </td>
                      <td className="p-3">
                        ${e.tournament.fee}
                      </td>
                      <td className="p-3">
                        ${totalPaid}
                      </td>
                      <td className="p-3">
                        <form
                          action={registerPayment}
                          className="flex items-center gap-2"
                        >
                          <input
                            type="hidden"
                            name="enrollmentId"
                            value={e.id}
                          />
                          <input
                            type="number"
                            name="amount"
                            min="1"
                            placeholder="Monto"
                            className="border rounded-md px-2 py-1 w-24"
                            required
                          />
                          <button
                            type="submit"
                            className="bg-purple-700 text-white px-3 py-1 rounded-md hover:bg-purple-800 transition"
                          >
                            Registrar
                          </button>
                        </form>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
