import { prisma } from '@/src/lib/prisma'
import { revalidatePath } from 'next/cache'
import { Enrollment, Payment, Player, Tournament } from '@prisma/client'

type EnrollmentWithRelations = Enrollment & {
  player: Player
  tournament: Tournament
  payments: Payment[]
}

/* =========================
   SERVER ACTION
========================= */
async function registerPaymentAction(formData: FormData) {
  'use server'

  const enrollmentId = formData.get('enrollmentId') as string
  const amount = Number(formData.get('amount'))

  if (!enrollmentId || Number.isNaN(amount) || amount <= 0) {
    return
  }

  // 🔒 Validar que exista la inscripción
  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
  })

  if (!enrollment) return

  await prisma.payment.create({
    data: {
      enrollmentId,
      amount,
      paymentDate: new Date(),
      receivedById: '9683e151-70b6-4762-a0c4-acde4e1d2d99', // ID del user ADMIN
    },
  })

  revalidatePath('/payments')
}

/* =========================
   PAGE
========================= */
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

        {/* EMPTY STATE */}
        {enrollments.length === 0 ? (
          <div style={{ marginTop: '1rem' }}>
            <p>No hay inscripciones registradas.</p>

            <p style={{ marginTop: '0.5rem', opacity: 0.8 }}>
              Para registrar pagos, primero debes crear jugadores e
              inscribirlos a un torneo.
            </p>

            <div
              style={{
                display: 'flex',
                gap: '1rem',
                marginTop: '1.5rem',
              }}
            >
              <a href="/players" className="button-primary">
                Registrar jugadores
              </a>

              <a href="/tournaments" className="button-secondary">
                Ver torneos
              </a>
            </div>
          </div>
        ) : (
          /* TABLE */
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
                const totalFee =
                  enrollment.totalFeeOverride ??
                  enrollment.tournament.totalFee

                const totalPaid = enrollment.payments.reduce(
                  (sum, p) => sum + p.amount,
                  0
                )

                const remaining = Math.max(0, totalFee - totalPaid)

                return (
                  <tr key={enrollment.id}>
                    <td>{enrollment.player.fullName}</td>
                    <td>{enrollment.tournament.name}</td>
                    <td>${totalFee}</td>
                    <td>${totalPaid}</td>
                    <td>
                      {remaining === 0 ? (
                        <span
                          style={{
                            color: 'limegreen',
                            fontWeight: 'bold',
                          }}
                        >
                          Pagado
                        </span>
                      ) : (
                        <span style={{ color: 'orange' }}>
                          ${remaining}
                        </span>
                      )}
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
