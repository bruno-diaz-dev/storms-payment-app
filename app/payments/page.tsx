import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function PaymentsPage() {
  const enrollments = await prisma.enrollment.findMany({
    include: {
      player: true,
      tournament: true,
      payments: true,
    },
  })

  const data = enrollments.map(e => {
    const totalFee = e.totalFeeOverride ?? e.tournament.totalFee
    const paid = e.payments.reduce((s, p) => s + p.amount, 0)
    const remaining = totalFee - paid

    return {
      id: e.id,
      player: e.player.fullName,
      tournament: e.tournament.name,
      totalFee,
      paid,
      remaining,
    }
  })

  return (
    <div style={{ padding: 24 }}>
      <h1>Payments</h1>

      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>Player</th>
            <th>Tournament</th>
            <th>Total</th>
            <th>Paid</th>
            <th>Remaining</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.id}>
              <td>{row.player}</td>
              <td>{row.tournament}</td>
              <td>${row.totalFee}</td>
              <td>${row.paid}</td>
              <td>${row.remaining}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
