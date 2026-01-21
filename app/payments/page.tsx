import { prisma } from '@/src/lib/prisma'
import { revalidatePath } from 'next/cache'
import { Enrollment, Payment, Player, Tournament } from '@prisma/client'

export const dynamic = 'force-dynamic'

type EnrollmentWithRelations = Enrollment & {
  player: Player
  tournament: Tournament
  payments: Payment[]
}

async function registerPaymentAction(formData: FormData) {
  'use server'

  const enrollmentId = formData.get('enrollmentId') as string
  const amount = Number(formData.get('amount'))

  if (!enrollmentId || Number.isNaN(amount) || amount <= 0) {
    return
  }

  await prisma.payment.create({
    data: {
      enrollmentId,
      amount,
      paymentDate: new Date(),
      receivedById: '9683e151-70b6-4762-a0c4-ADMIN', // ⚠️ usa el ID REAL del user admin
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
      orderBy: { createdAt: 'desc' },
    })

  return (
    <div className="page-container">
      <div className="card">
        <h1 className="title">Pagos e inscripciones</h1>

        {enrollments.length === 0 ? (
          <p>No hay inscripciones registradas.</p>
        ) : (
          <table style={{ marginTop: '1.5rem', width: '100%' }}>
            <thead>
              <tr>
                <th>Jugador</th>
                <th>Torneo</th>
                <th>Total</th>
                <th>Pagado</th>
                <th>Restante</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((enrollment) => {
                const totalPaid = enrollment.payments.reduce(
                  (sum, p) => sum + p.amount,
                  0
                )

                const totalFee =
                  enrollment.totalFeeOverride ??
                  enrollment.tournament.totalFee

                const remaining = totalFee - totalPaid

                return (
                  <tr key={enrollment.id}>
                    <td>{enrollment.player.fullName}</td>
                    <td>{enrollment.tournament.name}</td>
                    <td>${totalFee}</td>
                    <td>${totalPaid}</td>
                    <td
                      style={{
                        color: remaining <= 0 ? 'green' : 'orange',
                        fontWeight: 600,
                      }}
                    >
                      ${remaining}
                    </td>
                    <td>
                      {remaining > 0 && (
                        <form action={registerPaymentAction}>
                          <input
                            type="hidden"
                            name="enrollmentId"
                            value={enrollment.id}
                          />
                          <input
                            type="number"
                            name="amount"
                            min={1}
                            max={remaining}
                            required
                          />
                          <button type="submit">Registrar</button>
                        </form>
                      )}
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
