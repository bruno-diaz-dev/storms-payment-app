import { prisma } from '@/src/lib/prisma'
import { revalidatePath } from 'next/cache'
import { Enrollment, Payment, Player, Tournament } from '@prisma/client'

type EnrollmentWithRelations = Enrollment & {
  player: Player
  tournament: Tournament
  payments: Payment[]
}

async function registerPayment(formData: FormData) {
  'use server'

  const enrollmentId = formData.get('enrollmentId') as string
  const amount = Number(formData.get('amount'))

  if (!enrollmentId || amount <= 0) return

  await prisma.payment.create({
    data: {
      enrollmentId,
      amount,
    },
  })

  revalidatePath('/payments')
}

export default async function PaymentsPage() {
  const enrollments: EnrollmentWithRelations[] =
    await prisma.enrollment.findMany({
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
    <div className="page-container">
      <div className="card">
        <h1 className="title">Pagos e inscripciones</h1>

        {enrollments.length === 0 ? (
          <p>No hay inscripciones registradas.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Jugador</th>
                <th>Torneo</th>
                <th>Cuota</th>
                <th>Pagado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((enrollment) => {
                const totalPaid = enrollment.payments.reduce(
                  (sum: number, payment: Payment) =>
                    sum + payment.amount,
                  0
                )

                return (
                  <tr key={enrollment.id}>
                    <td>
                      {enrollment.player.firstName}{' '}
                      {enrollment.player.lastName}
                    </td>
                    <td>{enrollment.tournament.name}</td>
                    <td>${enrollment.tournament.fee}</td>
                    <td>${totalPaid}</td>
                    <td>
                      <form action={registerPayment}>
                        <input
                          type="hidden"
                          name="enrollmentId"
                          value={enrollment.id}
                        />
                        <input
                          type="number"
                          name="amount"
                          min={1}
                          required
                        />
                        <button type="submit">
                          Registrar
                        </button>
                      </form>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
